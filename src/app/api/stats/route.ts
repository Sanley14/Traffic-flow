import { NextResponse } from "next/server";
import { currentStats, hourlyData, zoneStats } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    current: currentStats,
    hourly: hourlyData,
    zones: zoneStats,
  });
}
