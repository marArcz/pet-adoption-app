import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Card, Col, Form, ListGroup, ListGroupItem, Nav, Row } from 'react-bootstrap';
import CalendarDays from './Calendar/calendar-days';
import './Calendar/calendar.css'
import './Calendar/calendar-days.css'
import axios from 'axios';
import ScheduleModal from './ScheduleModal';
import { Link } from 'react-router-dom';

const CalendarComponent = ({ events }) => {
    const [currentDay, setCurrentDay] = useState(new Date())
    const [eventsThisWeek, setEventsThisWeek] = useState([])
    const [eventsThisMonth, setEventsThisMonth] = useState([])
    const [scheduleDays, setScheduleDays] = useState([])
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const changeCurrentDay = (day) => {
        setCurrentDay(new Date(day.year, day.month, day.number));
    }

    const nextMonth = () => {

        if (currentDay.getMonth() == 11) {
            changeCurrentDay({
                number: currentDay.getDate(),
                month: 0,
                year: currentDay.getFullYear() + 1
            })
        } else {
            changeCurrentDay({
                number: currentDay.getDate(),
                month: currentDay.getMonth() + 1,
                year: currentDay.getFullYear()
            })
        }
    }

    const prevMonth = () => {

        if (currentDay.getMonth() == 0) {
            changeCurrentDay({
                number: currentDay.getDate(),
                month: 11,
                year: currentDay.getFullYear() - 1
            })
        } else {
            changeCurrentDay({
                number: currentDay.getDate(),
                month: currentDay.getMonth() - 1,
                year: currentDay.getFullYear()
            })
        }
    }

    const gotoDate = (date) => {
        setCurrentDay(new Date(date))
        console.log("goto date: ", new Date(Date.parse(date)))
    }

    const loadScheduleDays = () => {
        axios.get("/schedules/days")
            .then(res => {
                setScheduleDays(res.data)
            })
    }

    const loadEvents = () => {
        let weekEvents = [], monthEvents = []
        for (let event of events) {
            let today = new Date();
            let currentDate = today.getDate();
            let dayToday = today.getDay();
            let eventDate = new Date(Date.parse(event.date));
            if (eventDate.getMonth() === today.getMonth()) {
                // the event is for current month
                let newEvent = {
                    ...event,
                    passed: eventDate.getDate() < today.getDate()
                }
                // add to this month events
                monthEvents.push(newEvent)

                // check if it is for current week
                if (eventDate.getDate() < today.getDate()) {
                    if ((today.getDate() - eventDate.getDate()) <= (today.getDay() - 1)) {
                        weekEvents.push(newEvent)
                    }
                } else if (eventDate.getDate() > today.getDate()) {
                    if ((eventDate.getDate() - today.getDate()) <= (7 - today.getDay())) {
                        weekEvents.push(newEvent)
                    }
                } else if (eventDate.getDate() === today.getDate()) {
                    weekEvents.push(newEvent)
                }
            }
        }

        setEventsThisMonth(monthEvents)
        setEventsThisWeek(weekEvents)
    }

    useEffect(() => {
        loadEvents()
    }, [events])

    useEffect(() => {
        loadScheduleDays();
    }, [])

    const isDayAccepting = (day) => {
        for (let schedDay of scheduleDays) {
            if (schedDay.day === day) {
                return true;
            }
        }

        return false;
    }

    const showEvent = () => {

    }

    return (
        <div>
            <Row>
                <Col md>
                    <Card className='border-0 rounded-0 shadow'>
                        <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                                <h5 className='mb-3 fw-bold'>{months[currentDay.getMonth()]}, {currentDay.getFullYear()}</h5>
                                <div className="ms-auto">
                                    <div className="d-flex align-items-center">
                                        <Button className='d-flex align-items-center' size='sm' variant='light' onClick={prevMonth}><i className='bx bx-chevron-left bx-sm'></i></Button>
                                        <Button variant='light' onClick={() => gotoDate(new Date())}>Today</Button>
                                        <Button className='d-flex align-items-center' size='sm' variant='light' onClick={nextMonth}><i className='bx bx-chevron-right bx-sm'></i></Button>
                                    </div>
                                </div>
                            </div>

                            <div className="calendar-header">
                                {
                                    weekdays.map((day, index) => (
                                        <div key={index} className="weekday text-success text-uppercase fw-bold"><p>{day}</p></div>
                                    ))
                                }
                            </div>
                            <CalendarDays events={events} day={currentDay} changeCurrentDay={changeCurrentDay} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3}>
                    <Row className='row-cols-1'>
                        <Col>
                            <Card className='border-0 rounded-0 shadow mt-lg-0 mt-3'>
                                <Card.Body>
                                    <p className="text-purple fw-bold"><small>Scheduled Visits this Week:</small></p>
                                    <div className="mt-3">
                                        {
                                            eventsThisWeek.length > 0 ? (
                                                <ul className="event-list">
                                                    {eventsThisWeek.map((event, index) => (
                                                        <li key={index} onClick={() => gotoDate(event.date)} className={`${event.passed ? 'passed' : ''} ${event.date.toDateString() === currentDay.toDateString() ? 'active' : ''}`}>
                                                            <span><small>{months[event.date.getMonth()]} {event.date.getDate()} @{event.time.time_from}</small></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p><small>None scheduled for this week.</small></p>
                                            )
                                        }
                                    </div>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col>
                            <Card className='border-0 rounded-0 shadow mt-3'>
                                <Card.Body>
                                    <p className="text-secondary fw-bold"><small>Scheduled Visits this Month:</small></p>
                                    <div className="mt-3">
                                        {
                                            eventsThisMonth.length > 0 ? (
                                                <ul className="event-list">
                                                    {eventsThisMonth.map((event, index) => (
                                                        <li key={index} onClick={() => gotoDate(event.date)} className={`${event.passed ? 'passed' : ''}`}>
                                                            <span><small>{months[event.date.getMonth()]} {event.date.getDate()} @{event.time.time_from}</small></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p><small>None scheduled for this month.</small></p>
                                            )
                                        }
                                    </div>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col>
                            <Card className='mt-3 shadow border-0 rounded-0'>
                                <Card.Body>
                                    <div className="fw-bold d-flex align-items-center">
                                        <small>
                                            Scheduling System Settings
                                        </small>
                                        <Link title='Change Setting' to="/success/schedules-settings" className='btn btn-warning btn-sm ms-auto' type='button'><i className='bx bx-cog'></i></Link>
                                        {/* <button title='Change Setting' onClick={()=>setShowScheduleModal(true)} className='btn btn-warning btn-sm ms-auto' type='button'><i className='bx bx-cog'></i></button> */}

                                    </div>

                                    {/* <div className="text-end">
                                        <button className='btn btn-sm btn-gray text-white mb-1 rounded-1 me-1'><i className='bx bx-edit'></i></button>
                                        <button className='btn btn-sm btn-success text-white mb-1 rounded-1'><i className='bx bx-save'></i></button>
                                    </div> */}
                                    <p className='mt-2'>
                                        <small className='text-gray'>Accepting visits on: </small>
                                    </p>
                                    <ListGroup>
                                        {
                                            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                                                .map((day, index) => (
                                                    <ListGroupItem key={index}>
                                                        <small>
                                                            <Form.Check

                                                                inline
                                                                label={day}
                                                                disabled
                                                                checked={isDayAccepting(index)}
                                                                type="checkbox"
                                                                id={`inline-day-checkbox-${index}`}
                                                            />
                                                        </small>
                                                    </ListGroupItem>
                                                ))
                                        }
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {
                scheduleDays.length > 0 && (
                    <ScheduleModal loadScheduleDays={loadScheduleDays} show={showScheduleModal} handleClose={() => setShowScheduleModal(false)} isDayAccepting={isDayAccepting} />
                )
            }
        </div>
    )
}

export default CalendarComponent
