import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BreadCrumbComponent from './BreadCrumbComponent';
import LogoComponent from './LogoComponent';
import StatisticsComponent from './StatisticsComponent';

const DashboardComponent = ({ petCount }) => {
    const [adoptersCount, setAdoptersCount] = useState(0)
    const [applications, setApplications] = useState([])
    useEffect(() => {
        axios.get("/adopters/getAll")
            .then(res => {
                setAdoptersCount(res.data.length)
            })
        axios.post('/application/get', { status: 0 })
            .then(res => {
                console.log('res: ', res)
                setApplications(res.data)
            })
    }, [])

    const StatsCard = ({
        title,
        value,
        bg,
        txtColor = "text-dark",
        icon,
    }) => {
        return (
            <div className={`card shadow mb-2 border-0 ${bg} ${txtColor} rounded-0`}>
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div className="me-auto">
                            <p className="my-0 fs-6 fw-light">
                                <i className={icon}></i> {title}
                            </p>
                        </div>
                        <div className="">
                            <p className=" fs-5 my-0 fw-light">{value}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="pt-2">
            <h3 className="mb-2 text-dark">Welcome Back!</h3>
            <BreadCrumbComponent />
            {/* <hr className=" text-success" /> */}
            <Row className="h-100 gy-3">
                <Col lg={7} className="">
                    <div className="card bg-white border-0 rounded-0">
                        <div className="card-body">
                            <p className="text-black-50">Statistics</p>
                            <StatsCard
                                icon="bx bx-home-heart fs-6"
                                title="Animal Pets In Care"
                                value={petCount}
                                bg="bg-warning bg-gradient"
                                txtColor="text-dark"
                            />

                            <StatsCard
                                icon="bx bx-home-heart fs-6"
                                title="Registered Adopters"
                                value={adoptersCount}
                                bg="bg-success"
                                txtColor="text-light"
                            />
                            {/* <p className="mb-3 mt-5 text-black-50">Monthly Reports</p>
                            <StatisticsComponent /> */}
                            <p className="text-black-50 mt-5">Application Reports</p>
                            <hr />
                            {/* <p className='text-purple'><small>Pending Applications</small></p> */}
                            <div className="table-responsive-sm">
                                <Table >
                                    <caption><small>Pending Applications</small></caption>
                                    <thead className='text-gray fw-light'>
                                        <tr>
                                            <th>Application No</th>
                                            <th>Applicant</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>
                                    <tbody className='text-gray'>
                                        {
                                            applications.length > 0 ? (
                                                applications.map((application, index) => {
                                                    let adopter = application.adopter
                                                    return (
                                                        <tr key={index}>
                                                            <td><small>{application.application_no}</small></td>
                                                            <td><small>{adopter.firstname} {adopter.lastname}</small></td>
                                                            <td>
                                                                <Link to={`/success/applications/${application.id}`} className='btn btn-sm btn-success'>
                                                                    <i className='bx bxs-folder me-1'></i>
                                                                    <small>Application Form</small>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) :
                                                <tr>
                                                    <td colSpan={3} className='text-center'><small className='text-black-50'>No pending applications</small></td>
                                                </tr>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col lg className="">
                    <Row className="justify-content-center align-items-center h-100">
                        <Col className='col-md-6 col-9'>
                            <LogoComponent />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default DashboardComponent
