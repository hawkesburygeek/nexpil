import React, { useEffect, useState } from 'react';
import './style.css';
import { SideBar } from '../../components';
import { Calendar } from '../../components';
import { useHistory } from 'react-router';

export const CalendarPage = () => {
    const history = useHistory();
    useEffect(() => {
        checkUserToken();
    }, []);
    const checkUserToken = () => {
        var token = localStorage.getItem("token");
        if (!token) {
            history.push("/login");
        } else {
            history.push("/calendar");
        }
    }
    return (
        <div className="intro-page-container">
            <SideBar select={"calendar"} />
            <div className="calendar-main-section">
                <Calendar />
            </div>
        </div>
    )
}
