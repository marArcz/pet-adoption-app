import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PetsApi } from './BackendApi'
import PetComponent from './PetComponent'
import PetFilterMenuComponent from './PetFilterMenuComponent'
import PreloaderComponent from './PreloaderComponent'
import { showErrorToast, showSuccessToast } from './ToastNotification'
import Swal from 'sweetalert2'
import PetInfoModal from './PetInfoModal'
import UpdateModal from './UpdateModal'
import StatusModal from './StatusModal'
import axios from 'axios'

const PetsPage = ({ petList, onPetsUpdate, categoryId, onCategoryChange, categories, isPetsLoading,showAdoptedPet,showAvailablePet,setShowAdoptedPet,setShowAvailablePet }) => {
    const [showPreloader, setShowPreloader] = useState(false)
    const [showPetInfoModal, setShowPetInfoModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [petInfo, setPetInfo] = useState(null)
    const [petToUpdate, setPetToUpdate] = useState(null)
    const [searchResult, setSearchResult] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [localPetList, setLocalPetList] = useState(petList)
    const [petsLoaded, setPetsLoaded] = useState(false)
    const onRemove = (petId) => {
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
                PetsApi.delete(petId)
                    .then(res => {
                        onPetsUpdate()
                        setShowPreloader(false)
                        showSuccessToast("Pet deleted successfully!");

                    })
                    .catch(err => {
                        showErrorToast(res.data.message)
                    })
            }
        })

    }

    const viewInfo = (pet) => {
        console.log("viewInfo: ", pet)
        setShowPetInfoModal(true)
        setPetInfo(pet)
    }

    const closePetInfoModal = () => {
        setPetInfo(null)
        setShowPetInfoModal(false)
    }

    const closeUpdateModal = () => {
        setPetToUpdate(null)
        setShowUpdateModal(false)
    }
    const onUpdate = (pet) => {
        console.log("pet to update: ", pet)
        setPetToUpdate(pet)
        setShowUpdateModal(true)
    }

    const onSavePet = async (info) => {
        setShowPreloader(true)
        const { id, name, age, description, gender, address, categoryId, breedIds, vaccineIds, newImages, oldImages, originalImages, selectedImages } = info
        let mainPhoto = selectedImages[0]

        // update pet photos
        for (let image of originalImages) {
            if (!oldImages.includes(image)) {
                await PetsApi.deletePhoto(image.id);
            }
        }
        if (newImages.length > 0) {
            if (newImages.includes(mainPhoto)) {
                await PetsApi.addPhotos(id, newImages, true)
            } else {
                await PetsApi.addPhotos(id, newImages)
            }

        }

        if (oldImages.includes(mainPhoto)) {
            let image = oldImages[oldImages.indexOf(mainPhoto)]
            // pass petId and image id
            await PetsApi.setMainPhoto(id, image.id)
        }

        PetsApi.update({
            id, name, age, description, gender, address, categoryId, breedIds, vaccineIds
        })
            .then(res => {
                console.log("adding pet: ", res)
                if (res.status === 200) {
                    showSuccessToast("Successfully updated pet!");
                    setShowUpdateModal(false)
                    onPetsUpdate().then(res => {
                        setPetToUpdate(null)
                        setShowPreloader(false)

                    })


                } else {
                    showErrorToast("Error, cannot update pet!");

                }
            })

    }

  
    useEffect(()=>{
        setLocalPetList(petList)
    },[])
    

    

    useEffect(() => {
        setLocalPetList([])
    }, [categoryId])

    useEffect(() => {
        if (searchText === "") {
            setSearchResult(false)
            setIsSearching(false)
        } else {
            setShowPreloader(true)
            setIsSearching(true)
            let list = petList.filter((pet) => {
                return pet.name.toLowerCase().search(searchText.toLowerCase()) > -1
            })

            setSearchResult(list);
            setShowPreloader(false)
        }
    }, [searchText, petList])

    const updateStatus = (pet) => {
        setShowStatusModal(true)
        setPetToUpdate(pet)
    }



    return (
        <div className="py-2">
            <div className="py-2">
                <h4 className="mb-3 text-success">
                    <i className="material-icons">pets</i> Pets
                </h4>
                <hr />
                <div className="d-flex">
                    {/* <Form.Check type={"checkbox"} id="select-all" label="SELECT ALL" /> */}
                    <p className="my-1 fw-bold text-gray">Manage Pets</p>
                    <div className="ms-auto">
                        <Link to="/success/pets/add" className="btn btn-poppy text-light" type="button">Add New</Link>
                    </div>
                </div>
                <div className="my-2">
                    <Row>
                        <Col className="col-md-5">
                            <div className="search-input-group">
                                <i className="search-icon bx bx-search text-gray"></i>
                                <Form.Control
                                    onChange={e => setSearchText(e.target.value)}
                                    className="border- bg-white text-gray"
                                    placeholder="Search pet to manage"
                                    type="text"
                                    value={searchText}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="pets-container mb-3 pt-2">
                    <PetFilterMenuComponent categories={categories} onSelect={onCategoryChange} categoryId={categoryId} />
                    <div className="mt-3">
                        <div className="d-flex flex-wrap align-items-center">
                            <Form.Label className='me-3'>Filter:</Form.Label>
                            <small>
                                <Form.Check
                                    type="checkbox"
                                    id={`available-checkbox`}
                                    label={`Available`}
                                    className="me-3"
                                    checked={showAvailablePet}
                                    onChange={() => setShowAvailablePet(!showAvailablePet)}
                                />
                            </small>
                            <small>
                                <Form.Check
                                    type="checkbox"
                                    id={`adopted-checkbox`}
                                    label={`Adopted`}
                                    checked={showAdoptedPet}
                                    onChange={() => setShowAdoptedPet(!showAdoptedPet)}
                                />
                            </small>

                        </div>
                    </div>
                    {
                        isSearching ? (
                            <div className="mt-3 text-start">
                                <Button className='text-poppy d-flex align-items-center' onClick={() => setSearchText("")} size='sm' variant='default'><i className="material-icons fs-6 me-1">close</i> Clear Search</Button>
                            </div>
                        ) : null
                    }
                    {
                        isPetsLoading ? (
                            <div className='text-center mt-5'>
                                <Spinner size="sm" role="status" animation='border'>

                                </Spinner>
                            </div>
                        ) : (
                            petList && !isSearching ? (
                                <>
                                    {
                                        petList.length > 0 ? (
                                            <Row className="gy-3 mt-2 row-cols-lg-3 row-cols-md-2 row-cols-1">
                                                {petList.map((pet, index) => (
                                                    <Col key={index}>
                                                        <PetComponent onUpdate={onUpdate} updateStatus={updateStatus} onRemove={onRemove} pet={pet} viewInfo={viewInfo} />
                                                    </Col>
                                                ))
                                                }
                                            </Row>
                                        ) : (
                                            <div className="text-center mt-3">
                                                <p className='text-gray'>No pets record found.</p>
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        searchResult && searchResult.length > 0 ? (
                                            <Row className="gy-3 mt-2 row-cols-lg-3 row-cols-md-2 row-cols-1">
                                                {searchResult.map((pet, index) => (
                                                    <Col key={index}>
                                                        <PetComponent onUpdate={onUpdate} updateStatus={pet => updateStatus(pet)} onRemove={onRemove} pet={pet} viewInfo={viewInfo} />
                                                    </Col>
                                                ))
                                                }
                                            </Row>
                                        ) : (
                                            <p className="text-center mt-5 text-gray">No result found.</p>
                                        )
                                    }
                                </>
                            )
                        )
                    }

                </div>

            </div>
            <PreloaderComponent show={showPreloader} />
            {petInfo !== null ? (<PetInfoModal pet={petInfo} show={showPetInfoModal} handleClose={closePetInfoModal} />) : null}
            {petToUpdate !== null && showUpdateModal ? (<UpdateModal handleSubmit={onSavePet} pet={petToUpdate} show={showUpdateModal} handleClose={closeUpdateModal} />) : null}
            {
                petToUpdate && (
                    <StatusModal show={showStatusModal} handleClose={() => setShowStatusModal(false)} onPetsUpdate={onPetsUpdate} pet={petToUpdate} />
                )
            }
        </div>
    )
}

export default PetsPage
