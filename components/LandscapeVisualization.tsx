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
    scene.background = new THREE.Color(0x0d0d0d);

    // Isometric-ish camera from corner — matches reference
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
    camera.position.set(7, 6, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(5, 8, 5);
    scene.add(dir);

    const BOX = 4.2; // half-extent of the cube frame

    // ── Box frame ────────────────────────────────────────────────────
    // Draw 12 edges of a cube using LineSegments
    const frameVerts = new Float32Array([
      // bottom face
      -BOX,-BOX,-BOX,  BOX,-BOX,-BOX,
       BOX,-BOX,-BOX,  BOX,-BOX, BOX,
       BOX,-BOX, BOX, -BOX,-BOX, BOX,
      -BOX,-BOX, BOX, -BOX,-BOX,-BOX,
      // top face
      -BOX, BOX,-BOX,  BOX, BOX,-BOX,
       BOX, BOX,-BOX,  BOX, BOX, BOX,
       BOX, BOX, BOX, -BOX, BOX, BOX,
      -BOX, BOX, BOX, -BOX, BOX,-BOX,
      // verticals
      -BOX,-BOX,-BOX, -BOX, BOX,-BOX,
       BOX,-BOX,-BOX,  BOX, BOX,-BOX,
       BOX,-BOX, BOX,  BOX, BOX, BOX,
      -BOX,-BOX, BOX, -BOX, BOX, BOX,
    ]);
    const frameGeo = new THREE.BufferGeometry();
    frameGeo.setAttribute("position", new THREE.BufferAttribute(frameVerts, 3));
    const frameMat = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5 });
    scene.add(new THREE.LineSegments(frameGeo, frameMat));

    // ── Layer 3 (bottom): Embeddings grid ───────────────────────────
    // Regular cyan/teal grid — represents satellite embeddings
    const EMB_Y = -BOX + 0.2;
    const embRes = 28;
    const embPos: number[] = [];
    const embCol: number[] = [];
    const step = (BOX * 2 - 0.4) / (embRes - 1);

    for (let ix = 0; ix < embRes; ix++) {
      for (let iz = 0; iz < embRes; iz++) {
        const x = -BOX + 0.2 + ix * step;
        const z = -BOX + 0.2 + iz * step;
        const h = Math.sin(ix * 0.35) * Math.cos(iz * 0.35) * 0.3;
        embPos.push(x, EMB_Y + h, z);
        const t = (Math.sin(ix * 0.4 + iz * 0.25) + 1) / 2;
        const c = new THREE.Color().setHSL(0.50 + t * 0.07, 0.9, 0.45 + t * 0.2);
        embCol.push(c.r, c.g, c.b);
      }
    }
    const embGeo = new THREE.BufferGeometry();
    embGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(embPos), 3));
    embGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(embCol), 3));
    scene.add(new THREE.Points(embGeo, new THREE.PointsMaterial({ size: 0.08, vertexColors: true })));

    // ── Layer 2 (middle): Waving wireframe mesh ──────────────────────
    const MESH_Y = 0.2;
    const meshRes = 48;
    const meshGeo = new THREE.PlaneGeometry(BOX * 2 - 0.4, BOX * 2 - 0.4, meshRes, meshRes);
    meshGeo.rotateX(-Math.PI / 2);
    meshGeo.translate(0, MESH_Y, 0);

    const posAttr = meshGeo.getAttribute("position") as THREE.BufferAttribute;
    const originY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) originY[i] = posAttr.getY(i);

    // Solid fill (slightly visible)
    const fillMesh = new THREE.Mesh(meshGeo, new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    }));
    // Wireframe overlay
    const wireMesh = new THREE.Mesh(meshGeo, new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    }));
    scene.add(fillMesh);
    scene.add(wireMesh);

    // ── Layer 1 (top): Dense point grid ─────────────────────────────
    const TOP_Y = BOX - 0.3;
    const ptRes = 36;
    const ptPos: number[] = [];
    const ptStep = (BOX * 2 - 0.4) / (ptRes - 1);

    for (let ix = 0; ix < ptRes; ix++) {
      for (let iz = 0; iz < ptRes; iz++) {
        const x = -BOX + 0.2 + ix * ptStep;
        const z = -BOX + 0.2 + iz * ptStep;
        ptPos.push(x, TOP_Y, z);
      }
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ptPos), 3));
    const ptMat = new THREE.PointsMaterial({ size: 0.055, color: 0xdddddd });
    const topPoints = new THREE.Points(ptGeo, ptMat);
    scene.add(topPoints);
    const topPosAttr = ptGeo.getAttribute("position") as THREE.BufferAttribute;
    const topOriginY = new Float32Array(topPosAttr.count);
    for (let i = 0; i < topPosAttr.count; i++) topOriginY[i] = topPosAttr.getY(i);

    // ── Animate ──────────────────────────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.0005;

      // Wave the mesh
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        posAttr.setY(i, originY[i] + Math.sin(x * 0.9 + t) * 0.55 + Math.cos(z * 0.8 + t * 0.7) * 0.4);
      }
      posAttr.needsUpdate = true;
      meshGeo.computeVertexNormals();

      // Subtle undulation on top point grid
      for (let i = 0; i < topPosAttr.count; i++) {
        const x = topPosAttr.getX(i);
        const z = topPosAttr.getZ(i);
        topPosAttr.setY(i, topOriginY[i] + Math.sin(x * 0.6 + t * 0.5) * 0.12 + Math.cos(z * 0.5 + t * 0.4) * 0.1);
      }
      topPosAttr.needsUpdate = true;

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
