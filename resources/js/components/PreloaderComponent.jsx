import React from 'react'

const PreloaderComponent = ({message = "Please Wait...",show}) => {
    return (
        <div className={`preloader-wrapper ${show? "show":""}`} >
            <div className="content">
                <div className="preloader">
                    <span></span>
                </div>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default PreloaderComponent
