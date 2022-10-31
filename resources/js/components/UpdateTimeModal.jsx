import { hidePageLoader, showPageLoader } from '@/user-pages/PageLoader'
import { showErrorToast } from '@/user-pages/ToastNotification'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import ModalTemplate from './ModalTemplate'
import { showSuccessToast } from './ToastNotification'

const UpdateTimeModal = ({ show, handleClose, onSave,time }) => {
    const [time_from, setTime_from] = useState("")
    const [time_to, setTime_to] = useState("")
    const [slots, setSlots] = useState(1)
    const [isLoaded, setIsLoaded] = useState(true)

    useEffect(()=>{
            setTime_from(time.time_from)
            setTime_to(time.time_to)
            setSlots(time.slots)

    },[time])
    const onSubmit = (e) => {
        e.preventDefault();
        showPageLoader()
        axios.post("/schedules/time/update",{
            id:time.id,
            time_from,
            time_to,
            slots
        })
        .then(res=>{
            hidePageLoader()
            showSuccessToast("Successfully added!");
            onSave()
            handleClose()
            
        })
        .catch(err=>{
            hidePageLoader()
            showErrorToast("System error please try again!");
            console.log("error adding: ", err)
        })
    }
    return (
        <>
            <ModalTemplate show={show} handleClose={handleClose} onSubmit={onSubmit} title="Add Time">
                <div className="mb-3">
                    <div className="mb-3">
                        <Form.Label>From:</Form.Label>
                        <Form.Control disabled={!isLoaded} required type='time' value={time_from} onChange={(e) => setTime_from(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <Form.Label>To:</Form.Label>
                        <Form.Control disabled={!isLoaded} required type='time' value={time_to} onChange={(e) => setTime_to(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <Form.Label>No. of visits to accept:</Form.Label>
                        <Form.Control disabled={!isLoaded} required min={1} type='number' value={slots} onChange={(e) => setSlots(e.target.value)}/>
                    </div>
                </div>
            </ModalTemplate>
        </>
    )
}

export default UpdateTimeModal