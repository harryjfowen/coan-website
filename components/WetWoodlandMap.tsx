"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Deck } from "@deck.gl/core";
import { BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { fromUrl } from "geotiff";

const COG_URL = "https://pub-da22fbab193f4ccd85607bc265f1a5fa.r2.dev/wetwoodland_extent_b2.cog.bin";
const CENTER: [number, number] = [-3.9995, 50.7357];
const ZOOM = 9;

function valueToRGBA(v: number): [number, number, number, number] {
  if (v === 0) return [0, 0, 0, 0];
  const t = v / 255;
  return [
    Math.round(20 + (10 - 20) * t),
    Math.round(80 + (120 - 80) * t),
    Math.round(30 + (50 - 30) * t),
    Math.round(60 + (220 - 60) * t),
  ];
}

async function loadCogLayer(onTileLoad: () => void) {
  const tiff = await fromUrl(COG_URL);
  const baseImg = await tiff.getImage();
  const bbox = baseImg.getBoundingBox();
  const fullW = baseImg.getWidth();
  const fullH = baseImg.getHeight();
  const resX = (bbox[2] - bbox[0]) / fullW;
  const resY = (bbox[3] - bbox[1]) / fullH;

  return new TileLayer({
    id: "wetwood-cog",
    minZoom: 5,
    maxZoom: 13,
    tileSize: 256,
    async getTileData(props: any) {
      const { west, east, north, south } = props.bbox as { west: number; east: number; north: number; south: number };
      if (east <= bbox[0] || west >= bbox[2] || north <= bbox[1] || south >= bbox[3]) return null;

      const oW = Math.max(west, bbox[0]);
      const oE = Math.min(east, bbox[2]);
      const oN = Math.min(north, bbox[3]);
      const oS = Math.max(south, bbox[1]);

      const px0 = Math.max(0, Math.floor((oW - bbox[0]) / resX));
      const px1 = Math.min(fullW, Math.ceil((oE - bbox[0]) / resX));
      const py0 = Math.max(0, Math.floor((bbox[3] - oN) / resY));
      const py1 = Math.min(fullH, Math.ceil((bbox[3] - oS) / resY));
      const outW = Math.max(1, px1 - px0);
      const outH = Math.max(1, py1 - py0);

      const img = await tiff.getImage();
      const rasters = await img.readRasters({ window: [px0, py0, px1, py1], width: outW, height: outH });
      const band = rasters[0] as Uint8Array;

      const rgba = new Uint8ClampedArray(outW * outH * 4);
      for (let i = 0; i < band.length; i++) {
        const [r, g, b, a] = valueToRGBA(band[i]);
        rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = a;
      }
      return new ImageData(rgba, outW, outH);
    },
    renderSubLayers(props: any) {
      if (!props.data) return null;
      const { west, east, north, south } = props.tile.bbox;
      return new BitmapLayer({ ...props, data: undefined, image: props.data, bounds: [west, south, east, north] });
    },
    onTileLoad,
  });
}

export default function WetWoodlandMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const deckEl = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !mapEl.current || !deckEl.current) return;
    initialized.current = true;

    const map = new maplibregl.Map({
      container: mapEl.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: CENTER,
      zoom: ZOOM,
      attributionControl: false,
    });

    const deck = new Deck({
      canvas: deckEl.current,
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

    map.on("load", () => {
      loadCogLayer(() => deck.redraw()).then((layer) => {
        deck.setProps({ layers: [layer] });
      });
    });

    return () => {
      deck.finalize();
      map.remove();
      initialized.current = false;
    };
  }, []);

  return (
    <div className="relative w-full border border-gray-100" style={{ height: "480px" }}>
      <div ref={mapEl} className="absolute inset-0" />
      <canvas ref={deckEl} className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }} />
      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1">
        <span className="text-xs text-gray-500">Wet woodland extent · 10m · England</span>
      </div>
    </div>
  );
}
