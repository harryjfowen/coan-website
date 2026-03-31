"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const COG_URL = "https://pub-da22fbab193f4ccd85607bc265f1a5fa.r2.dev/wetwoodland_extent_b2.cog.bin";
const CENTER: [number, number] = [-3.9995, 50.7357];
const ZOOM = 9;

export default function WetWoodlandMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !mapEl.current) return;
    initialized.current = true;

    let map: any = null;
    let deck: any = null;

    async function init() {
      const maplibre = await import("maplibre-gl");

      if (!mapEl.current) return;

      map = new maplibre.default.Map({
        container: mapEl.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: CENTER,
        zoom: ZOOM,
        attributionControl: false,
      });

      map.on("load", async () => {
        // Load COG layer via deck.gl
        const [{ Deck }, { BitmapLayer }, { TileLayer }, { fromUrl }] = await Promise.all([
          import("@deck.gl/core"),
          import("@deck.gl/layers"),
          import("@deck.gl/geo-layers"),
          import("geotiff"),
        ]);

        const canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        mapEl.current!.appendChild(canvas);

        deck = new Deck({
          canvas,
          width: "100%",
          height: "100%",
          initialViewState: { longitude: CENTER[0], latitude: CENTER[1], zoom: ZOOM },
          controller: false,
          layers: [],
        });

        map.on("move", () => {
          const c = map.getCenter();
          deck.setProps({
            viewState: {
              longitude: c.lng,
              latitude: c.lat,
              zoom: map.getZoom(),
              bearing: map.getBearing(),
              pitch: map.getPitch(),
            },
          });
        });

        const tiff = await fromUrl(COG_URL);
        const baseImg = await tiff.getImage();
        const bbox = baseImg.getBoundingBox();
        const fullW = baseImg.getWidth();
        const fullH = baseImg.getHeight();
        const resX = (bbox[2] - bbox[0]) / fullW;
        const resY = (bbox[3] - bbox[1]) / fullH;

        const layer = new TileLayer({
          id: "wetwood-cog",
          minZoom: 5,
          maxZoom: 13,
          tileSize: 256,
          async getTileData(props: any) {
            const { west, east, north, south } = props.bbox;
            if (east <= bbox[0] || west >= bbox[2] || north <= bbox[1] || south >= bbox[3]) return null;
            const oW = Math.max(west, bbox[0]), oE = Math.min(east, bbox[2]);
            const oN = Math.min(north, bbox[3]), oS = Math.max(south, bbox[1]);
            const px0 = Math.max(0, Math.floor((oW - bbox[0]) / resX));
            const px1 = Math.min(fullW, Math.ceil((oE - bbox[0]) / resX));
            const py0 = Math.max(0, Math.floor((bbox[3] - oN) / resY));
            const py1 = Math.min(fullH, Math.ceil((bbox[3] - oS) / resY));
            const outW = Math.max(1, px1 - px0), outH = Math.max(1, py1 - py0);
            const img = await tiff.getImage();
            const rasters = await img.readRasters({ window: [px0, py0, px1, py1], width: outW, height: outH });
            const band = rasters[0] as Uint8Array;
            const rgba = new Uint8ClampedArray(outW * outH * 4);
            for (let i = 0; i < band.length; i++) {
              const v = band[i];
              if (v === 0) continue;
              const t = v / 255;
              rgba[i * 4]     = Math.round(20 + (10 - 20) * t);
              rgba[i * 4 + 1] = Math.round(80 + (140 - 80) * t);
              rgba[i * 4 + 2] = Math.round(30 + (50 - 30) * t);
              rgba[i * 4 + 3] = Math.round(60 + (220 - 60) * t);
            }
            return new ImageData(rgba, outW, outH);
          },
          renderSubLayers(props: any) {
            if (!props.data) return null;
            const { west, east, north, south } = props.tile.bbox;
            return new BitmapLayer({ ...props, data: undefined, image: props.data, bounds: [west, south, east, north] });
          },
        });

        deck.setProps({ layers: [layer] });
      });
    }

    init().catch(console.error);

    return () => {
      deck?.finalize();
      map?.remove();
      initialized.current = false;
    };
  }, []);

  return (
    <div className="relative w-full border border-gray-100" style={{ height: "480px" }}>
      <div ref={mapEl} className="absolute inset-0" />
      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 z-10">
        <span className="text-xs text-gray-500">Wet woodland extent · 10m · England</span>
      </div>
    </div>
  );
}
