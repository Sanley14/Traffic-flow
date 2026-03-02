import { NextResponse } from "next/server";
import { intersections } from "@/lib/data";

export async function GET() {
  return NextResponse.json(intersections);
}
