import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import 'animate.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AdminApi } from './BackendApi'
import Homepage from './Homepage'
import PreloaderComponent from './PreloaderComponent'
import SignInPage from './SignInPage'
import SignUpPage from './SignUpPage'
import { showErrorToast, showSuccessToast } from './ToastNotification'
import { removeSessionToken, setSessionToken } from './UserSession'
import VerifyEmailPage from './VerifyEmailPage'
import ScrollToTop from './ScrollToTop';
import PageLoader from '@/user-pages/PageLoader';

const Main = () => {
    // axios.defaults.baseURL = 'https://ghr-api.herokuapp.com/api/';
    axios.defaults.baseURL = 'https://ghr-pet-adoption.herokuapp.com/api';

    useEffect(() => {
        setShowPreloader(true)
        axios.post("/admin/hasAdmin")
            .then(res => {
                setShowPreloader(false)
                console.log("hasAdmin: ", res.data)
                if (res.data.hasAdmin === "false") {
                    navigate('/signup')
                }
            })
    }, [])

    const [admin, setAdmin] = useState({})
    const [showPreloader, setShowPreloader] = useState(false)
    const navigate = useNavigate();

    const onLogin = (email, password) => {
        setShowPreloader(true)

        AdminApi.login(email, password)
            .then(res => {
                if (res.status === 200) {
                    let userToken = {
                        type: res.data.token_type,
                        value: res.data.access_token
                    }
                    console.log("admin: ", res)
                    setAdmin({
                        id: res.data.account.id,
                        name: res.data.account.firstname + " " + res.data.account.lastname,
                        email: res.data.account.email,
                        photo: res.data.account.photo
                    })
                    setSessionToken(userToken)
                    axios.defaults.headers = {
                        accept: "application/json",
                        authorization: userToken.type + " " + userToken.value
                    }

                    navigate("/success")
                    showSuccessToast("Welcome Back Admin!")
                }
                else {
                    console.log(res)
                    showErrorToast("Invalid login credentials!");
                    removeSessionToken()

                }
                setShowPreloader(false)
            })
    }

    const onSignup = (admin) => {
        setShowPreloader(true)
        AdminApi.signup(admin)
            .then(res => {
                console.log('signup res: ', res)
                if (res.status === 200) {
                    setShowPreloader(false)
                    navigate("/verify-email");
                    showSuccessToast("Successfully signed up!");
                } else {

                    setShowPreloader(false);
                    // showErrorToast("Error: " + res.response.data.message)
                    showErrorToast("Sorry, email address is already taken!");

                }
            })
    }

    return (
        <div>
            <ToastContainer />
            <PageLoader/>
            <Routes>
                <Route path='/' element={<SignInPage onLogin={onLogin} />} />
                <Route path='/verify-email' element={<VerifyEmailPage />} />
                <Route path='/signup' element={<SignUpPage onSubmit={onSignup} />} />
                <Route path='/success/*' element={<Homepage />} />
            </Routes>
            <PreloaderComponent show={showPreloader} />
        </div>
    )
}

export default Main

// ReactDOM.render(
//     <BrowserRouter basename='/'>
//         <Main />
//     </BrowserRouter>, document.getElementById("app")
// )
