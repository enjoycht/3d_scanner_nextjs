'use client';
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useUrl } from '../compoent/UrlContext';
const WiFi = () => {
    const { url } = useUrl();
    return (
        <main className='d-flex'> 
            <Container className='flex-grow-1 d-flex'>
                <div className='d-flex flex-grow-1'>
                    <div className='d-flex flex-grow-1'>
                        <Card bg="light" className='text-center flex-grow-1 my-5 mx-4'>
                            <Card.Header>WiFi</Card.Header>
                            <Card.Body>
                                {`url: ${url}`}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </main>
    );
}
export default WiFi;