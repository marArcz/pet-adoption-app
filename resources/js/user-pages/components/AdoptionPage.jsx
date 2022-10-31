import { showErrorToast, showSuccessToast } from '@/components/ToastNotification'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Card, Col, Form, Image, Nav, Row, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import { hidePageLoader, showPageLoader } from '../PageLoader'
import BackButton from './BackButton'
import CalendarComponent from './CalendarComponent'

const AdoptionPage = ({ adopter, isUserRestricted }) => {
    const [pet, setPet] = useState(null);
    const [name, setName] = useState("")
    const [nickname, setNickname] = useState("")
    const [age, setAge] = useState("")
    const [status, setStatus] = useState("")
    const [address, setaddress] = useState("")
    const [contactNo, setContactNo] = useState("")
    const [email, setEmail] = useState("")
    const [facebook, setFacebook] = useState("")
    const [occupation, setOccupation] = useState("")
    const [dwelling, setDwelling] = useState("")
    const [landlordName, setLandlordName] = useState("")
    const [landlordPhone, setLandlordPhone] = useState("")
    const [moveOut, setMoveOut] = useState("")
    const [livingWithRelatives, setLivingWithRelatives] = useState("")
    const [permission, setPermission] = useState("")
    const [noOfAdults, setNoOfAdults] = useState("")
    const [noOfChildren, setNoOfChildren] = useState("")
    const [ageOfChildren, setAgeOfChildren] = useState("")
    const [allergies, setAllergies] = useState("")
    const [supportedByFamily, setSupportedByFamily] = useState("")
    const [responsible, setResponsible] = useState("")
    const [incomeSource, setIncomeSource] = useState("")
    const [adoptedAnAnimal, setAdoptedAnAnimal] = useState("")
    const [returnReason, setReturnReason] = useState("")
    const [giftPlan, setGiftPlan] = useState("")
    const [petsOwned, setPetsOwned] = useState("")
    const [havePet, setHavePet] = useState("")
    const [interestedPet, setInterestedPet] = useState("")
    const [keepAtDay, setKeepAtDay] = useState("")
    const [keepAtNight, setKeepAtNight] = useState("")
    const [outsideShelter, setOutsideShelter] = useState("")
    const [timeAlone, setTimeAlone] = useState("")
    const [foodType, setFoodType] = useState("")
    const [fenceType, setFenceType] = useState("")
    const [pastExperience, setpastExperience] = useState("")
    const [reason, setReason] = useState("")
    const [certify, setCertify] = useState(false)
    const [formData, setFormData] = useState(null)
    const { id } = useParams()

    const navigate = useNavigate();
    const [scheduleTime, setScheduleTime] = useState([])
    const [timeList, setTimeList] = useState([])
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [schedules, setSchedules] = useState([])

    useEffect(() => {
        showPageLoader();
        axios.get(`/pets/${id}/get`)
            .then(res => {
                hidePageLoader()
                setPet(res.data);
            })

        axios.get('/schedules/time')
            .then(res => {
                setTimeList(res.data)
            })

        axios.get("/schedules")
            .then(res=>{
                setSchedules(res.data)
            })
    }, [])



    const formOnSubmit = (e) => {
        e.preventDefault();

        const data = {
            adopterId: adopter.id,
            name,
            nickname,
            age,
            status,
            address,
            contact_no: contactNo,
            facebook,
            occupation,
            dwelling,
            landlord_name: landlordName,
            landlord_phone: landlordPhone,
            move_out: moveOut,
            living_with_relatives: livingWithRelatives,
            permission,
            no_of_adults: noOfAdults,
            no_of_children: noOfChildren,
            allergies_asthma: allergies,
            children_ages: ageOfChildren,
            supported_by_family: supportedByFamily,
            responsible,
            income_source: incomeSource,
            adopted_an_animal: adoptedAnAnimal,
            return_reason: returnReason,
            gift_plan: giftPlan,
            pets_owned: petsOwned,
            have_pet: havePet,
            interested_pet: interestedPet,
            keep_at_night: keepAtNight,
            keep_at_day: keepAtDay,
            outside_shelter: outsideShelter,
            time_alone: timeAlone,
            food_type: foodType,
            fence_type: fenceType,
            past_experience: pastExperience,
            reason_for_adoption: reason,
            certify,
            email
        }

        setFormData(data)


    }

    useEffect(() => {
        if (selectedDate) {
            console.log('date changed: ', selectedDate.getMonth())
            axios.post('/schedules/time/get', {
                date: `${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()}`
            })
                .then(res => {
                    console.log('sched time: ', res)
                    setScheduleTime(res.data);
                })
                .catch(err => {
                    console.log('error: ', err)
                })
        }

    }, [selectedDate])

    const submitApplication = () => {
        showPageLoader();

        formData.date = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`
        formData.time_id = selectedTime.id
        formData.petId = pet?.id
        axios.post('/application/add',formData)
        .then(res=>{
            showSuccessToast("Application was successfully submitted!");
            hidePageLoader();
            console.log('res: ', res)
            navigate(`/applications/view/${res.data[0].id}`)
        })
        .catch(err=>{
            console.log('err: ', err);
            hidePageLoader()
            showErrorToast("System error please try again!")
        })
    }

    return (
        <div>
            <header className='d-flex align-items-center'>
                <BackButton />
                <div className='ms-auto me-lg-auto'>
                    <p className="fw-bold my-0">Adoption Application Form</p>
                </div>
            </header>
            <hr />
            <p className='fw-bold text-gray '>
                <i className='bx bx-calendar-event'></i> Schedule Visit
            </p>
            <div className="mt-4">
                <Row>
                    <Col md="3">
                        <Image fluid thumbnail src={pet?.photos[0].src} />
                    </Col>
                    <Col md className=' pt-3 px-3'>
                        <p className="fs-5 fw-bold">{pet?.name}</p>
                        <p>{pet?.address}</p>
                        <div className="d-flex align-items-center">
                            <div className='badge bg-success me-1'>{pet?.category.name}</div>
                            <div className='badge bg-success me-1'>{pet?.gender}</div>
                            <div className='badge bg-success'>{pet?.age}</div>
                        </div>
                    </Col>
                </Row>
            </div>
            <Card className='mt-3 border-start-0 border-end-0 border-bottom-0 shadow border-top border-warning border-2'>
                <Card.Body>
                    <p>Selected Date: {selectedDate?.toDateString()}</p>
                    {
                        formData ? (
                            <div>
                                <p className="fw-bold text-center"><small><i className='bx bx-calendar-event'></i> Schedule Visit</small></p>
                                <Row className='justify-content-center'>
                                    <Col md className='text-center'>
                                        <p className="text-center fw-bold fs-6">Date:</p>
                                        {
                                            timeList.length > 0 ? (
                                                <CalendarComponent scheduleTime={timeList} schedules={schedules} onSelect={(date) => setSelectedDate(date)} />
                                            ) : (
                                                <div className="text-center mt-5">
                                                    <Spinner size='sm' animation="border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </Spinner>
                                                </div>
                                            )
                                        }
                                    </Col>
                                    <Col md>
                                        <p className="text-center fw-bold fs-6">Time:</p>
                                        <hr />
                                        <div className="row justify-content-center">
                                            <div className="col-md-10">
                                                {
                                                    selectedDate ? (
                                                        <Nav className='flex-column justify-content-center align-items-center'>

                                                            {
                                                                scheduleTime && scheduleTime.map((time, index) => (
                                                                    <Nav.Item key={index} className="mb-3 w-100" >
                                                                        <input disabled={time.available <= 0} onChange={()=>setSelectedTime(time)} type="radio" id={`time-${index}`} name='time' value={time.id} className="me-2" />
                                                                        <label htmlFor={`time-${index}`} className={`${time.available <= 0?"text-decoration-line-through text-black-50":""}`}>
                                                                            <small>
                                                                            {time.time_from}-{time.time_to}
                                                                            <span className={`ms-1 `}>(Available slots: <span className='text-poppy'>{time.available}</span>)</span>
                                                                            </small>
                                                                        </label>
                                                                    </Nav.Item>
                                                                ))

                                                            }
                                                        </Nav>

                                                    ) : (
                                                        <p className='text-center'>SELECT A DATE FIRST</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="mt-2 text-end">
                                    <button className='rounded-1 me-2 btn btn-gray px-lg-4 btn-sm' type='button' onClick={() => setFormData(null)}>Back</button>
                                    <button disabled={selectedTime === null} className='rounded-1  btn btn-secondary px-lg-4 btn-sm' type='button' onClick={submitApplication}>Submit</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="fw-bold"><small>Fill the Information</small></p>
                                <p className='text-poppy'><small>Required *</small></p>

                                <Form onSubmit={formOnSubmit}>
                                    <Row className=' align-items-end'>
                                        <Col md="3">
                                            <div className="mb-4">
                                                <Form.Label>Name: <span className='text-poppy'>*</span></Form.Label>
                                                <Form.Control type='text' required value={name} onChange={e => setName(e.target.value)} />
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="mb-4">
                                                <Form.Label>Nickname: <span className='text-poppy'>*</span></Form.Label>
                                                <Form.Control type='text' required value={nickname} onChange={e => setNickname(e.target.value)} />
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="mb-4">
                                                <Form.Label>Age: <span className='text-poppy'>*</span></Form.Label>
                                                <Form.Control type='number' required value={age} onChange={e => setAge(e.target.value)} />
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="mb-4">
                                                <Form.Label>Status: <span className='text-poppy'>*</span></Form.Label>
                                                <Form.Control type='text' required value={status} onChange={e => setStatus(e.target.value)} />
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-4">
                                                <Form.Label>Complete Address: <span className='text-poppy'>*</span></Form.Label>
                                                <Form.Control type='text' required value={address} onChange={e => setaddress(e.target.value)} />
                                            </div>
                                        </Col>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Contact Number: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='number' required value={contactNo} onChange={e => setContactNo(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Email Address: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='email' required value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Facebook Account: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={facebook} onChange={e => setFacebook(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Occupation: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={occupation} onChange={e => setOccupation(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Select the dwelling you live in: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Select value={dwelling} onChange={e => setDwelling(e.target.value)}>
                                                <option>Select One</option>
                                                <option value="House">House</option>
                                                <option value="Apartment">Apartment</option>
                                                <option value="Condo">Condo</option>
                                                <option value="Townhouse">Townhouse</option>
                                            </Form.Select>
                                        </div>
                                        <div className="col-12">
                                            <p className="form-text">If renting, write your landlord's name and contact number.</p>
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Landlord Name:</Form.Label>
                                            <Form.Control type='text' value={landlordName} onChange={e => setLandlordName(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Landlord Contact No:</Form.Label>
                                            <Form.Control type='text' value={landlordPhone} onChange={e => setLandlordPhone(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label><small>Are you planning to move in in the future?:</small></Form.Label>
                                            <Form.Control type='text' value={moveOut} onChange={e => setMoveOut(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Living with relatives? How long?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={livingWithRelatives} onChange={e => setLivingWithRelatives(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label><small>We want to make sure that the Dog/Cat truly allowed in your house. We need a document that stating that this is a fact. Please send us a document or a picture of letter with landlord or parent’s permission. Agree?</small><span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={permission} onChange={e => setPermission(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>How many adult in the household?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='number' required value={noOfAdults} onChange={e => setNoOfAdults(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>How many children in the household?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='number' required value={noOfChildren} onChange={e => setNoOfChildren(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Ages of children?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={ageOfChildren} onChange={e => setAgeOfChildren(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Do the children have allergies or asthma?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={allergies} onChange={e => setAllergies(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label><small>Are all members of the family supportive of this pet adoption?</small><span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={supportedByFamily} onChange={e => setSupportedByFamily(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Who will be responsible for the pet care?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={responsible} onChange={e => setResponsible(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>What is your source of income?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={incomeSource} onChange={e => setIncomeSource(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Have you ever adopted an animal from (or return an animal to) a Shelter?: <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Check
                                                inline
                                                label="Yes"
                                                name="adopted"
                                                type="radio"
                                                id={`inline-radio-1`}
                                                value="Yes"
                                                onChange={e => setAdoptedAnAnimal(e.target.value)}
                                            />
                                            <Form.Check
                                                inline
                                                value="No"
                                                onChange={e => setAdoptedAnAnimal(e.target.value)}
                                                label="No"
                                                name="adopted"
                                                type="radio"
                                                id={`inline-radio-2`}
                                            />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>If you returned an animal, what is the reason?</Form.Label>
                                            <Form.Control type='text' value={returnReason} onChange={e => setReturnReason(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Do you have plans to give this as a gift? If yes, to whom?<span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={giftPlan} onChange={e => setGiftPlan(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>List the name of the pets you have owned in the past 5 years</Form.Label>
                                            <textarea className="form-control" rows="4" value={petsOwned} onChange={e => setPetsOwned(e.target.value)}></textarea>
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Do you still own the pet? If yes, just write YES. If not, Reason of losing the pet?<span className='text-poppy'>*</span></Form.Label>
                                            <textarea className="form-control" value={havePet} onChange={e => setHavePet(e.target.value)} rows="4"></textarea>
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Is there a particular pet you are interested in? If so, please include his/her name and why?<span className='text-poppy'>*</span></Form.Label>
                                            <textarea className="form-control" value={interestedPet} onChange={e => setInterestedPet(e.target.value)} rows="4"></textarea>
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Where will the pet be kept during DAY? <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Select value={keepAtDay} onChange={e => setKeepAtDay(e.target.value)}>
                                                <option>Select One</option>
                                                <option value="Indoor">Indoor</option>
                                                <option value="Outdoor">Outdoor</option>
                                                <option value="Patio">Patio</option>
                                            </Form.Select>
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Where will the pet be kept during NIGHT? <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Select value={keepAtNight} onChange={e => setKeepAtNight(e.target.value)}>
                                                <option>Select One</option>
                                                <option value="Indoor">Indoor</option>
                                                <option value="Outdoor">Outdoor</option>
                                                <option value="Patio">Patio</option>
                                            </Form.Select>
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>If outside, describe or send a picture of the shelter you will provide.</Form.Label>
                                            <textarea className="form-control" value={outsideShelter} onChange={e => setOutsideShelter(e.target.value)} rows="4"></textarea>
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>Length of time during the day the pet will be left alone? <span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={timeAlone} onChange={e => setTimeAlone(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>What type of diet/food you plan to feed the pet?<span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={foodType} onChange={e => setFoodType(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label>What type of fence do you have?<span className='text-poppy'>*</span></Form.Label>
                                            <Form.Control type='text' required value={fenceType} onChange={e => setFenceType(e.target.value)} />
                                        </div>
                                        <div className="mb-4 col-md-4">
                                            <Form.Label><small>Share past experience of having pets? what are the challenges you have and how did you overcome them?</small></Form.Label>
                                            <textarea className="form-control" value={pastExperience} onChange={e => setpastExperience(e.target.value)} rows="4"></textarea>
                                        </div>
                                        <div className="mb-4 col-md">
                                            <Form.Label><small>Please give us a brief explanation of your reasons for wanting to adopt this pet.</small> <span className='text-poppy'>*</span></Form.Label>
                                            <textarea className="form-control" value={reason} required onChange={e => setReason(e.target.value)} rows="4"></textarea>
                                        </div>
                                        <div className="mb-4 mt-3 col-12 text-center">
                                            <Form.Check
                                                className='text-gray fw-bold'
                                                inline
                                                label="I certify that all the information in this application is true and I understand that false information may void the application."
                                                name="group1"
                                                type="checkbox"
                                                id={`certify-checkbox`}
                                                required
                                                value={true}
                                                onChange={(e) => setCertify(e.target.value)}
                                            />
                                            <span className='text-poppy'>*</span>
                                        </div>
                                    </Row>
                                    <hr />
                                    <div className="text-end">
                                        <Button variant="gray" className='me-2 px-lg-4' size="sm" type="reset">Reset</Button>
                                        <Button variant="secondary" className='text-light px-lg-4' size='sm' type="submit">Next</Button>
                                    </div>
                                </Form>
                            </div>
                        )
                    }
                </Card.Body>
            </Card>

        </div>
    )
}

export default AdoptionPage