import { set } from 'lodash';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Breadcrumb, Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BreedsApi, CategoryApi } from './BackendApi';
import PreloaderComponent from './PreloaderComponent';
import { showErrorToast, showSuccessToast } from './ToastNotification';

const UpdateBreeds = () => {
    const [breeds, setBreeds] = useState([])
    const [showPreloader, setShowPreloader] = useState(false)
    const { categoryId } = useParams();
    const [category, setCategory] = useState("")
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [breedToUpdate, setBreedToUpdate] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)

    const loadBreeds = async () => {
        let category = await CategoryApi.getOne(categoryId)
        setCategory(category)
        setBreeds(category.breeds);
        setShowPreloader(false)
    }

    useEffect(() => {
        setShowPreloader(true)
        loadBreeds();
    }, [])

    const onAddBreed = (breedName) => {
        setShowAddModal(false)
        setShowPreloader(true)
        BreedsApi.insert(breedName, categoryId)
            .then(res => {
                if (res.status === 200) {
                    showSuccessToast("New breed added!");

                } else {
                    showErrorToast("Cannot add new breed!");
                }
                loadBreeds().then(() => {
                    setShowPreloader(false)

                })
            })
    }
    const onUpdateBreed = (id, breedName) => {
        setShowUpdateModal(false)
        setShowPreloader(true)
        BreedsApi.update(id, breedName)
            .then(res => {
                if (res.status === 200) {
                    showSuccessToast("Successfully updated breed!");

                } else {
                    showErrorToast("Cannot update breed!");
                }
                loadBreeds().then(() => {
                    setShowPreloader(false)
                })
            })
    }
    const onDelete = (breed) => {
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
                BreedsApi.delete(breed.id)
                    .then(res => {
                        loadBreeds()
                            .then(() => {
                                setShowPreloader(false)
                                showSuccessToast("Breed deleted successfully!");
                            })

                    })
                    .catch(err => {
                        setShowPreloader(false)
                        showErrorToast(res.data.message)
                    })
            }
        })
    }

    const AddModal = ({ show, handleClose, onSubmit }) => {
        const [breedName, setBreedName] = useState("")
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(breedName)
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <p className="fw-bold text-gray my-0">
                        <small>Add Breed</small>
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type='text' required value={breedName} onChange={(e) => setBreedName(e.target.value)} />
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
    const UpdateModal = ({ show, handleClose, breed, onSubmit }) => {
        const [breedName, setBreedName] = useState(breed.name)
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(breed.id, breedName);
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <p className="fw-bold text-gray my-0">
                        <small>Update Breed</small>
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type='text' required value={breedName} onChange={(e) => setBreedName(e.target.value)} />
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
        setBreedToUpdate(null)
    }

    const updateBreed = (breed) => {
        setBreedToUpdate(breed)
        setShowUpdateModal(true)
    }



    return (
        <>
            <div className="py-2">
                <div className="d-flex align-items-center">
                    <div>
                        <Link className='link-gray' to={'/success/breeds'}>
                            <i className='material-icons me-2 fs-5'>arrow_back</i>
                        </Link>
                    </div>
                    <div>
                        <h5 className='text-success'>Manage Breeds</h5>
                    </div>
                </div>
                <hr />

                <div className="mt-2">
                    <Card className=''>
                        <Card.Body>
                            <div className="d-flex">
                                <div>
                                    <Breadcrumb>
                                        <Breadcrumb.Item active><small>{category.name}</small></Breadcrumb.Item>
                                        <Breadcrumb.Item active><small>Breeds</small></Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                <div className="ms-auto">
                                    <Button variant='poppy' className='text-white' type='button' onClick={() => setShowAddModal(true)}>Add New</Button>
                                </div>
                            </div>

                            <div className=" table-responsive-sm">
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
                                            breeds && breeds.map((breed, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{breed.name}</td>
                                                    <td>
                                                        <Button variant='success' onClick={() => updateBreed(breed)} className="mb-2 me-md-2" size='sm'><i className='bx bxs-edit text-light'></i></Button>
                                                        <Button variant='poppy' onClick={() => onDelete(breed)} className=' mb-2' size='sm'><i className='bx bx-trash text-light'></i></Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            {
                breedToUpdate !== null ? (

                    <UpdateModal onSubmit={onUpdateBreed} show={showUpdateModal} breed={breedToUpdate} handleClose={closeUpdateModal} />

                ) : null
            }
            <AddModal onSubmit={onAddBreed} show={showAddModal} handleClose={() => setShowAddModal(false)} />

            <PreloaderComponent show={showPreloader} />
        </>
    )
}

export default UpdateBreeds
