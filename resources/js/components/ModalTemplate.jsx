import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const ModalTemplate = ({show,handleClose,children, title,onSubmit,size="default"}) => {
    return (
        <Modal size={size} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title as={"p"} className="fs-6 fw-bold">{title}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button size='sm' variant="success" type='submit'>
                        Submit
                    </Button>
                    <Button size='sm' variant="gray" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ModalTemplate