import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

import {get} from "../../api";
import "./style.css";


export const Stats = () => {

    const [stats, setStats] = useState(null);

    const getStats = () => {
        get("/stats").then( result => {
            setStats(result.data);
        }).catch(error => {
            console.error(error);
        })
    }

    useEffect(() => {
        getStats();
    }, []);

    if(!stats) return ;
    return (
        <div style={{padding: "50px 0"}}>
            <div style={{padding: "30px 0"}}>
                <h5 className="h-stats">Number of added entries</h5>
                <div><strong>Today:</strong> {stats.added_entries.today}</div>
                <div><strong>Last 7 days:</strong> {stats.added_entries.last_7}</div>
                <div><strong>Week before:</strong> {stats.added_entries.last_14}</div>
            </div>
            <TableAverageCalories stats={stats.average_calories_per_user} />
        </div>
    );
}



const TableAverageCalories = ({ stats }) => {
    return (
        <>
            <h5 className="h-stats">The average number of calories added per user for the last 7 days</h5>
            <Table>
                <thead>
                    <tr>
                        <th scope="col">User</th>
                        <th scope="col">Average Calories</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat, index) => {
                        return (
                            <tr key={index} >
                                <td>{stat.email}</td>
                                <td>{stat.calories}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

export default Stats
