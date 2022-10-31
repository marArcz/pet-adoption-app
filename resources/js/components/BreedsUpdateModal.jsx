import React from 'react'
import { Modal } from 'react-bootstrap'

const BreedsUpdateModal = ({ show, handleOnClose,category }) => {
    // const [name, setName] = useState()
    return (
        <Modal show={show} onHide={handleOnClose} className="rounded-0" size='xl' >
            <Modal.Header closeButton className='border-0'>
                <p className="fw-bold">
                    <small>Breeds</small>
                </p>
            </Modal.Header>
            <Modal.Body className='rounded-0'>

            </Modal.Body>
        </Modal>
    )
}

export default BreedsUpdateModal
