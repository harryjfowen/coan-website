"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface PLYLoader {
  load: (url: string, onLoad: (geometry: THREE.BufferGeometry) => void) => void;
}

export default function PointCloudViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x4aded6, 0.3);
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);

    // Load PLY file
    const loadPLY = async (url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const geometry = parsePLY(arrayBuffer);

        const pointsMaterial = new THREE.PointsMaterial({
          size: 0.02,
          sizeAttenuation: true,
          vertexColors: true,
          opacity: 0.9,
          transparent: true,
        });

        const points = new THREE.Points(geometry, pointsMaterial);

        // Center and scale
        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox!;
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        geometry.scale(scale, scale, scale);

        scene.add(points);
        pointsRef.current = points;
        setIsLoading(false);

        // Auto-rotate slowly
        let autoRotateFrame = 0;
        const autoRotate = () => {
          if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.0005;
          }
          autoRotateFrame = requestAnimationFrame(autoRotate);
        };
        autoRotate();

        return () => cancelAnimationFrame(autoRotateFrame);
      } catch (error) {
        console.error("Error loading PLY:", error);
        setIsLoading(false);
      }
    };

    const cleanup = loadPLY("/models/ptw-website.ply");

    // Mouse controls
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isMouseDown && pointsRef.current) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        pointsRef.current.rotation.y += deltaX * 0.005;
        pointsRef.current.rotation.x += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    // Zoom with scroll
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      if (e.deltaY > 0) {
        camera.position.z += zoomSpeed;
      } else {
        camera.position.z -= zoomSpeed;
      }
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
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
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      cleanup?.then(() => {});
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-white text-sm">Loading point cloud...</div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 pointer-events-none">
        <p>Drag to rotate · Scroll to zoom</p>
      </div>
    </div>
  );
}

function parsePLY(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  const view = new DataView(arrayBuffer);
  const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
  const lines = text.split("\n");

  let headerEnd = 0;
  let vertexCount = 0;
  const properties: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("element vertex")) {
      vertexCount = parseInt(line.split(" ")[2]);
    }
    if (line.startsWith("property")) {
      properties.push(line.split(" ")[2]);
    }
    if (line === "end_header") {
      headerEnd = i + 1;
      break;
    }
  }

  const headerBytes = lines.slice(0, headerEnd).join("\n").length + headerEnd;
  const vertexData = new Float32Array(arrayBuffer, headerBytes);

  const positions: number[] = [];
  const colors: number[] = [];

  const hasColor = properties.includes("red");
  const stride = properties.length;

  for (let i = 0; i < vertexCount; i++) {
    const offset = i * stride;
    positions.push(vertexData[offset], vertexData[offset + 1], vertexData[offset + 2]);

    if (hasColor) {
      const red = vertexData[offset + 3] / 255;
      const green = vertexData[offset + 4] / 255;
      const blue = vertexData[offset + 5] / 255;
      colors.push(red, green, blue);
    } else {
      colors.push(0.4, 0.8, 1.0);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));

  return geometry;
}
