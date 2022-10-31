import BackButton from '@/user-pages/components/BackButton';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router'
import PreloaderComponent from './PreloaderComponent';
import { showSuccessToast } from './ToastNotification';

const ViewApplication = () => {

    const { id } = useParams();

    const [applicationForm, setApplicationForm] = useState(null);
    const [adopter, setAdopter] = useState({})
    const statusList = ['Pending', 'Declined', 'Approved', "Completed", "Cancelled"]
    const [pet, setPet] = useState({})
    const [showPreloader, setShowPreloader] = useState(false)

    const loadApplication = async () => {
        return await axios.post("/application/get", { id })
            .then(res => {
                console.log("form: ", res)
                setApplicationForm(res.data)
                setAdopter(res.data.adopter)
                setPet(res.data.pet)
                return res
            })
    }

    useEffect(() => {
        loadApplication()
    }, [])

    const sendMail = (application, status) => {
        console.log('mail application: ', application)
        axios.post("/mails/send/application", {
            email: application.adopter.account.email,
            name: `${application.adopter.firstname} ${application.adopter.lastname}`,
            application_no: application.application_no,
            status
        })
            .then(res => {
                console.log('mail res: ', res)
            })
            .catch(err => {

            })
    }
    const onApprove = (application) => {
        setShowPreloader(true)
        axios.post('/application/update-status', {
            id: application.id,
            status: 2
        })
            .then(async (res) => {
                showSuccessToast("Successfully updated!")
                console.log('res: ', res)
                // setApplications(res.data)
                await loadApplication()
                setShowPreloader(false)
                sendMail(application, 'approved')
            })
    }
    const onDecline = (application) => {
        setShowPreloader(true)

        axios.post('/application/update-status', {
            id: application.id,
            status: 1
        })
            .then(async (res) => {

                console.log('res: ', res)
                // setApplications(res.data)
                await loadApplication()
                setShowPreloader(false)
                sendMail(application, 'declined')
            })
    }

    const markAsCompleted = (application) => {
        setShowPreloader(true)

        axios.post('application/update-status', {
            id: application.id,
            status: 3,
        })
            .then(async (res) => {
                console.log('res: ', res)
                // setApplications(res.data)
                await loadApplication()
                setShowPreloader(false)
                sendMail(application, 'completed')

            })
    }

    const cancel = (application) => {

        axios.post('application/update-status', {
            id: application.id,
            status: 4,
        })
            .then(async (res) => {
                console.log('res: ', res)
                // setApplications(res.data)
                setShowPreloader(true)
                await loadApplication()
                setShowPreloader(false)
                sendMail(application, 'cancelled')

            })
    }
    return (
        <div className='py-3'>
            <div className="d-flex align-items-end">
                <BackButton />
                <h6 className='fw-bold ms-auto me-auto my-0'>Application Form</h6>
            </div>
            <hr />
            {
                applicationForm ? (
                    adopter === null || adopter === undefined ?
                        (
                            <div className='text-center'>
                                <p>Application form has been deleted.</p>
                            </div>
                        ) : (
                            <div>
                                <Card className='border-0 shadow'>
                                    <Card.Body className='p-4'>
                                        <div className="d-flex align-items-center">
                                            <p className="fw-bold my-0">
                                                <small >
                                                    Status:
                                                    <span className={`${applicationForm.application_status === 3 ? "text-success" : ""} ms-1`}>
                                                        {statusList[applicationForm.application_status]}
                                                    </span>
                                                </small>
                                            </p>

                                            <div className="ms-auto">
                                                {
                                                    applicationForm.application_status === 0 ? (
                                                        <>
                                                            <button onClick={() => onApprove(applicationForm)} className='btn btn-success btn-sm me-2' type='button'>Approve</button>
                                                            <button onClick={() => onDecline(applicationForm)} className='btn btn-poppy btn-sm' type='button'>Decline</button>
                                                        </>
                                                    ) : (
                                                        applicationForm.application_status === 2 ? (
                                                            <>
                                                                <button onClick={() => markAsCompleted(applicationForm)} className='btn btn-success btn-sm me-2' type='button'>Completed <i className='bx bx-check'></i></button>
                                                                <button onClick={() => cancel(applicationForm)} className='btn btn-poppy btn-sm' type='button'>Cancel</button>
                                                            </>
                                                        ) : null
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="row gy-2 gx-lg-5">
                                            <div className="col-md">
                                                <div className="d-flex align-items-center">
                                                    <div className=" me-2">
                                                        <p className="my-1"><small>Adopter Information</small></p>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <hr className='w-100' />
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <div className="col-lg-2 col-md-3">
                                                        <img className='img-fluid img-thumbnail' src={adopter.photo} />
                                                    </div>
                                                    <div className="col-md">
                                                        <p className="my-1 fw-bold">{adopter.firstname} {adopter.lastname}</p>
                                                        <p className="my-1"><small>{adopter.location}</small></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md">
                                                <div className="d-flex align-items-center">
                                                    <div className=" me-2">
                                                        <p className="my-1"><small>Pet to Adopt</small></p>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <hr className='w-100' />
                                                    </div>
                                                </div>
                                                <div className="row align-items-center">
                                                    <div className="col-lg-2 col-md-3">
                                                        <img className='img-fluid img-thumbnail' src={pet.photos[0].src} />
                                                    </div>
                                                    <div className="col-md">
                                                        <p className="my-1 fw-bold">{pet.name}</p>
                                                        <div className="d-flex align-items-center">
                                                            <div className='badge bg-success me-1'>{pet?.category.name}</div>
                                                            <div className='badge bg-success me-1'>{pet?.gender}</div>
                                                            <div className='badge bg-success'>{pet?.age}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <hr />
                                            <p className="text-black-50"><small>Application Form</small></p>

                                            {/* app fform */}
                                            <Row className=' align-items-end'>
                                                <Col md="3">
                                                    <div className="mb-4">
                                                        <Form.Label>Name: </Form.Label>
                                                        <Form.Control type='text' disabled value={applicationForm.name} onChange={e => setName(e.target.value)} />
                                                    </div>
                                                </Col>
                                                <Col md="3">
                                                    <div className="mb-4">
                                                        <Form.Label>Nickname: </Form.Label>
                                                        <Form.Control type='text' disabled value={applicationForm.nickname} onChange={e => setNickname(e.target.value)} />
                                                    </div>
                                                </Col>
                                                <Col md="3">
                                                    <div className="mb-4">
                                                        <Form.Label>Age: </Form.Label>
                                                        <Form.Control type='number' disabled value={applicationForm.age} onChange={e => setAge(e.target.value)} />
                                                    </div>
                                                </Col>
                                                <Col md="3">
                                                    <div className="mb-4">
                                                        <Form.Label>Status: </Form.Label>
                                                        <Form.Control type='text' disabled value={applicationForm.status} onChange={e => setStatus(e.target.value)} />
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-4">
                                                        <Form.Label>Complete Address: </Form.Label>
                                                        <Form.Control type='text' disabled value={applicationForm.address} onChange={e => setaddress(e.target.value)} />
                                                    </div>
                                                </Col>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Contact Number: </Form.Label>
                                                    <Form.Control type='number' disabled value={applicationForm.contact_no} onChange={e => setContactNo(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Email Address: </Form.Label>
                                                    <Form.Control type='email' disabled value={applicationForm.email} onChange={e => setEmail(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Facebook Account: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.facebook} onChange={e => setFacebook(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Occupation: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.occupation} onChange={e => setOccupation(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Select the dwelling you live in: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.dwelling} />
                                                </div>
                                                <div className="col-12">
                                                    <p className="form-text">If renting, write your landlord's name and contact number.</p>
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Landlord Name:</Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.landlord_name} onChange={e => setLandlordName(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Landlord Contact No:</Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.landlord_phone} onChange={e => setLandlordPhone(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label><small>Are you planning to move in in the future?:</small></Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.move_out} onChange={e => setMoveOut(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Living with relatives? How long?: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.living_with_relatives} onChange={e => setLivingWithRelatives(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label><small>We want to make sure that the Dog/Cat truly allowed in your house. We need a document that stating that this is a fact. Please send us a document or a picture of letter with landlord or parent’s permission. Agree?</small></Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.permission} onChange={e => setPermission(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>How many adult in the household?: </Form.Label>
                                                    <Form.Control type='number' disabled value={applicationForm.no_of_adults} onChange={e => setNoOfAdults(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>How many children in the household?: </Form.Label>
                                                    <Form.Control type='number' disabled value={applicationForm.no_of_children} onChange={e => setNoOfChildren(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Ages of children?: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.children_ages} onChange={e => setAgeOfChildren(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Do the children have allergies or asthma?: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.allergies_asthma} onChange={e => setAllergies(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label><small>Are all members of the family supportive of this pet adoption?</small></Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.supported_by_family} onChange={e => setSupportedByFamily(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Who will be responsible for the pet care?: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.responsible} onChange={e => setResponsible(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>What is your source of income?: </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.income_source} onChange={e => setIncomeSource(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Have you ever adopted an animal from (or return an animal to) a Shelter?: </Form.Label>
                                                    <p className="my-1 fw-bold">{applicationForm.adopted_an_animal}</p>
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>If you returned an animal, what is the reason? </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.return_reason} onChange={e => setReturnReason(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Do you have plans to give this as a gift? If yes, to whom?</Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.gift_plan} onChange={e => setGiftPlan(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>List the name of the pets you have owned in the past 5 years.</Form.Label>
                                                    <textarea className="form-control" disabled rows="4" value={applicationForm.pets_owned} onChange={e => setPetsOwned(e.target.value)}></textarea>
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Do you still own the pet? If yes, just write YES. If not, Reason of losing the pet?</Form.Label>
                                                    <textarea className="form-control" disabled value={applicationForm.have_pet} onChange={e => setHavePet(e.target.value)} rows="4"></textarea>
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Is there a particular pet you are interested in? If so, please include his/her name and why?</Form.Label>
                                                    <textarea className="form-control" disabled value={applicationForm.interested_pet} onChange={e => setInterestedPet(e.target.value)} rows="4"></textarea>
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Where will the pet be kept during DAY? </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.keep_at_day} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Where will the pet be kept during NIGHT? </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.keep_at_night} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>If outside, describe or send a picture of the shelter you will provide.</Form.Label>
                                                    <textarea className="form-control" disabled value={applicationForm.outside_shelter} onChange={e => setOutsideShelter(e.target.value)} rows="4"></textarea>
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>Length of time during the day the pet will be left alone? </Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.time_alone} onChange={e => setTimeAlone(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>What type of diet/food you plan to feed the pet?</Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.food_type} onChange={e => setFoodType(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label>What type of fence do you have?</Form.Label>
                                                    <Form.Control type='text' disabled value={applicationForm.fence_type} onChange={e => setFenceType(e.target.value)} />
                                                </div>
                                                <div className="mb-4 col-md-4">
                                                    <Form.Label><small>Share past experience of having pets? what are the challenges you have and how did you overcome them?</small></Form.Label>
                                                    <textarea className="form-control" value={applicationForm.past_experience} disabled onChange={e => setpastExperience(e.target.value)} rows="4"></textarea>
                                                </div>
                                                <div className="mb-4 col-md">
                                                    <Form.Label><small>Please give us a brief explanation of your reasons for wanting to adopt this pet.</small> </Form.Label>
                                                    <textarea className="form-control" value={applicationForm.reason_for_adoption} disabled onChange={e => setReason(e.target.value)} rows="4"></textarea>
                                                </div>

                                            </Row>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </div>
                        )
                ) : (
                    <div className="text-center h-100 mt-5">
                        <Spinner animation="border" size='sm' role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="my-1">
                            <small>Please Wait...</small>
                        </p>
                    </div>
                )
            }

            <PreloaderComponent show={showPreloader} />
        </div>
    )
}

export default ViewApplication
