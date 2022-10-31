import { showSuccessToast } from '@/components/ToastNotification'
import axios from 'axios'
import React, { useState } from 'react'
import { Form, Col, Row, Button, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import Logo from '../../../img/Logo-borderless.png'
import { hidePageLoader, showPageLoader } from '../PageLoader'
import { showErrorToast } from '../ToastNotification'
import { setSessionToken } from '../UserSession'
import NavbarComponent from './NavbarComponent'

const SignInPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate();

    const formOnSubmit = (e) =>{
        e.preventDefault();
        showPageLoader();

        axios.post("/adopters/login",{
            email,password
        })
        .then(res=>{
            console.log("sign in res: ", res)
            hidePageLoader();
            showSuccessToast("Successfully Signed In!");
            setSessionToken(res.data.access_token);
            navigate("/");
        })
        .catch(err=>{
            console.log("signin err: ", err)
            hidePageLoader();
            showErrorToast("Invalid sign in credentials, Please check!")
        })
    }

    return (
        <>
            <NavbarComponent showNav={false} />
            <div className='bg-success py-5'>
                <div className=" container my-5">
                    <Row className='justify-content-center align-items-center'>
                        <Col md="6" className='d-none d-lg-block'>
                            <Row className='justify-content-center mb-4 mt-2'>
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
                            <div className="card my-3 p-3">
                                <div className="card-body">
                                    <Form onSubmit={formOnSubmit}>
                                        <div className="text-start mb-4">
                                            <p className="fs-5 fw-bold text-success">SIGN IN</p>
                                        </div>
                                        <div className="mb-3">
                                            <Form.Label className='fw-bold'><small>Username:</small></Form.Label>
                                            <Form.Control type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <Form.Label className=' fw-bold'><small>Password:</small></Form.Label>
                                            <Form.Control type={`${showPassword?"text":"password"}`} value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div className="">
                                            <Form.Check
                                                type="checkbox"
                                                label="Show Password"
                                                id="show-password-checkbox"
                                                onChange={() => setShowPassword(!showPassword)}
                                                checked={showPassword}
                                            />
                                        </div>
                                        <div className="d-grid">
                                            <Button variant='success' className=' text-light mt-3' type='submit'>SIGN IN <i className='bx bx-log-in'></i></Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default SignInPage