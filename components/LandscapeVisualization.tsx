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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const BOX   = 4.0;
    const TOP_Y =  BOX - 0.3;   // point grid
    const M1_Y  =  0.8;          // upper mesh
    const M2_Y  = -0.8;          // lower mesh (or single mesh band)
    const EMB_Y = -BOX + 1.5;   // embeddings layer
    const SAT_Y = -BOX + 0.05;  // satellite bottom

    // ── Corner connector lines ────────────────────────────────────────
    const cornerVerts = new Float32Array([
      -BOX, TOP_Y, -BOX,   -BOX, SAT_Y, -BOX,
       BOX, TOP_Y, -BOX,    BOX, SAT_Y, -BOX,
       BOX, TOP_Y,  BOX,    BOX, SAT_Y,  BOX,
      -BOX, TOP_Y,  BOX,   -BOX, SAT_Y,  BOX,
    ]);
    const cornerGeo = new THREE.BufferGeometry();
    cornerGeo.setAttribute("position", new THREE.BufferAttribute(cornerVerts, 3));
    scene.add(new THREE.LineSegments(cornerGeo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 })));

    const planeW = BOX * 2 - 0.6;

    // ── Layer 1 (bottom): Satellite imagery ──────────────────────────
    const satGeo = new THREE.PlaneGeometry(planeW, planeW);
    satGeo.rotateX(-Math.PI / 2);
    const satTex = new THREE.TextureLoader().load("/images/iom-satellite.png");
    satTex.colorSpace = THREE.SRGBColorSpace;
    const satMesh = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({
      map: satTex,
      side: THREE.DoubleSide,
    }));
    satMesh.position.y = SAT_Y;
    scene.add(satMesh);

    // ── Layer 2: Embeddings overlay ───────────────────────────────────
    const embGeo = new THREE.PlaneGeometry(planeW, planeW);
    embGeo.rotateX(-Math.PI / 2);
    const embTex = new THREE.TextureLoader().load("/images/iom-embeddings.png");
    embTex.colorSpace = THREE.SRGBColorSpace;
    const embMesh = new THREE.Mesh(embGeo, new THREE.MeshBasicMaterial({
      map: embTex,
      side: THREE.DoubleSide,
    }));
    embMesh.position.y = EMB_Y;
    scene.add(embMesh);

    // ── Layer 3 (middle): Waving black wireframe mesh ─────────────────
    const meshRes = 40;
    const meshGeo = new THREE.PlaneGeometry(planeW, planeW, meshRes, meshRes);
    meshGeo.rotateX(-Math.PI / 2);

    const posAttr = meshGeo.getAttribute("position") as THREE.BufferAttribute;
    const originY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) originY[i] = posAttr.getY(i);

    const wireMesh = new THREE.Mesh(meshGeo, new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    }));
    wireMesh.position.y = M1_Y;
    scene.add(wireMesh);

    // ── Layer 4 (top): Dense black point grid ─────────────────────────
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

    const topAttr   = ptGeo.getAttribute("position") as THREE.BufferAttribute;
    const topOriginY = new Float32Array(topAttr.count);
    for (let i = 0; i < topAttr.count; i++) topOriginY[i] = topAttr.getY(i);

    // ── Animate ───────────────────────────────────────────────────────
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
