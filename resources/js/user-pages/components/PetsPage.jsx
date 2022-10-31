import React from 'react'
import { useState, useEffect } from 'react'
import { Col, Form, Row, Image, Button, Alert, ButtonGroup } from 'react-bootstrap'
import CategoryList from './CategoryList';
import PetComponent from './PetComponent';

const PetsPage = ({ categoryList, selectedCategory, handleSelect, isPetsLoading, petList, isUserRestricted }) => {

    const [showMessage, setShowMessage] = useState(false)
    const [notifyRestriction, setNotifyRestriction] = useState(false);
    const [searchText, setSearchText] = useState("")
    const [searchResult, setSearchResult] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingSearch, setIsLoadingSearch] = useState(false)
    useEffect(() => {
        let show = localStorage.getItem("ghrHideUserRestriction") === null
        setNotifyRestriction(show)
    })
    const hideRestrictionMessage = (e) => {
        e.preventDefault();
        localStorage.setItem("ghrHideUserRestriction", "true")
        setNotifyRestriction(false)
    }
    useEffect(() => {
        if (searchText === "") {
            setSearchResult(null)
            setIsSearching(false)
        } else {
            setIsLoadingSearch(true)
            setIsSearching(true)
            let list = petList.filter((pet) => {
                return (
                    pet.name.toLowerCase().search(searchText.toLowerCase()) > -1
                )
            })

            setSearchResult(list);
            setIsLoadingSearch(false)
        }
    }, [searchText, petList])


    return (
        <div>

            <Row className='justify-content-center'>
                <Col md="7">
                    <div className="search-input">
                        <Form.Control size='lg' type='search' value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Search pet to adopt...' className='fs-6' />
                        <i className='icon bx bx-search'></i>
                    </div>
                </Col>
            </Row>
            {
                isUserRestricted && notifyRestriction && (
                    <div className='mt-3'>
                        <Button variant='light' className='text-warning' type='button' onClick={() => setShowMessage(!showMessage)}>
                            <i className='bx bx-info-circle me-2'></i>
                            Important
                        </Button>

                        {
                            showMessage && (
                                <div className="mt-2">
                                    <Alert variant="warning">
                                        <small>We noticed that you are not from our area, adoption features is not available for areas outside Batangas but you can still browse and see our pets!</small>
                                        <a className='ms-2 fw-bold text-gray' href='#' onClick={hideRestrictionMessage}><small>Don't show again</small></a>
                                    </Alert>
                                </div>
                            )
                        }
                    </div>
                )

            }
            <div className="mt-4">
                <CategoryList categoryList={categoryList} handleSelect={handleSelect} selected={selectedCategory} />
            </div>

            <div className="mt-4">
                {
                    isPetsLoading || isLoadingSearch ? (
                        <div className="dots-loader">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    ) :
                        (
                            isSearching ? (
                                <Row className='gx-lg-4  gy-4 row-cols-lg-4 row-cols-md-2 row-cols-1'>
                                    {
                                        searchResult && searchResult.map((pet, index) => (
                                            <Col key={index}>
                                                <PetComponent pet={pet} />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            ) : (
                                petList.length > 0 ? (
                                    <Row className='gx-lg-4  gy-4 row-cols-lg-4 row-cols-md-2 row-cols-1'>
                                        {
                                            petList.map((pet, index) => (
                                                <Col key={index}>
                                                    <PetComponent pet={pet} />
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                ):(
                                    <p className="text-center text-gray fw-bold">
                                        No pets found.
                                    </p>
                                )
                            )
                        )
                }

            </div>
        </div>
    )
}

export default PetsPage