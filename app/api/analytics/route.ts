import { NextResponse } from 'next/server';
import {
  CRIME_TREND_DATA, CRIME_BY_TYPE_DATA, HOURLY_CRIME_DATA,
  PREDICTION_DATA, AREA_RISK_DATA, DASHBOARD_STATS
} from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    success: true,
    stats: DASHBOARD_STATS,
    trends: CRIME_TREND_DATA,
    byType: CRIME_BY_TYPE_DATA,
    hourly: HOURLY_CRIME_DATA,
    predictions: PREDICTION_DATA,
    areaRisk: AREA_RISK_DATA,
    aiInsights: {
      accuracy: 94.2,
      crimesPrevented: 23,
      trendDirection: 'RISING',
      nextMonthForecast: 34,
      highRiskAreas: ['Saddar', 'GT Road', 'Phase 5 Hayatabad'],
      peakHours: ['20:00-22:00', '00:00-02:00'],
      recommendedPatrols: [
        { area: 'Saddar', officers: 8, reason: 'Highest crime density' },
        { area: 'GT Road', officers: 5, reason: 'Drug trafficking route' },
        { area: 'Phase 5', officers: 4, reason: 'Recent homicide' },
      ],
    },
    generatedAt: new Date().toISOString(),
  });
}
