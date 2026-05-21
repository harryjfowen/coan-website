"use client";

import { useEffect, useRef, useState } from "react";

const COG_URL = "https://pub-da22fbab193f4ccd85607bc265f1a5fa.r2.dev/wetwoodland_extent_b2.cog.bin";
const CENTER = { longitude: -3.9995, latitude: 50.7357, zoom: 9 };

const PLASMA_LUT = (() => {
  const S: [number, number[]][] = [
    [0.00,[236,245,232,0]],  [0.08,[236,245,232,40]],
    [0.22,[204,227,205,110]],[0.40,[150,199,186,150]],
    [0.58,[92,160,168,185]], [0.78,[46,112,141,220]],
    [1.00,[9,35,69,245]],
  ];
  const a = new Uint8ClampedArray(256*4);
  for (let i=0;i<256;i++) {
    const t=i/255; let s0=S[0],s1=S[1];
    for (let j=1;j<S.length;j++){if(t<=S[j][0]){s0=S[j-1];s1=S[j];break;}s0=S[j];s1=S[j];}
    const f=s0[0]===s1[0]?1:(t-s0[0])/(s1[0]-s0[0]);
    for (let c=0;c<4;c++) a[i*4+c]=Math.round(s0[1][c]+f*(s1[1][c]-s0[1][c]));
  }
  return a;
})();

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = () => resolve(); s.onerror = reject;
    document.head.appendChild(s);
  });
}

function loadCSS(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = href;
  document.head.appendChild(l);
}

interface FlyOverPoint {
  longitude: number;
  latitude: number;
  zoom: number;
  duration: number;
}

