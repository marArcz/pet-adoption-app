import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Image, Row, Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { hidePageLoader, showPageLoader } from '../PageLoader';
import BackButton from './BackButton';

const PetDetails = ({ isUserRestricted, isSignedIn }) => {

    const { id } = useParams();
    const [pet, setPet] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activePhoto, setActivePhoto] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        showPageLoader();
        axios.get(`/pets/${id}/get`)
            .then(res => {
                setIsLoading(false);
                setPet(res.data)
                console.log('pet: ', res)
            })

    }, [])

    const adoptPet = (pet) => {
        if(isSignedIn){
            navigate(`/adoption/${pet?.id}`)
        }else{
            navigate("/signin")
        }
    }


    return (
        <div>
            <header>
                <BackButton />
            </header>
            <div className="mt-3">
                <Container>
                    <Row className=' gy-2'>
                        <Col md="6">
                            <div className="pet-photos-container text-center">
                                <Image onLoad={() => hidePageLoader()} thumbnail fluid src={activePhoto ? activePhoto.src : pet?.photos[0].src} />

                                {
                                    pet && pet?.photos.length > 1 ? (
                                        <div className="mt-3 mb-3 d-flex justify-content-center">
                                            {
                                                pet.photos.map((photo, index) => (
                                                    <div className="" key={index}>
                                                        <img src={photo.src} onClick={() => setActivePhoto(photo)} className="pet-info-photo me-3 border-light border-2 rounded-1 shadow" width="60" height="50" alt="Pet photo" />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : null
                                }
                            </div>
                        </Col>
                        <Col className=' align-self-center'>

                            <Row>
                                <Col>
                                    <h2 className='fw-bold'>
                                        {pet?.name}
                                    </h2>
                                    <p>
                                        <small>
                                            {
                                                pet && pet.breeds.map((breed, index) => (
                                                    <span key={index} className="me-1">
                                                        {breed.details.name}{`${index + 1 === pet.breeds.length ? "" : ","}`}
                                                    </span>
                                                ))
                                            }
                                        </small>
                                    </p>
                                </Col>
                                <Col className=' align-self-start text-end'>
                                    <span className="material-icons text-success fs-2">{pet?.gender.toLowerCase()}</span>
                                </Col>
                            </Row>

                            <div className="card border-0 shadow rounded-3 bg-success bg-opacity-75">
                                <div className="card-body text-light">
                                    <div className="row gy-3">
                                        <div className='text-lg-center col-md'>
                                            <p className=' mb-1 fw-bold'><small>Location</small></p>
                                            <p className="my-1"><small>{pet?.address}</small></p>
                                        </div>
                                        <div className="col-md text-lg-center">
                                            <p className='mb-1 fw-bold'><small>Age</small></p>
                                            <p className="my-1"><small>{pet?.age}</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Card className='border bg-light shadow mt-4 rounded-3'>
                                <Card.Body className='text-gray'>

                                    <p className='fw-bold mb-1'><small>Vaccines:</small></p>
                                    <p className='mt-1'>
                                        <small>
                                            {
                                                pet && pet?.vaccinations.map((vaccination, index) => (
                                                    <span key={index}>{vaccination.vaccine.name} {`${index + 1 === pet.vaccinations.length ? "" : ","}`}</span>
                                                ))
                                            }
                                        </small>
                                    </p>
                                    <p className='fw-bold'><small>Description:</small></p>
                                    <p style={{ textAlign: "justify" }}>
                                        <small>
                                            {pet?.description}
                                        </small>
                                    </p>
                                </Card.Body>
                            </Card>
                            <hr />
                            <div className="text-center text-gray mt-4">
                                {
                                    isUserRestricted ? (
                                        <Alert variant="warning">
                                            <small><i className='bx bx-info-circle'></i> Sorry, Adoption is only available for users within Batangas area.</small>
                                        </Alert>
                                    ) : (
                                        <>
                                            <p className='fw-bold'>Adopt and share {pet?.name} a home.</p>
                                            <Button disabled={isUserRestricted} onClick={()=>adoptPet(pet)} type='button' variant='success' size="sm" className='text-uppercas px-3 py-2 text-light'>
                                                <i className='bx bx-donate-heart bx-md'></i>
                                                <br />
                                                Adopt Pet
                                            </Button>
                                        </>
                                    )
                                }
                            </div>

                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default PetDetails