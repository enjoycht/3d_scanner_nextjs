'use client';
import React, { useState } from 'react';
import { Nav, Navbar, Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUrl } from './UrlContext';
import { useInfo } from './info';
import { useMsg } from '../compoent/websocket';
import Link from 'next/link';

const Header = () => {
    const { url, setUrl } = useUrl();
    const { status } = useMsg();
    const { info } = useInfo();
    const [inputUrl, setInputUrl] = useState<string>(url);

    const handleButtonClick = () => {
        setUrl(inputUrl);
    };

    const myLink = [
        {name: "模組設定", path: "/Setting"},
        {name: "網路設定", path: "/WIFI"},
        {name: "OTA 雲端更新", path: "/OTA"}
    ];

    return (
        <Navbar expand="lg" className="header px-5 py-2">
            <Navbar.Brand className='header-link me-4'>
                <Link className="nav-link header-link" href="/" passHref>3D 立體成形掃描機</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                    {
                        myLink.map((item, index) => {
                            return ( 
                                <Link   key={index}
                                        className='nav-link header-link me-4'
                                        href={item.path}
                                        passHref>{item.name}</Link>
                            );
                        })
                    }
                </Nav>
                <Nav>
                    <InputGroup className='mx-2'>
                        <InputGroup.Text className={(info["version"] === "v0.0.0") ? "text-warning" : "text-info"}>當前版本:</InputGroup.Text>
                        <Form.Control
                            type="text"
                            className={(info["version"] === "v0.0.0") ? "text-warning" : "text-info"}
                            value={(info["version"] === "v0.0.0" )? "測試版本" : info["version"] }
                            aria-label="ESP32 Version" 
                            disabled
                        />
                    </InputGroup>
                </Nav>
                <Nav>
                    <InputGroup className='mx-2'>
                        {
                            (status === "disconnect") ?
                                <InputGroup.Text className='text-danger'>連線中</InputGroup.Text> :
                            (status === "start" || status === "scan" ) ?
                                <InputGroup.Text className='text-success'>列印中</InputGroup.Text> :
                            (status === "stop") ?
                                <InputGroup.Text className='text-warning'>暫停列印</InputGroup.Text> :
                            (status === "end") ?
                                <InputGroup.Text className='text-info'>結束列印</InputGroup.Text> :
                                <InputGroup.Text className='text-secondary'>尚未連線</InputGroup.Text>
                        }
                        <Form.Control
                            type="text"
                            placeholder={url}
                            aria-label="ESP32 URL" 
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                        />
                        <Button variant="outline-success" onClick={handleButtonClick}>確定</Button>
                    </InputGroup>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;