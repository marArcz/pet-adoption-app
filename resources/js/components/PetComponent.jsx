import React from 'react'
import { Button, Card, Dropdown } from 'react-bootstrap';
import { showSuccessToast } from './ToastNotification';

const PetComponent = ({ pet, viewInfo, onRemove, onUpdate,updateStatus }) => {
    // const mainPhoto = pet.photos.filter((photo) =>{
    //     return photo.is_main === 1
    // })[0]
    

    return (
        <div>
            <Card bg="light" className="rounded position-relative">
                {/* <Dropdown.Toggle as={Button} type="button"  variant="default" className='bg-warning border-0 pt-2 text-dark rounded-2 shadow-smbg-opacity-75'><i className='material-icons'>settings</i></Drop> */}
                <Dropdown align="end" className='position-absolute end-0 top-0'>
                    <Dropdown.Toggle as={Button} type="button" variant="default" className='no-icon bg-warning border-0 pt-2 text-dark rounded-2 shadow-sm bg-opacity-75'>
                        <i className='material-icons'>settings</i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='shadow'>
                        <Dropdown.Item as="button" onClick={() => onRemove(pet.id)}><small>Remove</small></Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => onUpdate(pet)}><small>Manage / Update</small></Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => viewInfo(pet)}><small>View Information</small></Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => updateStatus(pet)}><small>Update Status</small></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Card.Img loading='lazy' variant="top" draggable={false} src={pet.photos[0].src} style={{ maxHeight: "300px", minHeight: "300px" }} />
                <Card.Body className=" border-secondary border-2 border-start">
                   
                    <div className="d-flex align-items-center mb-0">
                        <div className="">
                            <h5 className="card-text my-1">{pet.name}</h5>
                            <p className="my-1 card-text text-gray fw-bold"><small>{pet.breeds[0].details.name}</small></p>
                        </div>
                        <div className="text-end ms-auto">
                            <p className="my-1 card-text text-gray">
                                <i className="material-icons">{pet.gender.toLowerCase()}</i>
                            </p>
                            <p className="my-1 card-text text-gray"><small>{pet.age}</small></p>
                        </div>
                    </div>
                    <p className="text-black-50 mb-0"><small>{pet.address}</small></p>
                    <div className={`badge ${pet.status === 1?'bg-success':'bg-warning text-dark'}`}>
                        {pet.status === 1?'Available':'Adopted'}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PetComponent
