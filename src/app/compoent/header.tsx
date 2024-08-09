'use client';
import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../global.css';

const Header = () => { 
    return (
        <Navbar expand="lg" className="px-5 py-2 border-bottom">
                <Navbar.Brand href="/" className='header-link'>Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto m-2">
                        <Nav.Link className='header-link mx-4' href="/OTA" >雲端更新</Nav.Link>
                        <Nav.Link className='header-link mx-4' href="/WIFI" >網路</Nav.Link>
                        <Nav.Link className='header-link mx-4' href="/Setting" >設定</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;