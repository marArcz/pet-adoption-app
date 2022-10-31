import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Form, Col, Row, Button, Image, InputGroup, Card } from 'react-bootstrap'

import Logo from '../../../img/logo-borderless.png'
import { hidePageLoader, showPageLoader } from '../PageLoader'
import ProfilePic from '../../../img/profile.jpg'
import NavbarComponent from './NavbarComponent'
import { showErrorToast, showSuccessToast } from '../ToastNotification'
import { setSessionToken } from '../UserSession'
import { useNavigate } from 'react-router'

const SignupPage = () => {
    const [photo, setPhoto] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(ProfilePic);
    const [firstName, setFirstName] = useState("")
    const [middlename, setMiddlename] = useState("")
    const [lastname, setLastname] = useState("")
    const [location, setLocation] = useState("")
    const [state, setState] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [formIndex, setFormIndex] = useState(1);
    const [isGettingLocation, setIsGettingLocation] = useState(false)

    const navigate = useNavigate();

    const getLocation = () => {
        setIsGettingLocation(true)
        setLocation("...")

        navigator.geolocation.getCurrentPosition(function (position) {

            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude
            let url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
            axios.get(url).then(res => {
                setIsGettingLocation(false)
                console.log(res)
                setLocation(res.data.display_name)
                setState(res.data.address.state);
            })
        });
    }

    

    const formOnSubmit = (e) => {
        e.preventDefault();
        showPageLoader();

        const formData = new FormData();

        formData.append("photo", photo);
        formData.append("firstname", firstName);
        formData.append("middlename", middlename);
        formData.append("lastname", lastname);
        formData.append("location", location);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("state",state)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        axios.post('/adopters/register', formData, config)
            .then((res)=>{
                hidePageLoader()
                console.log(res)
                showSuccessToast("Successfully Signed Up!");
                setSessionToken(res.data.access_token)
                navigate("/");

            })
            .catch(err=>{
                hidePageLoader()
                console.log(err)
                showErrorToast("Email is already taken!");
            })
    }

    const onFileSelect = (e) => {

        let files = e.target.files;
        setPhoto(files[0])
        setPhotoUrl(URL.createObjectURL(files[0]));

    }
    const isForm1Filled = () => {
        console.log("status changed")
        return photo !== null && firstName !== "" && middlename !== "" && lastname !== "" && location !== "" && location !== "..."
    }

    const isForm2Filled = () => {
        return email !== "" && password !== "";
    }

    useEffect(()=>{
    })

    return (
        <>
            <NavbarComponent showNav={false} />
            <div className="bg-success py-3">
                <div className="container">
                    <Row className='justify-content-center align-items-center'>
                        <Col md="6" className='d-none d-lg-block'>
                            <Row className='justify-content-center mb-4 mt-5'>
                                <Col className='col-lg-5 col-5'>
                                    <Image src={Logo} fluid />
                                </Col>
                            </Row>
                            <div className="text-center">
                                <p className="fs-5 text-light fw-bold">GOD'S HOME OF REFUGE</p>
                                <div className="mt-3 text-light">
                                    <p>Home is where they belong.</p>
                                    <p>Shelter for rescued dogs and cats.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md>

                            <Card>
                                <Card.Body className='p-4'>
                                    <p className='fs-5 fw-bold'>Sign Up</p>
                                    <Form onSubmit={formOnSubmit}>
                                        {
                                            formIndex === 1 ? (
                                                <>
                                                    <Row className=' justify-content-center mb-3'>
                                                        <Col md="4" className="text-center">
                                                            <Image src={photoUrl} fluid thumbnail className='shadow-sm' />
                                                        </Col>
                                                    </Row>

                                                    <div className="mb-3">
                                                        <Form.Label className='fw-bold'><small>Choose Photo:</small></Form.Label>
                                                        <Form.Control size='sm' type='file' onChange={onFileSelect} />
                                                    </div>
                                                    <Row>
                                                        <Col md>
                                                            <div className="mb-3">
                                                                <Form.Label className='fw-bold'><small>First name</small>:</Form.Label>
                                                                <Form.Control size='sm' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                            </div>
                                                        </Col>
                                                        <Col md>
                                                            <div className="mb-3">
                                                                <Form.Label className='fw-bold'><small>Middle name</small>:</Form.Label>
                                                                <Form.Control size='sm' type='text' value={middlename} onChange={(e) => setMiddlename(e.target.value)} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <div className="mb-3">
                                                        <Form.Label className='fw-bold'><small>Last name:</small></Form.Label>
                                                        <Form.Control size='sm' type='text' value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                                    </div>
                                                    <div className="mb-2">
                                                        <Form.Label className='fw-bold'><small>Your Location:</small></Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control
                                                                disabled={isGettingLocation}
                                                                size='sm'
                                                                placeholder="Your current location..."
                                                                aria-label="Recipient's username"
                                                                aria-describedby="basic-addon2"
                                                                type='text'
                                                                value={location}
                                                                readOnly
                                                            />
                                                            <Button disabled={isGettingLocation} size='sm' variant="success" onClick={getLocation} className='text-light' title='Find Your Location' id="button-addon2">
                                                                <i className='bx bx-current-location'></i>
                                                            </Button>
                                                        </InputGroup>
                                                    </div>

                                                    <div className="d-grid">
                                                        {
                                                            isForm1Filled() ? (
                                                                <Button size='sm' onClick={() => setFormIndex(2)} variant='success' className=' text-light mt-3' type='button'>Next</Button>
                                                            ) : (
                                                                <Button disabled size='sm' onClick={() => setFormIndex(2)} variant='success' className=' text-light mt-3' type='button'>Next</Button>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className=''>
                                                        <Row className=' justify-content-center mb-3'>
                                                            <Col md="4">
                                                                <Image src={photoUrl} fluid thumbnail className='shadow-sm' />
                                                            </Col>
                                                        </Row>
                                                        <div className="mb-3">
                                                            <Form.Label className=''><small>Name:</small></Form.Label>
                                                            <Form.Control size="sm" disabled type='text' value={`${firstName} ${middlename} ${lastname}`} onChange={(e) => setEmail(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <Form.Label className=''><small>Your Location:</small></Form.Label>
                                                            <Form.Control size="sm" disabled type='text' value={location} />
                                                        </div>
                                                        <hr />
                                                        <div className="mb-3">
                                                            <Form.Label className='fw-bold'><small>Email adddress:</small></Form.Label>
                                                            <Form.Control required size="sm" type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <Form.Label className='fw-bold'><small>Password:</small></Form.Label>
                                                            <Form.Control required size="sm" type='text' value={password} onChange={(e) => setPassword(e.target.value)} />
                                                        </div>
                                                        <div className='d-grid'>

                                                            {
                                                                isForm2Filled() ?
                                                                    (
                                                                        <Button size='sm' variant='success' className=' px-lg-4 text-light mt-3' type='submit'><i className='bx bx-pencil'></i> Create Account</Button>
                                                                    ) :
                                                                    (
                                                                        <Button disabled size='sm' variant='success' className=' px-lg-4 text-light mt-3' type='submit'><i className='bx bx-pencil'></i> Create Account</Button>
                                                                    )
                                                            }
                                                            <Button size='sm' variant='secondary' className=' text-light mt-3' onClick={() => setFormIndex(1)} type='button'> Go Back</Button>


                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }

                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default SignupPage