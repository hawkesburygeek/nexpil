import React from 'react';
import './style.css';
import { SideBar } from '../../components';

export const NotificationPage = () => {
    return (
        <div>
            <div className="intro-page-container">
                <SideBar select={"notify"} />
                <div className="main-section"></div>
            </div>
        </div>
    )
}
