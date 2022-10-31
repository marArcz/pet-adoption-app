import React from 'react'
import { Form, Nav } from 'react-bootstrap'

const PetFilterMenuComponent = ({ categories = [], categoryId, onSelect }) => {
    return (
        <>
            <Nav className='flex-row '>
                <Nav.Item as="button" onClick={() => onSelect("")} className={`pet-filter-item ${categoryId === "" ? "active" : ""}`}>
                    All
                </Nav.Item>
                {
                    categories && categories.map((category, index) => (
                        <Nav.Item key={index} as={"button"} onClick={() => onSelect(category.id)} className={`pet-filter-item ${category.id === categoryId ? "active" : ""}`}>
                            {category.name}
                        </Nav.Item>
                    ))
                }
            </Nav>

        
        </>
    )
}

export default PetFilterMenuComponent
