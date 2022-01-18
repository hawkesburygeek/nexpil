import React, { useEffect } from 'react';
import '../style.css';
import './style.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import LabResultBody from './labResultBody';
import { server } from '../../../config/server';
import axios from '../../../api/axios';

export const LabResult = () => {
    const user = useSelector(state => state.patientSelect);
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchHealthData = () => {
            axios.get("v1/patient-lab-data/" + user.id).then(({ data }) => {
                console.log(" ======== Patient Lab Data for user response ===> ", data);
                setData(data);
            }).catch(error => {
                console.log("Error during fetch Patient Lab Data.");
            })
        };
        if (user.id) fetchHealthData();
    }, [user]);// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="card-section">
            <h1 className="card-title">Lab Results</h1>
            <LabResultBody data={data} title={"lab"} />
        </div >
    )
}
