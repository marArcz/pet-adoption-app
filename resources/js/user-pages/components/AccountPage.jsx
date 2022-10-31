import { showErrorToast } from '@/components/ToastNotification'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Accordion, Button, Form } from 'react-bootstrap'
import { hidePageLoader, showPageLoader } from '../PageLoader'
import { showSuccessToast } from '../ToastNotification'
import { getSessionToken } from '../UserSession'
import BackButton from './BackButton'

const AccountPage = () => {
    const [id, setId] = useState("")
    const [accountId, setAccountId] = useState("")
    const [photo, setPhoto] = useState(null)
    const [photoUrl, setPhotoUrl] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [middlename, setMiddlename] = useState("")
    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [accordionKey, setAccordionKey] = useState(0)

    const [adopterPassword, setAdopterPassword] = useState('')
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [formsSubmitted, setFormsSubmitted] = useState(0)
    const [successful, setSuccessful] = useState(0)
    const [declined, setDeclined] = useState(0)
    const [petsAdopted, setPetsAdopted] = useState(0)

    const loadUser = () => {
        let token = getSessionToken();
        let config = {
            headers: {
                authorization: `Bearer ${token}`,
                accept: 'application/json'
            }
        }
        showPageLoader()
        axios.get("/adopters/me", config)
            .then((res) => {
                hidePageLoader()
                const adopter = res.data
                setFirstname(adopter.firstname)
                setMiddlename(adopter.middlename)
                setLastname(adopter.lastname)
                setEmail(adopter.account.email)
                setPhotoUrl(adopter.photo)
                setId(adopter.id)
                setAccountId(adopter.account.id)

                if (!isDataLoaded) {
                    loadData(adopter.id)
                }
            })
            .catch(err => {
                hidePageLoader()

                console.log("me err: ", err)

            })
    }

    const loadData = (adopterId) => {
        axios.post("/application/get", { adopterId })
            .then(res => {
                setIsDataLoaded(true)
                const forms = res.data;
                console.log('forms: ', forms)
                setFormsSubmitted(forms.length)

                let success = 0
                for (let form of forms) {
                    if (form.application_status === 3) {
                        success++
                    }
                }
                setSuccessful(success)
                setPetsAdopted(success)

                let declinedCount = 0
                for (let form of forms) {
                    if (form.application_status === 1) {
                        declinedCount++
                    }
                }
                setDeclined(declinedCount)


            })
    }

    useEffect(() => {
        loadUser()
    }, [])

    const onSelectPhoto = (e) => {
        let files = e.target.files;

        setPhoto(files[0])
        setPhotoUrl(URL.createObjectURL(files[0]))
    }

    const userPhotoStyle = {
        backgroundImage: `url(${photoUrl})`,
        width: '200px',
        height: '200px',
        margin: 'auto'
    }

    const formInformationSubmit = (e) => {
        e.preventDefault()

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const formData = new FormData();

        formData.append('firstname', firstname)
        formData.append('middlename', middlename)
        formData.append('lastname', lastname)
        formData.append('email', email)
        formData.append('id', id)

        if (photo) {
            formData.append('photo', photo)
        }
        showPageLoader("Saving changes...")
        axios.post("/adopters/update", formData, config)
            .then(res => {
                hidePageLoader()
                showSuccessToast("Changes are successfully saved!")
                console.log("update res: ", res)
                loadUser()
            })

    }

    const changePassword = (e) => {
        e.preventDefault()

        showPageLoader();

        axios.post("/adopters/checkpassword", { password: currentPassword })
            .then(res => {
                if (res.data.matched) {
                    axios.post("/adopters/change-password", { password: newPassword })
                        .then(res => {
                            showSuccessToast("Successfully changed password!")
                            hidePageLoader();
                        })
                } else {
                    showErrorToast("Current Password is incorrect!");
                    hidePageLoader();
                }
            })
            .catch(err => {
                showErrorToast("Current Password is incorrect!");
                hidePageLoader();

            })
    }
    return (
        <div className=''>
            <div className="d-flex">
                <BackButton />
                <div className='ms-auto me-auto'>
                    <p className='fw-bold fs-5 my-1'>My Account</p>
                </div>
            </div>
            <hr />


            <div className="row mt-3 justify-content-center">
                <div className="col-md">
                    <div className="card bg-white text-gray rounded-2 border shadow-sm">
                        <div className="card-body">
                            <p className='fw-bold text-success'>Adoption History</p>
                            <div className="mt-2">
                                <div className="d-flex mb-3">
                                    <p className="my-1 ">
                                        <small>Application Form Submitted:</small>
                                    </p>
                                    <p className='my-1 text-center  ms-lg-auto'>
                                        <small>{formsSubmitted}</small>
                                    </p>
                                </div>
                                <div className="d-flex mb-3">
                                    <p className="my-1 ">
                                        <small>Successful Application:</small>
                                    </p>
                                    <p className='my-1 text-center  ms-lg-auto'>
                                        <small>{successful}</small>
                                    </p>
                                </div>
                                <div className="d-flex mb-3">
                                    <p className="my-1 ">
                                        <small>Declined Application:</small>
                                    </p>
                                    <p className='my-1 text-center  ms-lg-auto'>
                                        <small>{declined}</small>
                                    </p>
                                </div>
                                <div className="d-flex mb-3">
                                    <p className="my-1 ">
                                        <small>Pets Adopted:</small>
                                    </p>
                                    <p className='my-1 text-center  ms-lg-auto'>
                                        <small>{petsAdopted}</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card bg-white text-secondary border shadow-sm rounded-2">
                        <div className="card-body">
                            <Form onSubmit={formInformationSubmit}>
                                <div className="row justify-content-center ">
                                    <div className="col-md-6">
                                        <div className="user-photo position-relative" style={userPhotoStyle}>
                                        </div>
                                        <div className="text-center">
                                            <button className="btn btn-warning mt-2 py-0" onClick={() => document.getElementById('photo-chooser').click()} type='button'>
                                                <i className='bx bx-camera'></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <input type="file" className='d-none' id="photo-chooser" onChange={onSelectPhoto} />
                                <p className="mt-1 mb-3 text-black-50"><small>Update account</small></p>

                                <div className="mb-3">
                                    <Form.Label>Firstname:</Form.Label>
                                    <Form.Control type='text' value={firstname} onChange={e => setFirstname(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <Form.Label>Middlename:</Form.Label>
                                    <Form.Control type='text' value={middlename} onChange={e => setMiddlename(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <Form.Label>Lastname:</Form.Label>
                                    <Form.Control type='text' value={lastname} onChange={e => setLastname(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control type='email' value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="text-start">
                                    <Button variant='secondary' className='me-2' size='sm' type="reset">Reset</Button>
                                    <Button variant='success' size='sm' className='text-light' type="submit">Save Changes</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div className="card mt-3 bg-white text-dark border shadow-sm">
                        <div className="card-body">
                            <Form onSubmit={changePassword}>
                                <p className="form-text text-dark">Change Account Password</p>
                                <hr />
                                <div className="mb-3">
                                    <Form.Label>Current Password:</Form.Label>
                                    <Form.Control size="sm" type='text' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <Form.Label>New Password:</Form.Label>
                                    <Form.Control size="sm" type='text' value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                </div>
                                <div className="text-start">
                                    <Button variant='secondary' className='me-2' size='sm' type="reset">Reset</Button>
                                    <Button variant='success' size='sm' className='text-light' type="submit">Save Changes</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AccountPage
