import { hidePageLoader, showPageLoader } from '@/user-pages/PageLoader';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { showErrorToast } from './ToastNotification';

const ScheduleModal = ({ show, handleClose, isDayAccepting, loadScheduleDays }) => {
    const [checkboxState, setCheckboxState] = useState([false, false, false, false, false, false, false]);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const loadCheckboxStates = () => {
        let states = checkboxState

        // states.map((state, index) => {
        //     return isDayAccepting(index)
        // })

        for (let x = 0; x < 7; x++) {
            states[x] = isDayAccepting(x);

        }
        console.log("states; ", states)
        setCheckboxState(states)
    }

    useEffect(() => {
        loadCheckboxStates()
    }, [])

    const onCheck = (key) => {
        let states = checkboxState

        // states.map((state, index) => {
        //     return index === key ? !state : state;
        // })

        states[key] = !states[key]
        console.log("states; ", states)

        setCheckboxState(states)
        setCheckboxState(states)
    }

    const onSave = (e) => {
        e.preventDefault()
        let checks = 0
        if (checkboxState.indexOf(true) > -1) {
            const formData = new FormData();

            for (let index = 0; index < checkboxState.length; index++) {
                if (checkboxState[index]) {
                    formData.append('day[]', index);
                }
            }
            showPageLoader();
            axios.post('/schedules/days/update', formData)
                .then(res => {
                    console.log("onsave: ", res.data)
                    hidePageLoader();
                    loadScheduleDays();
                    handleClose()

                })
                .catch(err => {
                    hidePageLoader();
                    console.log('error: ', err)
                })
        } else {
            showErrorToast("Please check at least One!");
        }

    }

    return (
        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title as={"p"} className="fs-6 fw-bold">Schedule System Settings</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSave}>
                <Modal.Body>
                    <Form.Label className='fw-bold'><small>Accept visits on:</small></Form.Label>

                    <div className="mt-3">
                        <div className="d-flex flex-wrap">
                            {

                                days.map((day, index) => (
                                    <small className='my-1' key={index}>
                                        <Form.Check
                                            inline
                                            label={day}
                                            value={index}
                                            defaultChecked={checkboxState[index]}
                                            onChange={e => onCheck(index)}
                                            type="checkbox"
                                            id={`modal-day-checkbox-${index}`}
                                        />
                                    </small>
                                ))
                            }
                        </div>
                        <Button size='sm' variant="outline-gray" className='mt-2' type='submit'>
                            Save Changes
                        </Button>
                    </div>
                    <hr />
                    <div className="mt-3">
                        <div className="row justify-content-start">
                            <div className="col-md-8">
                                <div className="d-flex">
                                    <p className="fw-bold my-1">
                                        <small>Available Time/Hour:</small>
                                    </p>
                                </div>

                                <p className="my-1 text-black-50">
                                    <small>Time or hours for schedules</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button size='sm' variant="gray" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ScheduleModal