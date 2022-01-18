import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GET_USER, SET_PATIENT_SELECTED, GET_PATIENT_PERSONAL_DATA, GET_PATIENT_TASK_DATA,
    GET_PATIENT_MEDICATION_DATA, ADD_NEW_PATIENT, GET_PATIENT_HEALTH_DATA, GET_ASSIGNED_DATA
} from '../../store/actionNames';
import './style.css';
import { BsSearch, BsFillPlusCircleFill, BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { sharedColors } from '../../theme/sharedColor';
// import { useHistory } from "react-router-dom";
// import VizSensor from 'react-visibility-sensor';
// import { Fade } from '@material-ui/core';

export const AvatarsContainer = ({ setMainSection, setSectionTitle }) => {
    const dispatch = useDispatch();
    // const history = useHistory();
    // const [active, setActive] = useState(false);
    const patientList = useSelector(state => state.patientsList);
    const patientSelect = useSelector(state => state.patientSelect);
    
    const [arrowDirection, setArrowDirection] = useState(true);
    const [usersData, setUsersData] = useState([]);

    let check_user_name = "";

    // Style for the highlighted text.
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }
    const showAvatar = useRef();

    // select user
    const onHandleClickAvatar = (selectedUser) => {
        const selectedUserId = selectedUser.id;
        const user = usersData.find(user => user.id === selectedUserId);
        const patient = patientList.find(patient => patient.id === selectedUserId);

        if (user && patient) {
            console.log(" selected user ======> ", user);
            console.log(" selected patient ======> ", patient);

            if (setMainSection) setMainSection("userData");
            dispatch({ type: GET_USER, payload: patient });
            dispatch({ type: SET_PATIENT_SELECTED, payload: user });

            dispatch({ type: GET_PATIENT_PERSONAL_DATA, payload: user.id });
            dispatch({ type: GET_PATIENT_MEDICATION_DATA, payload: user.id });
            dispatch({ type: GET_PATIENT_HEALTH_DATA, payload: user.id });
            dispatch({ type: GET_ASSIGNED_DATA, payload: user.id });
            dispatch({ type: GET_PATIENT_TASK_DATA, payload: user.id });
            dispatch({ type: ADD_NEW_PATIENT, payload: false });
        }
    }

    useEffect(() => {
        const selectedUserId = patientSelect ? patientSelect.id : null;
        const newUsersData = patientList && Array.isArray(patientList)
            ? patientList.map(patient => {
                if (selectedUserId === patient.id) return { ...patient, selected: true };
                return { ...patient, selected: false };
            })
            : [];
        setUsersData(newUsersData);

        const width = window.innerWidth;
        if (width <= 890) {
            showAvatar.current.className = showAvatar.current.className === "avatar-main-section" ? "avatar-main-section-showed" : "avatar-main-section";
            setArrowDirection(true);
        }
    }, [patientList, patientSelect]);

    // Show patients list when mobile responsive
    const onToggleAvatar = () => {
        showAvatar.current.className = showAvatar.current.className === "avatar-main-section" ? "avatar-main-section-showed" : "avatar-main-section";
        setArrowDirection(!arrowDirection);
    }

    const onHandleSearch = (str) => {
        if (str) {
            var filteredUsers = patientList.filter(user => user.patient_name.toLowerCase().includes(str.toLowerCase()));
            setUsersData(filteredUsers);
        } else setUsersData(patientList);
    }

    const onClickAddNewPatient = () => dispatch({ type: ADD_NEW_PATIENT, payload: true });

    return (
        <div className="avatars">
            <div className="show-avatars" onClick={() => onToggleAvatar()}>
                {arrowDirection ? <BsChevronCompactDown color="white" /> : <BsChevronCompactUp color="white" />}
            </div>
            <div className="avatar-main-section" ref={showAvatar}>
                <div className="avatars-title-container">
                    <h1 className="avatars-title-text">
                        {setSectionTitle}
                        <span style={specialColorFont}>.</span></h1>
                    <BsFillPlusCircleFill onClick={onClickAddNewPatient} color={sharedColors.primaryButtonsColor} className="avatars-title-add-button" />
                </div>
                <div className="search-bar">
                    <BsSearch size="18px" color={sharedColors.primaryFontColor} className="search-icon" />
                    <input onChange={ev => onHandleSearch(ev.target.value)} type="text" placeholder="Search" className="search-input" />
                </div>
                <div className="users-avatar" id="avatar-scrollbar">
                    {
                        usersData && usersData.map((user, index) => {
                            let userNameSpan = "";
                            if (check_user_name !== user.patient_name.slice(0, 1).toUpperCase()) {
                                userNameSpan = <div>{user.patient_name.slice(0, 1).toUpperCase()}</div>;
                                check_user_name = user.patient_name.slice(0, 1).toUpperCase();
                            }
                            return (<Avatar key={index} onHandleClickAvatar={() => onHandleClickAvatar(user)} user={user} userNameSpan={userNameSpan} />);
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export const Avatar = (props) => {
    // const dispatch = useDispatch();
    // const history = useHistory();
    const domRef = React.useRef();
    const [isVisible, setVisible] = React.useState(false);
    useEffect(() => {
        const options = {
            root: document.querySelector('#avatar-scrollbar'),
            rootMargin: '-70px',
            // threshold: [0.98, 0.99, 1]
        }
        const observer = new IntersectionObserver(entries => {
            setVisible(entries[0].isIntersecting);
            if (!entries[0].isIntersecting) {
                setVisible(false);
            }
        }, options);

        observer.observe(domRef.current);

        return () => observer.unobserve(domRef.current);// eslint-disable-line react-hooks/exhaustive-deps
    }, []);
    const { user, userNameSpan } = props;

    return (
        <div ref={domRef} id="avatar-item">
            {userNameSpan}
            <div onClick={() => props.onHandleClickAvatar(user)}
                className={`${isVisible ? 'is-visible' : 'is-invisible'} ${user.selected === false ? "user-avatar" : "user-avatar-selected"}`}>
                <img className="avatar-image" src={user.userimage} alt={user.userimage} />
                <div className="user-info">
                    <p className="user-name-text">{user.patient_name}</p>
                    <p className="user-chats-text">{user.DOB}</p>
                </div>
                {/* <div className="chat-info-part">
                        <p className={user.selected === false ? "chat-date" : "chat-date-selected"}>Jul 29</p>
                    </div> */}
            </div>
        </div>
    );
}