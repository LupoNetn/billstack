package plans

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

type Service interface {
	CreatePlan(ctx context.Context, merchantID uuid.UUID, arg CreatePlanRequest) (PlanResponse, error)
	GetPlanByID(ctx context.Context, planID uuid.UUID, merchantID uuid.UUID) (PlanResponse, error)
	ListMerchantPlans(ctx context.Context, merchantID uuid.UUID, q ListPlansQuery) ([]PlanResponse, error)
	ListPublicPlans(ctx context.Context, merchantID uuid.UUID) ([]PlanResponse, error)
	UpdatePlan(ctx context.Context, arg UpdatePlanRequest, merchantID uuid.UUID) (PlanResponse, error)
	ArchivePlan(ctx context.Context, planID uuid.UUID, merchantID uuid.UUID) (PlanResponse, error)
}

type Svc struct {
	db sqlc.Querier
}

func NewService(db sqlc.Querier) Service {
	return &Svc{db: db}
}

func (s *Svc) CreatePlan(ctx context.Context, merchantID uuid.UUID, arg CreatePlanRequest) (PlanResponse, error) {
	// Validate amount / tiers based on plan_type
	if arg.PlanType == sqlc.PlanTypeFlat {
		if arg.Amount <= 0 {
			return PlanResponse{}, errors.New("amount must be > 0 for flat rate plans")
		}
	} else {
		// per_unit / metered — tiers required
		if len(arg.Tiers) == 0 {
			return PlanResponse{}, ErrTiersRequiredForTieredPlan
		}
		last := arg.Tiers[len(arg.Tiers)-1]
		if last.UpTo != nil {
			return PlanResponse{}, ErrLastTierMustBeUnlimited
		}
	}

	// Default interval_count to 1 if caller omitted it
	intervalCount := arg.IntervalCount
	if intervalCount < 1 {
		intervalCount = 1
	}

	metadataBytes, err := json.Marshal(arg.Metadata)
	if err != nil {
		return PlanResponse{}, err
	}

	var maxUnits pgtype.Int4
	if arg.MaxUnits != nil {
		maxUnits = pgtype.Int4{Int32: *arg.MaxUnits, Valid: true}
	}

	plan, err := s.db.CreatePlan(ctx, sqlc.CreatePlanParams{
		MerchantID:    merchantID,
		Name:          arg.Name,
		Description:   &arg.Description,
		PlanType:      arg.PlanType,
		Amount:        arg.Amount,
		Currency:      arg.Currency,
		UnitName:      &arg.UnitName,
		MaxUnits:      maxUnits,
		IntervalUnit:  arg.IntervalUnit,
		IntervalCount: intervalCount,
		TrialDays:     arg.TrialDays,
		Status:        sqlc.PlanStatusActive, // always start active
		Metadata:      metadataBytes,
	})
	if err != nil {
		return PlanResponse{}, err
	}

	// Create tier records for non-flat plans
	var dbTiers []sqlc.PlanTier
	for i, t := range arg.Tiers {
		var upTo pgtype.Int4
		if t.UpTo != nil {
			upTo = pgtype.Int4{Int32: *t.UpTo, Valid: true}
		}
		tier, err := s.db.CreatePlanTier(ctx, sqlc.CreatePlanTierParams{
			PlanID:    plan.ID,
			UpTo:      upTo,
			UnitPrice: t.UnitPrice,
			FlatFee:   t.FlatFee,
			TierOrder: int32(i + 1),
		})
		if err != nil {
			return PlanResponse{}, err
		}
		dbTiers = append(dbTiers, tier)
	}

	return toPlanResponse(plan, dbTiers), nil
}

func (s *Svc) GetPlanByID(ctx context.Context, planID uuid.UUID, merchantID uuid.UUID) (PlanResponse, error) {
	plan, err := s.db.GetPlanByIDAndMerchant(ctx, sqlc.GetPlanByIDAndMerchantParams{
		ID:         planID,
		MerchantID: merchantID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return PlanResponse{}, ErrPlanNotFound
		}
		return PlanResponse{}, err
	}

	tiers, err := s.db.GetPlanTiers(ctx, planID)
	if err != nil {
		return PlanResponse{}, err
	}

	return toPlanResponse(plan, tiers), nil
}

