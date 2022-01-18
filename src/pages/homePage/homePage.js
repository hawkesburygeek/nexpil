import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { SideBar } from '../../components';
import { AvatarsContainer } from '../../components';
import { sharedColors } from '../../theme/sharedColor';
import { UserDataComponent } from '../../components';
import { GET_PATIENTS_LIST, USER_ROLE_SET } from '../../store/actionNames/homePageActions';
import { useHistory } from "react-router-dom";
import Axios from 'axios';
import { server } from '../../config/server';
import { AddNewPatient } from '../../components/userDataComponent/addNewPatient';

export const HomePage = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const mainPart = useSelector(state => state.mainPart);
    const setMainPart = part => dispatch({ type: "SET_MAIN_SECTION", payload: part });
    const [homeMessage, setHomeMessage] = useState("Good Morning");
    const [homeUserName, sethomeUserName] = useState("Test Admin");
    const [sectionTitle, setSectionTitleFunc] = useState("Test Admin");
    const addNewPatientStatus = useSelector(state => state.addNewPatientStatus);
    const userRole = useSelector(state => state.userRole);
    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
    // const patientList = useSelector(state => state.patientsList);
    // Dispatch the action for get patient list after components mounted
    useEffect(() => {
        dispatch({ type: GET_PATIENTS_LIST });
        checkUserToken();
        setHomeUserData();
        if (userRole === "admin") {
            setSectionTitleFunc("Admin");
        } else if (userRole === "user") {
            setSectionTitleFunc("Patients");
        }
    }, [userRole]);// eslint-disable-line react-hooks/exhaustive-deps

    const setHomeUserData = () => {
        Axios.get(server.serverURL + "v1/home-page", config)
            .then((res) => {
                var data = res.data.data;
                if (data.status === true) {
                    setHomeMessage(data.message);
                    sethomeUserName(data.user_name);
                    if (data.role_id === 1) {
                        dispatch({ type: USER_ROLE_SET, payload: "admin" });
                    } else {
                        dispatch({ type: USER_ROLE_SET, payload: "user" });
                    }
                }
            });
    }

    const checkUserToken = () => {
        var token = localStorage.getItem("token");
        if (!token) {
            history.push("/login");
        }
        history.push('/calendar');
    }

    // Style for the highlighted text color.
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }

    useEffect(() => {
        console.log(" hompage props ==> ", props)
        const { state } = props.location;

        if (state && state.mode) {
            setMainPart("intro");
            dispatch({ type: GET_PATIENTS_LIST });
        }

    }, [props.location])// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="intro-page-container">
            <SideBar select={"patient"} />
            <div className="main-section">
                <AvatarsContainer setSectionTitle={sectionTitle} setMainSection={setMainPart} urlStatus="home" />
                {(mainPart === "intro" && addNewPatientStatus === false) &&
                    <div className="intro-section-part">
                        <div className="intro-page-intro-section" style={{ marginLeft: 20, marginTop: 10 }}>
                            <div>
                                <h1 className="intro-title">{homeMessage}<span style={specialColorFont}>,</span><br />Dr<span style={specialColorFont}>.</span> {homeUserName}</h1>
                                <p className="intro-description">Click on a patient on the left to view<br />their medical record</p>
                            </div>
                        </div>
                    </div>
                }

                {(mainPart !== "intro" && addNewPatientStatus === false) &&
                    <div className="home-page-user-data-container">
                        <UserDataComponent homeUserName={homeUserName} />
                    </div>
                }
                {addNewPatientStatus === true &&
                    <div className="home-page-user-data-container">
                        <div className="data-container">
                            <AddNewPatient />
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}
