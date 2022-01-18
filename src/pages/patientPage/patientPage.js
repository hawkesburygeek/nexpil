import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './style.css';
import { SideBar } from '../../components';
import { AvatarsContainer } from '../../components';
import { sharedColors } from '../../theme/sharedColor';
import { UserDataComponent } from '../../components';
import { GET_PATIENTS_LIST } from '../../store/actionNames/homePageActions';
import { useHistory } from "react-router-dom";

export const PatientPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainPart, setMainPart] = useState("intro");


    useEffect(() => {
        const checkUserToken = () => {
            var token = localStorage.getItem("token");
            if (!token) {
                history.push("/login");
            }
        }        
        dispatch({ type: GET_PATIENTS_LIST });
        checkUserToken();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps



    // Style for the highlighted text color.
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }

    // Set main section
    const setMainSection = (part) => setMainPart(part);

    return (
        <div className="intro-page-container">
            <SideBar select={"patient"} />
            <div className="main-section">
                <AvatarsContainer setMainSection={setMainSection} />
                <div className="intro-section-part">
                    {mainPart === "intro" ?
                        <div className="intro-page-intro-section">
                            <div>
                                <h1 className="intro-title">Good Morning<span style={specialColorFont}>,</span><br />Dr<span style={specialColorFont}>.</span> Smith</h1>
                                <p className="intro-description">Click on a patient on the left to view<br />their medical record</p>
                            </div>
                        </div>
                        : <UserDataComponent />
                    }
                </div>
            </div>
        </div>
    )
}
