import { hidePageLoader, showPageLoader } from '@/user-pages/PageLoader'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Card, Spinner, Tab, Table, Tabs } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { showSuccessToast } from './ToastNotification'

const ApplicationsPage = ({onPetsUpdate}) => {
    const [applications, setApplications] = useState([])
    const [key, setKey] = useState(0)
    const [status, setStatus] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];


    const loadApplications = async () => {
        console.log("status: ", key)
        await axios.post('/application/get', { status: key })
            .then(res => {
                console.log('res: ', res)
                setApplications(res.data)
                return res;
            })
    }
    useEffect(() => {
        setApplications([])
        loadApplications();
    }, []);

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
        showPageLoader();
        axios.post('/application/update-status', {
            id: application.id,
            status: 2
        })
            .then(async (res) => {
                showSuccessToast("Successfully updated!")
                console.log('onapprove: ', res)
                // setApplications(res.data)
                await loadApplications()
                hidePageLoader();
                sendMail(application, 'approved')
            })
    }
    const onDecline = (application) => {
        showPageLoader();

        axios.post('/application/update-status', {
            id: application.id,
            status: 1
        })
            .then(async (res) => {

                console.log('res: ', res)
                // setApplications(res.data)
                await loadApplications()
                hidePageLoader();
                sendMail(application, 'declined')
            })
    }

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            await loadApplications()
            setIsLoading(false)
        }

        loadData()
    }, [key])

    const refresh = async () => {
        setIsLoading(true)
        await loadApplications()
        setIsLoading(false)
    }

    const markAsCompleted = (application) => {
        showPageLoader()
        axios.post('application/update-status', {
            id: application.id,
            status: 3,
        })
            .then(async (res) => {
                onPetsUpdate()
                console.log('res: ', res)
                // setApplications(res.data)
                await loadApplications()
                hidePageLoader();
                sendMail(application, 'completed')

            })
    }
    return (
        <div className='py-2'>
            <h5 className="text-success">Application Forms</h5>
            <hr />

            <Card className='shadow-sm border-0 rounded-0'>
                <Card.Body>
                    <div className="text-end mb-3">
                        <Button variant='secondary' onClick={refresh} size='sm' className='text-light'>Refresh</Button>
                    </div>
                    <Tabs
                        id='adopters-tabs'
                        activeKey={key}
                        onSelect={setKey}
                    >
                        <Tab eventKey={0} title="Pending Applications">
                            <div className="table-responsive pt-3">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Application No</th>
                                            <th>Applicant</th>
                                            <th>Pet Name</th>
                                            <th>Schedule</th>
                                            <th>Application Form</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            isLoading ? (
                                                <tr>
                                                    <td colSpan={5} className='text-center pt-4'>
                                                        <Spinner className='mt-3' variant="gray" size='sm' animation="border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    </td>
                                                </tr>
                                            ) : (
                                                applications && applications.map((application, index) => {
                                                    let date = new Date(application.schedule.date)
                                                    return (
                                                        <tr key={index}>
                                                            <td>{application.application_no}</td>
                                                            <td>{application.adopter.firstname} {application.adopter.lastname}</td>
                                                            <td>{application.pet.name}</td>
                                                            <td>{months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</td>
                                                            <td>
                                                                <Button size="sm" variant="purple" className="" onClick={() => navigate(`/success/applications/${application.id}`)}>
                                                                    <i className='bx bxs-folder me-1'></i>
                                                                    <small>Application Form</small>
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <button onClick={() => onApprove(application)} className="btn-sm btn btn-outline-success mx-1" type='button'>
                                                                        Approve
                                                                    </button>
                                                                    <button onClick={() => onDecline(application)} className="btn-sm btn btn-outline-poppy mx-1" type='button'>
                                                                        Decline
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab eventKey={2} title="Approved Applications">
                            <div className="table-responsive pt-3">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Applicant</th>
                                            <th>Pet</th>
                                            <th>Schedule</th>
                                            <th>Application Form</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            isLoading ? (
                                                <tr>
                                                    <td colSpan={5} className='text-center pt-4'>
                                                        <Spinner size='sm' animation="border" role="status" variant="dark">

                                                        </Spinner>
                                                    </td>
                                                </tr>
                                            ) : (
                                                applications.map((application, index) => {
                                                    let date = new Date(application.schedule.date)
                                                    return (
                                                        <tr key={index}>
                                                            <td>{application.application_no}</td>
                                                            <td>{application.adopter.firstname} {application.adopter.lastname}</td>
                                                            <td>{application.pet.name}</td>
                                                            <td>{months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</td>
                                                            <td>
                                                            <Button size="sm" variant="purple" className="text-light mb-1" onClick={() => navigate(`/success/applications/${application.id}`)}>
                                                                    <i className='bx bxs-folder me-1'></i>
                                                                    <small>Application Form</small>
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                
                                                                <Button size="sm" variant="outline-success" className=" ms-lg-2 mb-1" onClick={() => markAsCompleted(application)}>
                                                                    <small>Completed <i className='bx bx-check'></i></small>
                                                                </Button>
                                                                <Button size="sm" variant="outline-poppy" className=" ms-lg-2 mb-1" onClick={() => cancelApplication(application)}>
                                                                    <small>Cancel <i className='bx bx-x'></i></small>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab eventKey={3} title="History">
                            <div className="table-responsive pt-3">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Applicant</th>
                                            <th>Pet</th>
                                            <th>Schedule</th>
                                            <th>Application Form</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            isLoading ? (
                                                <tr>
                                                    <td colSpan={5} className='text-center pt-4'>
                                                        <Spinner size='sm' animation="border" role="status" variant="dark">

                                                        </Spinner>
                                                    </td>
                                                </tr>
                                            ) : (
                                                applications.map((application, index) => {
                                                    let date = new Date(application.schedule.date)
                                                    return (
                                                        <tr key={index}>
                                                            <td>{application.application_no}</td>
                                                            <td>{application.adopter.firstname} {application.adopter.lastname}</td>
                                                            <td>{application.pet.name}</td>
                                                            <td>{months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</td>
                                                            <td>
                                                            <Button size="sm" variant="purple" className="text-light mb-1" onClick={() => navigate(`/success/applications/${application.id}`)}>
                                                                    <i className='bx bxs-folder me-1'></i>
                                                                    <small>Application Form</small>
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button size='sm' variant='success'>OPEN</Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ApplicationsPage
