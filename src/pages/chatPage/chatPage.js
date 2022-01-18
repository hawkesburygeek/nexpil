import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './style.css';
import { ChatAvatarsContainer, SideBar } from '../../components';
import { ChatWindow } from '../../components';
import { ChatUserInfo } from '../../components';
// import { GET_PATIENTS_LIST, SET_CHAT_CHANNEL } from '../../store/actionNames/homePageActions';
import VideoChat from '../../components/chatWindow/VideoChat';
import { useHistory } from 'react-router';
import { jwt } from 'twilio';

export const ChatPage = () => {
    const dispatch = useDispatch(); 
    
    // const settedPatient = useSelector(state => state.setPatientChat);
    const [videoCallStatus, setVideoCallStatus] = useState(0);
    const [channelName, setChannelName] = useState("");
    const [videoToken, setVideoToken] = useState("");
    // const [setChatLoad] = useState(false);
    const history = useHistory();
    const [chatInfo, setChatInfo] = useState("");
    const [selPatient, setSelPatient] = useState(0);

    const createNewRoom = (token, channel) => {
        /*   console.log(token, channel, "token n channel") */
        if (token && channel) {
            setChannelName(channel);
            setVideoToken(token);
            setVideoCallStatus(1);
        } else {
            alert("you didn't choose the user");
        }
        window.location.href = "/chat/" + chatInfo + "?info=video";
    }

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const foo = params.get('info');
        const channelName = params.get('channelName');
        const videoToken = params.get('videoToken');
        if(foo == "videocall" || foo == "video") {
            setVideoCallStatus(1);
            setChannelName(channelName);
            setVideoToken(videoToken);
            
        }
        dispatch({ type: 'GET_USER_CHAT', payload: {} });
        dispatch({ type: 'GET_PATIENT_MEDICATION_DATA', payload: "" });
        dispatch({ type: 'GET_ASSIGNED_DATA', payload: "" });
        checkUserToken();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const checkUserToken = () => {
        var token = localStorage.getItem("token");
        if (!token) {
            history.push("/login");
        } else {
            let pathName = window.location.pathname;
            setChatInfo(pathName.split("/")[2]);
        }
    }

    // const loadingSuccess = () => {
    //     setChatLoad(true);
    // }

    const getChannelName = (e, id) => {
        setChatInfo(e);
        setSelPatient(id);
        history.push("/chat/" + e);
    }

    let render = (
        <div className="chat-page-container">
            <SideBar select={"chat"} />
            <div className="main-section">
                <ChatAvatarsContainer getChannelName={getChannelName} />
                <div className="chat-section-part">
                    <div className="chat-page-section">
                        <div className="chatting-section">
                            <ChatWindow chatInfo={chatInfo} setVideoCall={createNewRoom} />
                        </div>
                    </div>
                    <div className="chatting-user-info-section" style={{ display: "block", overflow: "auto" }}>
                        <ChatUserInfo selPatient={selPatient}/>
                    </div>
                </div>
            </div>
        </div>
    );

    if (videoCallStatus === 1) {
        render = (
            <VideoChat roomName={channelName} token={videoToken} chatInfo={chatInfo} />
        );
    }
    return render;
}

