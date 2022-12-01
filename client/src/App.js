import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import NavBar from './components/navbar';
import Login from './components/login';
import Home from './components/home';

import './App.css';
import Stats from './components/stats';


const App = () => {

    const { pathname } = useLocation();

    return (
        <div className="app">
            {pathname !== "/" && <NavBar />}
            <Routes>
                <Route path="/" exact element={<Login />} />
                <Route path='/home' exact element={<Home />} />
                <Route path='/stats' exact element={<Stats />} />
            </Routes>
        </div>
    )
}

export default App;