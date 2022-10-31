import React from 'react'
import ReactDOM from 'react-dom'
export const ELEMENT_ID = "custom-page-loader"
import * as ReactDOMServer from 'react-dom/server';

const PageLoader = () => {
    return (
        <div id={ELEMENT_ID}></div>
    )
}

export default PageLoader;


export const showPageLoader = (message = "Please wait...") => {
    RenderPageLoader(message, true);
}
export const hidePageLoader = () => {
    RenderPageLoader("", false);
}

const RenderPageLoader = (message = "", show = true) => {
    const root = document.getElementById(ELEMENT_ID)

    const element = (
        <div className={`preloader-wrapper ${show ? "show" : ""}`} >
            <div className="content">
                <div className="preloader">
                    <span></span>
                </div>
                <p>{message}</p>
            </div>
        </div>
    )

    root.innerHTML = ReactDOMServer.renderToStaticMarkup(element)
}