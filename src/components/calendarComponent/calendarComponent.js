import React from 'react'
import { Link} from "react-router-dom";
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './style.css'
import jwt from 'jwt-simple';
import { sharedColors } from '../../theme/sharedColor';
import Calendar1 from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BsChevronCompactDown, BsChevronCompactUp, BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { BsSearch, BsFillPlusCircleFill, BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { server } from "../../config/server";

// I insert.
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { grey } from '@material-ui/core/colors'
import { CommandContext } from 'twilio/lib/rest/preview/wireless/command';
import Moment from 'moment';

const d = new Date();

const weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let day = weekday[d.getDay()];

let nowData = [];
let i_bottom = [];
let i_color = [];
let i_StartTime = [];
let chatUserInfo = [];
let token = localStorage.getItem("token");
let config = {
  headers: {
    'Authorization': 'Bearer ' + token
  }
}

function join(t, a, s) {
  function format(m) {
    let f = new Intl.DateTimeFormat('en', m);
    return f.format(t);
  }
  return a.map(format).join(s);
}

let a = [{ year: 'numeric' }, { month: 'numeric' }, { day: 'numeric' }];
let nowDate = Moment(Date.now()).format("YYYY-MM-DD");
let globalChannelName = '';
export class Calendar extends React.Component {
  calendarComponentRef = React.createRef();
  timeSloteId_ref = React.createRef();
  appointDescription_ref = React.createRef();
  patient_id_ref = React.createRef();
  title_ref = React.createRef();
  
  constructor(props) {
    super(props);
    this.state = {
      virtualTime: false,
      modalState: 0,
      patientlist: [],
      description: "",
      appDate: null,
      patient_id: null,
      appointment_id: null,
      timeValue: null,
      time: null,
      appName: "",
      setModalShow: true,
      modalShow: false,
      modalHide: true,
      timeslot: [],
      myavaliabletimeslot: [],
      heightSpec: "Fixed",
      height: 800,
      arrowDirection: true,
      viewType: "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      startDate: null,
      date: '',
      date1: '',
      date2: '',
      date3: '',
      date4: '',
      date5: '',
      hasError: '',
      viewCustom: 'dayGridMonth',
      currentEvents: [],
      calendarEvents: [],
      nowdate: nowDate,
      selDay: day,
      chartUserInfo: [],
      videoToken: '',
      patientData: [],
      changeStatus: 0,
      showavaliableModal: false,
      myappdate: null,
      // today: date.now()
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchPatient = this.fetchPatient.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.fetchSelectData = this.fetchSelectData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    this.handleDesChange = this.handleDesChange.bind(this);
    this.fetchTimeSlot = this.fetchTimeSlot.bind(this);
    this.newSchedule = this.newSchedule.bind(this);
    this.newAppointment = this.newAppointment.bind(this);
    this.updateAppointment = this.updateAppointment.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.handleModalHide = this.handleModalHide.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  hideModal() {
    this.setState({ modalShow: false })
  }
  viewChangeHandle = (viewType) => {
    if (viewType == 'week') {
      this.calendarComponentRef.current.getApi().changeView('timeGridWeek');
    }
    else {
      this.calendarComponentRef.current.getApi().changeView('dayGridMonth');
    }
  }
  async fetchPatient() {
    let a = [];
    // eslint-disable-next-line
    var temp = await axios.get(server.serverURL + "v1/patients", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function (response) {
      a = response.data.data.results
    });
    this.setState({ patientlist: a });
  }

  async fetchData() {
    let a = [];
    var bb = await axios.get(server.serverURL + "v1/appointments", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function (response) {
      a = response.data.data.results
    }).catch(error => {
      console.log(error.response, "error")
    })
    a.forEach(obj => this.renameKey(obj, 'appointment_id', 'id'));
    a.forEach(obj => this.renameKey(obj, 'time_slot', 'start'));
    a.forEach(obj => this.renameKey(obj, 'patient_name', 'title'));
    a.forEach(obj => this.renameValue(obj, 'start', obj['appointment_date'], obj['start']));
    a = a.filter(a=>a.patient_id !== -99999);
    this.setState({ calendarEvents: a });
    var now = new Date();
    let tempDate = Moment(now).format("YYYY-MM-DD");

    this.setData(tempDate);
  }

  renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
  renameValue(obj, field, oldValue, newValue) {
    obj[field] = oldValue + 'T' + newValue;
  }
  start_vCall = (index,item) => {
    let patientdata = this.state.patientData.data.results;
    let selectData = patientdata.filter(item => item.id == index);
    globalChannelName =  localStorage.userId + '/' + selectData[0].id;
  
    let midData = {
      appointmentId:item.id,
      ...selectData[0],
    }
    this.setChatToken(midData);   
  }
  setChatToken = (data) => {
    let channelName = localStorage.userId + "/" + data["id"];
    channelName = channelName.replace(/ /g, "");
    chatUserInfo = {
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
        userInfo: data,
        appointmentId:data['appointmentId']
    }
    token = jwt.encode(chatUserInfo, "xxx");
    this.goVideoCall();
  }
  getVideoToken = () => {
    axios.post(server.serverURL + 'v1/video-token', {
        "room": globalChannelName,
        "name": `Dr_${localStorage.userId}`
    }, config)
        .then(res => {
            var data = res.data;
            /*   console.log("res", data.token) */
            this.setState({videoToken:data.token});
            // resolve({chatToken, channelName});
            this.sendVideoNotification(data.token)
        });

  }

  sendVideoNotification = (twilioVideoToken) => {

      let obj = {
          patient_id: chatUserInfo["receive"],
          title: `Time to Call ${localStorage.userName}`,
          body: `Your Telemedicine call with ${localStorage.userName} starts soon. Click here to began the Call`,
          notification_id: "2",
          room_name: globalChannelName
      }
      /*  console.log("obj", obj, config) */
      axios.post(server.serverURL + 'v1/push-notify', obj, config)
          .then(res => {
           window.location.href = "/chat/" + token + "?info=videocall&&videoToken="+twilioVideoToken+"&&channelName="+globalChannelName;
          });
  }

  goVideoCall = () => {
      /*  console.log(videoToken, "videoToken") */
      if (this.state.videoToken) {
          this.sendVideoNotification(this.state.videoToken);          
          
      } else {
          this.getVideoToken()
      }
  }

  async fetchMyAvaliableTimeSlot() {
    const {myappdate} = this.state;
    console.log(myappdate+"============myappdate");
    let midmydate = null;
    var e = new Date();
    midmydate = myappdate;
    if(myappdate === undefined || myappdate === null){
      midmydate = e;
    }
    let a = [];
    console.log(midmydate);
    // let myappdate = e;
    
    let appointmentDetail = {
      appointment_date: midmydate.toISOString().substring(0, 10),
    }
    // eslint-disable-next-line
    var temptime = await axios.post(server.serverURL + "v1/available-time-slots", appointmentDetail, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function (response) {
      a = response.data.data.results
    });
    this.setState({ myavaliabletimeslot: a });
  }

  async fetchTimeSlot() {
    let a = [];
    let appointmentDetail = {
      appointment_date: this.state.appDate.toISOString().substring(0, 10),
    }
    console.log(this.state.appDate+"===appdate");
    // eslint-disable-next-line
    var temptime = await axios.post(server.serverURL + "v1/available-time-slots", appointmentDetail, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function (response) {
      a = response.data.data.results
    });
    this.setState({ timeslot: a });
  }


  async fetchSelectData() {

    let b = [];
    const event_id = this.state.appointment_id;
    // eslint-disable-next-line
    var temp = await axios.get(server.serverURL + "v1/appointments/" + event_id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function (response) {
      b = response.data.data
    });
    this.setState({ time: b.time_slot })
    this.setState({ timeValue: b.time_slot_id });
    this.setState({ patient_id: b.patient_id });
    this.setState({ description: b.description });
    this.setState({ appName: b.title }, function () { });
    let a = await this.fetchTimeSlot()

    this.setState({ timeslot: [{ time_slot: b.time_slot, time_slot_id: b.time_slot_id }, ...this.state.timeslot] }, function () {
      console.log(this.state.timeslot, "time slot", a)
      this.setState({ modalShow: true });
      // {time_slot: b.time_slot, time_slot_id: b.time_slot_id}, 
    });

  }
  componentDidMount() {  
    // window.location.href = '/calendar';  
    axios.get(server.serverURL + 'v1/chat-patients', config)
    .then(res => {
        this.setState({patientData:res.data});
    });
    this.setState({myappdate: new Date()});
    this.fetchMyAvaliableTimeSlot();
  }
  componentWillMount() {
    
    var e = new Date();
    this.setState({
      appDate: e
    });
    const first = new Date();
    const secondDate = new Date();
    const thirdDate = new Date();
    const firthDate = new Date();
    const fifthDate = new Date();
    const sixthDate = new Date();
    const second = new Date(secondDate.setMonth(secondDate.getMonth() + 1));
    const third = new Date(thirdDate.setMonth(thirdDate.getMonth() + 2));
    const firth = new Date(firthDate.setMonth(firthDate.getMonth() + 3));
    const fifth = new Date(fifthDate.setMonth(fifthDate.getMonth() + 4));
    const sixth = new Date(sixthDate.setMonth(sixthDate.getMonth() + 5));

    this.setState({ date: first });
    this.setState({ date1: second });
    this.setState({ date2: third });
    this.setState({ date3: firth });
    this.setState({ date4: fifth });
    this.setState({ date5: sixth });
    this.fetchData();
    this.fetchPatient();
    if (this.state.viewType == "Week") {
      // alert('ready');
      // let element = document.getElementsByClassName('fc-weekButton-button');
      // element.addClass('active');
    }
  }

  handleTimeChange(e) {
    this.setState({ timeValue: e.target.value })
  }
  handleDesChange(e) {
    this.setState({ description: e.target.value })
  }
  handleNameChange(e) {
    this.setState({ appName: e.target.value })
  }
  handlePChange(e) {
    this.setState({ patient_id: e.target.value })
  }
  handleDateChange(e) {
    this.setState({ appDate: e })
  }
  handleDateChangeformyappdate =async (e)=>{
    this.setState({myappdate:e});
    await this.fetchMyAvaliableTimeSlot();
  }
  handleModalHide() {
    this.setState({ modalShow: false })
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  newSchedule(e) {
    console.log("new-minicalandar")
    this.setState({ appName: "" });
    this.setState({ description: "" });
    this.setState({ patient_id: "" });
    this.setState({ timeValue: "" });
    this.setState({ modalState: 1 });
    this.setState({ modalShow: true });
    this.fetchTimeSlot();
  }
  setAvaliableTime=()=>{
    //showavaliableModal
    this.setState({showavaliableModal: true});
  }
  closeAvaliableModal =()=>{
    this.setState({showavaliableModal:false});
  }
  handleDateSelect = (selectInfo) => {
  
    this.setDay(selectInfo)
    this.setState({ appName: "" });
    this.setState({ description: "" });
    this.setState({ patient_id: "" });
    this.setState({ timeValue: "" });
    this.setState({ appDate: selectInfo.start });
    this.fetchTimeSlot();
    // this.setState({ modalState: 1 });
    // this.setState({ modalShow: true });
    console.log(selectInfo);
  }

  async newAppointment() {
    console.warn('newAppointment 250');
    var tzoffset = this.state.appDate.getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(this.state.appDate - tzoffset)).toISOString().substring(0, 10);
    if(this.state.patient_id === undefined || this.state.patient_id === null || this.state.patient_id === ""){
      alert("Please Select Patient");
      return;
    }
    let appointmentDetail = {
      title: this.title_ref.current.value,
      patient_id: this.state.patient_id,
      appointment_date: localISOTime,
      time_slot_id: this.timeSloteId_ref.current.value,
      description: this.appointDescription_ref.current.value,
      virtualTime: this.state.virtualTime
    }
    await axios.post(server.serverURL + 'v1/appointments', appointmentDetail, config)
      .then(res => {
        this.setState({ modalShow: false })
        alert(res.data.data.message)
        this.setState({changeStatus:Math.random()})
      })
      .catch(error => {
        // alert(JSON.stringify(error.response.data.errors));
        // alert(JSON.stringify(error.response.data.errors));
        this.setState({ hasError: error.response.data.error });
        // console.log(error.response.status, "error")
      })

    // this.setState({ modalShow: false })
    this.fetchData();

  }

  handleEventClick = (clickInfo) => {
    var e = new Date(clickInfo.event._def.extendedProps["appointment_date"]);
    var utc = e.getTime() + (e.getTimezoneOffset() * 60000);
    const eventId = clickInfo.event.id;
    this.setState({ appDate: new Date(utc) })
    this.setState({ appointment_id: eventId });
    this.setState({ modalState: 0 });

    this.fetchSelectData();

    // this.fetchTimeSlot();
    // this.setState({ modalShow: true });
    // console.log(this.state.timeslot);
  }

  updateAppointment() {
    console.warn('newAppointment 251');
    const event_id = this.state.appointment_id;
    var tzoffset = this.state.appDate.getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(this.state.appDate - tzoffset)).toISOString().substring(0, 10);

    let appointmentDetail = {
      title: this.title_ref.current.value,
      patient_id: this.patient_id_ref.current.value,
      appointment_date: localISOTime,
      time_slot_id: this.timeSloteId_ref.current.value,
      description: this.appointDescription_ref.current.value
    }

    axios.put(server.serverURL + 'v1/appointments/' + event_id, appointmentDetail, config)
      .then(res => {
        this.setState({ modalShow: false })
        alert(res.data.data.message)
      })
      .catch(error => {
        this.setState({ hasError: error.response.data.error });
      })
    this.fetchData()

  }

  deleteAppointment() {
    const event_id = this.state.appointment_id
    console.warn('newAppointment 252');
    axios.delete(server.serverURL + 'v1/appointments/' + event_id, config)
      .then(res => {
        alert(res.data.data.message)
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.errors));
      })
    this.fetchData()
    this.setState({ modalShow: false });
  }

  nextDate = () => {
    var tomorrow = new Date(this.state.nowdate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let tempDate = Moment(tomorrow).format("YYYY-MM-DD");
    this.setState({ nowdate: tempDate, selDay: weekday[tomorrow.getDay()] });
    this.setData(tempDate);
  }
  prevDate = () => {
    var yesterday = new Date(this.state.nowdate);
    yesterday.setDate(yesterday.getDate() - 1);
    let tempDate = Moment(yesterday).format("YYYY-MM-DD");
    this.setState({ nowdate: tempDate, selDay: weekday[yesterday.getDay()] });
    this.setData(tempDate);
  }
  setToday = () => {
    var now = new Date();
    let tempDate = Moment(now).format("YYYY-MM-DD");
    this.setState({ nowdate: tempDate, selDay: weekday[now.getDay()] });
    this.setData(tempDate);
  }
  setDay = (date) => {
    this.setState({ nowdate: date.startStr, selDay: weekday[date.start.getDay()] });
    this.setData(date.startStr);
  }
  handleEvents = (events) => {
    // this.setState({
    //   currentEvents: events
    // })
  }
  onChange(e) {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate(e.toISOString().substring(0, 10)); // call a method on the Calendar object
    this.setState({ appDate: e });
  }
  setData = (seldate) => {
    if (this.state.calendarEvents.length > 0) {
      nowData = this.state.calendarEvents.filter(item => item.appointment_date == seldate);
      nowData.map((item, index) => {
        let i_date = item.start;
        let i_time = i_date.slice(11, 16);
        let i_mh = i_time.split(':');
        // let i_bottom = Number(i_mh[1]) * 2;  
        i_StartTime[index] = i_time;
        i_bottom[index] = (Number(i_mh[0]) * 136.25 + 20 + Number(i_mh[1]) * 136.25 / 60.0);

        var r = () => Math.random() * 256 >> 0;
        i_color[index] = `rgba(${r()}, ${r()}, ${r()}, 0.1)`;
      })
    }
  }
  removeMyTime=async(item)=>{
    
    var tzoffset = this.state.myappdate.getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(this.state.myappdate - tzoffset)).toISOString().substring(0, 10);
    
    let appointmentDetail = {
      title: "Avaliable Time",
      patient_id: -99999,
      appointment_date: localISOTime,
      time_slot_id: item.time_slot_id,
      description: "",
    }
    await axios.post(server.serverURL + 'v1/appointments', appointmentDetail, config)
      .then(res => {
        this.fetchMyAvaliableTimeSlot();
      })
      .catch(error => {
        // this.setState({ hasError: error.response.data.error });

      })
  }
  render() {
    console.log("modal state", this.state.timeslot);
    return (
      <div className='demo-app'>
        {this.renderSidebar()}
        <div className='demo-app-main'>
          <FullCalendar
            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
            ref={this.calendarComponentRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={this.state.viewCustom}
            editable={true}
            eventDurationEditable={false}
            timeZone='local'
            selectable={true}
            selectMirror={true}
            // dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            contentHeight="calc(100vh - 170px)"
            width={100}
            events={this.state.calendarEvents}
            eventLimit={5}
            customButtons={{
              weekButton: {
                text: 'Week',
                id: 'weekCustomButton',
                click: () => {
                  this.viewChangeHandle('week');
                },
              },
              monthButton: {
                text: 'Month',
                click: () => {
                  this.viewChangeHandle('month');
                },
              }
            }}
            headerToolbar={{
              start: 'title',
              center: 'prev,next',
              // end:'weekButton monthButton'
              end: "dayGridMonth,timeGridWeek"
            }}
          />
        </div>
        <Modal
          show={this.state.modalShow}
          onHide={this.hideModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={() => this.handleModalHide()}>{this.state.modalState === 0 ? 'Edit Event' : 'Add Event'}</Modal.Header>
          <Modal.Body>
            {this.state.hasError &&
              <div className="alert alert-danger alert-dismissible">
                {/* eslint-disable-next-line */}
                <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>Danger!</strong> {this.state.hasError}
              </div>
            }
            <div className="form-group">
              <input name="appointmentName" ref={this.title_ref} id="appointmentName" value={this.state.appName} className="form-control" placeholder="Add title" onChange={this.handleNameChange} />
            </div>
            <div className="custom-control form-group">
              <input type="checkbox" className="custom-control-input" id="defaultUnchecked" name="defaultUnchecked" />
              <label className="custom-control-label" htmlFor="defaultUnchecked">Add as Virtual Appointment Time</label>
            </div>
            <div className="form-group">
              <DatePicker
                ref={this.appointmentDate}
                selected={this.state.appDate}
                onChange={this.handleDateChange}
                name="startDate"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className="form-group">
              {/* <label>Time</label> */}
              <select ref={this.timeSloteId_ref} className="form-control" id="time_select" name="start_time" defaultValue={this.state.timeValue} onChange={this.handleTimeChange}>
                {/* {this.state.modalState === 0 ? <option value={this.state.timeValue} key={this.state.timeValue}> {this.state.time} </option> : null} */}
                {this.state.timeslot.map((item, i) => {
                  return <option value={item.time_slot_id} key={item.time_slot_id}>{item.time_slot}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              {/* <label>Patient</label> */}
              <select ref={this.patient_id_ref} className="form-control" value={this.state.patient_id} name="patient" onChange={this.handlePChange}>
                {this.state.patientlist.map((item, i) => {
                  return <option value={item.id} key={i}>{item.first_name + " " + item.last_name}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              {/* <label>Description</label> */}
              <textarea ref={this.appointDescription_ref} name="description" id="description" className="form-control" value={this.state.description} onChange={this.handleDesChange}></textarea>
            </div>
          </Modal.Body>

          <Modal.Footer>
            {this.state.modalState === 0 ?
              <Button variant="primary" style={{ background: "#eb7f73", borderColor: "transparent", borderRadius: "20px" }} onClick={this.deleteAppointment}>
                Delete
              </Button> :
              <Button variant="secondary" style={{ background: "#eb7f73", borderColor: "transparent", borderRadius: "20px" }} onClick={this.handleModalHide}>
                Cancel
              </Button>
            }
            {this.state.modalState === 0 ?
              <Button variant="primary" style={{ background: "#877cec", borderColor: "transparent", borderRadius: "20px" }} onClick={this.updateAppointment}>
                Save
              </Button> :
              <Button variant="primary" style={{ background: "#877cec", borderColor: "transparent", borderRadius: "20px" }} onClick={this.newAppointment}>
                Save
              </Button>
            }
          </Modal.Footer>

        </Modal>


        <Modal
          show={this.state.showavaliableModal}
          onHide={this.closeAvaliableModal}
          aria-labelledby="contained-modal-title-vcenter"
          // centered
          dialogClassName="modal-timeslot"
          style = {{
            borderRadius: '25px !important'
          }}
        >
          <Modal.Header closeButton onClick={() => this.closeAvaliableModal()} style ={{
            fontWeight: 600,
            fontFamily: 'monospace',
          }}>{'My Availability'}</Modal.Header>
          <Modal.Body>
            {this.state.hasError &&
              <div className="alert alert-danger alert-dismissible">
                <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>Danger!</strong> {this.state.hasError}
              </div>
            }
            <div className="form-group">
              <DatePicker
                ref={this.appointmentDate}
                selected={this.state.myappdate}
                onChange={this.handleDateChangeformyappdate}
                name="startDate"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className="form-group">
              {this.state.myavaliabletimeslot.map((item, i) => {
                  return <div className="modal-timeslot-item" value={item.time_slot_id} key={item.time_slot_id}>{item.time_slot}<Button style ={{
                    backgroundColor: 'gray',
                    border: 'solid 1px',
                    padding: 2,
                    width: 25
                  }} onClick ={(e)=>this.removeMyTime(item)}><span aria-hidden="true">×</span></Button></div>;
              })}
            </div>
          </Modal.Body>

          <Modal.Footer style ={{width:"100%"}}>
              <Button variant="primary" style={{ background: "#877cec", borderColor: "transparent", borderRadius: "20px",width:"100%" }} onClick={this.closeAvaliableModal}>
                Save
              </Button>
          </Modal.Footer>

        </Modal>
      </div>
    )
  }

  
  renderSidebar() {
    // var { ...config } = this.state;
    const specialColorFont = {
      color: sharedColors.primaryFontColor,
    }
    const toggleAvatar = () => {
      this.setState({ arrowDirection: !this.state.arrowDirection });
    }
    let timeIndicates = [];
    for (let i = 0; i < 24; i++) {
      timeIndicates = [...timeIndicates, i]
    }

    const d = new Date();

    const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    let day = weekday[d.getDay()];
    let hour = d.getHours();
    let min = d.getMinutes();
    let bottom = - (hour * 136.25 + 20 + min / 60 * 136.25);

    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <div className="show-calendar-picker" onClick={() => toggleAvatar()}>
            {this.state.arrowDirection ? <BsChevronCompactDown color="white" /> : <BsChevronCompactUp color="white" />}
          </div>
          <div className={this.state.arrowDirection === false ? "show-picker-calendar" : "non-show-picker-calendar"}>
            <div className="avatars-title-container">
              <h1 className="avatars-title-text" style={{fontSize:32}}>Schedule<span style={specialColorFont}>.</span></h1>
              <BsFillPlusCircleFill onClick={(e) => this.newSchedule(e)} color={sharedColors.primaryButtonsColor} style={{ height: "26px", marginRight: 18 }} className="avatars-title-add-button" />
              <Button variant="primary" style={{ background: "#877cec", borderColor: "transparent", borderRadius: "20px" }} onClick={this.setAvaliableTime}>
                Time
              </Button>
            </div>
          </div>
          <div style={{ marginTop: 0 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
              <div style={{ color: '#6a12dd', fontWeight: 'bold', cursor:"pointer" }} onClick={this.setToday}>
                Today
              </div>

              <div className="date-header">
                <div className="text-center">
                  <span onClick={this.prevDate} style={{cursor:"pointer"}}><BsChevronLeft color={sharedColors.primaryButtonsColor} style={{ height: "20px", fontWeight: 600 }} /></span>
                  <span style={{ fontWeight: 'bold', padding: 15 }}>{this.state.selDay}</span>
                  <span>{this.state.nowdate.slice(8, 10)}</span>
                  <span style={{ fontSize: 12, paddingLeft: 10 }}>
                  </span>
                  <span onClick={this.nextDate} style={{cursor:"pointer"}}><BsChevronRight color={sharedColors.primaryButtonsColor} style={{ height: "20px", fontWeight: 600 }} /></span>
                </div>
              </div>
              <div className="container timeline-section">
                <div className="timeline" style={{ bottom: bottom }}>
                  <div className='timeline-line'></div>
                  <div className='timeline-circle'></div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    {timeIndicates.map((item, index) => (
                      <div key={index} style={{ color: 'gray', padding: '10px 0px' }}>
                        {`${item}.00`}
                        <div className="text-center">
                          <div style={{ paddingTop: 10 }}>-</div>
                          <div style={{ paddingTop: 12 }}>-</div>
                          <div style={{ paddingTop: 12 }}>-</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-md-10">
                    {nowData.map((item, index) => (
                      <div class="d-flex flex-column justify-content-center" style={{ position: "absolute", top: i_bottom[index], height: 70, padding: 15, marginTop: 2, borderLeft: 'solid 3px rgb(209 189 147)', backgroundColor: i_color[index], borderRadius: 4 }}>
                        <div style={{ fontSize: 12, color: '#3535b9', fontWeight: 'bold' }}>{i_StartTime[index]}</div>
                        <div style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: "grey" }}>{item.description} <Link onClick={() => this.start_vCall(item.patient_id,item)}>start-call</Link></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

function renderEventContent(eventInfo) {
  return (
    <div style={{ lineHeight: 1.5, fontWeight: 'bold'}}>
      <p style={{ color: 'black', margin: 0 }}>{eventInfo.timeText}</p>
      <p style={{ color: 'rgb(122, 50, 216)', margin: 0 }}>{eventInfo.event.title}</p>
      <p style={{ color: 'rgb(122, 50, 216)', margin: 0 }}>{eventInfo.event.extendedProps.doctor_name}</p>
      <p style={{ color: 'black', margin: 0 }}>{eventInfo.event.extendedProps.appointment_date}</p>
    </div>
  )
}
// eslint-disable-next-line
function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  )
}
