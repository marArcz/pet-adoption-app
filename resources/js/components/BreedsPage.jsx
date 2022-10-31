import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CategoryApi } from './BackendApi'
import BreedsUpdateModal from './BreedsUpdateModal'
import PreloaderComponent from './PreloaderComponent'

const BreedsPage = () => {
    const [breeds, setBreeds] = useState([])
    const [categories, setCategories] = useState([])
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showPreloader, setShowPreloader] = useState(false)

    const loadCategories = async () => {
        setShowPreloader(true)
        let categories = await CategoryApi.getAll()
        setCategories(categories)
        setShowPreloader(false)
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const openBreeds = (breeds) => {
        setShowUpdateModal(true)
    }

    return (
        <div className="py-2">
            <h5 className="text-success mb-1">Breeds</h5>
            <hr />
            <Row className='row-cols-lg-4 row-cols-1 row-cols-md-3'>
                {
                    categories.length > 0 && categories.map((category, index) => (
                        <Col key={index}>
                            <Card className="mb-3">
                                <Card.Body className='text-center'>
                                    <div className="text-start">
                                        <i className='bx bx-category'></i>
                                    </div>
                                    <p className="text-success text-center fs-4 text-uppercase fw-bold">{category.name}</p>
                                    <Link to={`/success/breeds/${category.id}`} onClick={() => openBreeds(category.breeds)} className="fw-bold text-center link-gray"><small>{`${category.breeds.length} ${category.breeds.length > 1 ? 'breeds' : 'breed'}`}</small></Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }

            </Row>
            <PreloaderComponent show={showPreloader} />
        </div>

    )
}

export default BreedsPage
