
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './style.css';


const AddFriendModal = ({show, onClose, onSubmit}) => {
    const [error, setError] = useState(null);
    const [friend, setFriend] = useState({"name": "", "email": ""});
    
    const onChangeValue = (event) => {
        const {name, value} = event.target;
        const newFriend = {...friend};
        newFriend[name] = value;
        setFriend(newFriend);
    }

    return (
        <>
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Invite Friend</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <input type="text" placeholder="Name" name="name"
                    className="form-control" value={friend.name} onChange={onChangeValue}/>
                </div>
                <div className="mb-3">
                    <input type="email" placeholder="email" name="email"
                    className="form-control"  value={friend.email} onChange={onChangeValue}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => onSubmit(friend)} disabled={!friend.name || !friend.email}>
                Submit
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default AddFriendModal;