'use client';
import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScanCard from './compoent/ScanCard';
import { Container, Row, Col } from 'react-bootstrap';
import PointAnimation from './compoent/ScanAuto';
import ScanControls from './compoent/ScanControls';
import './global.css';
import * as THREE from 'three';

export default function Home() {
    const [isPointAnimation, setIsPointAnimation] = useState(true);
    const [angle, setAngle] = useState<string>('front');
    const [isPaused, setIsPaused] = useState(false);

    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    const handleAngleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAngle(event.target.value);
    };

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
                        {isPointAnimation ? <ScanControls angle={angle} isPaused={isPaused} /> : <PointAnimation angle={angle} isPaused={isPaused} rendererRef={rendererRef} sceneRef={sceneRef} cameraRef={cameraRef} />}
                    </Col>
                </Row>
            </Container>
        </main>
    );
}