'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, ButtonGroup, InputGroup} from 'react-bootstrap';
import { useUrl } from '../compoent/UrlContext';
import { useInfo } from '../compoent/info';

const WiFi = () => {
    const { url } = useUrl();
    const { info } = useInfo();

    const [staDefault, setStaDefault] = useState<string>("");
    const [staPasswordDefault, setStaPasswordDefault] = useState<string>("");
    const [apDefault, setApDefault] = useState<string>("");
    const [apPasswordDefault, setApPasswordDefault] = useState<string>("");
    const [esp32HostnameDefault, setEsp32HostnameDefault] = useState<string>("");
    
    const [showPassword, setShowPassword] = useState<string>("password");
    const [showApPassword, setShowApPassword] = useState<string>("password");

    const saveButtonClick = () => {
        const staSSID = staDefault === '' ? info["sta"]["ssid"] : staDefault;
        const staPassword = staPasswordDefault === '' ? info["sta"]["password"]  : staPasswordDefault;
        const apSSID = apDefault === '' ? info["ap"]["ssid"]  : apDefault;
        const apPassword = apPasswordDefault === '' ? info["ap"]["password"]  : apPasswordDefault;
        const mdns = esp32HostnameDefault === '' ? info["mdns"] : esp32HostnameDefault;
        
        if(!url || url === "" || url === undefined || url.includes("github.io") || url.includes("github.dev")) {return;};
        axios.get(`http://${url}/api/set/data?sta_ssid=${staSSID}&sta_password=${staPassword}&ap_ssid=${apSSID}&ap_password=${apPassword}&mdns=${mdns}`)
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
                            <Card.Header  className='fs-2'>
                                <Row>
                                    <Col></Col>
                                    <Col>ESP32 無線網路設定</Col>
                                    <Col>
                                        <div className="d-grid gap-2">
                                            <ButtonGroup as={Col} md={12}>
                                                <Button onClick={saveButtonClick} variant='outline-success' size="lg">存檔</Button>
                                                <Button onClick={() => axios.get(`http://${url}/api/restart`)} variant='outline-danger' size="lg">重啟</Button>
                                            </ButtonGroup>
                                        </div>
                                    </Col>
                                </Row>
                                </Card.Header>
                            <Card.Body>
                                <Container>
                                    <Row className='py-2 mb-5'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>STA 帳號</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder={info["sta"]["ssid"]}
                                                defaultValue={staDefault}
                                                onChange={(e) => setStaDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>STA 密碼</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type={showPassword}
                                                    defaultValue={staPasswordDefault === '' ? info["sta"]["password"] : staPasswordDefault}
                                                    onChange={(e) => setStaPasswordDefault(e.target.value)}
                                                />
                                                <Button variant="outline-secondary" id="button-addon1" 
                                                onClick={() => setShowPassword(prevState => (prevState === "password" ? "text" : "password"))}>
                                                    {(showPassword === "password") ? "顯示密碼" : "隱藏密碼"}
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2 mb-5'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>STA 帳號</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder={info["sta"]["ssid"]}
                                                defaultValue={staDefault}
                                                onChange={(e) => setStaDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>STA 密碼</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type={showPassword}
                                                    defaultValue={staPasswordDefault === '' ? info["sta"]["password"] : staPasswordDefault}
                                                    onChange={(e) => setStaPasswordDefault(e.target.value)}
                                                />
                                                <Button variant="outline-secondary" id="button-addon1" 
                                                onClick={() => setShowPassword(prevState => (prevState === "password" ? "text" : "password"))}>
                                                    {(showPassword === "password") ? "顯示密碼" : "隱藏密碼"}
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2  mb-5'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>AP 帳號</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder={info["ap"]["ssid"]}
                                                defaultValue={apDefault}
                                                onChange={(e) => setApDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>AP 密碼</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    required
                                                    type={showApPassword}
                                                    defaultValue={apPasswordDefault === '' ? info["ap"]["password"] : apPasswordDefault}
                                                    onChange={(e) => setApPasswordDefault(e.target.value)}
                                                />
                                                <Button variant="outline-secondary" id="button-addon1" 
                                                        onClick={() => setShowApPassword(prevState => (prevState === "password" ? "text" : "password"))}>
                                                            {(showApPassword === "password") ? "顯示密碼" : "隱藏密碼"}
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2  mb-5'>
                                        <Form.Group as={Col} md="12">
                                            <Form.Label>ESP32 名稱</Form.Label>
                                            <Form.Control
                                            required
                                            type="text"
                                            placeholder={info["mdns"]}
                                            defaultValue={esp32HostnameDefault}
                                            onChange={(e) => setEsp32HostnameDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
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
export default WiFi;