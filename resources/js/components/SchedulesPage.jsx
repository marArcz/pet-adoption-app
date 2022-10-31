import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import CalendarComponent from './CalendarComponent'

const SchedulesPage = () => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        axios.get("/schedules")
        .then(res=>{
            console.log('schedules: ', res)
            let initial = res.data.map((sched,index)=>{
                return {
                    ...sched,
                    date:new Date(sched.date)
                }
            })

            let schedules = initial.filter((sched)=>{
                return sched.application_form.application_status !== 1 && sched.application_form.application_status !== 3
            })
            console.log("new scheds: ", schedules)
            setEvents(schedules)
        })
        .catch(err=>{
            console.log("err: ", err)
        })
    }, [])

    return (
        <div className='py-3'>
            <h5 className='text-dark'><i className='bx bx-calendar'></i> Schedules</h5>
            <hr />
            <div className="mt-3">
                <CalendarComponent events={events} />
            </div>
        </div>
    )
}

export default SchedulesPage
