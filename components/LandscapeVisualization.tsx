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

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1000);
    camera.position.set(13, 9, 13);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const BOX = 4.0;
    const TOP_Y  =  BOX - 0.3;
    const BOT_Y  = -BOX + 0.05;

    // ── Corner connector lines (4 verticals only) ────────────────────
    const cornerVerts = new Float32Array([
      -BOX, TOP_Y, -BOX,   -BOX, BOT_Y, -BOX,
       BOX, TOP_Y, -BOX,    BOX, BOT_Y, -BOX,
       BOX, TOP_Y,  BOX,    BOX, BOT_Y,  BOX,
      -BOX, TOP_Y,  BOX,   -BOX, BOT_Y,  BOX,
    ]);
    const cornerGeo = new THREE.BufferGeometry();
    cornerGeo.setAttribute("position", new THREE.BufferAttribute(cornerVerts, 3));
    scene.add(new THREE.LineSegments(cornerGeo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 })));

    // ── Layer 3 (bottom): GIS raster surface ─────────────────────────
    const rasterGeo = new THREE.PlaneGeometry(BOX * 2 - 0.6, BOX * 2 - 0.6);
    rasterGeo.rotateX(-Math.PI / 2);
    const satTex = new THREE.TextureLoader().load("/images/iom-satellite.jpg");
    const rasterMesh = new THREE.Mesh(rasterGeo, new THREE.MeshBasicMaterial({
      map: satTex,
      side: THREE.DoubleSide,
    }));
    rasterMesh.position.y = BOT_Y;
    scene.add(rasterMesh);

    // ── Layer 2 (middle): Black wireframe mesh — no fill ─────────────
    const meshRes = 40;
    const meshGeo = new THREE.PlaneGeometry(BOX * 2 - 0.6, BOX * 2 - 0.6, meshRes, meshRes);
    meshGeo.rotateX(-Math.PI / 2);

    const posAttr = meshGeo.getAttribute("position") as THREE.BufferAttribute;
    const originY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) originY[i] = posAttr.getY(i);

    const wireMesh = new THREE.Mesh(meshGeo, new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    }));
    wireMesh.position.y = 0.2;
    scene.add(wireMesh);

    // ── Layer 1 (top): Dense black point grid ────────────────────────
    const ptRes = 34;
    const ptStep = (BOX * 2 - 0.6) / (ptRes - 1);
    const ptPos: number[] = [];
    for (let ix = 0; ix < ptRes; ix++) {
      for (let iz = 0; iz < ptRes; iz++) {
        ptPos.push(-BOX + 0.3 + ix * ptStep, TOP_Y, -BOX + 0.3 + iz * ptStep);
      }
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ptPos), 3));
    scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({ size: 0.06, color: 0x111111 })));

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
