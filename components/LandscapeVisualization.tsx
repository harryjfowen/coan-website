"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LandscapeVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
    camera.position.set(10, 8, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const dir = new THREE.DirectionalLight(0xffffff, 0.4);
    dir.position.set(5, 8, 5);
    scene.add(dir);

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
    scene.add(new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 })));

    // ── Layer 3 (bottom): Raster surface ─────────────────────────────
    // Terrain-like coloured surface using vertex colours — cyan/teal heatmap
    const rasterRes = 40;
    const rasterGeo = new THREE.PlaneGeometry(BOX * 2 - 0.4, BOX * 2 - 0.4, rasterRes - 1, rasterRes - 1);
    rasterGeo.rotateX(-Math.PI / 2);

    const rasterPos = rasterGeo.getAttribute("position") as THREE.BufferAttribute;
    const rasterColors = new Float32Array(rasterPos.count * 3);

    for (let i = 0; i < rasterPos.count; i++) {
      const x = rasterPos.getX(i);
      const z = rasterPos.getZ(i);
      // Create terrain-like height values
      const h =
        Math.sin(x * 0.5) * Math.cos(z * 0.4) * 0.4 +
        Math.sin(x * 1.1 + 1.2) * Math.sin(z * 0.9) * 0.25 +
        Math.cos(x * 0.3 + z * 0.3) * 0.2;
      rasterPos.setY(i, h);

      // Map height to cyan-to-teal colour palette
      const t = (h + 0.8) / 1.6; // normalise 0..1
      const col = new THREE.Color().setHSL(0.48 + t * 0.08, 0.85, 0.35 + t * 0.3);
      rasterColors[i * 3]     = col.r;
      rasterColors[i * 3 + 1] = col.g;
      rasterColors[i * 3 + 2] = col.b;
    }
    rasterPos.needsUpdate = true;
    rasterGeo.setAttribute("color", new THREE.BufferAttribute(rasterColors, 3));
    rasterGeo.computeVertexNormals();

    const rasterMesh = new THREE.Mesh(rasterGeo, new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
    }));
    rasterMesh.position.y = -BOX + 0.1;
    scene.add(rasterMesh);

    // ── Layer 2 (middle): Waving wireframe mesh ──────────────────────
    const meshRes = 44;
    const meshGeo = new THREE.PlaneGeometry(BOX * 2 - 0.4, BOX * 2 - 0.4, meshRes, meshRes);
    meshGeo.rotateX(-Math.PI / 2);

    const posAttr = meshGeo.getAttribute("position") as THREE.BufferAttribute;
    const originY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) originY[i] = posAttr.getY(i);

    // Solid dark fill so mesh has depth
    const fillMesh = new THREE.Mesh(meshGeo, new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    }));
    fillMesh.position.y = 0.2;

    // Black wireframe lines
    const wireMesh = new THREE.Mesh(meshGeo, new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    }));
    wireMesh.position.y = 0.2;

    scene.add(fillMesh);
    scene.add(wireMesh);

    // ── Layer 1 (top): Dense black point grid ────────────────────────
    const ptRes = 34;
    const ptStep = (BOX * 2 - 0.4) / (ptRes - 1);
    const ptPos: number[] = [];
    for (let ix = 0; ix < ptRes; ix++) {
      for (let iz = 0; iz < ptRes; iz++) {
        ptPos.push(-BOX + 0.2 + ix * ptStep, BOX - 0.3, -BOX + 0.2 + iz * ptStep);
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
