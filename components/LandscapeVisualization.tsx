"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeRasterTexture() {
  const cells = 40;
  const cellPx = 12;
  const size = cells * cellPx;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Procedural landscape-like value field
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const nx = col / cells;
      const ny = row / cells;
      // Multi-frequency noise-like value
      const v =
        0.5 +
        0.25 * Math.sin(nx * 6.2 + 0.8) * Math.cos(ny * 5.1) +
        0.15 * Math.sin(nx * 12 + ny * 9 + 1.3) +
        0.10 * Math.cos(nx * 3.5 - ny * 4.2 + 2.1);
      const t = Math.max(0, Math.min(1, v));

      // Cyan → teal → deep teal colour ramp
      const h = 175 + t * 30;        // hue 175–205
      const s = 75 + t * 15;         // saturation
      const l = 35 + t * 35;         // lightness
      ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;
      ctx.fillRect(col * cellPx, row * cellPx, cellPx - 1, cellPx - 1);
    }
  }
  return new THREE.CanvasTexture(canvas);
}

export default function LandscapeVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1000);
    camera.position.set(13, 9, 13);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const BOX = 4.0;

    // ── Box frame ────────────────────────────────────────────────────
    const frameVerts = new Float32Array([
      -BOX,-BOX,-BOX,  BOX,-BOX,-BOX,
       BOX,-BOX,-BOX,  BOX,-BOX, BOX,
       BOX,-BOX, BOX, -BOX,-BOX, BOX,
      -BOX,-BOX, BOX, -BOX,-BOX,-BOX,
      -BOX, BOX,-BOX,  BOX, BOX,-BOX,
       BOX, BOX,-BOX,  BOX, BOX, BOX,
       BOX, BOX, BOX, -BOX, BOX, BOX,
      -BOX, BOX, BOX, -BOX, BOX,-BOX,
      -BOX,-BOX,-BOX, -BOX, BOX,-BOX,
       BOX,-BOX,-BOX,  BOX, BOX,-BOX,
       BOX,-BOX, BOX,  BOX, BOX, BOX,
      -BOX,-BOX, BOX, -BOX, BOX, BOX,
    ]);
    const frameGeo = new THREE.BufferGeometry();
    frameGeo.setAttribute("position", new THREE.BufferAttribute(frameVerts, 3));
    scene.add(new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })));

    // ── Layer 3 (bottom): Raster surface ─────────────────────────────
    const rasterGeo = new THREE.PlaneGeometry(BOX * 2 - 0.6, BOX * 2 - 0.6);
    rasterGeo.rotateX(-Math.PI / 2);
    const rasterMesh = new THREE.Mesh(rasterGeo, new THREE.MeshBasicMaterial({
      map: makeRasterTexture(),
      side: THREE.DoubleSide,
    }));
    rasterMesh.position.y = -BOX + 0.05;
    scene.add(rasterMesh);

    // ── Layer 2 (middle): Wireframe mesh only — no fill ──────────────
    const meshRes = 40;
    const meshGeo = new THREE.PlaneGeometry(BOX * 2 - 0.6, BOX * 2 - 0.6, meshRes, meshRes);
    meshGeo.rotateX(-Math.PI / 2);

    const posAttr = meshGeo.getAttribute("position") as THREE.BufferAttribute;
    const originY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) originY[i] = posAttr.getY(i);

    // Wireframe only — black lines, no fill
    const wireMesh = new THREE.Mesh(meshGeo, new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    }));
    wireMesh.position.y = 0.2;
    scene.add(wireMesh);

    // ── Layer 1 (top): Dense black point grid ────────────────────────
    const ptRes = 34;
    const ptStep = (BOX * 2 - 0.6) / (ptRes - 1);
    const ptPos: number[] = [];
    for (let ix = 0; ix < ptRes; ix++) {
      for (let iz = 0; iz < ptRes; iz++) {
        ptPos.push(-BOX + 0.3 + ix * ptStep, BOX - 0.3, -BOX + 0.3 + iz * ptStep);
      }
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ptPos), 3));
    const topPoints = new THREE.Points(ptGeo, new THREE.PointsMaterial({ size: 0.06, color: 0x111111 }));
    scene.add(topPoints);

    const topAttr = ptGeo.getAttribute("position") as THREE.BufferAttribute;
    const topOriginY = new Float32Array(topAttr.count);
    for (let i = 0; i < topAttr.count; i++) topOriginY[i] = topAttr.getY(i);

    // ── Animate ──────────────────────────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.0005;

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        posAttr.setY(i, originY[i] + Math.sin(x * 0.9 + t) * 0.55 + Math.cos(z * 0.8 + t * 0.7) * 0.4);
      }
      posAttr.needsUpdate = true;
      meshGeo.computeVertexNormals();

      for (let i = 0; i < topAttr.count; i++) {
        const x = topAttr.getX(i);
        const z = topAttr.getZ(i);
        topAttr.setY(i, topOriginY[i] + Math.sin(x * 0.5 + t * 0.4) * 0.1 + Math.cos(z * 0.45 + t * 0.35) * 0.08);
      }
      topAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = containerRef.current?.clientWidth || W;
      const h = containerRef.current?.clientHeight || H;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
