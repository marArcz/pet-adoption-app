import axios from 'axios'
import { Button } from 'bootstrap'
import React, { useEffect, useState } from 'react'
import { Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { hidePageLoader, showPageLoader } from '../PageLoader'
import BackButton from './BackButton'

const ApplicationsPage = ({ adopter }) => {

    const [applicationList, setApplicationList] = useState(null)
    const [applicationNo, setApplicationNo] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchResult, setSearchResult] = useState(null)

    useEffect(() => {
        axios.post('/application/get', { adopterId: adopter?.id })
            .then(res => {
                console.log('res: ', res)
                setApplicationList(res.data)
            })
    }, [adopter])

    useEffect(() => {
       if(applicationList){
        let result = applicationList.filter((form) => {
            return form.application_no.toLowerCase().search(applicationNo.toLowerCase()) > -1
        })

        setSearchResult(result)
        setIsSearching(true)
       }
    }, [applicationNo])

    return (
        <div>
            <div className="d-flex align-items-center">
                <BackButton />
                <p className="fw-bold ms-auto me-auto my-1">My Applications</p>
            </div>
            <hr />
            <div className="mt-3 row justify-content-center">
                <div className="col-md-7">
                    <div className="mb-3">
                        <Form.Label className='fw-bold text-gray'>Search Application</Form.Label>
                        <Form.Control type='search' value={applicationNo} onChange={e => setApplicationNo(e.target.value)} placeholder="Enter application number..." />
                    </div>
                    {
                        applicationList && applicationList?.length > 0 && (
                            <p className='text-gray'><small>List of submitted applications</small></p>
                        )
                    }
                    {
                        isSearching && searchResult ? (
                            <ListGroup>
                                {
                                    searchResult.map((application, index) => {
                                        let date = new Date(application.created_at);

                                        return (
                                            <ListGroupItem className='d-flex w-100 align-items-center text-gray' key={index}>
                                                <i className='bx bx-folder bx-sm'></i>
                                                <Link to={`/applications/view/${application.id}`} className='my-1 ms-auto me-auto link-gray text-decoration-none'>
                                                    <strong className='me-1'>{application.application_no}</strong>
                                                    <small>({date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()})</small>
                                                </Link>
                                                <div className="ms-auto">
                                                    {
                                                        application.application_status === 0 ? (
                                                            <p className='fs-6 my-1'><span className="badge bg-gray">Pending</span></p>
                                                        ) : (
                                                            application.application_status === 1 ? (
                                                                <p className='fs-6 my-1'><span className="badge bg-danger">Declined</span></p>
                                                            ) : (
                                                                application.application_status === 2 ? (
                                                                    <p className='fs-6 my-1'><span className="badge bg-success">Approved</span></p>
                                                                ) : (
                                                                    application.application_status === 3 ? (
                                                                        <p className='fs-6 my-1'><span className="badge bg-warning text-dark">Completed</span></p>
                                                                    ) : (
                                                                        <p className='fs-6 my-1'><span className="badge bg-gray">Cancelled</span></p>
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </ListGroupItem>
                                        )
                                    })
                                }
                            </ListGroup>
                        ) : (
                            applicationList ? (
                                <ListGroup>
                                    {
                                        applicationList && applicationList?.length > 0 ? (
                                            applicationList.map((application, index) => {
                                                let date = new Date(application.created_at);

                                                return (
                                                    <ListGroupItem className='d-flex w-100 align-items-center text-gray' key={index}>
                                                        <i className='bx bx-folder bx-sm'></i>
                                                        <Link to={`/applications/view/${application.id}`} className='my-1 ms-auto me-auto link-gray text-decoration-none'>
                                                            <strong className='me-1'>{application.application_no}</strong>
                                                            <small>({date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()})</small>
                                                        </Link>
                                                        <div className="ms-auto">
                                                            {
                                                                application.application_status === 0 ? (
                                                                    <p className='fs-6 my-1'><span className="badge bg-gray">Pending</span></p>
                                                                ) : (
                                                                    application.application_status === 1 ? (
                                                                        <p className='fs-6 my-1'><span className="badge bg-danger">Declined</span></p>
                                                                    ) : (
                                                                        application.application_status === 2 ? (
                                                                            <p className='fs-6 my-1'><span className="badge bg-warning text-dark">Approved</span></p>
                                                                        ) : (
                                                                            application.application_status === 3 ? (
                                                                                <p className='fs-6 my-1'><span className="badge bg-success text-light">Completed</span></p>
                                                                            ) : (
                                                                                <p className='fs-6 my-1'><span className="badge bg-gray">Cancelled</span></p>
                                                                            )
                                                                        )
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    </ListGroupItem>
                                                )
                                            })
                                        ) : (
                                            <p className='text-center'><small>You currently don't have application forms submitted.</small></p>
                                        )
                                    }
                                </ListGroup>
                            ) : (
                                <div className="text-center">
                                    <Spinner className='mt-3' size='sm' animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ApplicationsPage
