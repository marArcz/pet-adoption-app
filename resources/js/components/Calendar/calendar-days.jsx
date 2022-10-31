import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function CalendarDays(props) {
    const firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
    const weekdayOfFirstDay = firstDayOfMonth.getDay();
    const [days, setDays] = useState([])
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState(null)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const today = new Date();
    console.log('today: ', today)
    const loadDays = () => {
        var currentDays = [];

        for (let day = 0; day < 42; day++) {
            if (day === 0 && weekdayOfFirstDay === 0) {
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
            } else if (day === 0) {
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
            } else {
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
            }

            let calendarDay = {
                currentMonth: (firstDayOfMonth.getMonth() === props.day.getMonth()),
                date: (new Date(firstDayOfMonth)),
                month: firstDayOfMonth.getMonth(),
                number: firstDayOfMonth.getDate(),
                selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
                year: firstDayOfMonth.getFullYear(),
                events: [],
                today: firstDayOfMonth.toDateString() === today.toDateString(),

            }


            currentDays.push(calendarDay);
        }


        // load events

        // const events = props.event

        for (let event of props.events) {
            // let date = event.date.replace( /[-]/g, '/' );
            let date = Date.parse(event.date);
            let eventDate = new Date(date);
            console.log("event date: ", eventDate)
            console.log("days: ", days)
            for (let day of currentDays) {
                let calendarDate = new Date(day.year, day.month, day.number);
                if (eventDate.toDateString() === calendarDate.toDateString()) {
                    let newEvent = {
                        formId:event.application_form.id,
                        title: event.title,
                        applicant: `${event.application_form.adopter.firstname} ${event.application_form.adopter.lastname}`,
                        day: day.number,
                        month: day.month,
                        year: day.year,
                        time: `${event.time.time_from}-${event.time.time_to}`,
                        passed: day.month <= today.getMonth() ? (day.number < today.getDate() ? true : false) : false
                    }
                    day.events = [...day.events, newEvent]
                }
            }

        }

        console.log('before render: ', currentDays)
        setDays(currentDays)
    }



    useEffect(() => {
        loadDays();
    }, [props.day, props.events]);

    const showEvent = (events) => {
        console.log('selected events: ', events)
        setSelectedEvents(events);
        setShowEventModal(true)
    }

    const EventModal = ({ show, handleClose, events }) => {
        if (events !== null) {
            return (
                <Modal show={show} onHide={handleClose} scrollable>
                    <Modal.Header closeButton className="border-0">
                        <p className="fw-bold"><small>Event</small></p>
                    </Modal.Header>
                    <Modal.Body className="px-4">
                        <ListGroup>
                            {
                                events.map((event, index) => (
                                    <ListGroupItem className="" key={index}>
                                        <p className="mb-3 fw-bold">{event.title}</p>
                                        <p className=""><small>Applicant: {event.applicant}</small></p>
                                        <p className="text-poppy mb-1"><small>{months[event.month]}. {event.day}, {event.year} <span className="text-dark">@{event.time}</span></small></p>
                                        <p className="text-poppy my-0"><small></small></p>
                                        <Link to={`/success/applications/${event.formId}`} className="my-2 btn btn-success text-light btn-sm ">
                                            <small><i className="bx bxs-folder"></i> Application Form</small>
                                        </Link>
                                    </ListGroupItem>
                                ))
                            }

                        </ListGroup>
                    </Modal.Body>
                </Modal>
            )
        } else {
            return null
        }
    }


    return (
        <>
            <div className="table-content">
                {
                    days.map((day, index) =>
                    (
                        <div key={index} className={"calendar-day" + (day.currentMonth ? " current" : "") + (day.selected ? " selected" : "")}
                            onClick={() => props.changeCurrentDay(day)}>
                            <div className="d-flex">
                                <p>{day.number}</p>
                                <div className="d-flex flex-column">

                                    {
                                        day.events.length > 0 && (
                                            <span onClick={() => showEvent(day.events)} key={index} className={`calendar-event mt-0 mb-1 ${day.passed ? 'text-bg-light text-dark' : 'text-bg-secondary text-light'}`}>
                                                <small>{day.events.length} {day.events.length > 1 ? "events" : "event"}</small>
                                            </span>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                day.today ? (<span className="badge bg-success position-absolute bottom-0 end-0 mb-2"><small>Today</small></span>) : null
                            }
                        </div>
                    )
                    )
                }
            </div>
            <EventModal show={showEventModal} handleClose={() => setShowEventModal(false)} events={selectedEvents} />
        </>
    )
}

export default CalendarDays;
