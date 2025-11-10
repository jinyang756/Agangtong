'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Candlestick3DProps {
  data: any[];
  symbol: string;
}

export default function Candlestick3D({ data, symbol }: Candlestick3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!mountRef.current || !data || data.length === 0) return;
    
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
    camera.position.set(0, 5, 15);
    
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // 添加坐标轴
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // 创建K线图
    const group = new THREE.Group();
    
    // 计算价格范围
    const prices = data.map(d => [d.open, d.high, d.low, d.close]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // 计算坐标轴范围
    const minX = -data.length / 2;
    const maxX = data.length / 2;
    const minY = minPrice - priceRange * 0.1;
    const maxY = maxPrice + priceRange * 0.1;
    
    // 创建坐标轴
    createAxes(scene, minX, maxX, minY, maxY);
    
    // 创建K线
    data.forEach((candle, index) => {
      const x = index - data.length / 2;
      const { open, high, low, close } = candle;
      
      // 创建颜色
      const color = close > open ? 0x00ff00 : 0xff0000; // 绿色上涨，红色下跌
      
      // 创建影线
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, low, 0),
        new THREE.Vector3(x, high, 0)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);
      
      // 创建实体部分
      const bodyHeight = Math.abs(close - open);
      const bodyY = Math.min(open, close);
      
      const bodyGeometry = new THREE.BoxGeometry(0.8, bodyHeight, 0.8);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(x, bodyY + bodyHeight / 2, 0);
      group.add(body);
    });
    
    scene.add(group);
    
    // 简单的交互控制
    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 简单的相机跟随鼠标移动
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
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
    
    setIsLoading(false);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [data, symbol]);
  
  // 创建坐标轴
  const createAxes = (scene: THREE.Scene, minX: number, maxX: number, minY: number, maxY: number) => {
    // X轴
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(minX, minY, 0),
      new THREE.Vector3(maxX, minY, 0)
    ]);
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    scene.add(xAxis);
    
    // Y轴
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(minX, minY, 0),
      new THREE.Vector3(minX, maxY, 0)
    ]);
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    scene.add(yAxis);
    
    // 添加网格
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.position.y = minY;
    scene.add(gridHelper);
  };
  
  if (isLoading && (!data || data.length === 0)) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">加载3D图表中...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-2">图表加载失败</div>
          <div className="text-gray-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          3D K线图 - {symbol}
        </h2>
        <div className="text-sm text-gray-400">
          数据点: {data?.length || 0}
        </div>
      </div>
      <div ref={mountRef} className="w-full h-80 md:h-96 rounded-lg overflow-hidden" />
      <div className="mt-4 text-xs text-gray-400 flex justify-between">
        <div>
          <span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>
          涨
        </div>
        <div>
          <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>
          跌
        </div>
      </div>
    </div>
  );
}