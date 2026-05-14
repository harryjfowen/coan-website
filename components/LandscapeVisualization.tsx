"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LandscapeVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Embeddings layer (bottom) - cyan particles and pattern
    const embeddingsGroup = new THREE.Group();
    embeddingsGroup.position.y = -0.5;

    // Particle system for embeddings
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Cyan to teal color variations
      const hue = 0.5 + Math.random() * 0.1; // cyan-teal range
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      sizeAttenuation: true,
      vertexColors: true,
      opacity: 0.6,
      transparent: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    embeddingsGroup.add(particles);

    // Embeddings mesh layer - subtle plane with color gradient
    const embeddingsMeshGeometry = new THREE.PlaneGeometry(6, 6, 32, 32);
    const embeddingsMeshMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      metalness: 0.3,
      roughness: 0.7,
      emissive: 0x0088cc,
      emissiveIntensity: 0.3,
    });
    const embeddingsMesh = new THREE.Mesh(embeddingsMeshGeometry, embeddingsMeshMaterial);
    embeddingsMesh.rotation.x = -Math.PI / 2.5;
    embeddingsMesh.position.z = -0.2;
    embeddingsGroup.add(embeddingsMesh);

    scene.add(embeddingsGroup);

    // Waving mesh (middle layer) - undulating independently
    const meshGeometry = new THREE.PlaneGeometry(6, 6, 64, 64);
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.2,
      roughness: 0.4,
      wireframe: false,
    });

    const waveMesh = new THREE.Mesh(meshGeometry, meshMaterial);
    scene.add(waveMesh);

    // Store original positions for wave animation
    const positionAttribute = meshGeometry.getAttribute("position");
    const originalPositions = new Float32Array(positionAttribute.array as ArrayLike<number>);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.0005;

      // Update wave mesh with gentle undulation
      const posArray = positionAttribute.array as Float32Array;
      for (let i = 0; i < posArray.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];

        // Gentle wave using sine
        posArray[i] = x;
        posArray[i + 1] = y + Math.sin(x * 0.5 + time) * 0.3 + Math.cos(z * 0.5 + time) * 0.2;
        posArray[i + 2] = z;
      }
      positionAttribute.needsUpdate = true;
      waveMesh.geometry.computeVertexNormals();

      // Subtle rotation of embeddings
      embeddingsGroup.rotation.z += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
