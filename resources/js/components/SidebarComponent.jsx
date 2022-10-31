import React, { useState } from 'react'
import { Collapse, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DropdownMenuBtn from './DropdownMenuBtn'

const SidebarComponent = ({ sidebarMenus, activeKey, onMenuSelect, admin, open }) => {
    const [isPetExpanded, setIsPetExpanded] = useState(false)

    const MenuBtn = (props) => {
        return (
            <Nav.Link as={Link} href={props.to} to={props.to} className="fs-5 w-100 d-flex align-items-center">
                <i className="material-icons me-3">{props.icon}</i>
                <span className="fs-6 text-capitalize">{props.label}</span>
            </Nav.Link>
        )
    }

    return (
        <div className={`bg-white sidebar bg-gradient shadow-sm ${open ? "open" : ""}`}>
            <header className=" text-center text-light">
                {/* <p className="text-success">ADMIN</p> */}
                <div
                    className="user-photo shadow"
                    style={{ backgroundImage: `url('${admin.photo}')` }}
                />
                {
                    admin.firstname?(
                        <p className="mt-3 mb-1 text-black-50 text-capitalize">{admin.firstname + ' ' + admin.lastname}</p>
                    ):null
                }
                <hr />
            </header>

            <Nav
                activeKey={activeKey}
                className="flex-column mt-0"
                as={"ul"}
                onSelect={onMenuSelect}
            >
                {sidebarMenus &&
                    sidebarMenus.map((item, index) => (
                        <Nav.Item as='li' className="" key={index}>
                            <Nav.Link as={Link} href={item.to} to={item.to} className="fs-5">
                                <div className="d-flex align-items-center">
                                    <i className="material-icons me-3">{item.icon}</i>
                                    <span className="fs-6 text-capitalize">{item.label}</span>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                {/* <Nav.Item>
                    <MenuBtn to="/success" icon="home" label="Home" />
                </Nav.Item>
                <Nav.Item className="">
                    <DropdownMenuBtn to="/success/pets" icon="pets" label="Pets" expanded={isPetExpanded} onClick={() => setIsPetExpanded(!isPetExpanded)} />
                    <Collapse className='p-0' in={isPetExpanded}>
                        <Nav.Item>
                            <MenuBtn to="/success/pets/add" icon="add" label="Add Pet" />
                        </Nav.Item>
                    </Collapse>
                </Nav.Item> */}
            </Nav>
        </div>
    )
}

export default SidebarComponent
