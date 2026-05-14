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
    camera.position.set(4, 7, 18);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const BOX   = 5.0;
    const TOP_Y =  4.5;
    const M1_Y  =  1.5;
    const EMB_Y = -1.5;
    const SAT_Y = -4.5;

    const planeW = BOX * 2 - 0.6;

    // Layer 1 (bottom): Satellite imagery
    const satGeo = new THREE.PlaneGeometry(planeW, planeW);
    satGeo.rotateX(-Math.PI / 2);
    const satTex = new THREE.TextureLoader().load("/images/iom-satellite.png");
    satTex.colorSpace = THREE.SRGBColorSpace;
    const satMesh = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ map: satTex, side: THREE.DoubleSide }));
    satMesh.position.y = SAT_Y;
    scene.add(satMesh);

    // Layer 2: Embeddings overlay
    const embGeo = new THREE.PlaneGeometry(planeW, planeW);
    embGeo.rotateX(-Math.PI / 2);
    const embTex = new THREE.TextureLoader().load("/images/iom-embeddings.png");
    embTex.colorSpace = THREE.SRGBColorSpace;
    const embMesh = new THREE.Mesh(embGeo, new THREE.MeshBasicMaterial({ map: embTex, side: THREE.DoubleSide }));
    embMesh.position.y = EMB_Y;
    scene.add(embMesh);

    // Layer 3: Waving interior grid (no border)
    const gridN = 22;
    const half = planeW / 2;
    const gStep = planeW / gridN;
    const gridLineCount = gridN * (gridN + 1) * 2;
    const gridPos = new Float32Array(gridLineCount * 2 * 3);
    let gi = 0;
    for (let ix = 1; ix < gridN; ix++) {
      for (let iz = 0; iz < gridN; iz++) {
        const x = -half + ix * gStep;
        const z0 = -half + iz * gStep;
        const z1 = -half + (iz + 1) * gStep;
        gridPos[gi++] = x; gridPos[gi++] = 0; gridPos[gi++] = z0;
        gridPos[gi++] = x; gridPos[gi++] = 0; gridPos[gi++] = z1;
      }
    }
    for (let iz = 1; iz < gridN; iz++) {
      for (let ix = 0; ix < gridN; ix++) {
        const z = -half + iz * gStep;
        const x0 = -half + ix * gStep;
        const x1 = -half + (ix + 1) * gStep;
        gridPos[gi++] = x0; gridPos[gi++] = 0; gridPos[gi++] = z;
        gridPos[gi++] = x1; gridPos[gi++] = 0; gridPos[gi++] = z;
      }
    }
    const gridGeo = new THREE.BufferGeometry();
    const gridPosAttr = new THREE.BufferAttribute(gridPos, 3);
    gridGeo.setAttribute("position", gridPosAttr);
    const gridMesh = new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }));
    gridMesh.position.y = M1_Y;
    scene.add(gridMesh);

    // Layer 4 (top): Dense black point grid
    const ptRes  = 34;
    const ptStep = planeW / (ptRes - 1);
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

    // Animate
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.0005;

      for (let i = 0; i < gridPosAttr.count; i++) {
        const x = gridPosAttr.getX(i);
        const z = gridPosAttr.getZ(i);
        gridPosAttr.setY(i, Math.sin(x * 0.9 + t) * 0.12 + Math.cos(z * 0.8 + t * 0.7) * 0.09);
      }
      gridPosAttr.needsUpdate = true;

      for (let i = 0; i < topAttr.count; i++) {
        const x = topAttr.getX(i);
        const z = topAttr.getZ(i);
        topAttr.setY(i, topOriginY[i] + Math.sin(x * 1.4 + t * 1.5) * 0.18 + Math.cos(z * 1.2 + t * 1.2) * 0.12);
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
