'use client';
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScanCard from './compoent/ScanCard';
import { Container, Row, Col } from 'react-bootstrap';
import PointAnimation from './compoent/ScanAuto';
import ScanControls from './compoent/ScanControls';
import './global.css';

export default function Home() {
    const [isPointAnimation, setIsPointAnimation] = useState(true);
    const [angle, setAngle] = useState<string>('left');

    const handleAngleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAngle(event.target.value);
    };

    // 切換模式
    const toggleFeature = () => {
        setIsPointAnimation(!isPointAnimation);
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
                        />
                    </Col>
                    <Col md={9} className="d-flex">
                        {!isPointAnimation ? <ScanControls angle={angle} /> : <PointAnimation angle={angle} />}
                    </Col>
                </Row>
            </Container>
        </main>
    );
}