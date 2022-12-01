import React, { useEffect, useState } from 'react';
import {Link } from 'react-router-dom';

import LogOutIcon from './icons/logout.svg';
import FriendIcon from './icons/friend.svg';
import AddFriendModal from '../add-friend-modal';
import {post} from '../../api';
import "./style.css";


export const NavBar = () => {

    const [userInfo, setUserInfo] = useState({});
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const inviteFriend = (friend) => {
        post("/invitation", friend).then(result => {
            console.log(result.data);
            setShow(false);
        });
    }
    useEffect(() => {
        const user = sessionStorage.getItem("user_info");
        setUserInfo(JSON.parse(user));
    }, []);

    return (
        <div className="nav-container">
            <nav className="navbar navbar-light">
                <div className="nav-btn">
                    <Link to={'/home'} className="navbar-brand link"> Foods </Link>
                    {userInfo.isAdmin && <Link to={'/stats'} className="navbar-brand link">Statistics</Link>}
                </div>
                <div className="nav-btn">
                    <img src={FriendIcon} className="nav-icon" onClick={handleShow}/>
                    <Link to={'/'} className="navbar-brand link"> 
                        <img src={LogOutIcon} className="nav-icon link"/>
                    </Link>
                </div>
            </nav>
            {show && <AddFriendModal show={show} onClose={handleClose} onSubmit={inviteFriend} />}
        </div>
    );
}

export default NavBar
