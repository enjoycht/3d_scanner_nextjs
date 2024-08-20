'use client';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useUrl } from '../compoent/UrlContext';

const Setting = () => {
    const { url } = useUrl();
    const [zAxisSteps, setZAxisSteps] = useState<number>(1);

    const [zAxisMaxPlaceholder, setZAxisMaxPlaceholder] = useState<string>("");
    const [zAxisStepPlaceholder, setZAxisStepPlaceholder] = useState<string>("");
    const [zAxisSpeedPlaceholder, setZAxisSpeedPlaceholder] = useState<string>("");
    const [zAxisCorrectionPlaceholder, setZAxisCorrectionPlaceholder] = useState<string>("");
    const [xyStepPlaceholder, setXyStepPlaceholder] = useState<string>("");
    const [xyStepPerStepPlaceholder, setXyStepPerStepPlaceholder] = useState<string>("");
    const [xySpeedPlaceholder, setXySpeedPlaceholder] = useState<string>("");
    const [laserCenterPlaceholder, setLaserCenterPlaceholder] = useState<string>("");

    const [zAxisMaxDefault, setZAxisMaxDefault] = useState<number>();
    const [zAxisStepDefault, setZAxisStepDefault] = useState<number>();
    const [zAxisSpeedDefault, setZAxisSpeedDefault] = useState<number>();
    const [zAxisCorrectionDefault, setZAxisCorrectionDefault] = useState<number>();
    const [xyStepDefault, setXyStepDefault] = useState<number>();
    const [xyStepPerStepDefault, setXyStepPerStepDefault] = useState<number>();
    const [xySpeedDefault, setXySpeedDefault] = useState<number>();
    const [laserCenterDefault, setLaserCenterDefault] = useState<number>();
    const [timingBudgetDefault, setTimingBudgetDefault] = useState<number>(15);
    
    const [zAxisCorrentPosition, setZAxisCorrentPosition] = useState<number>();
    const [laserDistance, setLaserDistance] = useState<number>();
    const [ws, setWs] = useState<WebSocket | null>(null);

    
    useEffect(() => {
        console.log(url);
        if(!url) {return;};
        const socket = new WebSocket(`ws://${url}/ws`);
        axios.get(`http://${url}/api/info`)
            .then(response => {
                if (response.data) {
                    console.log('ESP32 Data:', response.data);
                    setZAxisMaxPlaceholder(response.data['data']['module']['z_axis_max']);
                    setZAxisStepPlaceholder(response.data['data']['module']['z_axis_one_time_step']);
                    setZAxisSpeedPlaceholder(response.data['data']['module']['z_axis_delay_time']);
                    setZAxisCorrectionPlaceholder(response.data['data']['module']['z_axis_start_step']);
                    setXyStepPlaceholder(response.data['data']['module']['x_y_axis_max']);
                    setXyStepPerStepPlaceholder(response.data['data']['module']['x_y_axis_one_time_step']);
                    setXySpeedPlaceholder(response.data['data']['module']['x_y_axis_step_delay_time']);
                    setLaserCenterPlaceholder(response.data['data']['module']['vl53l1x_center']); 
                    setTimingBudgetDefault(response.data['data']['module']['vl53l1x_timeing_budget']);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        socket.addEventListener('open', (event) => {
            console.log('WebSocket is open now.');
        });
        
        // Listen for messages
        socket.addEventListener('message', (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            setZAxisCorrentPosition(message.z_steps);
            setLaserDistance(message.vl53l1x);
        });
        
        // Connection closed
        socket.addEventListener('close', (event) => {
            console.log('WebSocket is closed now.');
        });
        
        // Handle errors
        socket.addEventListener('error', (event) => {
            console.error('WebSocket error observed:', event);
        });
        
        setWs(socket);
        
        return () => {
            socket.close();
        };
    }, [url]);

    const saveButtonClick = () => {
        console.log('Save Setting');
        const zAxisMax = zAxisMaxDefault === undefined ? zAxisMaxPlaceholder : zAxisMaxDefault;
        const zAxisStep = zAxisStepDefault === undefined ? zAxisStepPlaceholder : zAxisStepDefault;
        const zAxisSpeed = zAxisSpeedDefault === undefined ? zAxisSpeedPlaceholder : zAxisSpeedDefault;
        const zAxisCorrection = zAxisCorrectionDefault === undefined ? zAxisCorrectionPlaceholder : zAxisCorrectionDefault;
        const xyStep = xyStepDefault === undefined ? xyStepPlaceholder : xyStepDefault;
        const xyStepPerStep = xyStepPerStepDefault === undefined ? xyStepPerStepPlaceholder: xyStepPerStepDefault;
        const xySpeed = xySpeedDefault === undefined ? xySpeedPlaceholder : xySpeedDefault;
        const laserCenter = laserCenterDefault === undefined ? laserCenterPlaceholder : laserCenterDefault;
        const timingBudget = timingBudgetDefault;

        console.log('save url: ', `http://${url}/api/set/data?z_axis_max=${zAxisMax}&z_axis_start_step=${zAxisStep}&z_axis_delay_time=${zAxisSpeed}&z_axis_one_time_step=${zAxisCorrection}&x_y_axis_max=${xyStep}&x_y_axis_step_delay_time=${xyStepPerStep}&x_y_axis_one_time_step=${xySpeed}&vl53l1x_center=${laserCenter}&vl53l1x_timeing_budget=${timingBudget}`);
        axios.get(`http://${url}/api/set/data?z_axis_max=${zAxisMax}&z_axis_start_step=${zAxisStep}&z_axis_delay_time=${zAxisSpeed}&z_axis_one_time_step=${zAxisCorrection}&x_y_axis_max=${xyStep}&x_y_axis_step_delay_time=${xyStepPerStep}&x_y_axis_one_time_step=${xySpeed}&vl53l1x_center=${laserCenter}&vl53l1x_timeing_budget=${timingBudget}`)
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
                                                    placeholder={zAxisMaxPlaceholder}
                                                    defaultValue={zAxisMaxDefault}
                                                    onChange={(e) => setZAxisMaxDefault(parseInt(e.target.value))}
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
                                                    placeholder={zAxisStepPlaceholder}
                                                    defaultValue={zAxisStepDefault}
                                                    onChange={(e) => setZAxisStepDefault(parseInt(e.target.value))}
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
                                                    placeholder={zAxisSpeedPlaceholder}
                                                    defaultValue={zAxisSpeedDefault}
                                                    onChange={(e) => setZAxisSpeedDefault(parseInt(e.target.value))}
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
                                                    placeholder={zAxisCorrectionPlaceholder}
                                                    defaultValue={zAxisCorrectionDefault}
                                                    onChange={(e) => setZAxisCorrectionDefault(parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2'> 
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>X Y軸1圈微步</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder={xyStepPlaceholder}
                                                        defaultValue={xyStepDefault}
                                                        onChange={(e) => setXyStepDefault(parseInt(e.target.value))}
                                                    />
                                                    <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>X Y軸每次上升微步</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={xyStepPerStepPlaceholder}
                                                    defaultValue={xyStepPerStepDefault}
                                                    onChange={(e) => setXyStepPerStepDefault(parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>X Y軸速度</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={xySpeedPlaceholder}
                                                    defaultValue={xySpeedDefault}
                                                    onChange={(e) => setXySpeedDefault(parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text>delayMicroseconds</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                    <Row className='py-2'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>雷射中心點</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={laserCenterPlaceholder}
                                                    defaultValue={laserCenterDefault}
                                                    onChange={(e) => setLaserCenterDefault(parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text>mm</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>雷射 Timeing Budget</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Select defaultValue={timingBudgetDefault} 
                                                    onChange={(e) => setTimingBudgetDefault(isNaN(parseInt(e.target.value))? 1: parseInt(e.target.value))}> 
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
                                                    value={zAxisCorrentPosition}
                                                    onChange={(e) => setZAxisCorrentPosition(isNaN(parseInt(e.target.value))? 1: parseInt(e.target.value))}
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
                                                    value={laserDistance}
                                                    onChange={(e) => setLaserDistance(isNaN(parseInt(e.target.value))? 1: parseInt(e.target.value))}
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