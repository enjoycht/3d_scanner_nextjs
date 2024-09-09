'use client'

import React , { useEffect , useState , useRef } from 'react' ;
import * as THREE from 'three' ;
import { OrbitControls } from 'three/examples/jsm/Addons.js' ;
import { useMsg } from '../compoent/websocket' ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

interface ScanAutoProps {

    angle: String ;
    isPaused: boolean ;

    //分別儲存  Three.js 渲染器、Three.js 場景、Three.js 相機
    rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null> ;
    sceneRef: React.MutableRefObject<THREE.Scene | null> ;
    cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null> ;

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const PointAnimation: React.FC<ScanAutoProps> = ( { angle , isPaused , rendererRef , sceneRef , cameraRef } ) => {

    const { points } = useMsg () ;
    const mountRef = useRef<HTMLDivElement>( null ) ;

    // ~~~~ 旋轉角度
    const pointCloudRotationRef = useRef ( { z: 0 } ) ;

    // ~~~~ 停止動畫
    const animationFrameIdRef = useRef<number | null>( null ) ;

    useEffect(() => {

        console.log ( 'Points:' , points ) ;								// 添加這行來檢查 points 的值.
    
        if ( !points || points.length === 0 ) { 
        
            return ; 
            
        }
    
        const flattenedPoints = new Float32Array ( points.flat().filter ( value => !isNaN ( value ) ) ) ;
    
        if (flattenedPoints.length === 0 ) {

            console.error ( 'No valid points found.' ) ;

            return ;

        }
    
        // ~~~~ 設置場景
        const scene = new THREE.Scene () ;
        sceneRef.current = scene ;
    
        const camera = new THREE.PerspectiveCamera ( 75 , window.innerWidth / window.innerHeight , 0.00001 , 1000 ) ;
        cameraRef.current = camera ;

        switch (angle) { 

						case 'up' :
								camera.position.set ( 0 , 1.2 , 0 ) ;				// 調整相機位置

								break ;

						case 'down' :
								camera.position.set ( 0 , - 1.2 , 0 ) ; 

								break ;

						case 'left' :

								camera.position.set ( - 1.2 , 0 , 0 ) ; 

								break ;

						case 'right' :

								camera.position.set ( 1.2 , 0 , 0 ) ; 

								break ;

						case 'top - left' :

								camera.position.set ( - 1.2 , 1.2 , 0 ) ; 

								break ;

						case 'bottom - left' :

								camera.position.set ( - 1.2 , - 1.2 , 0 ) ; 

								break ;

						case 'top - right' :

								camera.position.set ( 1.2 , 1.2 , 0 ) ; 

								break ;

						case 'bottom - right' :

								camera.position.set ( 1.2 , - 1.2 , 0 ) ; 

								break ; 

						case 'front' :

								camera.position.set ( 0 , 0 , 1.2 ) ; 

								break ;

						case 'back' :		

								camera.position.set ( 0 , 0 , - 1.2 ) ; 

								break ;	

						default :

								camera.position.set ( 1.2 , 1.2 , 1.2 ) ; 

								break ;

				} 
				
        const renderer = new THREE.WebGLRenderer ( { antialias: true } ) ;
        rendererRef.current = renderer ;
        const mountNode = mountRef.current ;

        if ( mountNode ) {

            renderer.setSize ( mountNode.clientWidth , mountNode.clientHeight ) ;
            mountNode.appendChild ( renderer.domElement ) ;

        }
    
        const pointGeometry = new THREE.BufferGeometry () ;
        pointGeometry.setAttribute ( 'position' , new THREE.BufferAttribute ( flattenedPoints , 3 ) ) ;
        pointGeometry.computeBoundingSphere () ;						// Ensure bounding sphere is computed correctly
        const pointMaterial = new THREE.PointsMaterial ( { color: 0xff0000 , size: 0.005 } ) ;			// 增加點的大小
        const pointCloud = new THREE.Points ( pointGeometry , pointMaterial ) ;
        scene.add ( pointCloud )
    
        const controls = new OrbitControls ( camera , renderer.domElement ) ;
        controls.enableRotate = false ;
    
        // ~~~~ 渲染場景
        const animate = () => {

            if ( !isPaused ) {

                pointCloudRotationRef.current.z += 0.005 ;

            }

            pointCloud.rotation.z = pointCloudRotationRef.current.z ;
            controls.update () ;

            // ~~ blink point
            //pointMaterial.opacity = Math.abs ( Math.sin ( Date.now() * 0.005 ) ) ;
            pointMaterial.transparent = true ;
            renderer.render ( scene , camera ) ;
            animationFrameIdRef.current = requestAnimationFrame ( animate ) ;

        }

        animate () ;
    
        const handleResize = () => {

            if ( mountNode ) {

                const { clientWidth , clientHeight } = mountNode ;
                camera.aspect = clientWidth / clientHeight ;
                camera.updateProjectionMatrix () ;
                renderer.setSize ( clientWidth , clientHeight ) ;

            }

        } ;
    
        window.addEventListener ( 'resize' , handleResize ) ;
        handleResize () ;
    
        return () => {

            if ( mountNode ) {

                mountNode.removeChild ( renderer.domElement ) ;

            }

            window.removeEventListener ( 'resize' , handleResize ) ;

            if ( animationFrameIdRef.current !== null ) {

                cancelAnimationFrame ( animationFrameIdRef.current ) ;

            }

        } ;

    } , [ points , angle , isPaused , cameraRef , rendererRef , sceneRef ] ) ;


    return (

        <div className='flex-grow-1' ref={mountRef} style={{ width:'100%', height: '100%'}} />

    ) ;

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default PointAnimation ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
