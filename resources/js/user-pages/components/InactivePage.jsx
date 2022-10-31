import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { removeSessionToken } from '../UserSession'
import NavbarComponent from './NavbarComponent'

const InactivePage = () => {
    const navigate = useNavigate()

    const onLogout = () =>{
        removeSessionToken();
        window.location.href = "/"
    }
    return (
        <>
            <NavbarComponent showNav={false} />
            <div className="py-2 mt-5 ">
                <div className="text-center">
                <i class='bx bx-error bx-lg text-poppy'></i><i className='text-gray bx bx-sad bx-lg mb-3'></i>
                    <h4 className='text-center text-gray'>We're sorry, your account was deactivated!</h4>
                </div>
                <div className="row mt-5 justify-content-center">
                    <div className="col-md-4 text-center">
                        <div className=' alert alert-poppy'><i className='bx bx-info-circle'></i> You are currently blocked from accessing your account.</div>

                        <div className='mt-5'>
                            <button type='button' onClick={onLogout} className='btn btn-sm btn-secondary'>Sign out</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InactivePage
