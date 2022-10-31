import BackButton from '@/user-pages/components/BackButton';
import { hidePageLoader, showPageLoader } from '@/user-pages/PageLoader';
import axios, { Axios } from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AddTimeModal from './AddTimeModal';
import { showErrorToast, showSuccessToast } from './ToastNotification';
import UpdateTimeModal from './UpdateTimeModal';

const ScheduleSettings = ({ scheduleDays, loadScheduleDays }) => {
    // const [scheduleDays, setScheduleDays] = useState([])
    const [checkboxState, setCheckboxState] = useState([false, false, false, false, false, false, false]);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const [scheduleTime, setScheduleTime] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [timeToUpdate, setTimeToUpdate] = useState(null)
    const isDayAccepting = (day) => {
        for (let schedDay of scheduleDays) {
            if (schedDay.day == day) {
                return true;
            }
        }

        return false;
    }

    const loadScheduleTime = () => {
        axios.get("/schedules/time")
            .then(res => {
                setScheduleTime(res.data)
                console.log("time: ", res)
            })
    }


    const loadCheckboxStates = () => {
        console.log("loading states")
        console.log("sched days: ", scheduleDays)
        let states = checkboxState

        for (let x = 0; x < 7; x++) {
            states[x] = isDayAccepting(x);

        }
        console.log("states; ", states)
        setCheckboxState(states)

    }



    useEffect(() => {
        loadScheduleDays()
        loadScheduleTime()

    }, [])
    useEffect(() => {
        console.log('sched chamges')
        loadCheckboxStates()

    }, [scheduleDays])


    const onCheck = (key) => {
        let states = checkboxState

        // states.map((state, index) => {
        //     return index === key ? !state : state;
        // })

        states[key] = !states[key]
        console.log("states; ", states)

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
                    showSuccessToast("Successfully saved changes!")
                })
                .catch(err => {
                    hidePageLoader();
                    console.log('error: ', err)
                })
        } else {
            showErrorToast("Please check at least One!");
        }

    }

    const updateTime = (time) =>{
        setShowUpdateModal(true)
        setTimeToUpdate(time)
    }

    const deleteTime = (time) =>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF5630',
            cancelButtonColor: '#334444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                showPageLoader()
               axios.get('/schedules/time/delete/'+time.id)
               .then(res=>{
                    hidePageLoader()
                    showSuccessToast("Successfully deleted!")
                    loadScheduleTime()
               })
            }
        })
    }

    return (
        <>
            <div className='mt-5 d-flex align-items-center'>
                <BackButton size="sm" />
                <p className="fw-bold my-1 ms-auto me-auto"><i className='bx bx-cog'></i> Schedule Settings</p>
            </div>
            <hr />

            <Form onSubmit={onSave}>
                <Form.Label className='fw-bold '><small>Accept visits on:</small></Form.Label>

                <div className="mt-3">
                    <div className="d-flex flex-wrap">
                        {

                            scheduleDays.length > 0 && checkboxState.indexOf(true) > -1 ? (
                                days.map((day, index) => (
                                    <Form.Check
                                        key={"checkbox-" + index}
                                        inline
                                        label={day}
                                        value={index}
                                        defaultChecked={checkboxState[index]}
                                        onChange={() => onCheck(index)}
                                        type="checkbox"
                                        id={`modal-day-checkbox-${index}`}
                                    />

                                ))
                            ) : (
                                <p>Please wait...</p>
                            )
                        }
                    </div>
                    <Button disabled={scheduleDays.length === 0 && checkboxState.indexOf(true) <= -1} size='sm' variant="outline-gray" className='mt-4' type='submit'>
                        Save Changes
                    </Button>
                </div>
                <hr />
                <div className="mt-3">
                    <div className="row justify-content-start align-items-center">
                        <div className="col-md-6">
                            <div className="d-flex">
                                <p className="fw-bold my-1">
                                    <small>Available Time/Hour:</small>
                                </p>
                                <button onClick={() => setShowAddModal(true)} className='btn btn-sm btn-secondary ms-auto' type='button'>Add</button>
                            </div>

                            <p className="my-1 text-black-50">
                                <small>Time or hours for schedules</small>
                            </p>

                            <div className="mt-2">
                                <ListGroup>
                                    {

                                        scheduleTime.length > 0 && scheduleTime.map((time, index) => (
                                            <ListGroupItem className='py-3' key={index}>
                                                <div className="d-flex">
                                                    <p className="my-0 d-flex align-items-center fw-bold">
                                                        <i className='bx bx-time'></i>
                                                        <small className='ms-2'>
                                                            {time.time_from} - {time.time_to}
                                                        </small>
                                                    </p>
                                                    <p className="my-0 ms-2 text-poppy fw-bold">
                                                        <small>({time.slots} {`${time.slots === 1 ? "slot" : "slots"}`})</small>
                                                    </p>

                                                    <div className="ms-auto">
                                                        <Button variant='success' type='button' onClick={() => updateTime(time)} size="sm" className="text-light"><i className='bx bx-edit'></i></Button>
                                                        <Button variant='poppy' type='button' onClick={()=> deleteTime(time )} size="sm" className="text-light ms-1"><i className='bx bx-trash'></i></Button>
                                                    </div>
                                                </div>
                                            </ListGroupItem>
                                        ))
                                    }
                                </ListGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>

            <AddTimeModal onAdd={loadScheduleTime} show={showAddModal} handleClose={() => setShowAddModal(false)} />
            {
                timeToUpdate && (
                    <UpdateTimeModal time={timeToUpdate} show={showUpdateModal} handleClose={()=>setShowUpdateModal(false)} onSave={loadScheduleTime}/>
                )
            }
        </>
    )
}

export default ScheduleSettings