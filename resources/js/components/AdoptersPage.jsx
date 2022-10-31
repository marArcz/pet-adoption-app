import { hidePageLoader, showPageLoader } from '@/user-pages/PageLoader';
import { showSuccessToast } from '@/user-pages/ToastNotification';
import { hide } from '@popperjs/core';
import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button, Card, Container, Dropdown, Tab, Table, Tabs } from 'react-bootstrap'

const AdoptersPage = () => {

    const [key, setKey] = useState('registered');
    const [adopters, setadopters] = useState([]);

    const loadAdopters = async () => {
        return await axios.get("/adopters/getAll")
            .then((res) => {
                setadopters(res.data);
                return res
            })
            .catch(err => err)
    }

    useEffect(() => {
        loadAdopters();
    }, [])

    const onTabSelect = () => {

    }

    const deleteAdopter = (adopter) => {
        showPageLoader()
        axios.get("/adopters/delete/" + adopter.account.id)
            .then(async (res) => {
                await loadAdopters();
                hidePageLoader();
                showSuccessToast("Successfully deleted!");


            })
    }

    const activateAccount = (adopter) => {
        showPageLoader()
        axios.post("/adopters/update-status", {
            id: adopter.id,
            status: 1
        })
            .then(async (res) => {
                await loadAdopters()
                hidePageLoader()
                showSuccessToast("Successfully updated!");

            })
    }

    const deactivateAccount = (adopter) => {
        showPageLoader()
        axios.post("/adopters/update-status", {
            id: adopter.id,
            status: 0
        })
            .then(async (res) => {
                await loadAdopters()
                hidePageLoader()
                showSuccessToast("Successfully updated!");

            })
    }

    return (
        <div className='py-2'>
            <h5 className='text-success'>Adopters</h5>
            <hr />

            <Card className='shadow-sm border-0 rounded-0'>
                <Card.Body>
                    <Tabs
                        id='adopters-tabs'
                        activeKey={key}
                        onSelect={onTabSelect}
                    >
                        <Tab eventKey="registered" title="Registered Adopters">
                            <div className='pt-3 mx-lg-2 table-responsive-sm'>
                                <Table className='align-middle'>
                                    <thead>
                                        <tr>
                                            <th>Photo</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Date Joined</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            adopters && adopters.map((adopter, index) => {
                                                let date = new Date(adopter.created_at)
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <img src={adopter.photo} className="img-fluid img-thumbnail" width="40" alt="" />
                                                        </td>
                                                        <td>{adopter.firstname} {adopter.lastname}</td>
                                                        <td>{adopter.account.email}</td>
                                                        <td>{date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()}-{date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-{date.getFullYear()}</td>
                                                        <td>
                                                            <Dropdown>
                                                                <Dropdown.Toggle size='sm' className='text-light' variant={adopter.status === 1?"success":"poppy"} id="dropdown-basic">
                                                                    {adopter.status === 1 ? "Active" : "Inactive"}
                                                                </Dropdown.Toggle>

                                                                <Dropdown.Menu className='shadow' align="end">
                                                                    <Dropdown.Item as="button" onClick={()=>activateAccount(adopter)}>Active</Dropdown.Item>
                                                                    <Dropdown.Item as="button" onClick={()=>deactivateAccount(adopter)}>Inactive</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                        <td>
                                                            <Button variant='poppy' onClick={() => deleteAdopter(adopter)} className='text-light' size='sm'><i className='bx bx-trash'></i></Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}

export default AdoptersPage
