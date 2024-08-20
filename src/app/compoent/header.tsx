'use client';
import React, {useState, useEffect} from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUrl } from './UrlContext';
import Link from 'next/link';

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
                <Nav className="mx-auto">                       
                    <Link className="nav-link header-link me-4" href="/OTA" passHref>OTA</Link>
                    <Link className='nav-link header-link me-4' href="/WIFI" passHref>網路</Link>
                    <Link className='nav-link header-link me-4' href="/Setting" passHref>設定</Link>
                </Nav>
                <Nav>
                    <Navbar.Text className='mx-4 text-info'>version: v2.2.3</Navbar.Text>
                    <Form className="d-flex me-auto">  
                        <Form.Control
                        type="text"
                        placeholder={url}
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