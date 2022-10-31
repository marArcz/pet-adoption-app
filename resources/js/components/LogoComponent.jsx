import React from 'react'
import { Image } from 'react-bootstrap'
import Logo from '../../../public/images/logo.png'
const LogoComponent = () => {
    return (
        <div className="text-center ">
            <div className="text-start">
                <h5 className='text-start text-uppercase text-success'>Gods Home of Refuge</h5>
                <h6 className="my-2 text-secondary">Animal Pet Adoption</h6>
            </div>
            <Image src={Logo} fluid />
            <div className="text-end">
                <h6 className="my-2 text-secondary">Building a friendly world for all.</h6>
            </div>
        </div>
    )
}

export default LogoComponent
