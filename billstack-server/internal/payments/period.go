package payments

import (
	"time"

	sqlc "github.com/luponetn/billstack/internal/db/sqlc"
)

// CalculatePeriodEnd advances from start using plan interval, clamping month-end dates.
func CalculatePeriodEnd(start time.Time, plan sqlc.Plan) time.Time {
	count := int(plan.IntervalCount)
	if count < 1 {
		count = 1
	}

	switch plan.IntervalUnit {
	case sqlc.PlanIntervalUnitDaily:
		return start.AddDate(0, 0, count)
	case sqlc.PlanIntervalUnitWeekly:
		return start.AddDate(0, 0, 7*count)
	case sqlc.PlanIntervalUnitYearly:
		return start.AddDate(count, 0, 0)
	case sqlc.PlanIntervalUnitMonthly:
		fallthrough
	default:
		return addMonthsClamped(start, count)
	}
}

func addMonthsClamped(t time.Time, months int) time.Time {
	year, month, day := t.Date()
	hour, min, sec := t.Clock()
	loc := t.Location()

	targetMonth := int(month) + months
	targetYear := year + (targetMonth-1)/12
	targetMonth = (targetMonth-1)%12 + 1

	lastDay := daysInMonth(targetYear, time.Month(targetMonth))
	if day > lastDay {
		day = lastDay
	}

	return time.Date(targetYear, time.Month(targetMonth), day, hour, min, sec, t.Nanosecond(), loc)
}

func daysInMonth(year int, month time.Month) int {
	return time.Date(year, month+1, 0, 0, 0, 0, 0, time.UTC).Day()
}
