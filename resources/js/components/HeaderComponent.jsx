import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Badge, Button, Container, Dropdown, Image, Nav, Navbar } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LogoImage from '../../../public/images/logo.png'
import { removeSessionToken } from './UserSession'
import bellIcon from '@/assets/img/bell.png'

const HeaderComponent = ({ admin, onSideBarToggle, onUpdateAccount }) => {

    const navigate = useNavigate()
    const [showUpdateModel, setShowUpdateModel] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unread, setUnread] = useState([])

    const location = useLocation();
    const signOut = () => {
        removeSessionToken();
        navigate("/")
    }

    const loadNotifications = (admin) => {
        console.log("notif admin: ", admin)
        if (admin && admin.account) {
            axios.get(`/notifications/${admin.account?.id}`)
                .then(res => {
                    if (res.data !== notifications) {
                        console.log("notif res: ", res)
                        setNotifications(res.data)
                        let unread = res.data.filter((notification) => notification.status === 0)
                        setUnread(unread)
                    }
                })
        }
    }
    useEffect(() => {
        console.log('admin changed')
        loadNotifications(admin)
    }, [admin, location])



    const updateNotification = (notif, status) => {
        axios.post('/notifications/update-status', {
            id: notif.id,
            status
        })
            .then(res => {
                loadNotifications()
                console.log('update notif: ', res)
            })
    }

    const openNotification = (notif) => {
        updateNotification(notif, 2)
        navigate(notif.link)
    }

    const clearAll = () => {

        axios.get("/notifications/clear")
            .then(res => {
                console.log('clear notif: ', res)
                loadNotifications();
            })
    }

    return (
        <Navbar
            fixed='top'
            variant='light'
            bg='white'
            className='navbar-main border shadow-sm'
        >
            <Container fluid>
                <button className='sidebar-toggler me-3 d-block d-lg-none d-md-none' type='button' onClick={onSideBarToggle}>
                    <i className="material-icons">menu</i>
                </button>
                <div className="ms-lg-4">
                    <div className="d-flex">
                        <Image fluid src={LogoImage} width="45" className='d-md-inline d-none' />
                        <span className="ms-2 mb-0 p-0 align-self-center d-lg-block d-md-block d-none"><small>God's Home Of Refuge</small></span>
                    </div>
                </div>
                <Nav className="ms-auto">

                    <Nav.Item className="me-3">

                        <Dropdown className='no-toggle'>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                {
                                    unread.length > 0 && (
                                        <Badge className='text-' pill bg="poppy">
                                            {unread.length}
                                        </Badge>
                                    )
                                }
                                <i className="material-icons">notifications</i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu align={"end"}>
                                <Dropdown.Header>Notifications</Dropdown.Header>
                                <Dropdown.Divider />
                                {
                                    notifications.length > 0 ? (
                                        notifications.map((notification, index) => {
                                            let date = new Date(notification.created_at);
                                            let today = new Date();
                                            let postedOn = '';

                                            let difference = (today - date);
                                            let diffMins = Math.round(((difference % 86400000) % 3600000) / 60000);
                                            var diffDays = Math.floor(difference / 86400000); // days
                                            var diffHrs = Math.floor((difference % 86400000) / 3600000)

                                            if (diffHrs < 1) {
                                                if (diffMins < 1) {
                                                    postedOn = "few moments ago"
                                                } else {
                                                    postedOn = diffMins + (diffMins > 1 ? " mins ago" : " min ago")
                                                }
                                            } else {
                                                postedOn = diffHrs + (diffHrs > 1 ? " hrs ago" : " hr ago")
                                            }
                                            if (notification.link !== null || notification.link !== "") {
                                                return (
                                                    <Dropdown.Item key={index} onClick={() => openNotification(notification)}>
                                                        <div className="d-flex align-items-center">
                                                            <div className='me-2'>
                                                                {
                                                                    notification.photo !== null ? (
                                                                        <img width={'30px'} src={notification.photo} alt="" />
                                                                    ) : (
                                                                        // <img src={notification.photo} alt="" />
                                                                        <i className='bx bxs-file-blank bx-md text-gray'></i>
                                                                    )
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className={`my-1 ${notification.status !== 2 ? 'fw-bold' : 'text-gray'}`}>
                                                                    <small>{notification.content}</small>
                                                                </p>
                                                                <p className="my-0">
                                                                    <small className="text-black-50">
                                                                        {postedOn}
                                                                    </small>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Dropdown.Item>
                                                )
                                            } else {
                                                return (
                                                    <Dropdown.Item key={index}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="me-2">
                                                                {
                                                                    notification.photo === null ? (
                                                                        <img width={'30px'} src={bellIcon} alt="" />
                                                                    ) : (
                                                                        <img src={notification.photo} alt="" />
                                                                    )
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className={`my-1 ${notification.status !== 2 ? 'fw-bold' : 'text-gray'}`}>
                                                                    <small>{notification.content}</small>
                                                                </p>
                                                                <p className="my-0">
                                                                    <small className="text-black-50">
                                                                        {postedOn}
                                                                    </small>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Dropdown.Item>
                                                )
                                            }
                                        })
                                    ):(
                                        <Dropdown.Item>
                                            <small className="text-center text-black-50">
                                                Nothing's here.
                                            </small>
                                        </Dropdown.Item>
                                    )
                                }

                                {/* <Dropdown.Divider/>
                                <Dropdown.Item className='text-center' onClick={clearAll}>
                                    Clear All
                                </Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav.Item>
                    <Nav.Item>

                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                <span className='fw-bold text-capitalize'>{admin.firstname ? (admin.firstname + ' ' + admin.lastname) : null}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu align={"end"}>
                                <Dropdown.Item onClick={onUpdateAccount}><small><i className='material-icons fs-6 me-1 text-success'>edit</i> Update Account</small></Dropdown.Item>
                                <Dropdown.Item onClick={signOut}><small><i className='material-icons fs-6 me-1 text-success'>logout</i> Sign Out</small></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default HeaderComponent
