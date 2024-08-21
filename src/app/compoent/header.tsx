'use client';
import React, {useState, useEffect} from 'react';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUrl } from './UrlContext';
import { useInfo } from './info';
import Link from 'next/link';

const Header = () => {
    const { url, setUrl } = useUrl();
    const { info } = useInfo();
    const [inputUrl, setInputUrl] = useState<string>(url);

    const handleButtonClick = () => {
        setUrl(inputUrl);
    };

    return (
        <Navbar expand="lg" className="header px-5 py-2">
            <Navbar.Brand className='header-link me-4'>
                <Link className="nav-link header-link" href="/" passHref>Home</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">                       
                    <Link className="nav-link header-link me-4" href="/OTA" passHref>OTA</Link>
                    <Link className='nav-link header-link me-4' href="/WIFI" passHref>網路</Link>
                    <Link className='nav-link header-link me-4' href="/Setting" passHref>設定</Link>
                </Nav>
                <Nav>
                    {
                        (info["version"] === "v0.0.0") ?
                            <Navbar.Text className='mx-4 text-warning'>version: v0.0.0 測試版本</Navbar.Text> :
                        (info["version"] === "") ?
                            "" :
                            <Navbar.Text className='mx-4 text-info'>version: {info["version"]}</Navbar.Text>
                    }
                    <Form className="d-flex me-auto">  
                        <Form.Control
                        type="text"
                        placeholder={url}
                        aria-label="ESP32 URL" 
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        />
                    </Form>
                    <Button variant="outline-success" onClick={handleButtonClick}>確定</Button>
                </Nav>
                <Nav>
                    <Button variant='outline-danger' className='ms-4' onClick={() => axios.get(`http://${url}/api/restart`)}>重啟</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;