import React from 'react'
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import logo from '../../../public/images/logo.png'
const VerifyEmailPage = () => {
    return (
        <Container>
            <Card className='mt-5'>
                <Card.Body className='p-5'>
                    <Image src={logo} fluid width={120} className="mb-3" />

                    <div className="mb-3">
                        <Link to="/" className="link-primary">Back to Home</Link>
                    </div>
                    <h4 className='text-success mb-4'>We sent a verification link to your email address!</h4>
                    <h6 className='mt-4'>Kindly check your inbox.</h6>

                    <div className="mt-3">
                        <p className='text-gray'><small>Did not recieve any email?</small></p>
                        <Button variant='secondary' size='sm' type='button'>Resend</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default VerifyEmailPage
