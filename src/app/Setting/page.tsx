'use client';
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Setting = () => {
    return (
        <main className='d-flex'> 
            <Container className='flex-grow-1 d-flex'>
                <div className='d-flex flex-grow-1'>
                    <div className='d-flex flex-grow-1'>
                        <Card bg="light" className='text-center flex-grow-1 my-5 mx-4'>
                            <Card.Header>Setting</Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </main>
    );
}
export default Setting;