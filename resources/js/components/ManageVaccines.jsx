import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Breadcrumb, Button, Card, Modal, Table, Form } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CategoryApi, VaccineApi } from './BackendApi';
import PreloaderComponent from './PreloaderComponent';
import { showErrorToast, showSuccessToast } from './ToastNotification';

const ManageVaccines = () => {
    const { categoryId } = useParams();
    const [showPreloader, setShowPreloader] = useState(false)
    const [category, setCategory] = useState({})
    const [vaccines, setVaccines] = useState([])
    const [vaccineToUpdate, setVaccineToUpdate] = useState(null)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const loadVaccines = async () => {
        let category = await CategoryApi.getOne(categoryId);
        setCategory(category)
        setVaccines(category.vaccines)

    }

    useEffect(() => {
        setShowPreloader(true)
        loadVaccines()
            .then(() => {
                setShowPreloader(false)
            })
    }, [])
    const onAddVaccine = (vaccineName) => {
        setShowAddModal(false)
        setShowPreloader(true)
        VaccineApi.insert(vaccineName, categoryId)
            .then(res => {
                if (res.status === 200) {
                    loadVaccines().then(() => {
                        setShowPreloader(false)
                        showSuccessToast("New breed added!");

                    })
                } else {
                    showErrorToast("Cannot add new breed!");
                }
            })
    }
    const onUpdateVaccine = (id, vaccineName) => {
        setShowUpdateModal(false)
        setShowPreloader(true)
        VaccineApi.update(id, vaccineName)
            .then(res => {
                if (res.status === 200) {
                    loadVaccines().then(() => {
                        setShowPreloader(false)
                        showSuccessToast("Successfully updated vaccine!");

                    })

                } else {
                    setShowPreloader(false)
                    showErrorToast("Cannot update vaccine!");
                }

            })
    }
    const onDelete = (vaccine) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF5630',
            cancelButtonColor: '#334444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setShowPreloader(true)
                VaccineApi.delete(vaccine.id)
                    .then(res => {
                        loadVaccines()
                            .then(() => {
                                setShowPreloader(false)
                                showSuccessToast("Delete successfully!")
                            })

                    })
            }
        })
    }

    const AddModal = ({ show, handleClose, onSubmit }) => {
        const [vaccineName, setVaccineName] = useState("")
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(vaccineName)
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <p className="fw-bold text-gray my-0">
                        <small>Add Vaccine</small>
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type='text' required value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} />
                        </div>
                        <div className="mt-3 text-end">
                            <Button variant='success' type='submit' size='sm' className='me-2 text-light'>Submit</Button>
                            <Button variant='gray' type='button' size='sm' onClick={handleClose}>Cancel</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
    const UpdateModal = ({ show, handleClose, vaccine, onSubmit }) => {
        const [vaccineName, setVaccineName] = useState(vaccine.name)
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(vaccine.id, vaccineName);
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <p className="fw-bold text-gray my-0">
                        <small>Update Vaccine</small>
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type='text' required value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} />
                        </div>
                        <div className="mt-3 text-end">
                            <Button variant='success' type='submit' size='sm' className='me-2 text-light'>Submit</Button>
                            <Button variant='gray' type='button' size='sm' onClick={handleClose}>Cancel</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    const closeUpdateModal = () => {
        setShowUpdateModal(false)
        setVaccineToUpdate(null)
    }

    const updateBreed = (breed) => {
        setVaccineToUpdate(breed)
        setShowUpdateModal(true)
    }
    return (
        <div className="py-2">
            <div className="d-flex align-items-center">
                <div>
                    <Link className='link-gray' to={'/success/vaccines'}>
                        <i className='material-icons me-2 fs-5'>arrow_back</i>
                    </Link>
                </div>
                <div>
                    <h5 className='text-success'>Manage Vaccines</h5>
                </div>
            </div>
            <hr />

            <div className="mt-2">
                <Card>
                    <Card.Body>
                        <div className="d-flex">
                            <div>
                                <Breadcrumb>
                                    <Breadcrumb.Item active><small>{category.name}</small></Breadcrumb.Item>
                                    <Breadcrumb.Item active><small>Vaccines</small></Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                            <div className="ms-auto">
                                <Button variant='poppy' className='text-white' type='button' onClick={() => setShowAddModal(true)}>Add New</Button>
                            </div>
                        </div>
                        <Table hover className="text-gray text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    vaccines && vaccines.map((vaccine, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{vaccine.name}</td>
                                            <td>
                                                <Button variant='success' onClick={() => updateBreed(vaccine)} size='sm'><i className='bx bxs-edit text-dark'></i> Edit</Button>
                                                <Button variant='poppy' onClick={() => onDelete(vaccine)} className='ms-2' size='sm'><i className='bx bx-trash text-dark'></i> Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
            {
                vaccineToUpdate !== null ? (

                    <UpdateModal onSubmit={onUpdateVaccine} show={showUpdateModal} vaccine={vaccineToUpdate} handleClose={closeUpdateModal} />

                ) : null
            }
            <AddModal onSubmit={onAddVaccine} show={showAddModal} handleClose={() => setShowAddModal(false)} />

            <PreloaderComponent show={showPreloader} />

        </div>
    )
}

export default ManageVaccines
