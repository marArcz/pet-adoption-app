import PetsPage from './components/PetsPage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import CategoryList from './components/CategoryList';
import NavbarComponent from './components/NavbarComponent';
import PetComponent from './components/PetComponent';
import PetDetails from './components/PetDetails';
import { getSessionToken } from './UserSession';
import AdoptionPage from './components/AdoptionPage';
import ApplicationsPage from './components/ApplicationsPage';
import DonationPage from './DonationPage';
import ViewApplication from './components/ViewApplication';
import AccountPage from './components/AccountPage';
import InactivePage from './components/InactivePage';

const Home = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [adopter, setAdopter] = useState({})

    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [petList, setPetList] = useState([])
    const [isPetsLoading, setIsPetsLoading] = useState(false)
    const [isUserRestricted, setIsUserRestricted] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const loadUser = () => {
        let token = getSessionToken();
        let config = {
            headers: {
                authorization: `Bearer ${token}`,
                accept: 'application/json'
            }
        }

        axios.get("/adopters/me", config)
            .then((res) => {
                setIsSignedIn(true)
                console.log("me:", res)
                setAdopter(res.data)
                if (res.data.status === 0) {
                    navigate('/deactivated')
                }
                // if user location is not in batangas area, restrict user
                setIsUserRestricted(res.data.state.toLowerCase() !== "batangas");

            })
            .catch(err => {
                setIsSignedIn(false)
                console.log("me err: ", err)
            })
    }

    useEffect(() => {
        loadUser();
    }, [])

    const loadCategories = () => {
        axios.get("/categories")
            .then(res => {
                console.log("categories: ", res)
                setCategoryList(res.data)
            })
    }

    useEffect(() => {
        loadCategories();

    }, [])

    

    useEffect(() => {
        let categoryId = selectedCategory?.id;
        console.log("categoryId: ", categoryId)

        setIsPetsLoading(true)
        if (categoryId) {
            axios.get(`/pets/${categoryId}`)
                .then(res => {
                    setIsPetsLoading(false)
                    let list = res.data.filter(pet=>{
                        return pet.status === 1
                    })
                    console.log('pets list: ', list)

                    setPetList(list);
                })
        }else{
            axios.get(`/pets`)
                .then(res => {
                    setIsPetsLoading(false)
                    let list = res.data.filter(pet=>{
                        return pet.status === 1
                    })
                    setPetList(list);
                    console.log('pets: ', res)
                })
        }
    }, [selectedCategory])

    useEffect(() => {
        document.querySelector("main").scrollTo({
            top: 0,
            behavior: 'smooth'
        });


        // console.log("location: ", location);
        // setActiveKey(location.pathname)
        // setIsSidebarOpen(false)
        // let title = ""
        // switch (location.pathname) {
        //     case "/success":
        //         title = "Dashboard"
        //         break;
        //     case "/success/pets":
        //         title = "Pets"
        //         break
        //     case "/success/pets/add":
        //         title = "Add New Pet"
        //         break
        // }
        // document.title = title

    }, [location])

    return (
        <>
            <NavbarComponent isSignedIn={isSignedIn} adopter={adopter} />
            <main>
                <Container className='my-5'>
                    <Routes>
                        <Route path='/adoption/:id' element={<AdoptionPage adopter={adopter} isUserRestricted={isUserRestricted} />} />
                        <Route path='/view-pet/:id' element={<PetDetails isSignedIn={isSignedIn} isUserRestricted={isUserRestricted} />} />
                        <Route path='/applications' element={<ApplicationsPage adopter={adopter} />} />
                        <Route path='/applications/view/:id' element={<ViewApplication />} />
                        <Route path='/donation' element={<DonationPage />} />
                        <Route path='/account' element={<AccountPage />} />

                        <Route path='/' element={<PetsPage isUserRestricted={isUserRestricted} categoryList={categoryList} selectedCategory={selectedCategory} handleSelect={(category) => setSelectedCategory(category)} isPetsLoading={isPetsLoading} petList={petList} />} />
                    </Routes>
                </Container>
            </main>
        </>
    )
}

export default Home