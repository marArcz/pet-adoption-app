import React from 'react'
import gcashLogo from '../../img/gcash.jpg'
import bdoLogo from '../../img/bdo.jpg'
import paymayaLogo from '../../img/paymaya.png'
import smartLogo from '../../img/smart.jpg'
import BackButton from './components/BackButton'
const DonationPage = () => {
    return (
        <>
            <BackButton />
            <div className='card text-dark bg-success bg-opacity-25 shadow-sm mt-2'>
                <div className="card-body p-4">
                    <div className="row gx-4 gy-3">
                        <div className="col-md">
                            <h3 className='text-dark fs-4 fw-bold mb-4'>Cash Donation</h3>
                            <div className='d-flex mb-3 align-items-center'>
                                <img src={gcashLogo} width="40" className='img-fluid rounded-1' alt="" />
                                <p className='my-1 ms-2'>G Cash</p>
                            </div>
                            <div className=" d-flex fw-bold flex-wrap mb-3 align-items-center">
                                <p className=" me-2 my-1">Christine Lobozana</p>
                                <p className='my-1'>0967 380 2285</p>
                            </div>
                            <div className=" d-flex fw-bold flex-wrap mb-3 align-items-center">
                                <p className=" me-2 my-1">May Ann Navarro</p>
                                <p className='my-1'>0267 664 2945</p>
                            </div>
                            <hr />
                            <div className='d-flex mb-3  mt-4 align-items-center'>
                                <img src={bdoLogo} width="40" className='img-fluid rounded-1' alt="" />
                                <p className='my-1 ms-2'>BDO</p>
                            </div>
                            <div className=" d-flex fw-bold flex-wrap mb-3 align-items-center">
                                <p className=" me-2 my-1">May Ann Navarro</p>
                                <p className='my-1'>002 090 441 824</p>
                            </div>
                            <hr />
                            <div className='d-flex mb-3  mt-4 align-items-center'>
                                <img src={paymayaLogo} width="120" className='img-fluid rounded-1' alt="" />
                                {/* <p className='my-1 ms-2'>PayMaya</p> */}
                            </div>
                            <div className=" d-flex fw-bold flex-wrap mb-3 align-items-center">
                                <p className=" me-2 my-1">May Ann Navarro</p>
                                <p className='my-1'>0926 664 2935</p>
                            </div>
                            <hr />
                            <div className='d-flex mb-3  mt-4 align-items-center'>
                                <img src={smartLogo} width="80" className='img-fluid rounded-1' alt="" />
                                <p className='my-1 ms-2'>Smart Padala</p>
                            </div>
                            <div className=" d-flex fw-bold flex-wrap mb-3 align-items-center">
                                <p className=" me-2 my-1">Hermigilda R. Navarro</p>
                                <p className='my-1'>0915 695 9312</p>
                            </div>
                            <div className=" d-flex fw-bold flex-wrap mb-3 align-items-center">
                                <p className=" me-2 my-1">Account Number</p>
                                <p className='my-1'>5577 5193 3998 4107</p>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <h4 className='fw-bold'>Donation Needs</h4>
                            <ul className="mt-4">
                                <li className="nav-item mb-3">
                                    Dog Food
                                </li>
                                <li className="nav-item mb-3">
                                    Cat Food
                                </li>
                                <li className="nav-item mb-3">
                                    Rice
                                </li>
                                <li className="nav-item mb-3">
                                    Bath Essentials
                                </li>
                                <li className="nav-item mb-3">
                                    Medicine
                                </li>
                                <li className="nav-item mb-3">
                                    Vitamins
                                </li>
                                <li className="nav-item mb-3">
                                    Cat Liiter
                                </li>
                                <li className="nav-item mb-3">
                                    Dog Liiter
                                </li>
                                <li className="nav-item mb-3">
                                    Towels
                                </li>
                                <li className="nav-item mb-3">
                                    Pet Toys
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DonationPage
