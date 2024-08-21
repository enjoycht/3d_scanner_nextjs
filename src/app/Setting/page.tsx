'use client';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useUrl } from '../compoent/UrlContext';
import { useInfo } from '../compoent/info';
import { useMsg } from '../compoent/websocket';

const Setting = () => {
    const { url } = useUrl();
    const { info } = useInfo();
    const { stopMsg } = useMsg();

    const [zAxisSteps, setZAxisSteps] = useState(0);
    const [moduleData, setModuleData] = useState({
        z_axis_max: "",
        z_axis_one_time_step: "",
        z_axis_delay_time: "",
        z_axis_start_step: "",
        x_y_axis_max: "",
        x_y_axis_check_times: "",
        x_y_axis_one_time_step: "",
        x_y_axis_step_delay_time: "",
        vl53l1x_center: "",
        vl53l1x_timeing_budget: ""
    });

    const [moduleDataP, setModuleDataP] = useState({
        z_axis_max: "",
        z_axis_one_time_step: "",
        z_axis_delay_time: "",
        z_axis_start_step: "",
        x_y_axis_max: "",
        x_y_axis_check_times: "",
        x_y_axis_one_time_step: "",
        x_y_axis_step_delay_time: "",
        vl53l1x_center: "",
        vl53l1x_timeing_budget: ""
    });

    useEffect(() => {
        setModuleDataP(info['module']);
        setModuleChange('vl53l1x_timeing_budget', info['module']['vl53l1x_timeing_budget']);
    }, [info]);

    const saveButtonClick = () => {
        let param = "";
        for (const key in moduleData) {
            if (moduleData[key as keyof typeof moduleData] === ""){
                param += `${key}=${moduleDataP[key as keyof typeof moduleDataP]}&`;
            } else {
                param += `${key}=${moduleData[key as keyof typeof moduleData]}&`;
            }
        }
        param = param.slice(0, -1);
        console.log(`Save Setting: ${param}`);
        if(!url || url === "" || url === undefined || url.includes("github.io") || url.includes("github.dev")) {return;};
        axios.get(`http://${url}/api/set/data?${param}`)
            .then(response => {
                if (response.data) {
                    console.log('ESP32 Data:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
 
    const zAxisUpButtonClick = () => {
        console.log(`Z Axis Up: ${zAxisSteps}steps`);
        if(!url || url === "" || url === undefined || url.includes("github.io") || url.includes("github.dev")) {return;};
        axios.get(`http://${url}/api/set/scanner?command=up&step=${zAxisSteps}`)
            .then(response => {
                if (response.data) {
                    console.log('ESP32 Data:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const zAxisDownButtonClick = () => {
        console.log(`Z Axis Down: ${zAxisSteps}steps`);
        if(!url || url === "" || url === undefined || url.includes("github.io") || url.includes("github.dev")) {return;};
        axios.get(`http://${url}/api/set/scanner?command=down&step=${zAxisSteps}`)
            .then(response => {
                if (response.data) {
                    console.log('ESP32 Data:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const zAxisHomeButtonClick = () => {
        console.log('Z Axis Home');
        if(!url || url === "" || url === undefined || url.includes("github.io") || url.includes("github.dev")) {return;};
        axios.get(`http://${url}/api/set/scanner?command=home`)
            .then(response => {
                if (response.data) {
                    console.log('ESP32 Data:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const setModuleChange = (key: string, value: string) => {
        setModuleData(prevData => { return { ...prevData, [key]: value } });
    }

    return (
        <main className='d-flex'> 
            <Container className='flex-grow-1 d-flex'>
                <div className='d-flex flex-grow-1'>
                    <div className='d-flex flex-grow-1'>
                        <Card bg="light" className='text-center flex-grow-1 my-5 mx-4'>
                            <Card.Header className='fs-2'>Setting</Card.Header>
                            <Card.Body>
                                <Container>
                                    <Row className='py-2'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸最大值</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_max}
                                                    defaultValue={moduleData.z_axis_max}
                                                    onChange={(e) => setModuleChange('z_axis_max', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸每次上升微步</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_one_time_step}
                                                    defaultValue={moduleData.z_axis_one_time_step}
                                                    onChange={(e) => setModuleChange('z_axis_one_time_step', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸速度</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_delay_time}
                                                    defaultValue={moduleData.z_axis_delay_time}
                                                    onChange={(e) => setModuleChange('z_axis_delay_time', e.target.value)}
                                                />
                                                <InputGroup.Text>delayMicroseconds</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸初始矯正值</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_start_step}
                                                    defaultValue={moduleData.z_axis_start_step}
                                                    onChange={(e) => setModuleChange('z_axis_start_step', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2'> 
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸1圈微步</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder={moduleDataP.x_y_axis_max}
                                                        defaultValue={moduleData.x_y_axis_max}
                                                        onChange={(e) => setModuleChange('x_y_axis_max', e.target.value)}
                                                    />
                                                    <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸每次上升微步</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.x_y_axis_one_time_step}
                                                    defaultValue={moduleData.x_y_axis_one_time_step}
                                                    onChange={(e) => setModuleChange('x_y_axis_one_time_step', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸速度</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.x_y_axis_step_delay_time}
                                                    defaultValue={moduleData.x_y_axis_step_delay_time}
                                                    onChange={(e) => setModuleChange('x_y_axis_step_delay_time', e.target.value)}
                                                />
                                                <InputGroup.Text>delayMicroseconds</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸掃描次數</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.x_y_axis_check_times}
                                                    defaultValue={moduleData.x_y_axis_check_times}
                                                    onChange={(e) => setModuleChange('x_y_axis_check_times', e.target.value)}
                                                />
                                                <InputGroup.Text>次</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>雷射中心點</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.vl53l1x_center}
                                                    defaultValue={moduleData.vl53l1x_center}
                                                    onChange={(e) => setModuleChange('vl53l1x_center', e.target.value)}
                                                />
                                                <InputGroup.Text>mm</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>雷射 Timeing Budget</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Select defaultValue="" value={moduleData.vl53l1x_timeing_budget}
                                                    onChange={(e) => setModuleChange('vl53l1x_timeing_budget', e.target.value)}> 
                                                    <option>15</option>
                                                    <option>20</option>
                                                    <option>33</option>
                                                    <option>50</option>
                                                    <option>100</option>
                                                    <option>500</option>
                                                </Form.Select>
                                                <InputGroup.Text>ms</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                    <Row className='py-2 d-grid gap-2s'>
                                        <Col>
                                            <div className="d-grid gap-2">
                                                <Button onClick={saveButtonClick} variant='success'>存檔</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="border-bottom border-2 p-2" />
                                    <Row className='py-2'>
                                        <Col md={6}> 
                                            <Form.Label as={Col}>Z軸步數</Form.Label>
                                            <Form.Group as={Col}>
                                                <InputGroup className="mb-3">
                                                    <Form.Control
                                                        required
                                                        value={zAxisSteps}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setZAxisSteps(value === '' || isNaN(parseInt(value)) ? 1 : parseInt(value));
                                                        }}
                                                        type="text"
                                                        placeholder="1"
                                                    />
                                                    <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                       </Col>
                                        <Col md={2}>
                                            <Button onClick={zAxisUpButtonClick} className='mt-4' size="lg">Z軸 往上</Button>
                                        </Col>
                                        <Col md={2}>
                                            <Button onClick={zAxisHomeButtonClick} className='mt-4' size="lg">Z軸 歸位</Button>
                                        </Col>
                                        <Col md={2}>
                                            <Button onClick={zAxisDownButtonClick} className='mt-4' size="lg"> Z軸 往下</Button>
                                        </Col>
                                    </Row>
                                    <Row className='py-2'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>目前Z軸位置</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    disabled
                                                    type="text"
                                                    value={stopMsg.z_steps}
                                                    onChange={(e) => (isNaN(parseInt(e.target.value))? 1: parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text> / 47000</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>雷射測距</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    disabled
                                                    type="text"
                                                    value={stopMsg.vl53l1x}
                                                    onChange={(e) => (isNaN(parseInt(e.target.value))? 1: parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text>mm</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </main>
    );
}
export default Setting;