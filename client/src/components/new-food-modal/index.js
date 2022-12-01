
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './style.css';


const NewFoodModal = ({show, onClose, onSubmit}) => {
    const [error, setError] = useState(null);
    const [food, setFood] = useState({"name": "", "calories": ""});
    
    const onChangeValue = (event) => {
        const {name, value} = event.target;
        const newFood = {...food};
        newFood[name] = value;
        setFood(newFood);
    }

    return (
        <>
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add new food entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <input type="text" placeholder="Food Name (e.g Milk)" name="name"
                    className="form-control" value={food.name} onChange={onChangeValue}/>
                </div>
                <div className="mb-3">
                    <input type="number" placeholder="Calories of food (e.g 149)" name="calories"
                    className="form-control"  value={food.calories} onChange={onChangeValue}/>
                </div>
                {error && <div className="error"><small>{error}</small></div>}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => onSubmit(food)} disabled={!food.name || !food.calories}>
                Submit
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default NewFoodModal;