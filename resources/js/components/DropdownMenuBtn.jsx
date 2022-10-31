import React from 'react'
import { Button, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'


const DropdownMenuBtn = ({ icon, label,to,onClick,expanded }) => {
    return (

        <Button variant='link' onClick={onClick} className={`w-100 d-flex align-items-center text-decoration-none   ${expanded?"active-dropdown":""}`}>
            <i className='material-icons me-3'>{icon.toLowerCase()}</i>
            <span>{label}</span>
            <i className='material-icons ms-auto'>{`${expanded? "expand_less":"expand_more"}`}</i>
        </Button>
    )
}

export default DropdownMenuBtn
