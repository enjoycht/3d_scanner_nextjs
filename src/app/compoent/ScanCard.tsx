'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Form, ButtonGroup, FormSelect, Button, InputGroup } from 'react-bootstrap';
import * as THREE from 'three';
import { useUrl } from '../compoent/UrlContext';
import { useMsg } from '../compoent/websocket';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const ScanCard: React.FC<ScanModeProps> = ({ toggleFeature, isPointAnimation, angle, handleAngleChange, isPaused, togglePause, rendererRef, sceneRef, cameraRef }) => {

    const { url } = useUrl();
    const { points, status, name, scanMsg, setPoints, setName } = useMsg();
    const [projectName, setProjectName] = useState<string>("");
    
    const saveSvg = () => {

        if (rendererRef.current && sceneRef.current && cameraRef.current) {

            rendererRef.current.render(sceneRef.current, cameraRef.current);
            const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = '${name}.png';
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
            link.setAttribute('download', '${name}.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }

    };

    const handleCommand = (command: string, name: string = "") => {

        if(!url || url === "" || url === undefined || url.includes("github.io")) {return;};
        let myUrl = `http://${url}/api/set/scanner?command=${command}`;
        console.log("command:", command, "name:", name);

        if (command === "new") { if (name === "") { return; } else { setPoints([]); myUrl += `&name=${name}`; } }

        axios.get(myUrl)

            .then((response) => {

                console.log(response);

            })

            .catch((error) => {
                console.error(error);

            });

    }

    useEffect(() => {

        setProjectName(name);

    }, [name]);

    return (

        <Card bg="light" className='d-flex flex-grow-1 my-5 mx-4'>
            <Card.Header className='fs-2 fw-bold text-center'>3D立體成形掃描機</Card.Header>
            <Card.Body>
                <Row>

                    <Form.Label className='fw-bold fs-4'> 3D 模型名稱</Form.Label>

                    <Form.Control 

                        type='text' 
                        placeholder='輸入3D模型名稱'
                        className='fw-bold fs-4'
                        required
                        value={projectName}
                        disabled={status !== "end"}
                        onChange={(e) => setProjectName(e.target.value)}

                    />

                </Row>

                <Row className='py-2 mb-3'>

                    <div className="d-grid gap-2">

                        <ButtonGroup as={Col} md={12}>
                            {
                                (status !== "scan" && status !== "stop") ? 
                                <Button size="lg" variant="outline-success" onClick={() => handleCommand("new", projectName)} disabled={status === "disconnect"}>{(status === "disconnect")? "尚未連線" : "開始"}</Button> :
                                <>

                                    <Button size="lg" variant={(status === "scan" ) ? "outline-info" : "outline-primary" } onClick={() => handleCommand((status === "scan" ) ? "stop" : "start")}>
                                    {(status === "scan" ) ? "暫停" : "繼續"}
                                    </Button>
                                    <Button size="lg" variant="outline-danger" onClick={() => handleCommand("end")}>
                                        結束
                                    </Button>

                                </>

                            }

                        </ButtonGroup>

                    </div>

                </Row>

                <Row className='py-2'>

                    <Form.Group as={Col} className="mb-3">

                        <InputGroup>

                            <InputGroup.Text>時間</InputGroup.Text>
                            <Form.Control required disabled type="text" value={Math.trunc(scanMsg.time / 60)} />
                            <InputGroup.Text>分</InputGroup.Text> 
                            <Form.Control required disabled type="text" value={Math.trunc(scanMsg.time % 60)} />
                            <InputGroup.Text>秒</InputGroup.Text>

                        </InputGroup>

                    </Form.Group>

                </Row>

                <Form.Group as={Row} className="mb-3">

                    <InputGroup className="mb-2">

                        <InputGroup.Text>視角</InputGroup.Text>

                        <FormSelect value={angle} onChange={handleAngleChange}>

                            <option value="up">上</option>
                            <option value="down">下</option>
                            <option value="left">左</option>
                            <option value="right">右</option>
                            <option value="top-left">左上</option>
                            <option value="bottom-left">左下</option>
                            <option value="top-right">右上</option>
                            <option value="bottom-right">右下</option>
                            <option value="front">前</option>
                            <option value="back">後</option>

                        </FormSelect>

                        <Button onClick={togglePause} variant={isPaused ? 'outline-success' : 'outline-danger'} size="lg">

                            {isPaused ? '旋轉' : '靜止'}

                        </Button>

                    </InputGroup>

                </Form.Group>

            </Card.Body>

            <Card.Footer>

                <Row className='py-2'>

                    <Form.Group as={Col}>

                        <Form.Label>目前Z軸位置</Form.Label>

                        <InputGroup >

                            <Form.Control required disabled type="text" value={scanMsg.z_steps} />
                            <InputGroup.Text> / 47000</InputGroup.Text>

                        </InputGroup>

                    </Form.Group>

                </Row>

                <Row className='py-2'>

                    <Form.Group as={Col}>

                        <Form.Label>物體半徑</Form.Label>

                        <InputGroup>

                            <Form.Control required disabled type="text" value={scanMsg.r} />
                            <InputGroup.Text>mm</InputGroup.Text>

                        </InputGroup>

                    </Form.Group>

                </Row>

                <Row className='py-2 mb-4'>

                    <Form.Group as={Col}>

                        <Form.Label>掃描點</Form.Label>

                        <InputGroup>

                            <InputGroup.Text>點 {scanMsg.points_count}</InputGroup.Text>
                            <Form.Control required disabled type="text" value={scanMsg.points[0]? scanMsg.points[0][0] : ''} />
                            <Form.Control required disabled type="text" value={scanMsg.points[0]? scanMsg.points[0][1] : ''} />
                            <Form.Control required disabled type="text" value={scanMsg.points[0]? scanMsg.points[0][2] : ''} />

                        </InputGroup>

                    </Form.Group>

                </Row>

                <Row className="d-grid gap-2">

                    <ButtonGroup as={Col} md={12}>

                        <Button variant='outline-success' onClick={saveSvg} size='lg'>下載圖片</Button>
                        <Button variant='outline-info' onClick={saveCsv} size='lg'>下載CSV</Button>

                    </ButtonGroup>

                </Row>

            </Card.Footer>

        </Card>

    )

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default ScanCard ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
