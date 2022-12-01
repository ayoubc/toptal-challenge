import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { post } from "../../api";
import './style.css';

const ADMIN_ROLE = "admin";


const Login = () => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState({"email": "", "password": ""});
    
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        post("/login", user).then(({data}) => {
            data.isAdmin = data.role === ADMIN_ROLE;
            sessionStorage.setItem("user_info", JSON.stringify(data));
            navigate("/home");
        }).catch((error) => {
            console.error(error);
            setError(error.detail || error.message);
        });
    }

    const onChangeValue = (event) => {
        const {name, value} = event.target;
        const newUser = {...user};
        newUser[name] = value;
        setUser(newUser);
    }

    useEffect(() => {
        sessionStorage.removeItem("user_info");
    });

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <input type="email" placeholder="Email address" name="email"
                    className="form-control" value={user.email} onChange={onChangeValue}/>
                </div>
                <div className="mb-3">
                    <input type="password" placeholder="Password" name="password"
                    className="form-control"  value={user.password} onChange={onChangeValue}/>
                </div>
                {error && <div className="error"><small>{error}</small></div>}
                <button type="submit" className="btn btn-primary" disabled={!user.email || !user.password}>Submit</button>
            </form>
        </div>

    )
}

export default Login;