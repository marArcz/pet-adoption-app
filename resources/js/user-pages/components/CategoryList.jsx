import React from 'react'

const CategoryList = ({ categoryList = [], handleSelect, selected = null }) => {

    const CategoryComponent = ({ category, isSelected, onSelect }) => {
        // if selected
        if (isSelected) {
            return (
                <button type='button' className='btn active category-option me-3' onClick={() => onSelect(category)}>
                    <p className='my-0'>{category.name}</p>
                </button>
            )
        } else { // if category is not selected
            return (
                <button type='button' className='btn category-option me-3' onClick={() => onSelect(category)}>
                    <p className='my-0'>{category.name}</p>
                </button>
            )
        }
    }

    return (
        <div className="category-list px-2 py-4 justify-content-start justify-content-md-center">
            <button type='button' className={`${selected === null?'active':''} btn category-option me-3 `} onClick={() => handleSelect(null)}>
                <p className='my-0'>All</p>
            </button>
            {
                categoryList.map((category, index) => (
                    <CategoryComponent key={index} isSelected={selected?.id === category.id} onSelect={handleSelect} category={category} />
                ))
            }
        </div>
    )
}

export default CategoryList