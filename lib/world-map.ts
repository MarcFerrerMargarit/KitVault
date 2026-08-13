import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type {
  GeometryCollection,
  Objects,
  Topology,
} from "topojson-specification";
import topology from "world-atlas/countries-110m.json";

/** One country outline, already projected into the SVG's coordinate space. */
export interface WorldCountry {
  /** Numeric ISO 3166-1 code, as a string. */
  id: string;
  /** Natural Earth's country name (e.g. "United Kingdom", "Côte d'Ivoire"). */
  name: string;
  /** SVG path data. */
  d: string;
}

export interface WorldMapData {
  width: number;
  height: number;
  countries: WorldCountry[];
}

const WIDTH = 1000;
const HEIGHT = 480;

// Nothing is ever collected from the polar wastes, and they eat a third of the
// canvas — dropping them lets the rest of the world fill the frame.
const EXCLUDED = new Set(["Antarctica", "Fr. S. Antarctic Lands"]);

interface CountryProps {
  name: string;
}

let cached: WorldMapData | null = null;

/**
 * Build the projected world map once per server process. The output is static,
 * so `/api/world-map` serves it with a long cache and the browser keeps it.
 */
export function getWorldMap(): WorldMapData {
  if (cached) return cached;

  const topo = topology as unknown as Topology<Objects<CountryProps>>;
  const collection = feature(
    topo,
    topo.objects.countries as GeometryCollection<CountryProps>,
  ) as FeatureCollection<Geometry, CountryProps>;

  const features = collection.features.filter(
    (f) => !EXCLUDED.has(f.properties.name),
  );

  // Equal Earth: pretty *and* equal-area, so a country's ink matches its size —
  // which is what makes a choropleth honest.
  const projection = geoEqualEarth().fitSize([WIDTH, HEIGHT], {
    type: "FeatureCollection",
    features,
  });
  // One decimal is plenty at this resolution and trims ~30% off the payload.
  const path = geoPath(projection).digits(1);

  cached = {
    width: WIDTH,
    height: HEIGHT,
    countries: features
      .map((f) => ({
        // Kosovo, N. Cyprus and Somaliland have no ISO code in this dataset,
        // so fall back to the name — otherwise all three collide on one id and
        // Kosovo, which has a national team, would be untallyable.
        id: String(f.id ?? "") || `ne:${f.properties.name}`,
        name: f.properties.name,
        d: path(f) ?? "",
      }))
      .filter((c) => c.d !== ""),
  };

  return cached;
}
