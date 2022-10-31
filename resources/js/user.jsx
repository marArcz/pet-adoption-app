import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// css
import './bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/css/app.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/css/users.css'
import App from './user-pages/App';

axios.defaults.baseURL = 'https://ghr-pet-adoption.herokuapp.com/api';

ReactDOM.createRoot(document.getElementById("app")).render(
    <BrowserRouter basename='/'>
       <App/>
    </BrowserRouter>
)
