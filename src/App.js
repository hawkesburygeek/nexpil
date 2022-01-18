import React, { useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import {
  HomePage,
  PatientPage,
  ChatPage,
  CalendarPage,
  NotificationPage,
  SettingPage,
  UserDetailPage,
  LoginPage,
  RegisterPage,
  TelehealthPage,
  ProfilePage,
} from './pages';
import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { routers } from './config/router';
import Echo from 'laravel-echo';
import { useDispatch, useSelector } from 'react-redux';
import Pusher from 'pusher-js';
import jwt_decode from "jwt-decode";

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

import './App.css';
import { ADD_NEW_PATIENT, GET_ASSIGNED_DATA, GET_PATIENT_HEALTH_DATA, GET_PATIENT_MEDICATION_DATA, GET_PATIENT_PERSONAL_DATA, GET_PATIENT_TASK_DATA, GET_USER, SET_PATIENT_SELECTED } from './store/actionNames';

// window.Pusher = require('pusher-js');

// console.log("process.env :: ", process.env)
// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   // key: process.env.MIX_PUSHER_APP_KEY,
//   // cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//   key: "289fb69b45fa3edfc19d",
//   cluster: "mt1",
//   wsHost: window.location.hostname,
//   wsPort: 6001,
//   wssPort: 6001,
//   disableStats: true,
//   enabledTransports: ['ws', 'wss'],
//   forceTLS: false,
// });
var pusher = new Pusher('289fb69b45fa3edfc19d', {
  cluster: 'mt1'
});
var channel = pusher.subscribe('my-channel');

function App() {
  
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.userInfo);
  const patientsList = useSelector(state => state.patientsList);


  // useBeforeunload(() => { localStorage.removeItem('token'); });

  useEffect(() => {
    // if (jwt_decode(token).exp < Date.now() / 1000) {
    //   localStorage.clear();
    // }
    channel.bind('my-event', function (data) {
      const { patient, task } = data.payload;
      const patientFullName = patient["first_name"] + " " + patient["last_name"];
      if (Array.isArray(patientsList) && patientsList.length > 0) {
        store.addNotification({
          title: `${patientFullName} has completed a task.`,
          message: <a style={{ color: "#0e9ef3" }} onClick={() => onClickViewResults(patient, task)}>View Results</a>,
          type: "info",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 10000,
            onScreen: true,
            pauseOnHover: true,
            click: false,
            touch: false,
            showIcon: true,
          }
        });
      }
    });
  }, [patientsList]);
  console.log(" patientsList---------- first ", patientsList)
  const onClickViewResults = (user, task) => {
    const selectedUserId = user.id;
    const patient = patientsList.find(item => item.id === selectedUserId);
    console.log(" patientsList---------- inside ", patientsList)
    console.log(" user---------- ", user)
    console.log(" patient---------- ", patient)
    if (patient) {
      dispatch({ type: "SET_MAIN_SECTION", payload: "userData" });

      dispatch({ type: GET_USER, payload: patient });
      dispatch({ type: SET_PATIENT_SELECTED, payload: patient });

      dispatch({ type: GET_PATIENT_PERSONAL_DATA, payload: user.id });
      dispatch({ type: GET_PATIENT_MEDICATION_DATA, payload: user.id });
      dispatch({ type: GET_PATIENT_HEALTH_DATA, payload: user.id });
      dispatch({ type: GET_ASSIGNED_DATA, payload: user.id });
      dispatch({ type: GET_PATIENT_TASK_DATA, payload: user.id });
      dispatch({ type: ADD_NEW_PATIENT, payload: false });
    } else alert("Notified patient is not in the patient list.");
  }
  return (
    <div className="super-container">
      <div className="page-main-container">
        <Switch>
          <Route path={routers.HOMEPAGE} exact component={HomePage} />
          <Route path={routers.PATIENTPAGE} exact component={PatientPage} />
          <Route path={routers.CHATPAGE} component={ChatPage} />
          <Route path={routers.CALENDAR_PAGE} component={CalendarPage} />
          <Route path={routers.NOTIFICATION} component={NotificationPage} />
          <Route path={routers.SETTINGS} component={SettingPage} />
          <Route path={routers.DETAIL_PAGE} component={UserDetailPage} />
          <Route path={routers.LOGINPAGE} component={LoginPage} />
          <Route path={routers.REGISTERPAGE} component={RegisterPage} />
          <Route path={routers.SETTINGPAGE} component={SettingPage} />
          <Route path={routers.TELEHEALTHPAGE} component={TelehealthPage} />
          <Route path={routers.PROFILEPAGE} component={ProfilePage} />

        </Switch>
        <ReactNotification />
      </div>
    </div>
  );
}

export default App;
