'use client';
import React, {useState, useEffect} from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUrl } from './UrlContext';

const Header = () => {
    const { url, setUrl } = useUrl();
    const [inputUrl, setInputUrl] = useState<string>(url);

    const handleButtonClick = () => {
        setUrl(inputUrl);
        console.log('URL updated to:', inputUrl);
    };

    useEffect(() => {
        console.log('Current URL:', url);
        if (url) {
            axios.get(`http://${url}/api/info`)
                .then(response => {
                    if (response.data) {
                        console.log('ESP32 Data:', response.data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [url]);

    return (
        <Navbar expand="lg" className="header px-5 py-2">
            <Navbar.Brand href="/" className='header-link'>Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto ">
                    <Nav.Link className='header-link me-4' href="/OTA" >雲端更新</Nav.Link>
                    <Nav.Link className='header-link me-4' href="/WIFI" >網路</Nav.Link>
                    <Nav.Link className='header-link me-4' href="/Setting" >設定</Nav.Link>
                </Nav>
                <Nav>
                    <Navbar.Text className='mx-4 text-info'>version: v2.2.3</Navbar.Text>
                    <Form className="d-flex me-auto">  
                        <Form.Control
                        type="text"
                        placeholder="http://window.location.host"
                        aria-label="ESP32 URL" 
                        className='me-2'
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        />
                    </Form>
                    <Button variant="outline-success" onClick={handleButtonClick}>確定</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;