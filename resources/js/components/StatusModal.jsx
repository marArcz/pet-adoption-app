import { hidePageLoader, showPageLoader } from '@/user-pages/PageLoader'
import axios from 'axios'
import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import ModalTemplate from './ModalTemplate'
import { showSuccessToast } from './ToastNotification'

const StatusModal = ({ show, handleClose, onPetsUpdate, pet }) => {
    const [status, setStatus] = useState(pet.status)

    const formOnSubmit = (e) => {
        e.preventDefault();
        showPageLoader();
        axios.post('/pets/update-status', {
            id: pet.id,
            status
        })
            .then(res => {
                onPetsUpdate()
                showSuccessToast("Successfully updated!");
                console.log('res: ', res)
                hidePageLoader();
                handleClose();
            })
    }

    return (
        <ModalTemplate show={show} title="Update Pet Status" handleClose={handleClose} onSubmit={formOnSubmit}>
            <div className="mb-3">
                <Form.Label>Status:</Form.Label>
                <Form.Select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value={1}>Available</option>
                    <option value={0}>Adopted</option>
                </Form.Select>
            </div>
        </ModalTemplate>
    )
}

export default StatusModal
