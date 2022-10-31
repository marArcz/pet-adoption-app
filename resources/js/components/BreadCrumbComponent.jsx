import React from 'react'
import { Breadcrumb } from 'react-bootstrap'

const BreadCrumbComponent = () => {
    return (
        <Breadcrumb>
            <Breadcrumb.Item active><small>App</small></Breadcrumb.Item>
            <Breadcrumb.Item active><small>Home</small></Breadcrumb.Item>
        </Breadcrumb>
    )
}

export default BreadCrumbComponent
