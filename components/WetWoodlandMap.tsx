"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Okehampton, Devon
const START_LNG = -3.9995;
const START_LAT = 50.7357;
const START_ZOOM = 10;

// Replace with your Cloudflare R2 public COG URL
const COG_URL = "YOUR_R2_COG_URL_HERE";

// Serve COG tiles via titiler
const TILE_URL = `https://titiler.xyz/cog/tiles/{z}/{x}/{y}.png?url=${encodeURIComponent(COG_URL)}&colormap_name=greens&rescale=0,1`;

export default function WetWoodlandMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "basemap",
            type: "raster",
            source: "basemap",
            paint: { "raster-saturation": -0.8, "raster-brightness-max": 1.1 },
          },
        ],
      },
      center: [START_LNG, START_LAT],
      zoom: START_ZOOM,
      attributionControl: false,
      interactive: true,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      map.current.addSource("wetwood-extent", {
        type: "raster",
        tiles: [TILE_URL],
        tileSize: 256,
      });

      map.current.addLayer({
        id: "wetwood-extent",
        type: "raster",
        source: "wetwood-extent",
        paint: {
          "raster-opacity": 0.85,
        },
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: "480px" }}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1">
        <span className="text-xs text-gray-500">Wet woodland extent · 10m · England</span>
      </div>
    </div>
  );
}
