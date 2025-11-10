'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OrderBookHologramProps {
  data: {
    bids: { price: number; quantity: number }[];
    asks: { price: number; quantity: number }[];
  } | null;
}

export default function OrderBookHologram({ data }: OrderBookHologramProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current || !data) return;
    
    // 清空之前的渲染
    mountRef.current.innerHTML = '';
    
    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    
    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 创建订单簿可视化
    const group = new THREE.Group();
    
    // 获取最高价格和最大数量用于缩放
    const allPrices = [...data.bids, ...data.asks].map(item => item.price);
    const allQuantities = [...data.bids, ...data.asks].map(item => item.quantity);
    const maxPrice = Math.max(...allPrices);
    const minPrice = Math.min(...allPrices);
    const maxQuantity = Math.max(...allQuantities);
    
    // 创建买单可视化（绿色）
    data.bids.forEach((bid, index) => {
      const normalizedPrice = (bid.price - minPrice) / (maxPrice - minPrice);
      const normalizedQuantity = bid.quantity / maxQuantity;
      
      const geometry = new THREE.BoxGeometry(0.5, normalizedQuantity * 3, 0.5);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8
      });
      const cube = new THREE.Mesh(geometry, material);
      
      cube.position.set(
        -1.5, // 左侧
        normalizedPrice * 4 - 2, // 垂直位置基于价格
        0
      );
      
      group.add(cube);
    });
    
    // 创建卖单可视化（红色）
    data.asks.forEach((ask, index) => {
      const normalizedPrice = (ask.price - minPrice) / (maxPrice - minPrice);
      const normalizedQuantity = ask.quantity / maxQuantity;
      
      const geometry = new THREE.BoxGeometry(0.5, normalizedQuantity * 3, 0.5);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
      });
      const cube = new THREE.Mesh(geometry, material);
      
      cube.position.set(
        1.5, // 右侧
        normalizedPrice * 4 - 2, // 垂直位置基于价格
        0
      );
      
      group.add(cube);
    });
    
    scene.add(group);
    
    // 添加旋转动画
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 缓慢旋转
      group.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // 窗口大小调整
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [data]);
  
  if (!data) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">加载订单簿中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
        订单簿全息图
      </h2>
      <div ref={mountRef} className="w-full h-80 rounded-lg overflow-hidden" />
      <div className="mt-4 text-xs text-gray-400 flex justify-between">
        <div>
          <span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>
          买单
        </div>
        <div>
          <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>
          卖单
        </div>
      </div>
    </div>
  );
}