'use client';
import React, {useState} from 'react';
import { Card, Row, Col, FormCheck, Form, FormLabel, FormSelect } from 'react-bootstrap';

interface ScanModeProps {
    toggleFeature: () => void;
    isPointAnimation: boolean;
    angle: string; 
    handleAngleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ScanCard: React.FC<ScanModeProps> = ({ toggleFeature, isPointAnimation, angle, handleAngleChange}) => {
    return (
        <Card bg="light" className='text-center d-flex flex-grow-1 my-5 mx-4'>
            <Card.Header>3D立體成型掃描機</Card.Header>
            <Card.Body>
                <div>
                    <img src='https://via.placeholder.com/150' alt='placeholder' />
                </div>
                <Row className='my-5'>
                    <Col>
                        <Form>
                            <FormLabel>{isPointAnimation ? '自動模式' : '手動模式'}</FormLabel>
                            <FormCheck 
                                type='switch' 
                                id='custom-switch'
                                checked={!isPointAnimation}
                                onChange={toggleFeature}
                            />
                        </Form>
                    </Col>
                </Row>
                {isPointAnimation ? (
                    <>
                        <Row className='my-5'>
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
                ) : (
                    <>
                        <Row className='my-5'>
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
                        {/* <Row className='my-5'><Col>y</Col></Row> */}
                    </>
                )}
            </Card.Body>
        </Card>
    )
}

export default ScanCard;