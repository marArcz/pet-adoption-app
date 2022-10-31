import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';

// css
import './bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/app.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("app")).render(
    <BrowserRouter basename='/admin'>
        <Main/>
    </BrowserRouter>
)
