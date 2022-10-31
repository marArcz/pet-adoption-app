import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row, Button, Badge } from 'react-bootstrap';
import Creatable from 'react-select/creatable';
import PreloaderComponent from './PreloaderComponent'
import { BreedsApi, CategoryApi, PetsApi, VaccineApi } from './BackendApi';
import { showErrorToast, showSuccessToast } from './ToastNotification'
import { ToastContainer } from 'react-toastify';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const AddPetPage = ({ onPetsUpdate }) => {

    const [categoryId, setCategoryId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("Male")
    const [address, setAddress] = useState("")
    const [categories, setCategories] = useState([])
    const [showAddCategory, setShowAddCategory] = useState(false)
    const [showAddBreed, setShowAddBreed] = useState(false)
    const [breedIds, setBreedIds] = useState([]);
    const [images, setImages] = useState([])
    const [breeds, setBreeds] = useState([])
    const [vaccines, setVaccines] = useState([])
    const [vaccineOptionList, setVaccineOptionList] = useState([])
    const [selectedVaccines, setSelectedVaccines] = useState([])
    const [vaccineIds, setVaccineIds] = useState([])
    const [isVaccinesLoading, setIsVaccinesLoading] = useState(false)
    const [breedOptionList, setBreedOptionList] = useState([])
    const [categoryOptionList, setCategoryOptionList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isCategoryLoading, setIsCategoryLoading] = useState(true)
    const [selectedBreeds, setSelectedBreeds] = useState([])
    const [isBreedsLoading, setIsBreedsLoading] = useState(false)
    const [showPreloader, setShowPreloader] = useState(false)


    const handleImageDrag = (result) => {
        if (!result.destination) return;
        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setImages(items)
    }

    const loadCategories = () => {
        axios.get("/categories")
            .then((res) => {
                let categories = res.data;

                let list = categories.map((category, i) => {
                    return {
                        label: category.name,
                        value: category.id
                    }
                })

                setCategoryOptionList(list)
                setIsCategoryLoading(false)
            })
    }
    const loadBreeds = async (categoryId) => {
        setIsBreedsLoading(true);
        let breeds = await BreedsApi.getAll(categoryId);
        console.log("Breeds: ", breeds)
        let list = breeds.map((breed, i) => {
            return {
                value: breed.id,
                label: breed.name
            }
        })

        setBreedOptionList(list)

        setIsBreedsLoading(false)
    }
    const loadVaccines = async (categoryId) => {
        setIsVaccinesLoading(true)
        let vaccines = await VaccineApi.getAll(categoryId);
        let options = vaccines.map((vaccine, i) => {
            return {
                label: vaccine.name,
                value: vaccine.id
            }
        })

        setVaccineOptionList(options)
        setIsVaccinesLoading(false)
    }
    useEffect(() => {
        let ids = selectedVaccines.map((vaccine, i) => {
            return vaccine.value
        })

        setVaccineIds(ids);
    }, [selectedVaccines]);

    useEffect(() => {
        let ids = selectedBreeds.map((breed, i) => {
            return breed.value
        })

        setBreedIds(ids);
    }, [selectedBreeds]);


    useEffect(() => {
        setBreedOptionList([])
        setVaccineOptionList([])
        setSelectedBreeds([])
        setSelectedVaccines([])
        if (categoryId !== "" && categoryId !== undefined) {
            loadBreeds(categoryId)
            loadVaccines(categoryId)
        }
    }, [categoryId])

    useEffect(() => {
        if (selectedCategory) {
            setCategoryId(selectedCategory.value)
        }
    }, [selectedCategory])
    useEffect(() => {
        loadCategories();
    }, [])

    const onNewCategoryAdded = (categoryId) => {
        loadCategories();
        setCategoryId(categoryId)
        console.log("new added: ", categoryId)
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
            let optionList = [...categoryOptionList, newOption];
            setCategoryOptionList(optionList);
            setSelectedCategory(newOption)
        } else {
            showErrorToast("Error cannot add category!")
        }
        setIsCategoryLoading(false)
    }
    const onCreateBreed = async (name) => {
        setIsBreedsLoading(true)
        let res = await BreedsApi.insert(name, categoryId);

        if (res.status === 200) {
            showSuccessToast("New Breed added!");

            let newBreed = { label: res.data.breed.name, value: res.data.breed.id };
            let selected = [...selectedBreeds, newBreed]
            let newList = [...breeds, newBreed]
            setBreedOptionList(newList)
            setSelectedBreeds(selected);
        } else {
            showErrorToast("Error: " + res.message)
        }
        setIsBreedsLoading(false)
    }

    const onCreateVaccine = async (name) => {
        setIsVaccinesLoading(true)
        let res = await VaccineApi.insert(name, categoryId);

        if (res.status === 200) {
            showSuccessToast("New vaccine added!");
            let newVaccine = {
                label: res.data.vaccine.name,
                value: res.data.vaccine.id
            }
            let newOptions = [...vaccineOptionList, newVaccine];
            let selected = [...selectedVaccines, newVaccine];
            setVaccineOptionList(newOptions);
            setSelectedVaccines(selected);
            setIsVaccinesLoading(false)
        }
    }

    const onNewBreedAdded = (breedId) => {
        loadBreeds(categoryId);
        setShowAddBreed(false)
        // setBreedId(breedId)
    }
    const onFileSelect = (e) => {
        let files = e.target.files
        let list = [...images]
        console.log("files: ", files)
        for (let file of files) {
            list.push(file)

        }

        setImages(list)
    }
    const removeImage = (index) => {
        let list = images.filter((img, i) => {
            return i !== index
        })

        setImages(list)
    }
    const clearForm = () =>{
        setName("")
        setAge("")
        setDescription("")
        setAddress("")
        setSelectedCategory(null)
        setSelectedBreeds([])
        setSelectedVaccines([])
        setImages([])
    }
    const onFormSubmit = (e) => {
        e.preventDefault();

        if (images.length == 0) {
            showErrorToast("Please add a pet photo!");
            return
        }
        setShowPreloader(true)
        PetsApi.insert({
            name,
            age,
            description,
            gender,
            address,
            categoryId,
            breedIds,
            vaccineIds,
            photos: images
        })
            .then(res => {
                if (res.status === 200) {
                    showSuccessToast("New pet added!")
                    clearForm()
                } else {
                    showErrorToast("Error: " + res.message)
                    console.log("error: ", res)
                }
                setShowPreloader(false)
                onPetsUpdate();
            })

    }

    return (
        <div className='pt-2 pb-4'>
            <ToastContainer />
            <h5 className="mb-3 text-success">
                Add New Pet
            </h5>
            <hr />

            <Row >
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <p className='fw-bold form-text'>Pet Details</p>

                            <Form onSubmit={onFormSubmit}>
                                <Row>
                                    <Col>
                                        <div className="mb-3">
                                            <Form.Label className='text-dark fw-bold'>Pet Name:</Form.Label>
                                            <Form.Control autoFocus value={name} onChange={e => setName(e.target.value)} type='text' placeholder='Name of pet...' required />
                                        </div>
                                    </Col>
                                    <Col>
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
                                    <Creatable placeholder="Select One..." value={selectedCategory} isLoading={isCategoryLoading} options={categoryOptionList} onCreateOption={onCreateCategory} onChange={setSelectedCategory} />
                                </div>
                                <Row>
                                    <Col md>
                                        <div className="mb-3">
                                            <Form.Label className='text-dark fw-bold'>Breed:</Form.Label>
                                            <Creatable placeholder="You may select one or more..." isDisabled={selectedCategory === null} isLoading={isBreedsLoading} onCreateOption={onCreateBreed} options={breedOptionList} isMulti={true} value={selectedBreeds} onChange={setSelectedBreeds} />
                                        </div>
                                    </Col>
                                    <Col md>
                                        <div className="mb-3">
                                            <Form.Label className='text-dark fw-bold'>Vaccines:</Form.Label>
                                            <Creatable placeholder="You may select one or more..." isDisabled={selectedCategory === null} isLoading={isVaccinesLoading} onCreateOption={onCreateVaccine} options={vaccineOptionList} isMulti={true} value={selectedVaccines} onChange={setSelectedVaccines} />
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
                                                                    images && images.map((img, index) => (
                                                                        <Draggable key={index} draggableId={`pet-img-${index}`} index={index}>
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
                                                                                            <Button type="button" onClick={() => removeImage(index)} variant="secondary" className='p-1 py-0 rounded-0 position-absolute end-0 top-0 bg-opacity-25'><i className='m-0 bx bx-x'></i></Button>
                                                                                        </div>
                                                                                        <Card.Img variant="top" src={URL.createObjectURL(img)} />
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
                                <Button variant='secondary' className='ms-2' type='button' onClick={clearForm}>Reset</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <PreloaderComponent show={showPreloader} />
        </div>
    )
}

export default AddPetPage