func (s *Svc) ListMerchantPlans(ctx context.Context, merchantID uuid.UUID, q ListPlansQuery) ([]PlanResponse, error) {
	limit := q.Limit
	if limit <= 0 {
		limit = 20
	}

	var statusString string
	if q.Status != nil {
		statusString = string(*q.Status)
	}

	plans, err := s.db.ListPlans(ctx, sqlc.ListPlansParams{
		MerchantID: merchantID,
		Column2:    statusString,
		Limit:      limit,
		Offset:     q.Offset,
	})
	if err != nil {
		return nil, err
	}

	result := make([]PlanResponse, 0, len(plans))
	for _, p := range plans {
		tiers, err := s.db.GetPlanTiers(ctx, p.ID)
		if err != nil {
			return nil, err
		}
		result = append(result, toPlanResponse(p, tiers))
	}
	return result, nil
}

func (s *Svc) ListPublicPlans(ctx context.Context, merchantID uuid.UUID) ([]PlanResponse, error) {
	plans, err := s.db.ListPublicPlans(ctx, merchantID)
	if err != nil {
		return nil, err
	}

	result := make([]PlanResponse, 0, len(plans))
	for _, p := range plans {
		tiers, err := s.db.GetPlanTiers(ctx, p.ID)
		if err != nil {
			return nil, err
		}
		result = append(result, toPlanResponse(p, tiers))
	}
	return result, nil
}

func (s *Svc) UpdatePlan(ctx context.Context, arg UpdatePlanRequest, merchantID uuid.UUID) (PlanResponse, error) {
	// Fetch current plan first for plan_type guard
	existing, err := s.db.GetPlanByIDAndMerchant(ctx, sqlc.GetPlanByIDAndMerchantParams{
		ID:         arg.ID,
		MerchantID: merchantID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return PlanResponse{}, ErrPlanNotFound
		}
		return PlanResponse{}, err
	}

	if existing.Status == sqlc.PlanStatusArchived {
		return PlanResponse{}, ErrPlanAlreadyArchived
	}

	// Build nullable params using pgtype wrappers (nil = keep existing via COALESCE)
	params := sqlc.UpdatePlanParams{
		ID:         arg.ID,
		MerchantID: merchantID,
	}
	if arg.Name != nil {
		params.Name = arg.Name
	}
	if arg.Description != nil {
		params.Description = arg.Description
	}
	if arg.Amount != nil {
		params.Amount = pgtype.Int8{Int64: *arg.Amount, Valid: true}
	}
	if arg.Currency != nil {
		params.Currency = arg.Currency
	}
	if arg.UnitName != nil {
		params.UnitName = arg.UnitName
	}
	if arg.MaxUnits != nil {
		params.MaxUnits = pgtype.Int4{Int32: *arg.MaxUnits, Valid: true}
	}
	if arg.IntervalUnit != nil {
		params.IntervalUnit = sqlc.NullPlanIntervalUnit{PlanIntervalUnit: *arg.IntervalUnit, Valid: true}
	}
	if arg.IntervalCount != nil {
		params.IntervalCount = pgtype.Int4{Int32: *arg.IntervalCount, Valid: true}
	}
	if arg.TrialDays != nil {
		params.TrialDays = pgtype.Int4{Int32: *arg.TrialDays, Valid: true}
	}
	if arg.Status != nil {
		params.Status = sqlc.NullPlanStatus{PlanStatus: *arg.Status, Valid: true}
	}
	if arg.Metadata != nil {
		b, err := json.Marshal(arg.Metadata)
		if err != nil {
			return PlanResponse{}, err
		}
		params.Metadata = b
	}

	plan, err := s.db.UpdatePlan(ctx, params)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return PlanResponse{}, ErrPlanNotFound
		}
		return PlanResponse{}, err
	}

	tiers, err := s.db.GetPlanTiers(ctx, plan.ID)
	if err != nil {
		return PlanResponse{}, err
	}

	return toPlanResponse(plan, tiers), nil
}

func (s *Svc) ArchivePlan(ctx context.Context, planID uuid.UUID, merchantID uuid.UUID) (PlanResponse, error) {
	plan, err := s.db.ArchivePlan(ctx, sqlc.ArchivePlanParams{
		ID:         planID,
		MerchantID: merchantID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return PlanResponse{}, ErrPlanAlreadyArchived
		}
		return PlanResponse{}, err
	}

	tiers, err := s.db.GetPlanTiers(ctx, plan.ID)
	if err != nil {
		return PlanResponse{}, err
	}

	return toPlanResponse(plan, tiers), nil
}
