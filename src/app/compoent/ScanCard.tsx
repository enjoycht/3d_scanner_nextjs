'use client';
import React from 'react';
import { Card, Row, Col, FormCheck, Form, FormLabel, FormSelect, Button } from 'react-bootstrap';
import Image from 'next/image';
import CsvString from './csvString';
import * as THREE from 'three';

interface ScanModeProps {
    toggleFeature: () => void;
    isPointAnimation: boolean;
    angle: string; 
    handleAngleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    isPaused: boolean;
    togglePause: () => void;
    rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
    sceneRef: React.MutableRefObject<THREE.Scene | null>;
    cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
}

const ScanCard: React.FC<ScanModeProps> = ({ toggleFeature, isPointAnimation, angle, handleAngleChange, isPaused, togglePause, rendererRef, sceneRef, cameraRef }) => {
    const points = CsvString('/point.csv');  
    const saveSvg = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'scene.png';
            link.click();
        }
    };

    const saveCsv = () => {
        if (points && points.length > 0) {
            const csvContent = points.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', 'points.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Card bg="light" className='text-center d-flex flex-grow-1 my-5 mx-4'>
            <Card.Header className='fs-2 fw-bold'>3D立體成型掃描機</Card.Header>
            <Card.Body>
                <div>
                    <Image src='https://via.placeholder.com/150' alt='placeholder' width={150} height={150} />
                </div>
                <Row>
                    <Col>
                        <Form>
                            <FormLabel className='fs-3 mt-4 fw-bold'>{isPointAnimation ? '自動模式' : '手動模式'}</FormLabel>
                            <FormCheck 
                                type='switch' 
                                id='mode-switch'
                                checked={!isPointAnimation}
                                onChange={toggleFeature}
                            />
                        </Form>
                    </Col>
                </Row>
                {isPointAnimation ? (
                    <>
                        <Row>
                            <Col>
                                <Button onClick={togglePause} className='mt-4'>
                                    {isPaused ? '播放' : '暫停'}
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col><p className='fs-3 fw-bold mt-4'>下載</p></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button onClick={saveSvg}>
                                    下載圖片
                                </Button>
                            </Col>
                            <Col>
                                <Button onClick={saveCsv}>
                                    下載CSV
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormLabel className='fw-bold fs-3 mt-4'>選擇角度</FormLabel>
                                <FormSelect value={angle} onChange={handleAngleChange}>
                                    <option value="up">上</option>
                                    <option value="down">下</option>
                                    <option value="left">左</option>
                                    <option value="right">右</option>
                                    <option value="top-left">左上</option>
                                    <option value="bottom-left">左下</option>
                                    <option value="top-right">右上</option>
                                    <option value="bottom-right">右下</option>
                                </FormSelect>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <>
                        <Row>
                            <Col>
                                <FormLabel>選擇角度</FormLabel>
                                <FormSelect value={angle} onChange={handleAngleChange}>
                                    <option value="up">上</option>
                                    <option value="down">下</option>
                                    <option value="left">左</option>
                                    <option value="right">右</option>
                                    <option value="top-left">左上</option>
                                    <option value="bottom-left">左下</option>
                                    <option value="top-right">右上</option>
                                    <option value="bottom-right">右下</option>
                                </FormSelect>
                            </Col>
                        </Row>
                    </>
                )}
            </Card.Body>
        </Card>
    )
}

export default ScanCard;