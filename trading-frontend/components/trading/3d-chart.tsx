'use client';
// @ts-ignore
import { useEffect, useRef } from 'react';
// @ts-ignore
import * as THREE from 'three';

interface Candlestick3DProps {
  data: { open: number; high: number; low: number; close: number; volume: number }[];
  symbol: string;
}

export default function Candlestick3D({ data, symbol }: Candlestick3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 初始化Three.js场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 500);
    mountRef.current.appendChild(renderer.domElement);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // 创建3D K线
    data.forEach((candle, index) => {
      const height = Math.abs(candle.close - candle.open);
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
      const material = new THREE.MeshPhongMaterial({
        color: candle.close > candle.open ? 0x00ff00 : 0xff0000,
        emissive: candle.close > candle.open ? 0x004400 : 0x440000,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(index * 1.2, height / 2, 0);
      scene.add(cube);

      // 添加上下影线
      const lineGeometry = new THREE.CylinderGeometry(0.05, 0.05, candle.high - candle.low);
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.set(index * 1.2, (candle.high + candle.low) / 2, 0);
      scene.add(line);
    });

    // 自动旋转
    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [data]);

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl overflow-hidden border border-cyan-500/30">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-cyan-300 font-mono text-sm">
        <div>股票: {symbol}</div>
        <div>模式: 3D全息投影</div>
      </div>
    </div>
  );
}