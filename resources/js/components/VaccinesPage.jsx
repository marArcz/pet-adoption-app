import React, { useEffect } from 'react'
import { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CategoryApi } from './BackendApi'
import PreloaderComponent from './PreloaderComponent'

const VaccinesPage = () => {
    const [categories, setCategories] = useState([])
    const [showPreloader, setShowPreloader] = useState(false)
    const loadCategories = () =>{
        setShowPreloader(true)
        CategoryApi.getAll()
        .then(res =>{
            setCategories(res);
            setShowPreloader(false)
        })
    }

    useEffect(()=>{
        loadCategories()
    },[])

    return (
        <div className='py-2'>
            <h5 className='text-success'>Vaccines</h5>
            <hr />
            <Row>
                {
                    categories.length > 0 && categories.map((category, index) => (
                        <Col key={index} md={4} lg={3}>
                            <Card className="mb-3">
                                <Card.Body className='text-center'>
                                    <div className="text-start">
                                        <i className='bx bx-category'></i>
                                    </div>
                                    <p className="text-success text-center fs-4 text-uppercase fw-bold">{category.name}</p>
                                    <Link to={`/success/vaccines/${category.id}`} className="fw-bold text-center link-gray"><small>{`${category.vaccines.length} ${category.vaccines.length > 1 ? 'vaccines' : 'vaccine'}`}</small></Link>
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

export default VaccinesPage