export default function WetWoodlandPreview() {
  const mapEl = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialized.current || !mapEl.current) return;
    initialized.current = true;

    async function init() {
      loadCSS("https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css");
      await Promise.all([
        loadScript("https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"),
        loadScript("https://unpkg.com/deck.gl@latest/dist.min.js"),
      ]);

      const w = window as any;
      const maplibregl = w.maplibregl;
      const deck = w.deck;

      if (!mapEl.current) return;

      const R = 6378137;
      const lonToM = (lon: number) => lon * Math.PI * R / 180;
      const latToM = (lat: number) => Math.log(Math.tan(Math.PI/4 + lat*Math.PI/360)) * R;
      const TILE_SIZE = 256;

      const { fromUrl } = await new Function('u', 'return import(u)')('https://esm.sh/geotiff@2.1.3');
      const tiff = await fromUrl(COG_URL);
      const imageCount = await tiff.getImageCount();
      const imgCache: any[] = new Array(imageCount);
      const getImg = async (i: number) => { if (!imgCache[i]) imgCache[i] = await tiff.getImage(i); return imgCache[i]; };
      const images = await Promise.all(Array.from({length:imageCount},(_,i)=>getImg(i)));
      const base = images[0];
      const cogBbox = base.getBoundingBox();
      const spanX = cogBbox[2]-cogBbox[0], spanY = cogBbox[3]-cogBbox[1];
      const ovMeta = images.map((img: any,i: number)=>({i,res:spanX/img.getWidth(),w:img.getWidth(),h:img.getHeight()}));
      ovMeta.sort((a: any,b: any)=>a.res-b.res);
      const pickOv = (targetRes: number) => {
        let pick=ovMeta[0];
        for (const m of ovMeta){if(m.res<=2*targetRes)pick=m;else break;}
        return pick;
      };

      async function getTileData(props: any) {
        const west=lonToM(props.bbox.west),east=lonToM(props.bbox.east);
        const north=latToM(props.bbox.north),south=latToM(props.bbox.south);
        if(east<=cogBbox[0]||west>=cogBbox[2]||north<=cogBbox[1]||south>=cogBbox[3]) return null;
        const oW=Math.max(west,cogBbox[0]),oE=Math.min(east,cogBbox[2]);
        const oN=Math.min(north,cogBbox[3]),oS=Math.max(south,cogBbox[1]);
        if(oE<=oW||oN<=oS) return null;
        const meta=pickOv((east-west)/TILE_SIZE);
        const img=await getImg(meta.i);
        const resX=spanX/meta.w,resY=spanY/meta.h;
        const wx0=Math.max(0,Math.floor((oW-cogBbox[0])/resX));
        const wx1=Math.min(meta.w,Math.ceil((oE-cogBbox[0])/resX));
        const wy0=Math.max(0,Math.floor((cogBbox[3]-oN)/resY));
        const wy1=Math.min(meta.h,Math.ceil((cogBbox[3]-oS)/resY));
        if(wx1<=wx0||wy1<=wy0) return null;
        const tSpanX=east-west,tSpanY=north-south;
        const dx0=Math.max(0,Math.floor(((oW-west)/tSpanX)*TILE_SIZE));
        const dx1=Math.min(TILE_SIZE,Math.ceil(((oE-west)/tSpanX)*TILE_SIZE));
        const dy0=Math.max(0,Math.floor(((north-oN)/tSpanY)*TILE_SIZE));
        const dy1=Math.min(TILE_SIZE,Math.ceil(((north-oS)/tSpanY)*TILE_SIZE));
        const outW=dx1-dx0,outH=dy1-dy0;
        if(outW<=0||outH<=0) return null;
        let rasters;
        try{rasters=await img.readRasters({window:[wx0,wy0,wx1,wy1],width:outW,height:outH});}
        catch{return null;}
        const band=rasters[0];
        const rgba=new Uint8ClampedArray(TILE_SIZE*TILE_SIZE*4);
        for(let y=0;y<outH;y++){
          for(let x=0;x<outW;x++){
            const v=band[y*outW+x];
            if(v>=255) continue;
            const dst=((dy0+y)*TILE_SIZE+(dx0+x))*4;
            const idx=Math.min(255,Math.round(v*255/254))*4;
            rgba[dst]=PLASMA_LUT[idx];rgba[dst+1]=PLASMA_LUT[idx+1];
            rgba[dst+2]=PLASMA_LUT[idx+2];rgba[dst+3]=PLASMA_LUT[idx+3];
          }
        }
        const c=document.createElement("canvas");
        c.width=c.height=TILE_SIZE;
        c.getContext("2d")!.putImageData(new ImageData(rgba,TILE_SIZE,TILE_SIZE),0,0);
        return c;
      }

      // Flyover waypoints - pause 3s at start, then very slow pan
      const flyoverPoints: FlyOverPoint[] = [
        { longitude: -3.8, latitude: 50.7, zoom: 13.5, duration: 3000 },
        { longitude: -3.2, latitude: 51.3, zoom: 13.5, duration: 5000 },
        { longitude: -2.4, latitude: 51.8, zoom: 13.5, duration: 5000 },
        { longitude: -3.8, latitude: 50.7, zoom: 13.5, duration: 5000 },
      ];

      let currentPointIndex = 0;
      let animationStartTime = Date.now();

      const animateCamera = () => {
        const now = Date.now();
        const currentPoint = flyoverPoints[currentPointIndex];
        const nextPoint = flyoverPoints[(currentPointIndex + 1) % flyoverPoints.length];
        const elapsed = now - animationStartTime;
        const progress = Math.min(elapsed / currentPoint.duration, 1);

        const newViewState = {
          longitude: currentPoint.longitude + (nextPoint.longitude - currentPoint.longitude) * progress,
          latitude: currentPoint.latitude + (nextPoint.latitude - currentPoint.latitude) * progress,
          zoom: currentPoint.zoom + (nextPoint.zoom - currentPoint.zoom) * progress,
          pitch: 0,
          bearing: 0,
        };

        deckGL?.setProps({ viewState: newViewState });

        if (progress >= 1) {
          currentPointIndex = (currentPointIndex + 1) % flyoverPoints.length;
          animationStartTime = now;
        }

        requestAnimationFrame(animateCamera);
      };

      let deckGL: any;

      deckGL = new deck.DeckGL({
        container: mapEl.current,
        mapLib: maplibregl,
        mapStyle: "https://tiles.stadiamaps.com/styles/stamen_toner_lite.json?api_key=8bfda774-b759-4e53-bf51-77e9b673a89e",
        initialViewState: CENTER,
        controller: false,
        layers: [
          new deck.TileLayer({
            id: "wetwood-cog",
            getTileData,
            tileSize: TILE_SIZE,
            maxRequests: 20,
            minZoom: 4,
            maxZoom: 16,
            renderSubLayers(props: any) {
              if (!props.data) return null;
              const {west,south,east,north}=props.tile.bbox;
              return new deck.BitmapLayer({...props,data:null,image:props.data,bounds:[west,south,east,north]});
            },
          }),
        ],
      });

      setStatus("ready");

      setTimeout(() => {
        animateCamera();
      }, 500);
    }

    init().catch((err) => {
      console.error("WetWoodlandPreview init error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error details:", msg);
      setErrorMsg(msg);
      setStatus("error");
    });
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-gray-100 h-full" style={{ minHeight: "280px" }}>
      <div ref={mapEl} className="absolute inset-0" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 pointer-events-none">
          <span className="text-xs text-gray-400">Loading map…</span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 pointer-events-none gap-2">
          <span className="text-xs text-red-400 font-medium">Map failed to load</span>
          {errorMsg && <span className="text-xs text-gray-400 max-w-xs text-center">{errorMsg}</span>}
        </div>
      )}
      <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-2 z-10 pointer-events-none rounded-md">
        <div
          className="w-24 h-2 rounded-full mb-1"
          style={{
            background: "linear-gradient(to right, rgb(236,245,232), rgb(150,199,186), rgb(46,112,141), rgb(9,35,69))",
          }}
        />
        <div className="flex justify-between">
          <span className="text-[10px] text-gray-400">Low</span>
          <span className="text-[10px] text-gray-400">High</span>
        </div>
      </div>
    </div>
  );
}
