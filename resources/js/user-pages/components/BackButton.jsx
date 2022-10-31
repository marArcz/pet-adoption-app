import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router'

const BackButton = ({size="default"}) => {
    const navigate = useNavigate();

    return (
        <Button size={size} variant='success' type='button' className='text-light' onClick={() => navigate(-1)}>
            <i className='bx bx-arrow-back'></i>
        </Button>
    )
}

export default BackButton