import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const PetComponent = ({ pet }) => {

    const PetImage = ({ photo }) => {
        return (
            <div className="pet-img shadow" style={{ backgroundImage: `url(${photo.src}` }}></div>

        )
    }

    return (
        <div className="pet-card">
            <Link to={`/view-pet/${pet.id}`} >
                <PetImage photo={pet.photos[0]} />
            </Link>
            <div className="pet-card-body">
                <Row className=' align-items-start'>
                    <Col>
                        <Link className="link link-dark fs-5 my-0 fw-bold text-decoration-none">{pet.name}</Link>
                        <p className='my-0'>
                            <small>
                                {
                                    pet.breeds.map((breed, index) => (
                                        <span className='me-1' key={index}>
                                            {breed.details.name}
                                            {
                                                index + 1 === pet.breeds.length ? null : ","
                                            }
                                        </span>
                                    ))
                                }
                            </small>
                        </p>
                    </Col>
                    <Col className='text-end text-success'>
                        <i className='fs-2 material-icons'>{pet.gender.toLowerCase()}</i>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default PetComponent