import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Button, Col, Form, Image, Modal, Row } from 'react-bootstrap'

const UpdateAccountModal = ({ show, handleClose, account, handleSubmit }) => {
    const [firstname, setFirstname] = useState("");
    const [middlename, setMiddlename] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [photo, setPhoto] = useState("")
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [originalPhoto, setOriginalPhoto] = useState("")
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const choosePhoto = () => {
        document.getElementById("input-photo").click()
    }

    const onPhotoSelect = (e) => {
        console.log("e: ", e)
        let file = e.target.files[0];
        setPhoto(URL.createObjectURL(file));
        setSelectedPhoto(file)
    }
    useEffect(() => {
        setPhoto(account.photo)
        setOriginalPhoto(account.photo)
        setFirstname(account.firstname)
        setMiddlename(account.middlename)
        setLastname(account.lastname)
        setEmail(account.account.email)
    }, [])

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit({
            id: account.id,
            firstname,
            middlename,
            lastname,
            email,
            selectedPhoto,
            password,
            isChangingPassword
        })
    }
    const resetPhoto = () => {
        setPhoto(originalPhoto)
        setSelectedPhoto(null)
    }

    return (
        <Modal size='lg' show={show} onHide={handleClose} className="rounded-0">
            <Modal.Header closeButton className='rounded-0 border-0'>
                <p className="fw-bold my-0"><small>Update Account</small></p>
            </Modal.Header>
            <Modal.Body className='rounded-0'>
                <Form onSubmit={onFormSubmit}>
                    <input type="file" name="" className='d-none' id="input-photo" onChange={onPhotoSelect} />
                    <div className="mb-2">
                        <Row className=' justify-content-center'>
                            <div className="col col-md-5 border pt-2 pb-2 rounded-2 position-relative">
                                <div className="text-end">
                                    <Button variant='link' type='button' onClick={resetPhoto} className='text-dark text-decoration-none p-0' size="sm" ><i className='bx bx-refresh'></i> Reset</Button>
                                </div>
                                <Image src={photo} fluid />
                                <div className="text-center mt-2">
                                    <Button variant="secondary" onClick={choosePhoto} size="sm" className="rounded-1 px-3"><i className='bx bx-camera'></i></Button>
                                </div>
                            </div>
                        </Row>
                    </div>
                    <div className="mb-3">
                        <Form.Label>Firstname:</Form.Label>
                        <Form.Control type='text' required value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <Form.Label>Middlename:</Form.Label>
                        <Form.Control type='text' required value={middlename} onChange={(e) => setMiddlename(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <Form.Label>Lastname:</Form.Label>
                        <Form.Control type='text' required value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type='text' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {
                        !isChangingPassword ? (
                            <>
                                <div className="mb-3">
                                    <Form.Label>Password:</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control type='password' disabled value="password" className=" rounded-0 flex-grow" />
                                        <Button variant='secondary' onClick={()=>setIsChangingPassword(true)} type='button' className='rounded-0'><small>Change</small></Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <Form.Label>Current Password:</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control type='text'  required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className=" rounded-0 flex-grow" />
                                        <Button onClick={()=>setIsChangingPassword(false)} variant='secondary' type='button' className='rounded-0'><small>Cancel</small></Button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <Form.Label>New Password:</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control type='text'  required value={password} onChange={(e) => setPassword(e.target.value)} className=" rounded-0 flex-grow" />
                                    </div>
                                </div>
                            </>
                        )
                    }
                    <Button variant='warning' className='me-2 rounded-1' type='submit'>Submit</Button>
                    <Button variant='secondary' className='rounded-1' type='reset'>Reset</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateAccountModal
