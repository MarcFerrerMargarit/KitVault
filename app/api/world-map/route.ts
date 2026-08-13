import { NextResponse } from "next/server";
import { getWorldMap } from "@/lib/world-map";

/**
 * GET /api/world-map
 * Projected country outlines for the collection map. The payload is derived
 * from a fixed dataset, so it never changes and is cached hard — the map view
 * pays for it once, and `/collection` stays light because the geometry is not
 * part of its render payload.
 */
export async function GET() {
  return NextResponse.json(getWorldMap(), {
    headers: {
      // Never cache in development, or edits to the projection would be
      // invisible behind a year-long immutable response.
      "Cache-Control":
        process.env.NODE_ENV === "production"
          ? "public, max-age=31536000, immutable"
          : "no-store",
    },
  });
}
