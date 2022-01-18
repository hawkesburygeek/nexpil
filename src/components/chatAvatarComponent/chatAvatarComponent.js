import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_PATIENT_MEDICATION_DATA, GET_ASSIGNED_DATA, GET_USER_CHAT, GET_PATIENT_PERSONAL_ALLERGY } from '../../store/actionNames';
import './style.css';
import { BsSearch } from "react-icons/bs";
import { sharedColors } from '../../theme/sharedColor';
import jwt from 'jwt-simple';
import axios from 'axios';
import { server } from '../../config/server';
import date from 'date-and-time';
import moment from 'moment';

export const  ChatAvatarsContainer = ({ getChannelName }) => {
    const currentUrl = window.location.href;
    console.log(getChannelName);
    const dispatch = useDispatch();
    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
    // State variables
    // const [ setArrowDirection] = useState(true);
    const [chatPatientList, setChatPatientList] = useState([]);
    const [usersData, setUsersData] = useState([]);
    let check_user_name = "";

    // Style for the highlighted text.
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }
    const showAvatar = useRef();

    // Set usersData to data from server
    useEffect(() => {
        axios.get(server.serverURL + 'v1/chat-patients', config)
            .then(res => {
                var data = res.data;
                console.log(data);
                setChatPatientList(data.data.results);
                setUsersData(data.data.results);
            });
            // setTimeout(autoToken, 2000);
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    const setChatToken = (data) => {
        let channelName = localStorage.userId + "/" + data["id"];
        channelName = channelName.replace(/ /g, "");
        let chatUserInfo = {
            send: localStorage.userId,
            sender: localStorage.userName,
            s_phone_number: localStorage.phone_number,
            sendImage: localStorage.userImage,
            receive: data["id"],
            receiver: data["patient_name"],
            r_phone_number: data["phone_number"],
            receiveImage: data["userimage"],
            channelName: channelName,
            date: data["DOB"],
            userInfo: data
        }
        getChannelName(jwt.encode(chatUserInfo, "xxx"), data["id"]);
    }

    const setHighlightedUser = (userItem) => {
        console.log(usersData[userItem]);
        setChatToken(usersData[userItem])
        let virtualArray = [];
        for (let i = 0; i < usersData.length; i++) {
            if (i !== userItem) virtualArray.push({ ...usersData[i], selected: false });
            if (i === userItem) virtualArray.push({ ...usersData[i], selected: true })
        }
        setUsersData(virtualArray);
        dispatch({ type: GET_USER_CHAT, payload: usersData[userItem] });
        dispatch({ type: GET_PATIENT_MEDICATION_DATA, payload: usersData[userItem].id });
        dispatch({ type: GET_ASSIGNED_DATA, payload: usersData[userItem].id });
        // dispatch({ type: GET_PATIENT_PERSONAL_ALLERGY, payload: usersData[userItem].id })
    }


    const handleSearch = (str) => {
        if (str) {
            const filteredUsers = chatPatientList.filter(user => user.patient_name.toLowerCase().includes(str.toLowerCase()));
            setUsersData(filteredUsers);
        } else setUsersData(chatPatientList);
    }
    return (
        <div className="avatars">
            <div className="avatar-main-section" ref={showAvatar}>
                <div className="avatars-title-container">
                    <h1 className="avatars-title-text">Chat<span style={specialColorFont}>.</span></h1>
                </div>
                <div className="search-bar">
                    <BsSearch size="18px" color={sharedColors.primaryFontColor} className="search-icon" />
                    <input type="text" onChange={ev => handleSearch(ev.target.value)} placeholder="Search" className="search-input" />
                </div>
                <div className="users-avatar" id="avatar-scrollbar">
                    {usersData && usersData.map((user, index) => {
                        if (check_user_name !== user.patient_name.slice(0, 1).toUpperCase()) {
                            check_user_name = user.patient_name.slice(0, 1).toUpperCase();
                        }
                        const chatDate = user.chat_date ? moment(user.chat_date).format("MMM DD") : "";
                        return (
                            <div key={index}>
                                {/* { userNameSpan } */}
                                <div onClick={() => setHighlightedUser(index)} className={user.selected === false ? "user-avatar" : "user-avatar-selected"}>
                                    <img className="avatar-image" src={user.userimage} alt={user.userimage} />
                                    <div className="user-info">
                                        <p className="user-name-text">{user.patient_name}</p>
                                        <p className="user-chats-text">{user.recent_chat}</p>
                                    </div>
                                    <div className="chat-info-part">
                                        <p className={user.selected === false ? "chat-date" : "chat-date-selected"}>{chatDate}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    )}
                </div>
            </div>
        </div>
    )
}
