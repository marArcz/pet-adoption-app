import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Container, Form, FormLabel, Row } from 'react-bootstrap'
import UserProfile from '../../../public/images/profile.jpg'
import LogoComponent from './LogoComponent'
const SignUpPage = ({ onSubmit }) => {
    const [firstname, setFirstname] = useState("")
    const [middlename, setMiddlename] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [address, setAddress] = useState("")
    const [photo, setPhoto] = useState(UserProfile);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const formOnSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            firstname,
            middlename,
            lastname,
            email,
            password,
            address,
            photo,
            selectedPhoto
        })
    }

    const openChooseFile = () =>{
        document.getElementById("file-chooser").click();
    }

    const onChoose = (e) =>{
        console.log('file: ', e.target.files)
        let file = e.target.files[0];
        setPhoto(file)
        setSelectedPhoto(file)
    }

    return (
        <Container>
            <Row className="justify-content-center max-h align-items-center">
                <Col md={10} className="p-2">
                    <Card className="shadow border p-0">
                        <Card.Body className="p-0 position-relative">
                            {/* <div className="sign-btn-group position-absolute top-0 start-0 bg-opacity-50 bg-secondary">
                                <div className="content">
                                    <button type="button" className="d-flex align-items-center">
                                        <span className="text-light me-1"><small>Forgot Password</small></span>
                                        <small><i className="bx bx-help-circle fs-6 text-light "></i></small>
                                    </button>
                                </div>
                            </div> */}
                            <Row className="">
                                <Col md={7} className="">
                                    <div className="bg-success border-gray border-3 border-top p-5">
                                        <Form onSubmit={formOnSubmit} className="form active">
                                            <div className="text-start">
                                                <p className="fs-2 text-light">Create an account</p>
                                                <p className="fs-6 text-black-50">
                                                    To manage system you need to sign up.
                                                </p>
                                            </div>
                                            {/* <br /> */}
                                            <hr className="text-light" />
                                            <div className="">
                                                <div className="text-center">
                                                    <Row className='mt-3 mb-4 justify-content-center'>
                                                        <Col lg={4} md={4} >
                                                            <input accept='image/*' type="file" onChange={onChoose} id="file-chooser" className='d-none'/>
                                                            <div className="wrapper position-relative">
                                                                <img src={typeof(photo) === typeof("")? photo:URL.createObjectURL(photo)} alt="" className="img-fluid img-thumbnail" />
                                                                <Button size='sm' onClick={openChooseFile} className='bg-warning rounded-1 bg-opacity-75 pb-0 position-absolute bottom-0 end-0'>
                                                                    <i className='material-icons fs-6'>camera</i>
                                                                </Button>
                                                            </div>
                                                            <p className='text-white-50'><small>Your Photo</small></p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <Row className='mb-3 gy-3'>
                                                    <Col md={6}>
                                                        <Form.Label className='text-light'>Firstname:</Form.Label>
                                                        <Form.Control className='rounded-0' type='text' value={firstname} onChange={e => setFirstname(e.target.value)} required />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className='text-light'>Middlename:</Form.Label>
                                                        <Form.Control className='rounded-0' type='text' value={middlename} onChange={e => setMiddlename(e.target.value)} required />
                                                    </Col>
                                                    <Col>
                                                        <Form.Label className='text-light'>Lastname:</Form.Label>
                                                        <Form.Control className='rounded-0' type='text' value={lastname} onChange={e => setLastname(e.target.value)} required />
                                                    </Col>
                                                    {/* <Col md={6}>
                                                        <Form.Label className='text-light'>Address:</Form.Label>
                                                        <Form.Control className='rounded-0' type='text' value={address} onChange={e => setAddress(e.target.value)} required />
                                                    </Col> */}
                                                </Row>
                                                <div className="mb-3">
                                                    <Form.Label className=" text-light">Email Address</Form.Label>
                                                    <Form.Control
                                                        type="email"
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
                                                </div>

                                                <Button
                                                    variant="secondary"
                                                    className="px-4 py-2 rounded-1 fs-6"
                                                    type="submit"
                                                >
                                                    SIGN UP
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Col>
                                <Col md className="">
                                    <div className="bg-white p-5">
                                        <Row className="h-100 align-items-center justify-content-center mt-5">
                                            <Col md={9}>
                                                <LogoComponent />
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

export default SignUpPage
