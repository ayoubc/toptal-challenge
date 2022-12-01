import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Accordion } from 'react-bootstrap';

import NewFoodModal from '../new-food-modal';
import SelectTag from '../select-tag';
import DeleteIcon from "./icons/delete.svg";
import SaveIcon from "./icons/save.svg";
import EditIcon from "./icons/edit.svg";
import { get, post, _delete, put } from "../../api";
import './style.css';



const Home = () => {
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [userInfo, setUserInefo] = useState({});
    const [stats, setStats] = useState(null);
    const [meals, setMeals] = useState([]);

    const getFoods = (id) => {
        get(`/foods/${id}`).then((result) => {
            setFoods(result.data.data.map(food => {
                return { ...food, editMode: false };
            }));
        }).catch(error => {
            console.error(error);
            setError(error.message);
        });
    }

    const getStats = (user) => {
        if (user.isAdmin) return;
        get(`/stats/${user.id}`).then((result) => {
            setStats(result.data);
        }).catch(error => {
            console.error(error);
            setError(error.message);
        });
    }

    const addFood = (food) => {
        post("/foods", { ...food, created_by: userInfo.id }).then((result) => {
            setFoods([...foods, result.data.data]);
            setShow(false);
            getStats(userInfo);
        }).catch(error => {
            console.error(error);
            setError(error.message);
        });
    }

    // operations: save, edit, delete 
    const updateFood = (index, properties) => {
        // delete operation
        if (!properties) {
            console.log(foods[index].id)
            _delete(`/foods/${foods[index].id}`).then(result => {
                foods.splice(index, 1);
                console.log(result);
                setFoods([...foods]);
            }).catch(error => console.error(error));
        }
        else {
            // update operation
            foods[index] = Object.assign(foods[index], properties);

            // save operation
            if (!foods[index].editMode) {
                let food = { ...foods[index] };
                delete food.editMode;
                put("/foods", food).then(result => {
                    console.log("Saved correctly: ", result);
                    setFoods([...foods]);
                })
            }
            // otherwise just an update
            else setFoods([...foods]);
            // setFoods([...foods]);
        }
    }
    const getMeals = () => {
        get("/meals").then(result => {
            setMeals(result.data);
        })
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user_info"));
        setUserInefo(user);
        getFoods(user.id);
        getStats(user);
        getMeals();
    }, []);
    return (
        <>
            <div className="menu-container">
                <div className="menu">
                    {foods && <TableMenu foods={foods} user={userInfo} onChange={updateFood} meals={meals}/>}
                    {error && <div className="error"><small>{error}</small></div>}
                    {!error && !foods && <p>No Foods Available</p>}
                    {show && <NewFoodModal show={show} onClose={handleClose} onSubmit={addFood} />}
                    <button className="btn btn-primary add-food-btn" onClick={handleShow}>Add Food</button>
                </div>
                {
                    !userInfo.isAdmin &&
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Statistics</Accordion.Header>
                            <Accordion.Body>
                                {stats && <TableCalories stats={stats} limit={userInfo.threshold} />}
                                {!stats && <p>No stats Available</p>}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                }
            </div>
        </>
    )
}

const TableMenu = ({ foods, user, onChange, meals }) => {

    const onSave = (index) => {
        onChange(index, { editMode: false });
    }
    const onDelete = (index) => {
        onChange(index, null);
    }
    const onEdit = (index) => {
        onChange(index, { editMode: true });
    }
    const onAddTag = (foodIndex) => {
        return (tagIndex) => {
            const newFood = { ...foods[foodIndex] };
            newFood.tags.push(meals[tagIndex]);
            onChange(foodIndex, newFood);
        }
    }
    const onChangeValue = (event, index) => {
        const { name, value } = event.target;
        const newFood = { ...foods[index] };
        newFood[name] = value;
        onChange(index, newFood);
    }
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Calories</th>
                    <th scope="col">Tags</th>
                    {user.isAdmin && <th scope="col">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {foods.map((food, index) => {
                    return (
                        <tr key={index} >
                            <td>
                                <input className={food.editMode ? "form-control" : "read-only"} type="text"
                                    value={food.name} readOnly={!food.editMode} name="name"
                                    onChange={(event) => onChangeValue(event, index)} />
                            </td>
                            <td>
                                <input className={food.editMode ? "form-control" : "read-only"} type="number"
                                    value={food.calories} readOnly={!food.editMode} name="calories"
                                    onChange={(event) => onChangeValue(event, index)} />
                            </td>
                            <td>
                                <span>{food.tags.map(t => t.name).join('-')}</span>
                                <SelectTag tags={meals} existing={food.tags.map(t => t.id)} onSelect={onAddTag(index)}/>
                            </td>
                            {
                                user.isAdmin &&
                                <td>
                                    {!food.editMode && <img className="icon" onClick={() => onEdit(index)} src={EditIcon} />}
                                    {food.editMode && <img className="icon" onClick={() => onSave(index)} src={SaveIcon} />}
    
                                    <img className="icon" onClick={() => onDelete(index)} src={DeleteIcon}/>
                                   
                                </td>
                            }
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}


const TableCalories = ({ stats, limit }) => {
    return (
        <>
            <h6 className="h-stats">Calorie limit warning per day - current threshold: {limit}</h6>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th scope="col">Day</th>
                        <th scope="col">Total Calories</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat, index) => {
                        return (
                            <tr key={index} >
                                <td>{stat.day}</td>
                                <td className={stat.calories > limit ? "over-limit" : ""}>{stat.calories}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}


export default Home;