'use client';
import React, {useEffect, useState, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScanCard from './compoent/ScanCard';
import { Container, Row, Col } from 'react-bootstrap';
import PointAnimation from './compoent/ScanAuto';
import ScanControls from './compoent/ScanControls';
import './global.css';
import * as THREE from 'three';

export default function Home() {
    const [isPointAnimation, setIsPointAnimation] = useState(true);
    const [angle, setAngle] = useState<string>('up');
    const [isPaused, setIsPaused] = useState(false);

    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    useEffect(() => {
        const socket = new WebSocket('ws://window.location.host/ws'); 
        socket.onopen = () => {
            console.log('WebSocket connection established');
        };
    
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);
        };
    
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = (message: string) => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            console.log('WebSocket connection established');
            socket.send(message);
        };
    }

    const handleAngleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAngle(event.target.value);
    };

    
    // 切換模式
    const toggleFeature = () => {
        setIsPointAnimation(!isPointAnimation);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    return (
        <main className='d-flex'> 
            <Container fluid className='flex-grow-1 d-flex'>
                <Row className='flex-grow-1'>
                    <Col md={3} className="d-flex flex-column">
                        <ScanCard 
                            toggleFeature={toggleFeature} 
                            isPointAnimation={isPointAnimation} 
                            angle={angle}
                            handleAngleChange={handleAngleChange}
                            isPaused={isPaused}
                            togglePause={togglePause}
                            rendererRef={rendererRef}
                            sceneRef={sceneRef}
                            cameraRef={cameraRef}    
                        />
                    </Col>
                    <Col md={9} className="d-flex">
                        {isPointAnimation ? <ScanControls angle={angle} isPaused={isPaused}/> : <PointAnimation angle={angle} isPaused={isPaused} rendererRef={rendererRef} sceneRef={sceneRef} cameraRef={cameraRef} />}
                    </Col>
                </Row>
            </Container>
        </main>
    );
}


