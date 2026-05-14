"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LandscapeVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera angled from above and to the side — like the reference
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6, 5, 6);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ── Layer 1 (bottom): Embeddings grid ─────────────────────────────
    // Regular grid of cyan/teal points varying in brightness — structured data
    const embGroup = new THREE.Group();
    embGroup.position.y = -1.8;

    const gridRes = 30;
    const gridSpacing = 5 / gridRes;
    const embPositions: number[] = [];
    const embColors: number[] = [];

    for (let ix = 0; ix < gridRes; ix++) {
      for (let iz = 0; iz < gridRes; iz++) {
        const x = (ix - gridRes / 2) * gridSpacing;
        const z = (iz - gridRes / 2) * gridSpacing;
        // Slight height variation to give embedding "values"
        const val = Math.sin(ix * 0.4) * Math.cos(iz * 0.4) * 0.15;
        embPositions.push(x, val, z);

        // Cyan to teal palette varying by position
        const t = (Math.sin(ix * 0.3 + iz * 0.2) + 1) / 2;
        const c = new THREE.Color().setHSL(0.50 + t * 0.08, 0.85, 0.45 + t * 0.2);
        embColors.push(c.r, c.g, c.b);
      }
    }

    const embGeo = new THREE.BufferGeometry();
    embGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(embPositions), 3));
    embGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(embColors), 3));
    const embMat = new THREE.PointsMaterial({ size: 0.07, sizeAttenuation: true, vertexColors: true });
    embGroup.add(new THREE.Points(embGeo, embMat));
    scene.add(embGroup);

    // ── Layer 2 (top): Gently waving mesh ─────────────────────────────
    const meshRes = 60;
    const meshGeo = new THREE.PlaneGeometry(5, 5, meshRes, meshRes);
    meshGeo.rotateX(-Math.PI / 2);

    // Two materials: solid fill + wireframe overlay
    const fillMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x888888,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const fillMesh = new THREE.Mesh(meshGeo, fillMat);
    const wireMesh = new THREE.Mesh(meshGeo, wireMat);
    fillMesh.position.y = 0.3;
    wireMesh.position.y = 0.3;
    scene.add(fillMesh);
    scene.add(wireMesh);

    // Store original Y values for wave animation
    const posAttr = meshGeo.getAttribute("position") as THREE.BufferAttribute;
    const originY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      originY[i] = posAttr.getY(i);
    }

    // Animation
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.0006;

      // Gentle ocean-like undulation
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const wave = Math.sin(x * 1.2 + t) * 0.22 + Math.cos(z * 1.0 + t * 0.8) * 0.18;
        posAttr.setY(i, originY[i] + wave);
      }
      posAttr.needsUpdate = true;
      meshGeo.computeVertexNormals();

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = containerRef.current?.clientWidth || width;
      const h = containerRef.current?.clientHeight || height;
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
