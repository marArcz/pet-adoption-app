import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import LogoComponent from './LogoComponent'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { getSessionToken } from './UserSession'

const SignInPage = ({onLogin}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const formOnSubmit = (e) =>{
        e.preventDefault();
        onLogin(email,password)
    }

    useEffect(()=>{
        document.title = "God's Home of Refugee - Sign In"
        if(getSessionToken() !== null){
            navigate('/success')
        }
    },[])

    return (
        <Container>
            <Row className="justify-content-center max-h align-items-center">
                <Col md={9} className="p-2">
                    <Card className="shadow border p-0">
                        <Card.Body className="p-0 position-relative">
                            <div className="sign-btn-group position-absolute top-0 start-0 bg-opacity-50 bg-secondary">
                                <div className="content">
                                    <button type="button" className="d-flex align-items-center">
                                        <span className="text-light me-1"><small>Forgot Password</small></span>
                                        <small><i className="bx bx-help-circle fs-6 text-light "></i></small>
                                    </button>
                                </div>
                            </div>
                            <Row className="">
                                <Col className="">
                                    <div className="bg-success p-5">
                                        <Form onSubmit={formOnSubmit} className="form active">
                                            <div className="mb-">
                                                <p className="fs-1 text-light">Sign In Here!</p>
                                                <p className="fs-6">
                                                    To manage system you need to sign in.
                                                </p>
                                            </div>
                                            {/* <br /> */}
                                            <hr className="text-light" />
                                            <div className="">
                                                <div className="mb-4">
                                                    <Form.Label className=" text-light">Email Address</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        className="rounded-0"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <Form.Label className="text-light">Password</Form.Label>
                                                    <Form.Control
                                                        autoComplete='true'
                                                        type="password"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="rounded-0 fs-5 mb-3"
                                                    />
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="formBasicCheckbox"
                                                    >
                                                        <Form.Check
                                                            className="text-secondary"
                                                            type="checkbox"
                                                            label="Keep me logged in."
                                                        />
                                                    </Form.Group>
                                                </div>

                                                <Button
                                                    variant="secondary"
                                                    className="px-4 py-2 rounded-1 fs-6"
                                                    type="submit"
                                                >
                                                    SIGN IN
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Col>
                                <Col md className="">
                                    <div className="bg-white p-5">
                                        <Row className="h-100 justify-content-center mt-4">
                                            <Col md={8}>
                                                <LogoComponent/>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default SignInPage;

// if (document.getElementById('app')) {
//     ReactDOM.render(<SignInPage />, document.getElementById('app'));
// }
