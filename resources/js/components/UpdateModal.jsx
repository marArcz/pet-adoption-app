import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row, Spinner, Button, Card, Badge } from 'react-bootstrap'
import Creatable from 'react-select/creatable';
import { BreedsApi, CategoryApi, VaccineApi } from './BackendApi'
import PreloaderComponent from './PreloaderComponent'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { showErrorToast, showSuccessToast } from './ToastNotification';

const UpdateModal = ({ show, handleClose, pet, handleSubmit }) => {
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [description, setDescription] = useState("")
    const [gender, setGender] = useState("")
    const [address, setAddress] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedBreeds, setSelectedBreeds] = useState([])
    const [selectedVaccines, setSelectedVaccines] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
    const [breedsOptions, setBreedsOptions] = useState([])
    const [vaccinesOptions, setVaccinesOptions] = useState([])
    const [breedIds, setBreedIds] = useState([])
    const [vaccineIds, setVaccineIds] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [originalImages, setOriginalImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [newImages, setNewImages] = useState([])
    const [selectedImages, setSelectedImages] = useState([])
    const [isCategoryLoading, setIsCategoryLoading] = useState(true)
    const [isBreedsLoading, setIsBreedsLoading] = useState(false)
    const [isVaccinesLoading, setIsVaccinesLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const loadCategories = async () => {
        setIsCategoryLoading(true)
        let categories = await CategoryApi.getAll()
        let list = categories.map((category, index) => {
            return {
                label: category.name,
                value: category.id
            }
        })
        setCategoryOptions(list)
        setIsCategoryLoading(false)
    }

    const loadBreeds = (categoryId) => {
        setIsBreedsLoading(true)
        BreedsApi.getAll(categoryId).then(res => {
            let breeds = res;
            let list = breeds.map((breed, index) => {
                return {
                    label: breed.name,
                    value: breed.id
                }
            })

            setBreedsOptions(list)
            setIsBreedsLoading(false)
        })
    }
    const loadVaccines = (categoryId) => {
        setIsVaccinesLoading(true)
        VaccineApi.getAll(categoryId).then(res => {
            let vaccines = res;
            let list = vaccines.map((vaccine, index) => {
                return {
                    label: vaccine.name,
                    value: vaccine.id
                }
            })

            setVaccinesOptions(list);
        })
        setIsVaccinesLoading(false)
    }

    const loadPetInfo = () => {
        let category = {
            label: pet.category.name,
            value: pet.category.id
        }
        setSelectedCategory(category);
        let breeds = pet.breeds.map((breed) => {
            return {
                value: breed.details.id,
                label: breed.details.name
            }
        })
        setSelectedBreeds(breeds);
        let vaccines = pet.vaccinations.map((vaccination) => {
            return {
                label: vaccination.vaccine.name,
                value: vaccination.vaccine.id
            }
        })
        setSelectedVaccines(vaccines)
        setName(pet.name)
        setAge(pet.age)
        setDescription(pet.description)
        setGender(pet.gender)
        setAddress(pet.address)

        let images = pet.photos;
        setOriginalImages(images);
        setSelectedImages(images)
        setOldImages(images)

    }

    useEffect(() => {
        let ids = selectedBreeds.map((breed, i) => {
            return breed.value
        })

        setBreedIds(ids)
    }, [selectedBreeds])

    useEffect(() => {
        let ids = selectedVaccines.map((vaccine, i) => {
            return vaccine.value
        })

        setVaccineIds(ids)
    }, [selectedVaccines])

    useEffect(() => {
        setIsLoading(true);
        const loadAll = async () => {
            await loadCategories();
            loadPetInfo();
            setIsLoading(false)
            document.getElementById('edit-pet-name').focus()
        }

        loadAll();
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            loadBreeds(selectedCategory.value)
            loadVaccines(selectedCategory.value)
        }
    }, [selectedCategory])

    const removeFromOldImage = (index) => {
        let list = oldImages.filter((img, i) => {
            return img !== selectedImages[index]
        })

        setOldImages(list)
        removeFromSelectedImages(index)
    }
    const removeFromNewImage = (index) => {
        let list = newImages.filter((img, i) => {
            return img !== selectedImages[index]
        })
        setNewImages(list)
        removeFromSelectedImages(index)
    }
    const removeFromSelectedImages = (index) => {
        let list = selectedImages.filter((img, i) => {
            return i !== index
        })
        setSelectedImages(list)
        console.log("selected: ", selectedImages)
        console.log("old: ", oldImages)
    }
    const onFileSelect = (e) => {
        let files = e.target.files
        let list = []
        console.log("files: ", files)
        for (let file of files) {
            list.push(file)
        }

        setNewImages([...newImages, ...list])
        setSelectedImages([...selectedImages, ...list])
    }


    const onCreateCategory = async (inputValue) => {
        setIsCategoryLoading(true)
        let res = await CategoryApi.insert(inputValue);
        if (res.status === 200) {
            showSuccessToast("New category added!");
            let newOption = {
                label: res.data.category.name,
                value: res.data.category.id
            }
            let optionList = [...categoryOptions, newOption];
            setCategoryOptions(optionList);
            setSelectedCategory(newOption)
        } else {
            showErrorToast("Error cannot add category!")
        }
        setIsCategoryLoading(false)
    }
    const onCreateBreed = async (name) => {
        setIsBreedsLoading(true)
        let res = await BreedsApi.insert(name, selectedCategory.value);

        if (res.status === 200) {
            showSuccessToast("New Breed added!");

            let newBreed = { label: res.data.breed.name, value: res.data.breed.id };
            let selected = [...selectedBreeds, newBreed]
            let newList = [...breedsOptions, newBreed]
            setBreedsOptions(newList)
            setSelectedBreeds(selected);
        } else {
            showErrorToast("Error: " + res.message)
        }
        setIsBreedsLoading(false)
    }

    const onCreateVaccine = async (name) => {
        setIsVaccinesLoading(true)
        let res = await VaccineApi.insert(name, selectedCategory.value);

        if (res.status === 200) {
            showSuccessToast("New vaccine added!");
            let newVaccine = {
                label: res.data.vaccine.name,
                value: res.data.vaccine.id
            }
            let newOptions = [...vaccinesOptions, newVaccine];
            let selected = [...selectedVaccines, newVaccine];
            setVaccinesOptions(newOptions);
            setSelectedVaccines(selected);
            setIsVaccinesLoading(false)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (selectedImages.length == 0) {
            showErrorToast("Please add a pet photo!");
            return
        }
        setIsSubmitting(true)
        await handleSubmit({
            id: pet.id,
            name,
            age,
            description,
            address,
            categoryId: selectedCategory.value,
            breedIds,
            vaccineIds,
            oldImages,
            newImages,
            originalImages,
            gender,
            selectedImages
        })
        setIsSubmitting(false)
    }
    const handleImageDrag = (result) => {
        if (!result.destination) return;
        const items = Array.from(selectedImages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSelectedImages(items)
    }
    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton className='border-0'>
                    <p className="fw-bold"><small>Update Pet Information</small></p>
                </Modal.Header>
                <Modal.Body className="position-relative ">
                    {isLoading ? (
                        <div style={{ zIndex: 100 }} className="d-flex position-absolute top-0 start-0 w-100 h-100 align-items-center justify-content-center bg-light bg-opacity-50">
                            <div className='text-center mb-2 '>
                                <Spinner animation="border" role="status" size='lg' className='me-2 text-success'>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                <p className='mt-3 text-dark'>Please wait</p>
                            </div>
                        </div>
                    ) : null}

                    <Form onSubmit={onSubmit}>
                        <Row>
                            <Col md>
                                <div className="mb-3">
                                    <Form.Label className='text-dark fw-bold'>Pet Name:</Form.Label>
                                    <Form.Control id='edit-pet-name' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </Col>
                            <Col md>
                                <div className="mb-3">
                                    <Form.Label className='text-dark fw-bold'>Age:</Form.Label>
                                    <Form.Control type='text' placeholder='eg. 2 months old' required value={age} onChange={(e) => setAge(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <div className="mb-3">
                            <Form.Label className='text-dark fw-bold'>Description:</Form.Label>
                            <Form.Control as={"textarea"} value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required placeholder='Pet description...' />
                        </div>
                        <Row>
                            <Col md>
                                <div className="mb-3">
                                    <Form.Label className='text-dark fw-bold'>Gender</Form.Label>
                                    <Form.Select required value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col md>
                                <div className="mb-3">
                                    <Form.Label className='text-dark fw-bold'>Address</Form.Label>
                                    <Form.Control autoComplete='true' type='text' required placeholder='Pet location...' value={address} onChange={e => setAddress(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <div className="mb-3">
                            <Form.Label className='text-dark fw-bold'>Type of animal:</Form.Label>
                            <Creatable placeholder="Select One..." value={selectedCategory} isLoading={isCategoryLoading} options={categoryOptions} onCreateOption={onCreateCategory} onChange={setSelectedCategory} />
                        </div>
                        <Row>
                            <Col md>
                                <div className="mb-3">
                                    <Form.Label className='text-dark fw-bold'>Breed:</Form.Label>
                                    <Creatable placeholder="You may select one or more..." isDisabled={selectedCategory === null} isLoading={isBreedsLoading} onCreateOption={onCreateBreed} options={breedsOptions} isMulti={true} value={selectedBreeds} onChange={setSelectedBreeds} />
                                </div>
                            </Col>
                            <Col md>
                                <div className="mb-3">
                                    <Form.Label className='text-dark fw-bold'>Vaccines:</Form.Label>
                                    <Creatable placeholder="You may select one or more..." isDisabled={selectedCategory === null} isLoading={isVaccinesLoading} onCreateOption={onCreateVaccine} options={vaccinesOptions} isMulti={true} value={selectedVaccines} onChange={setSelectedVaccines} />
                                </div>
                            </Col>
                        </Row>
                        <div className="mb-3">
                            <Form.Label className='text-dark fw-bold'>Pet Photos:</Form.Label>
                            <Card className='shadow-sm'>
                                <Card.Body>
                                    <Form.Control type='file' className='d-none' accept='image/*' multiple onChange={onFileSelect} id='file-select' />
                                    <Form.Label htmlFor='file-select' className='m-0 btn btn-secondary btn-sm'>Add Image</Form.Label>
                                    <hr />
                                    <DragDropContext onDragEnd={handleImageDrag}>
                                        <Droppable droppableId='images'>
                                            {
                                                (provided) => (
                                                    <Row {...provided.droppableProps} ref={provided.innerRef}>
                                                        {
                                                            selectedImages && selectedImages.map((img, index) => (
                                                                <Draggable key={index} draggableId={`update-img-${index}`} index={index}>
                                                                    {(provided) => (
                                                                        <Col md={3} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                            <Card className='position-relative'>
                                                                                <div className="">
                                                                                    {
                                                                                        index == 0 ? (
                                                                                            <>
                                                                                                <Badge bg='success' className='main-photo-label'>
                                                                                                    Main Photo
                                                                                                </Badge>
                                                                                            </>
                                                                                        ) : null
                                                                                    }
                                                                                </div>
                                                                                <div className="text-end mb-2">
                                                                                    {
                                                                                        img.src ? (
                                                                                            <Button type="button" onClick={() => removeFromOldImage(index)} variant="secondary" className='p-1 py-0 rounded-0 position-absolute end-0 top-0 bg-opacity-25'><i className='m-0 bx bx-x'></i></Button>
                                                                                        ) : (
                                                                                            <Button type="button" onClick={() => removeFromNewImage(index)} variant="secondary" className='p-1 py-0 rounded-0 position-absolute end-0 top-0 bg-opacity-25'><i className='m-0 bx bx-x'></i></Button>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                                <Card.Img variant="top" src={img.src ? img.src : URL.createObjectURL(img)} />
                                                                            </Card>
                                                                        </Col>
                                                                    )}
                                                                </Draggable>
                                                            ))
                                                        }
                                                        {provided.placeholder}
                                                    </Row>
                                                )
                                            }
                                        </Droppable>
                                    </DragDropContext>
                                </Card.Body>
                            </Card>
                        </div>

                        <Button variant='warning' type='submit'>Submit</Button>
                        <Button variant='secondary' className='ms-2' type='reset'>Reset</Button>

                    </Form>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default UpdateModal
