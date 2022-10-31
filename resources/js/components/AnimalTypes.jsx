import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Form, Button, Card, Modal, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'

import { CategoryApi } from './BackendApi'
import PreloaderComponent from './PreloaderComponent'
import { showSuccessToast } from './ToastNotification'

const AnimalTypes = ({ onCategoryUpdate }) => {
    const [categories, setCategories] = useState([])
    const [showPreloader, setShowPreloader] = useState(false)
    const [categoryToUpdate, setCategoryToUpdate] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const loadCategories = async () => {
        let categories = await CategoryApi.getAll();
        setCategories(categories);
    }

    useEffect(() => {
        const loadData = async () => {
            setShowPreloader(true);
            await loadCategories();
            setShowPreloader(false);
        }

        loadData();
    }, [])

    const onAddSubmit = (name) => {
        setShowAddModal(false)
        setShowPreloader(true);

        CategoryApi.insert(name)
            .then(res => {
                onCategoryUpdate()
                loadCategories().then(() => {
                    setShowPreloader(false);
                    showSuccessToast("New category added!");
                })
            })
    }
    const onUpdateSubmit = (id, name) => {
        setShowUpdateModal(false)
        setCategoryToUpdate(null)
        setShowPreloader(true);

        CategoryApi.update(id, name)
            .then(res => {
                onCategoryUpdate()
                loadCategories().then(() => {
                    setShowPreloader(false);
                    showSuccessToast("Successfully update category!");
                })
            })
    }

    const AddModal = ({ show, handleClose, onSubmit }) => {
        const [name, setName] = useState("")
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(name)
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <p className="fw-bold text-gray my-0">
                        <small>Add Category</small>
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type='text' required value={name} onChange={(e) => setName(e.target.value)} />
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

    const UpdateModal = ({ show, handleClose, category, onSubmit }) => {
        if (category === null) {
            return null
        }
        const [name, setName] = useState(category.name)
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(category.id, name);
        }
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <p className="fw-bold text-gray my-0">
                        <small>Update Category</small>
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type='text' required value={name} onChange={(e) => setName(e.target.value)} />
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

    const onUpdateBtnClick = (category) => {
        setCategoryToUpdate(category)
        setShowUpdateModal(true)
    }

    const onDelete = (category) => {
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
                CategoryApi.delete(category.id)
                    .then(res => {
                        loadCategories()
                            .then(() => {
                                setShowPreloader(false)
                                showSuccessToast("Category deleted successfully!");
                            })

                    })
            }
        })
    }

    return (
        <div className='py-2'>
            <h5 className='text-success'>Animal Types</h5>
            <hr />

            <Card>
                <Card.Body>
                    {/* <p className='fw-bold'><small></small></p> */}
                    <div className="d-flex">
                        <p className="my-1 fw-bold text-gray">Manage</p>
                        <Button variant='poppy'  onClick={() => setShowAddModal(true)} className='ms-auto text-light'>Add new</Button>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories && categories.map((category, index) => (
                                <tr key={index}>
                                    <td>{++index}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <Button variant='success' onClick={() => onUpdateBtnClick(category)} size='sm'><i className='bx bx-edit text-light'></i></Button>
                                        <Button variant='poppy' onClick={() => onDelete(category)} size='sm' className='ms-2'><i className='bx bx-trash text-light'></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <UpdateModal show={showUpdateModal} onSubmit={onUpdateSubmit} category={categoryToUpdate} handleClose={() => setShowUpdateModal(false)} />
            <AddModal onSubmit={onAddSubmit} show={showAddModal} handleClose={() => setShowAddModal(false)} />
            <PreloaderComponent show={showPreloader} />
        </div>
    )
}

export default AnimalTypes
