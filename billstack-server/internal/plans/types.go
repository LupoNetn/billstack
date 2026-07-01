package plans

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

var (
	ErrPlanNotFound               = fmt.Errorf("plan not found")
	ErrPlanAlreadyArchived        = fmt.Errorf("plan is already archived")
	ErrPlanHasActiveSubscriptions = fmt.Errorf("plan has active subscriptions and cannot have its type changed")
	ErrTiersRequiredForTieredPlan = fmt.Errorf("tiers are required when plan_type is per_unit or metered")
	ErrLastTierMustBeUnlimited    = fmt.Errorf("the last tier must have up_to = null (unlimited)")
)

type PlanTierInput struct {
	UpTo      *int32 `json:"up_to"`                               // null = unlimited (last tier)
	UnitPrice int64  `json:"unit_price" binding:"required,min=0"` // kobo per unit
	FlatFee   int64  `json:"flat_fee"`                            // optional flat fee for this tier, kobo
}

type CreatePlanRequest struct {
	Name          string                `json:"name"          binding:"required"`
	Description   string                `json:"description"`
	PlanType      sqlc.PlanType         `json:"plan_type"     binding:"required"`
	Amount        int64                 `json:"amount"        binding:"min=0"`
	Currency      string                `json:"currency"      binding:"required"`
	UnitName      string                `json:"unit_name"`
	MaxUnits      *int32                `json:"max_units"`
	IntervalUnit  sqlc.PlanIntervalUnit `json:"interval_unit" binding:"required"`
	IntervalCount int32                 `json:"interval_count" binding:"min=1"`
	TrialDays     int32                 `json:"trial_days"`
	Metadata      map[string]any        `json:"metadata"`
	Tiers         []PlanTierInput       `json:"tiers"` // required for per_unit / metered
}

type UpdatePlanRequest struct {
	ID            uuid.UUID              `json:"-"`
	Name          *string                `json:"name"`
	Description   *string                `json:"description"`
	Amount        *int64                 `json:"amount"         binding:"omitempty,min=0"`
	Currency      *string                `json:"currency"`
	UnitName      *string                `json:"unit_name"`
	MaxUnits      *int32                 `json:"max_units"`
	IntervalUnit  *sqlc.PlanIntervalUnit `json:"interval_unit"`
	IntervalCount *int32                 `json:"interval_count" binding:"omitempty,min=1"`
	TrialDays     *int32                 `json:"trial_days"`
	Status        *sqlc.PlanStatus       `json:"status"`
	Metadata      map[string]any         `json:"metadata"`
}

type ListPlansQuery struct {
	Status *sqlc.PlanStatus
	Limit  int32
	Offset int32
}

type PlanTierResponse struct {
	ID        string `json:"id"`
	UpTo      *int32 `json:"up_to"`
	UnitPrice int64  `json:"unit_price"`
	FlatFee   int64  `json:"flat_fee"`
	TierOrder int32  `json:"tier_order"`
}

type PlanResponse struct {
	ID             string             `json:"id"`
	MerchantID     string             `json:"merchant_id"`
	Name           string             `json:"name"`
	Description    *string            `json:"description,omitempty"`
	PlanType       string             `json:"plan_type"`
	Amount         int64              `json:"amount"`
	Currency       string             `json:"currency"`
	UnitName       *string            `json:"unit_name,omitempty"`
	MaxUnits       *int32             `json:"max_units,omitempty"`
	IntervalUnit   string             `json:"interval_unit"`
	IntervalCount  int32              `json:"interval_count"`
	BillingCadence string             `json:"billing_cadence"`
	TrialDays      int32              `json:"trial_days"`
	Status         string             `json:"status"`
	Metadata       any                `json:"metadata,omitempty"`
	Tiers          []PlanTierResponse `json:"tiers,omitempty"`
	CreatedAt      time.Time          `json:"created_at"`
	UpdatedAt      time.Time          `json:"updated_at"`
}

// billingCadence produces a human-readable cadence string e.g. "Every 3 months", "Yearly".
func billingCadence(unit sqlc.PlanIntervalUnit, count int32) string {
	if count == 1 {
		switch unit {
		case sqlc.PlanIntervalUnitDaily:
			return "Daily"
		case sqlc.PlanIntervalUnitWeekly:
			return "Weekly"
		case sqlc.PlanIntervalUnitMonthly:
			return "Monthly"
		case sqlc.PlanIntervalUnitYearly:
			return "Yearly"
		}
	}
	label := string(unit)
	switch unit {
	case sqlc.PlanIntervalUnitDaily:
		label = "days"
	case sqlc.PlanIntervalUnitWeekly:
		label = "weeks"
	case sqlc.PlanIntervalUnitMonthly:
		label = "months"
	case sqlc.PlanIntervalUnitYearly:
		label = "years"
	}
	return fmt.Sprintf("Every %d %s", count, label)
}

// toPlanResponse maps a sqlc.Plan + optional tiers to a clean PlanResponse.
func toPlanResponse(p sqlc.Plan, tiers []sqlc.PlanTier) PlanResponse {
	resp := PlanResponse{
		ID:             p.ID.String(),
		MerchantID:     p.MerchantID.String(),
		Name:           p.Name,
		Description:    p.Description,
		PlanType:       string(p.PlanType),
		Amount:         p.Amount,
		Currency:       p.Currency,
		UnitName:       p.UnitName,
		IntervalUnit:   string(p.IntervalUnit),
		IntervalCount:  p.IntervalCount,
		BillingCadence: billingCadence(p.IntervalUnit, p.IntervalCount),
		TrialDays:      p.TrialDays,
		Status:         string(p.Status),
		CreatedAt:      p.CreatedAt.Time,
		UpdatedAt:      p.UpdatedAt.Time,
	}
	if p.MaxUnits.Valid {
		v := p.MaxUnits.Int32
		resp.MaxUnits = &v
	}
	if len(p.Metadata) > 0 && string(p.Metadata) != "null" {
		var m any
		_ = (&m)
		resp.Metadata = p.Metadata
	}
	for _, t := range tiers {
		tr := PlanTierResponse{
			ID:        t.ID.String(),
			UnitPrice: t.UnitPrice,
			FlatFee:   t.FlatFee,
			TierOrder: t.TierOrder,
		}
		if t.UpTo.Valid {
			v := t.UpTo.Int32
			tr.UpTo = &v
		}
		resp.Tiers = append(resp.Tiers, tr)
	}
	return resp
}
