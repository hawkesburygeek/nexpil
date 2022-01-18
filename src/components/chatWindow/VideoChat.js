import React, { useState, useCallback, useEffect } from 'react';
import Room from './Room';
import { useHistory } from 'react-router';
import { SideBar } from '../sideBar';
import { ChatWindow } from './chatWindow';
import { DoctorNotes } from '../userDataComponent/doctorNotes/doctorNotes';
import { Link } from "react-router-dom";
import { Management } from './Management'
import jwt from 'jwt-simple';
import Moment from 'moment';

const VideoChat = ({ roomName, token, chatInfo, }) => {
  // const [username, setUsername] = useState('');
  const history = useHistory();
  const [setVideoCallStatus] = useState(0);
  const [patient, setPatient] = React.useState('');
  // const [channelName, setChannelName] = useState("");
  // eslint-disable-next-line
  const createNewRoom = () => {
    setVideoCallStatus(1);
  }
  // eslint-disable-next-line
  const config = {
    headers: {
      'Authorization': 'Bearer ' + localStorage.token
    }
  }

    useEffect(()=>{
      let data = jwt.decode(chatInfo, "xxx");
      let patient = data.userInfo;
      setPatient(patient);
    }, [chatInfo]);

    const [second, setSecond] = useState('00');
    const [minute, setMinute] = useState('00');
    const [isActive, setIsActive] = useState(true);
    const [counter, setCounter] = useState(0);

    // useEffect(() => {
    //   let intervalId;
  
    //   if (isActive) {
    //     intervalId = setInterval(() => {
    //       const secondCounter = counter % 60;
    //       const minuteCounter = Math.floor(counter / 60);
  
    //       const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}`: secondCounter;
    //       const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}`: minuteCounter;
  
    //       setSecond(computedSecond);
    //       setMinute(computedMinute);
  
    //       setCounter(counter => counter + 1);
    //     }, 1000)
    //   }
  
    //   return () => clearInterval(intervalId);
    // }, [isActive, counter])
    
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const foo = params.get('info');
    const handleLogout = useCallback(event => {
      if(foo == "videocall"){
        // history.push("/calendar");
        // window.location.reload();
        window.location.href = "/calendar";
      }
      else {
        // history.push("/chat");
        // window.location.reload();
        window.location.href = "/chat";
      }
    });
    let dates = Date()
  let render;
  render = (
    <div style={{ width: "100%", height: "100%" }}>
      <SideBar select={"chat"} />
      <div className="main-section">
        <div style={{ width: "100%", height: "100%" }}>
          <div className="row video-window d-flex" style={{ width: "96%", height: "68vh", minHeight: "66vh", marginBottom: "30px" }}>
            <div className="col-6" style={{ height: "100%" }}>
            <div className="tele-icon d-flex justify-content-between">
                <img src="/assets/images/tele-icon.png" width={230}/>                
                <div className="btn btn-indigo" style={{height:39, width:81}} onClick={handleLogout}>Back</div>
            </div>            
                <div className="d-flex justify-content-between fw-600">
                    <div>
                        <div>Call Duration</div>
                        <div>{minute} : {second}</div>
                    </div>
                    <div>
                        <div>{patient.patient_name} - {Moment(patient.DOB).format('MM/DD/YYYY')}</div>
                    </div>
                </div>
              <div className="card-section" style={{
                width: "100%",
                height: "90%",
                padding: 0
              }}>
                
                <Room roomName={roomName} token={token} handleLogout={handleLogout} />
              </div>
            </div>            
            <div className="col-6 bg-white manageradius">
              <Management page={"video"} roomName={roomName} chatInfo={chatInfo} />
            </div>         
          </div>
        </div>
      </div>
    </div>
  );
  return render;
};

export default VideoChat;
