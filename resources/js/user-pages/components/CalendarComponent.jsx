import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'

const CalendarComponent = ({ schedules, onSelect, scheduleTime }) => {
    const [scheduleDays, setScheduleDays] = useState([])
    // var scheduleDays = []
    const [currentDate, setCurrentDate] = useState(new Date())
    const [days, setDays] = useState([])
    const [word, setWord] = useState(0)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const today = new Date();
    const weeks = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const loadScheduleDays = () => {
        axios.get("/schedules/days")
            .then(res => {
                setScheduleDays(res.data)
                // scheduleDays = res.data
                setCurrentDate(new Date())
            })
    }

    useEffect(() => {
        loadScheduleDays()
    }, [])

    useEffect(() => {
        loadDays()
    }, [scheduleDays, schedules, currentDate])

    const getSchedules = (eventDate, timeId) => {
        var scheds = []
        for (let sched of schedules) {
            let date = new Date(sched.date)
            if (date.toDateString() === eventDate.toDateString() && sched.time_id === timeId) {
                scheds.push(sched);
            }
        }

        return scheds;
    }

    const isDateAvailable = (date) => {

        var isAvailable = false
        for (let time of scheduleTime) {
            let scheds = getSchedules(date, time.id);
            let available = time.slots - scheds.length
            if (available > 0) {
                return true;
            }
        }

        return false;
    }

    const isDayAccepting = (day) => {
        for (let schedDay of scheduleDays) {
            if (schedDay.day === day) {
                return true;
            }
        }

        return false;
    }




    const loadDays = () => {
        var currentDays = []
        const firstDayOfMonth = new Date(currentDate?.getFullYear(), currentDate?.getMonth(), 1);
        const weekdayOfFirstDay = firstDayOfMonth.getDay();


        for (let day = 0; day < 42; day++) {
            if (day === 0 && weekdayOfFirstDay === 0) {
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
            } else if (day === 0) {
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
            } else {
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
            }

            let calendarDay = {
                date: firstDayOfMonth,
                month: firstDayOfMonth.getMonth(),
                number: firstDayOfMonth.getDate(),
                selected: (firstDayOfMonth.toDateString() === currentDate.toDateString()),
                year: firstDayOfMonth.getFullYear(),
                isAvailable: isDateAvailable(firstDayOfMonth),
                isAccepting: isDayAccepting(firstDayOfMonth.getDay()),
                today: firstDayOfMonth.toDateString() === today.toDateString(),
            }
            if (calendarDay.month < today.getMonth() && calendarDay.year === today.getFullYear()) {
                calendarDay.passed = true
            }
            else if (calendarDay.number <= today.getDate() && calendarDay.month === today.getMonth() && calendarDay.year === today.getFullYear()) {
                calendarDay.passed = true
            } else {
                calendarDay.passed = false
            }

            currentDays.push(calendarDay)
        }

        setDays(currentDays);
    }



    const onSelectDate = (date) => {
        console.log("selected date: ", date)
        setCurrentDate(date);
        loadDays()
        onSelect(date)
    }

    const prevMonth = () => {
        let date = currentDate
        date.setMonth(date.getMonth() - 1);
        setCurrentDate(date);
        loadDays();

    }

    const nextMonth = () => {
        let date = currentDate
        date.setMonth(date.getMonth() + 1);
        setCurrentDate(date);
        loadDays();
    }


    return (
        <div>
            <Card className='calendar mx-lg-3 mb-3 shadow-sm bg-white rounded-1 py-3' id='schedule-calendar'>
                <Card.Body>
                    <div className="calendar-header d-flex">
                        <button disabled={currentDate?.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()} onClick={prevMonth} className={`btn btn-sm btn-light ${currentDate?.getMonth() === today.getMonth() ? "d-none" : ""}`} type='button'>
                            {`<<`}
                        </button>
                        <span className='fw-bold me-auto ms-auto'><small>{months[currentDate?.getMonth()]} {currentDate?.getFullYear()}</small></span>
                        <button onClick={nextMonth} className="btn btn-sm btn-light" type='button'>
                            {`>>`}
                        </button>

                    </div>
                    <div className="weekdays mt-3">
                        {
                            weeks.map((week, index) => (
                                <div key={index} className="fw-bold text-center">
                                    <small>{week}</small>
                                </div>
                            ))
                        }
                    </div>
                    <div className="calendar-body">
                        {
                            days && days.map((day, index) => {
                                if (day.passed || !day.isAccepting) {
                                    return (
                                        <div key={index} className="text-gray col text-center">
                                            <button className={`btn btn-sm  text-center border-0`} type="button" disabled>
                                                {day.number}
                                            </button>
                                        </div>
                                    )
                                } else {
                                    if (day.month === currentDate.getMonth()) {
                                        return (
                                            <div key={index} className="text-dark col text-center ">
                                                <button disabled={!day.isAvailable} type='button' onClick={() => onSelectDate(new Date(day.year, day.month, day.number))} className={`${day.selected ? "selected" : ""} current  btn btn-sm calendar-day text-center fw-bold ${day.isAvailable ? 'available' : 'full'}`}>
                                                    {day.number}
                                                </button>
                                            </div>
                                        )
                                    } else {
                                        if (day.isAvailable) {
                                            return (
                                                <div key={index} className=" col text-center">
                                                    <button type='button' onClick={() => onSelectDate(new Date(day.year, day.month, day.number))} className={`btn btn-sm text-gray calendar-day text-center available`}>
                                                        {day.number}
                                                    </button>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={index} className=" col text-center">
                                                    <button type='button' disabled className={`btn btn-sm text-gray calendar-day text-center full`}>
                                                        {day.number} 
                                                    </button>
                                                </div>
                                            )
                                        }
                                    }
                                }
                            })
                        }
                    </div>
                </Card.Body>
                <Card.Footer className='bg-white'>
                        <div className="d-flex w-100 justify-content-center">
                            <div className="bg-success px-3 mx-1 bg-opacity-50 py-1 rounded-0">
                                <p className="my-0"><small>Available</small></p>
                            </div>
                            <div className="bg-danger px-3 mx-1 bg-opacity-50 py-1 rounded-0">
                                <p className="my-0"><small>Full</small></p>
                            </div>
                        </div>
                </Card.Footer>
            </Card>
        </div>
    )
}

export default CalendarComponent