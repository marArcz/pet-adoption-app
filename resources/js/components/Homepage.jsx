import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AddPetPage from './AddPetPage'
import AdoptersPage from './AdoptersPage'
import AnimalTypes from './AnimalTypes'
import ApplicationsPage from './ApplicationsPage'
import { AdminApi, PetsApi } from './BackendApi'
import BreedsPage from './BreedsPage'
import DashboardComponent from './DashboardComponent'
import HeaderComponent from './HeaderComponent'
import ManageVaccines from './ManageVaccines'
import PetsPage from './PetsPage'
import PreloaderComponent from './PreloaderComponent'
import ScheduleSettings from './ScheduleSettings'
import SchedulesPage from './SchedulesPage'
import SidebarComponent from './SidebarComponent'
import { sidebarMenus } from './SideBarMenuItems'
import { showErrorToast, showSuccessToast } from './ToastNotification'
import UpdateAccountModal from './UpdateAccountModal'
import UpdateBreeds from './UpdateBreeds'
import { getSessionToken, setSessionToken } from './UserSession'
import VaccinesPage from './VaccinesPage'
import ViewApplication from './ViewApplication'

const Homepage = () => {
    const location = useLocation();
    const [activeKey, setActiveKey] = useState(location.pathname)
    const [unFilteredPetList, setUnFilteredPetList] = useState([])
    const [petList, setPetList] = useState(null)
    const [categories, setCategories] = useState([])
    const [showPreloader, setShowPreloader] = useState(false)
    const [categoryId, setCategoryId] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [admin, setAdmin] = useState({});
    const [isPetLoaded, setIsPetLoaded] = useState(false)
    const [showUpdateAccountModal, setShowUpdateAccountModal] = useState(false)
    const [scheduleDays, setScheduleDays] = useState([])
    const [adoptersCount, setAdoptersCount] = useState(0)
    const [isPetsLoading, setisPetsLoading] = useState(false)
    const [showAvailablePets, setShowAvailablePets] = useState(true)
    const [showAdoptedPet, setShowAdoptedPet] = useState(false)
    const navigate = useNavigate()

    const loadAdmin = () => {
        var token = getSessionToken()
        if (token === null) {
            navigate("/")
            showErrorToast("You need to sign in first!");
        } else {
            console.log("token: ", token)

            AdminApi.getCurrentAdmin(token)
                .then(res => {
                    console.log("homepage admin: ", res)
                    if (res.status === 200) {
                        setAdmin(res.data);
                    } else {
                        navigate("/")
                        showErrorToast("Login session has expired, you need to sign in!");
                        setSessionToken(null)
                    }
                })
        }
    }

    const loadCategories = () => {
        axios.get("/categories")
            .then((res) => {
                setCategories(res.data);
                console.log("categories: ", res)
            })
    }

    const filterOutAvailablePets = (list) => {
        return list.filter((pet) => {
            return pet.status !== 1
        })
    }
    const filterOutAdoptedPets = (list) => {
        return list.filter((pet) => {
            return pet.status !== 0
        })
    }

    const loadPets = async () => {
        if (location.pathname === "/success/pets" && !isPetLoaded) {
            setShowPreloader(true);

        }
        setisPetsLoading(true)
        let pets = await PetsApi.getAll(categoryId)
        setUnFilteredPetList(pets)
        var list = pets

        if (!showAvailablePets) {
            list = filterOutAvailablePets(list)
        }
        if (!showAdoptedPet) {
            list = filterOutAdoptedPets(list)
        }


        setPetList(list)

        setIsPetLoaded(true)
        if (location.pathname === "/success/pets" && !isPetLoaded) {
            setShowPreloader(false);
        }
        setisPetsLoading(false)
    }

    const loadScheduleDays = () => {
        axios.get("/schedules/days")
            .then(res => {
                setScheduleDays(res.data)
            })
    }

    useEffect(() => {
        console.log('category changed:')
        loadPets()
    }, [categoryId])

    useEffect(() => {
        loadAdmin()
        loadPets()
        loadCategories()
        loadScheduleDays()
    }, [])

    useEffect(() => {
        if (petList) {
            var list = unFilteredPetList

            if (!showAvailablePets) {
                list = filterOutAvailablePets(list)
            }
            if (!showAdoptedPet) {
                list = filterOutAdoptedPets(list)
            }

            setPetList(list)
        }
    }, [showAvailablePets, showAdoptedPet])

    useEffect(() => {
        document.querySelector("main").scrollTo({
            top: 0,
            behavior: 'smooth'
        });


        console.log("location: ", location);
        setActiveKey(location.pathname)
        setIsSidebarOpen(false)
        let title = ""
        switch (location.pathname) {
            case "/success":
                title = "Dashboard"
                break;
            case "/success/pets":
                title = "Pets"
                break
            case "/success/pets/add":
                title = "Add New Pet"
                break
            default:
                title="Admin Panel"
        }
        document.title = title

    }, [location])


    const StatsCard = ({
        title,
        value,
        bg,
        txtColor = "text-dark",
        icon,
    }) => {
        return (
            <div className={`card shadow mb-2 border-0 ${bg} ${txtColor} rounded-0`}>
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div className="me-auto">
                            <p className="my-0 fs-6 fw-light">
                                <i className={icon}></i> {title}
                            </p>
                        </div>
                        <div className="">
                            <p className=" fs-5 my-0 fw-light">{value}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const isDayAccepting = (day) => {
        for (let schedDay of scheduleDays) {
            if (schedDay.day == day) {
                return true;
            }
        }

        return false;
    }

    const onUpdateSubmit = (account) => {
        setShowUpdateAccountModal(false)
        setShowPreloader(true)
        AdminApi.update(account)
            .then((res) => {
                setShowPreloader(false)
                if (res.status === 200) {
                    showSuccessToast("Successfully updated Account")
                    loadAdmin();
                } else {
                    showErrorToast("Something went wrong, please try again!");
                }
            })
    }

    return (
        <>
            <ToastContainer />
            <SidebarComponent
                activeKey={activeKey}
                sidebarMenus={sidebarMenus}
                admin={admin}
                open={isSidebarOpen}
            />
            <HeaderComponent admin={admin} onSideBarToggle={() => setIsSidebarOpen(!isSidebarOpen)} onUpdateAccount={() => setShowUpdateAccountModal(true)} />

            <main onClick={() => setIsSidebarOpen(false)} className="home full-h bg-light rounded-5">
                <Container className="h-100 mt-4 mb-3 ">
                    <Routes>
                        <Route path="/" element={<DashboardComponent petCount={petList ? petList.length : 0} />} />
                        <Route path="/pets" element={<PetsPage showAdoptedPet={showAdoptedPet} showAvailablePet={showAvailablePets} setShowAdoptedPet={setShowAdoptedPet} setShowAvailablePet={setShowAvailablePets} isPetsLoading={isPetsLoading} categoryId={categoryId} onCategoryChange={setCategoryId} categories={categories} onPetsUpdate={loadPets} petList={petList} />} />
                        <Route path="/pets/add" element={<AddPetPage onPetsUpdate={loadPets} />} />
                        <Route path="/breeds" element={<BreedsPage />} />
                        <Route path="/vaccines" element={<VaccinesPage />} />
                        <Route path="/vaccines/:categoryId" element={<ManageVaccines />} />
                        <Route path="/breeds/:categoryId" element={<UpdateBreeds />} />
                        <Route path="/types" element={<AnimalTypes onCategoryUpdate={loadCategories} />} />
                        <Route path="/adopters" element={<AdoptersPage />} />
                        <Route path="/schedules" element={<SchedulesPage />} />
                        <Route path="/schedules-settings" element={<ScheduleSettings scheduleDays={scheduleDays} loadScheduleDays={loadScheduleDays} />} />
                        <Route path="/applications" element={<ApplicationsPage onPetsUpdate={loadPets} />} />
                        <Route path="/applications/:id" element={<ViewApplication />} />
                    </Routes>
                </Container>
            </main>
            <PreloaderComponent show={showPreloader} />
            {
                admin && Object.keys(admin).length === 0 && Object.getPrototypeOf(admin) === Object.prototype ?
                    null : (
                        <UpdateAccountModal show={showUpdateAccountModal} handleClose={() => setShowUpdateAccountModal(false)} account={admin} handleSubmit={onUpdateSubmit} />

                    )
            }
        </>
    )
}

export default Homepage
