'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

interface ScanControlsProps {
    angle: String;
}
const ScanControls:React.FC<ScanControlsProps>= ({ angle }) => {
    const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 設置場景
    const scene = new THREE.Scene();

    // 設置相機
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      switch (angle) {
        case 'up':
            camera.position.set(0, 5, 0);
            break;
        case 'down':
            camera.position.set(0, -5, 0);
            break;
        case 'left':
            camera.position.set(-5, 0, 0);
            break;
        case 'right':
            camera.position.set(5, 0, 0);
            break;
        case 'top-left':
            camera.position.set(-5, 5, 0);
            break;
        case 'bottom-left':
            camera.position.set(-5, -5, 0);
            break;
        case 'top-right':
            camera.position.set(5, 5, 0);
            break;
        case 'bottom-right':
            camera.position.set(5, -5, 0);
            break;
        default:
            camera.position.set(5, 5, 5);
            break;
    }

    // 設置渲染器
    const renderer = new THREE.WebGLRenderer();
    const mountNode = mountRef.current;
    if (mountNode) {
        renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
        mountNode.appendChild(renderer.domElement);
    }


    // 創建一個正方體
    const geometry = new THREE.BoxGeometry();
    const material = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 红色
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 绿色
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // 蓝色
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 黄色
        new THREE.MeshBasicMaterial({ color: 0xff00ff }), // 洋红色
        new THREE.MeshBasicMaterial({ color: 0x00ffff })  // 青色
    ];
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 創建點雲
    const pointGeometry = new THREE.BufferGeometry();
    const points = new Float32Array([
      // 點的坐標 (x, y, z)
        1.0, 1.0, 1.0,  //前右上
        1.0, 1.0, -1.0, //後右上
        1.0, -1.0, 1.0, //前右下
        1.0, -1.0, -1.0, //後右下
        -1.0, 1.0, 1.0, //前左上
        -1.0, 1.0, -1.0, //後左上
        -1.0, -1.0, 1.0, //前左下
        -1.0, -1.0, -1.0 //後左下
    ]);

    pointGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1});
    const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(pointCloud);

    // 添加軌道控制
    const controls = new OrbitControls(camera, renderer.domElement);

    // 渲染場景
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        if (mountNode) {
            const { clientWidth, clientHeight } = mountNode;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 清理資源
    return () => {
        if (mountNode) {
            mountNode.removeChild(renderer.domElement);
        }
        window.removeEventListener('resize', handleResize);
    };
  }, [angle]);
    return (
        <div className='flex-grow-1' ref={mountRef} style={{ width:'100%', height: '100%', overflow: 'hidden' }} />
    )
}

export default ScanControls;