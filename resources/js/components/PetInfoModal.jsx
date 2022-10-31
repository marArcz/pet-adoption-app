import React, { useState } from 'react'
import { Button, Card, Col, Image, Modal, Row } from 'react-bootstrap'

const PetInfoModal = ({ show, handleClose, pet }) => {

    const [activePhoto, setActivePhoto] = useState(pet.photos[0].src);
    console.log("petInfomodal: ", pet)
    return (
        <>
            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <Modal.Title as="p" className="fs-6 fw-bold"><small>Pet Information</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-2 container">
                        <Row>
                            <Col md={12}>
                                <Card className='rounded-0 pet-img-info-card'>
                                    {/* <Card.Img className='rounded-0 main-img' variant='top' src={activePhoto} /> */}
                                    <Card.Body>
                                        <div className="img-wrapper mb-3">
                                            <img src={activePhoto} className='main-img img-fluid' alt="" />
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            {pet.photos.map((photo, index) => (
                                                <img key={index} width="60" onClick={() => setActivePhoto(photo.src)} height="120" className="me-3 img-thumbnail pet-info-photo" src={photo.src} />
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md className='pt-4'>
                                <Row className='mb-1'>
                                    <Col>
                                        <div className="">
                                            <p className="mb-2 fw- text-black-50"><small>Name:</small></p>
                                            <h5 className='text-success'>{pet.name}</h5>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="">
                                            <p className="mb-2 fw- text-black-50"><small>Classification:</small></p>
                                            <p className='text-dark fs-5'>
                                                {pet.category.name}
                                            </p>
                                        </div>
                                    </Col>

                                </Row>
                                <Row className='mb-1'>
                                    <Col>
                                        <div className="">
                                            <p className="mb-2 fw- text-black-50"><small>Gender:</small></p>
                                            <div className="d-flex text-dark fs-6 align-items-center">
                                                <span className=' text-capitalize me-1'><span>{pet.gender}</span></span>
                                                <i className='material-icons fs-6'>{pet.gender.toLowerCase()}</i>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="">
                                            <p className="mb-2 fw- text-black-50"><small>Breed:</small></p>
                                            <p className='text-dark'>
                                                {
                                                    pet.breeds.map((breed, index) => (
                                                        <span key={index}>{breed.details.name}{index + 1 === pet.breeds.length ? "" : ", "}</span>
                                                    ))
                                                }
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mb-1'>
                                    <Col>
                                        <div className="">
                                            <p className="mb-2 fw- text-black-50"><small>Location:</small></p>
                                            <p className='text-dark fs-6'>
                                                {pet.address}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="">
                                            <p className="mb-2 fw- text-black-50"><small>Vaccines:</small></p>
                                            <p className='text-dark'>
                                                {
                                                    pet.vaccinations.map((vaccination, index) => (
                                                        <span key={index}>{vaccination.vaccine.name}{index + 1 === pet.vaccinations.length ? "" : ", "}</span>
                                                    ))
                                                }
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="">
                                    <p className="mb-2 fw- text-black-50"><small>Description:</small></p>
                                    <p className="text-dark" style={{textAlign:"justify"}}>{pet.description}</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PetInfoModal
