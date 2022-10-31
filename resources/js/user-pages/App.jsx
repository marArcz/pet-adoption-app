import React from 'react'
import { Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'
import InactivePage from './components/InactivePage'
import SignInPage from './components/SignInPage'
import SignupPage from './components/SignupPage'
import Home from './Home'
import PageLoader from './PageLoader'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/*' element={<Home />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/deactivated'  element={<InactivePage/>} />
      </Routes>

      <PageLoader />
      <ToastContainer />
    </>
  )
}

export default App