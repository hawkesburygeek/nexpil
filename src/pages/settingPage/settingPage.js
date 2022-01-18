import React from 'react';
import './style.css';
import { SideBar } from '../../components';
import { Setting } from '../../components/settingComponent'
export const SettingPage = () => {
    // eslint-disable-next-line
    const form = React.useRef();
    return (
        <div className="intro-setting-container">
            <SideBar select={"setting"} />
            <div className="main-section">
                <div style={{
                    position: "absolute",
                    left: 250,
                    top: 150,
                    color: "red",
                    fontSize: "larger",
                    fontWeight: 600,
                }}>
                    <span>v1.92</span>
                </div>
                <Setting />
            </div>
        </div>
    )
}
