import React from 'react'
import { Container, Dropdown, Nav, Navbar, NavbarBrand, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../../public/images/logo.png'
import { removeSessionToken } from '../UserSession'

const NavbarComponent = ({ showNav = true, isSignedIn = false, adopter = null }) => {
  const navigate = useNavigate()

  const logOut = (e) => {
    e.preventDefault()
    removeSessionToken();
    localStorage.removeItem("ghrHideUserRestriction")
    window.location.href = "/"
  }

  return (
    <>
      <Navbar id='navbar-main' className='' variant='light' bg="white" expand="lg">
        <Container>
          <NavbarBrand as={Link} to="/">
            <img src={Logo} width="50" className='me-3' alt="" />
            <small className=" d-lg-inline d-none">God's Home of Refuge</small>
          </NavbarBrand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" >
            <Nav className={`${showNav ? "" : "d-none"} ms-lg-auto align-items-center`}>
              <Nav.Link as={Link} to='/' className='ms-lg-3 ' active >Pets</Nav.Link>
              {
                isSignedIn && (
                  <Nav.Link className='ms-lg-3' as={Link} to="/applications" >My Applications</Nav.Link>
                )
              }
              <Nav.Link className='ms-lg-3' as={Link} to='/donation'>Donation</Nav.Link>
              {
                !isSignedIn ? (
                  <>
                    <Nav.Link as={Link} to="/signin" className='ms-4'>SIGN IN</Nav.Link>
                    <div>
                      <Nav.Link as={Link} to="/signup" className='ms-4 btn btn-success text-light btn-sm '>SIGN UP</Nav.Link>
                    </div>
                  </>
                ) : (
                  <Nav.Item href="#link" >
                    <Dropdown id="nav-dropdown">
                      <Dropdown.Toggle className='user-photo' style={{ backgroundImage: `url(${adopter?.photo})` }}>

                      </Dropdown.Toggle>

                      <Dropdown.Menu align="end" className="mt-2">
                        <Dropdown.Item as={Link} to='/account'>My Account</Dropdown.Item>
                        <Dropdown.Item className="text-dark" onClick={logOut} href="#">Log Out</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>
                )
              }

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default NavbarComponent