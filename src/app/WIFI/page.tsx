'use client';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button} from 'react-bootstrap';
import { useUrl } from '../compoent/UrlContext';

const WiFi = () => {
    const { url } = useUrl();

    const [staPlaceholder, setStaPlaceholder] = useState<string>("");
    const [staPasswordPlaceholder, setStaPasswordPlaceholder] = useState<string>("");
    const [apPlaceholder, setApPlaceholder] = useState<string>("");
    const [apPasswordPlaceholder, setApPasswordPlaceholder] = useState<string>("");
    const [esp32HostnamePlaceholder, setEsp32HostnamePlaceholder] = useState<string>("");

    const [staDefault, setStaDefault] = useState<string>("");
    const [staPasswordDefault, setStaPasswordDefault] = useState<string>("");
    const [apDefault, setApDefault] = useState<string>("");
    const [apPasswordDefault, setApPasswordDefault] = useState<string>("");
    const [esp32HostnameDefault, setEsp32HostnameDefault] = useState<string>("");

    useEffect(() => {
        if(!url || url === "" || url === undefined || url.includes("github.io")) {return;};
        axios.get(`http://${url}/api/info`)
            .then(response => {
                if (response.data) {
                    console.log('ESP32 Data:', response.data);
                    setStaPlaceholder(response.data['data']['sta']['ssid']);
                    setStaPasswordPlaceholder(response.data['data']['sta']['password']);
                    setApPlaceholder(response.data['data']['ap']['ssid']);
                    setApPasswordPlaceholder(response.data['data']['ap']['password']);
                    setEsp32HostnamePlaceholder(response.data['data']['mdns']);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [url]);

    const saveButtonClick = () => {
        const staSSID = staDefault === '' ? staPlaceholder : staDefault;
        const staPassword = staPasswordDefault === '' ? staPasswordPlaceholder : staPasswordDefault;
        const apSSID = apDefault === '' ? apPlaceholder : apDefault;
        const apPassword = apPasswordDefault === '' ? apPasswordPlaceholder : apPasswordDefault;
        const mdns = esp32HostnameDefault === '' ? esp32HostnamePlaceholder : esp32HostnameDefault;

        console.log('Save Setting');
        console.log(staSSID, staPassword, apSSID, apPassword, mdns);
        console.log('wifi url: ', `http://${url}/api/set/data?sta_ssid=${staSSID}&sta_password=${staPassword}&ap_ssid=${apSSID}&ap_password=${apPassword}&mdns=${mdns}`);
        
        if(!url || url === "" || url === undefined || url.includes("github.io")) {return;};
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
                            <Card.Header>WiFi</Card.Header>
                            <Card.Body>
                            <Container>
                                    <Row className='py-2 mb-5'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>STA 帳號</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder={staPlaceholder}
                                                defaultValue={staDefault}
                                                onChange={(e) => setStaDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>STA 密碼</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder={staPasswordPlaceholder}
                                                defaultValue={staPasswordDefault}
                                                onChange={(e) => setStaPasswordDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className='py-2  mb-5'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>AP 帳號</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder={apPlaceholder}
                                                defaultValue={apDefault}
                                                onChange={(e) => setApDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>AP 密碼</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder={apPasswordPlaceholder}
                                                defaultValue={apPasswordDefault}
                                                onChange={(e) => setApPasswordDefault(e.target.value)}
                                            />
                                            </Form.Group>
                                        
                                    </Row>
                                    <Row className='py-2  mb-5'>
                                        <Form.Group as={Col} md="12">
                                            <Form.Label>ESP32 名稱</Form.Label>
                                            <Form.Control
                                            required
                                            type="text"
                                            placeholder={esp32HostnamePlaceholder}
                                            defaultValue={esp32HostnameDefault}
                                            onChange={(e) => setEsp32HostnameDefault(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2 d-grid gap-2s'>
                                        <Col>
                                            <div className="d-grid gap-2">
                                                <Button onClick={saveButtonClick} variant='success'>存檔</Button>
                                            </div>
                                        </Col>
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