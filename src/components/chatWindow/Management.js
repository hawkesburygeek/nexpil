import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AddIcon from "@mui/icons-material/Add";
import "./style.css";
import Moment from "moment";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonUnstyled from "@mui/core/ButtonUnstyled";
import Stack from "@mui/material/Stack";
import { purple } from "@mui/material/colors";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jwt from "jwt-simple";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../config/server";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_PATIENT_MEDICATION_DATA,
  GET_ASSIGNED_DATA,
  GET_USER_CHAT,
} from "../../store/actionNames";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import chroma from "chroma-js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIRichTextEditor from "mui-rte";

let token = localStorage.getItem("token");

const ColorButton = styled(ButtonUnstyled)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#6308F7",
  borderRadius: 15,
  width: 300,
  borderColor: "transparent",
  fontFamily: "poppins",
  "&:hover": {
    backgroundColor: "#6308F7",
  },
}));
//let drugData = [];
let noAllergy = "";
//drugData = [];
let survey_id = "";

let button_text = ["Mark update", "Mark as done", "Mark new"];
const items = [
  { label: "one", value: 1 },
  { label: "two", value: 2 },
];

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled ? "red" : "blue",
      color: "#FFF",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};

export const Management = ({ roomName, chatInfo, handleLogout }) => {
  const [age, setAge] = React.useState("");
  const dispatch = useDispatch();
  const [buttonAction, setButtonAction] = React.useState(true);
  const [state, setState] = useState({});
  const [checkAction1, setCheckAction1] = React.useState("disable-check");//check-active
  const [checkAction2, setCheckAction2] = React.useState("disable-check");
  const [checkAction3, setCheckAction3] = React.useState("disable-check");
  const [checkAction4, setCheckAction4] = React.useState("disable-check");
  const [checkAction5, setCheckAction5] = React.useState("disable-check");
  const [checkAction6, setCheckAction6] = React.useState("disable-check");

  // const [checkAction1, setCheckAction1] = React.useState("check-active");//check-active
  // const [checkAction2, setCheckAction2] = React.useState("check-active");
  // const [checkAction3, setCheckAction3] = React.useState("check-active");
  // const [checkAction4, setCheckAction4] = React.useState("check-active");
  // const [checkAction5, setCheckAction5] = React.useState("check-active");
  // const [checkAction6, setCheckAction6] = React.useState("check-active");

  const [backButtonAction, setBackButtonAction] = React.useState("Back");
  const [buttonDisableAction, setButtonDisableAction] = React.useState(true);
  const [screenAction, setScreenAction] = React.useState(0);
  const [listAction1, setListAction1] = React.useState("");
  const [listAction2, setListAction2] = React.useState("");

  const [medicineName, setMedicineName] = React.useState("");
  const [listAction3, setListAction3] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);

  const [subExpanded, setSubExpanded] = React.useState("panel11");
  const subhandleChange = (panel) => (event, newExpanded) => {
    setSubExpanded(newExpanded ? panel : false);
  };

  const [activeNumber, setActiveNumber] = React.useState(0);

  const [list1, setList1Action] = React.useState("");
  const [list2, setList2Action] = React.useState("");
  const [list3, setList3Action] = React.useState("");
  const [list4, setList4Action] = React.useState("");
  const [select, setSelectAction] = React.useState("");
  const [medicineSave, setMedicineSave] = React.useState(true);
  const [refresh, setRefresh] = React.useState(true);
  const [expandedDescription, setExpandedDescription] = React.useState(true);
  const [patient, setPatient] = React.useState([]);
  const [drugs, setDrugs] = React.useState([]);
  const [allergy, setAllergy] = useState([]);
  const [survey, setSurvey] = useState([]);
  const [surveyAns, setsurveyAns] = React.useState("");
  const [gapsincare, setGapsInCare] = useState([]);
  const [afterSummary, setafterSummary] = useState([]);
  const [afterVisitSummary, setAfterVisitSummary] = useState([]);
  const medication = useSelector((state) => state.medication);
  const [chatMedication, setChatMedication] = useState([]);
  const [careGaps, setCareGaps] = useState("");
  const [shortText, setShortText] = useState("");
  const [goalsList, setGoalsList] = useState("");

  const [markPastVisitTxt,setMarkPastVisitTxt] = React.useState("");

  const [surveyAnsMakeAsView, setsurveyAnsMakeAsView] = React.useState(false);
  const [markAsSurveyAns, setmarkAsSurveyAns] = React.useState("");
  const [changeStatusvalue, setChangeStatusValue] = React.useState(0);
  const [recommendation_for_resolution, setrecommendation_for_resolution] =
    React.useState("");
  const [notes, setNotes] = React.useState("");
  const [markStatus, setMarkStatus] = React.useState(0);
  const [selVisitId, setSelVisitId] = React.useState(0);

  const [reviewButton, setReviewButton] = React.useState("");
  const [markAsReviewedAllergy, setMarkAsReviewedAllergy] = React.useState("");
  const [medicationButton, setMedicationButton] = React.useState("Save");
  const [markAsReviewedMedication, setMarkAsReviewedMedication] =
    React.useState("");
  const [markAsReviewedMedicationText, setMarkAsReviewedMedicationText] =
    React.useState("");

  const handleSelectChange = (event) => {
    setAge(event.target.value);
    setSelectAction(event.target.value);
    let se = event.target.value;
    if (list1 !== "" && list2 !== "" && se !== "") {
      setBackButtonAction("Save");
    }
  };
  const SurveyanwhandleSelectChange = (e,index) => {
    setState({ ...state, [index]: e.target.value });    
  };
  const handleSearchChange = (event, values) => {
    setMedicineName(values?.label);
    let se = values?.label;
    if (list3 !== "" && se !== "") {
      setExpandedDescription(false);
    } else {
      setExpandedDescription(true);
    }
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const onHandleInputMedicationName = (ev) => {
    const term = ev.target.value;
    console.log(" iiiiiiiiii term ", term);
    //setInfoDetails({ ...infoDetails, task_name: term });
    if (term) {
      axios
        .get(
          `${server.domainURL}/nexpil/drug_product.php?Name=${term}&choice=0`
        )
        .then(({ data }) => {
          console.log(" iiiiiiiiii data ", data);
          let drugData = [];
          data.forEach(element => {
            drugData.push({
              id: element.uid,
              label: element.DrugName
            })
          });

          console.log("Drug Data", drugData);

          setDrugs(drugData);
          setRefresh(!refresh);
          //setAvailableMedicationList(data);
        })
        .catch((err) => {});
    }
    else {
      getDrugData();
    }
  };

  /* console.log(room, "room")
  console.log(participants, "particpants") */
  const handleAction1 = () => {
    setButtonAction(false);
    setListAction1("active");
    setListAction2("");
    setButtonDisableAction(false);
    setReviewButton("review-button-active");
    noAllergy = (
      <ListItem
        className={`active`}
        key={1}
        disableGutters
        sx={{ borderRadius: 10, backgroundColor: "#EFF0F6", my: 3, py: 1.8 }}
      >
        <IconButton onClick={handleAction1}>
          <Brightness1Icon
            className={`${listAction1} line`}
            sx={{ color: "#DFE6E9" }}
          />
        </IconButton>
        <ListItemText
          className={`${listAction1} line`}
          primary={"No Known Drug Allergies"}
          sx={{ px: 2 }}
        />
      </ListItem>
    );
  };
  const handleAction2 = () => {
    setScreenAction(1);
    setReviewButton("");
    // noAllergy = (
    //   <ListItem
    //     key={1}
    //     disableGutters
    //     sx={{ borderRadius: 10, backgroundColor: "#EFF0F6", my: 3, py:1.8  }}
    //   >
    //     <IconButton onClick={handleAction1}>
    //       <Brightness1Icon
    //         className={`line`}
    //         sx={{ color: "#DFE6E9" }}
    //       />
    //     </IconButton>
    //     <ListItemText
    //       className={` line`}
    //       primary={"No Known Drug Allergies"}
    //       sx={{ px: 2 }}
    //     />
    //   </ListItem>
    // );
  };
  const handleAction3 = () => {
    setScreenAction(1);
  };
  const SaveOrBack = (e) => {
    let l1 = list1;
    let l2 = list2;
    if (e.target.id === "list1") {
      setList1Action(e.target.value);
      l1 = e.target.value;
    } else if (e.target.id === "list2") {
      setList2Action(e.target.value);
      l2 = e.target.value;
    }

    if (l1 !== "" && l2 !== "" && select !== "") {
      setBackButtonAction("Save");
    } else if ((screenAction == 1 && l1 === "") || l2 === "" || select !== "") {
      setBackButtonAction("Back");
    } else if ((screenAction == 2 && l1 === "") || l2 === "" || select !== "") {
      setBackButtonAction("Done");
    }
  };
  const ShowDescription = (e) => {
    setMedicationButton("Save");
    let l3 = list3;
    if (e.target.id === "list3") {
      setList3Action(e.target.value);
      l3 = e.target.value;
    }
    if (l3 !== "" && medicineName !== "") {
      setExpandedDescription(false);
    } else {
      setExpandedDescription(true);
    }
  };
  const completeAllergy = async (e) => {
    if (backButtonAction === "Save") {
      let allergyData = {
        list1: list1,
        list2: list2,
        select: select,
        patient_id: patient.id,
        appointment_id: patient.appointmentId,
      };

      // eslint-disable-next-line
      var temp = await axios
        .post(server.serverURL + "v1/add-allergy", allergyData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then(function (response) {});
      let tempID = [];
      tempID = {
        selPatient: patient.id,
      };
      getAllergy(tempID,patient.appointmentId);
      // setCheckAction1("check-active");
      // setExpanded(false);
      // setScreenAction(true);
      setListAction1("");
      setListAction2("");
      setList1Action("");
      setList2Action("");
      setList3Action("");
      setBackButtonAction("Done");

      setButtonAction(true);
      //setActiveNumber(activeNumber+1);
    } else if (e.target.innerText == "Back") {
      setListAction2("active");
      if (checkAction1 != "check-active") {
        noAllergy = (
          <ListItem
            key={1}
            disableGutters
            sx={{ borderRadius: 6, backgroundColor: "#EFF0F6", my: 3, py: 1.8 }}
          >
            <IconButton onClick={handleAction1}>
              <Brightness1Icon className={` line`} sx={{ color: "#DFE6E9" }} />
            </IconButton>
            <ListItemText
              className={` line`}
              primary={"No Known Drug Allergies"}
              sx={{ px: 2 }}
            />
          </ListItem>
        );
      }
      setScreenAction(0);
    } else if (e.target.innerText == "Done") {
      setScreenAction(0);
      setReviewButton("review-button-active");
      setMarkAsReviewedAllergy("");
    } else if (screenAction == 0 && e.target.innerText == "Mark as reviewed") {
      setCheckAction1("check-active");
      setMarkAsReviewedAllergy(Date.now());
      setExpanded(false);
      setScreenAction(0);
      setListAction1("");
      setListAction2("");
      setList1Action("");
      setList2Action("");
      setList3Action("");
      setBackButtonAction("Done");

      setButtonAction(true);
    }
  };
  const markasreviewSurvey = async (e)=>{
    let now = Moment(Date.now()).format("MM/DD/YYYY in hh:mm a");
    setmarkAsSurveyAns("Last reviewed on" + now);
  }
  const completeSurvery = async (e) =>{
    if(survey && survey.length > 0){
      survey.map(async (item,index)=>{
        let midans = state["surveyAns_"+index];
        if(midans !== undefined && midans !== null && midans !==""){
          //call api
          var surveydata = {
            patient_id: patient.id,
            survey_question_id:item.id,
            multiple_type_id:item.multiple_type_id,
            appointment_id: patient.appointmentId,
            answer:midans,
          };
          console.log(surveydata);
            var temp = await axios
            .post(server.domainURL +
              "/webapi/v1/survey-questions-update", surveydata, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            })
            .then(function (response) {
             console.log(response);
            });
        }
      });
    }
    setsurveyAnsMakeAsView(true);
    setCheckAction3("check-active");
    //state["surveyAns_"+index]
  }
  const completeMedicine = async (e) => {
    if (e.target.innerText == "Save") {
      let medicineData = {
        list3: list3,
        list4: list4,
        medicineName: medicineName,
        patient_id: patient.id,
        appointment_id: patient.appointmentId,
      };

      var temp = await axios
        .post(server.serverURL + "v1/add-medicine", medicineData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then(function (response) {
          // setCheckAction2("check-active");
          // setExpanded(false);
          // setScreenAction(1);
          setListAction3("");
          setList3Action("");
          setList4Action("");
          // setMedicineName("");
          setMedicationButton("Done");
          dispatch({ type: GET_PATIENT_MEDICATION_DATA, payload: patient.id ,appointId : patient.appointmentId});
        });
    } else if (e.target.innerText == "Done") {
      setScreenAction(0);
      setMarkAsReviewedMedication("MarkAsReview");
    } else if (screenAction == 0 && e.target.innerText == "Mark as reviewed") {
      setCheckAction2("check-active");
      let now = Moment(Date.now()).format("MM/DD/YYYY in hh:mm a");
      setMarkAsReviewedMedicationText("Last reviewed on " + now);
    }
  };
  const noAllergyComplete = () => {
    setCheckAction1("check-active");
    // setExpanded(false);
    // setScreenAction(1);
    setListAction1("");
    setListAction2("");
    setButtonAction(true);
    //setActiveNumber(activeNumber+1);
    setCheckAction1("check-active");
    let now = Moment(Date.now()).format("MM/DD/YYYY in hh:mm a");
    setMarkAsReviewedAllergy("Last reviewed on " + now);
  };
  useEffect(() => {
    let data = jwt.decode(chatInfo, "xxx");
    let patient = data.userInfo;
    dispatch({ type: GET_PATIENT_MEDICATION_DATA, payload: patient.id ,appointId : patient.appointmentId});
    setPatient(patient);
    let tempID = [];
    tempID = {
      selPatient: patient.id,
    };

    getDrugData();
    getAllergy(tempID,patient.appointmentId);
    getMedicationData(medication);
    // get_survey_id(patient.id)
    get_survey_info(patient.id,patient.appointmentId);
    get_gapincare_info(patient.id);
    get_after_summary(patient.id);
    ////markAsReviewed();
    console.log(medication);
  }, [chatInfo, medication.length, changeStatusvalue]);

  useEffect(() => {
    markAsReviewed();
  }, [checkAction1, checkAction2, checkAction3, checkAction4, checkAction5, checkAction6]);

  const getMedicationData = (data) => {
    let array = [];
    if (data.length !== 0 && data.length > 4) {
      for (let index = 0; index < 4; index++) {
        const element = data[index];
        element ? array.push(element["title"]) : array.push("");
      }
      setChatMedication(array);
      setCheckAction2("check-active");
    } else if (data.length !== 0 && data.length <= 4) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        element ? array.push(element["title"]) : array.push("");
      }
      setChatMedication(array);
      setCheckAction2("check-active");
      //setActiveNumber(activeNumber+1);
    } else {
      setChatMedication([]);
    }
  };
  const getDrugData = async () => {
    let drugData = [];
    var temp = await axios
      .get(server.serverURL + "v1/getDrug", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        response.data.data.map((item, index) => {
          drugData.push({
            label: response.data.data[index]["brand_name"],
            id: response.data.data[index]["id"]
          });
        });
        setDrugs(drugData);
        setRefresh(!refresh);
      });
  };
  const getAllergy = async (ID,AppointID) => {
    let patient = {
      patientID: ID,
      appointment_id: AppointID
    };
    console.log(patient);
    var temp = await axios
      .post(server.serverURL + "v1/allergy", patient, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        setAllergy(response.data.data);
        if (screenAction === 0 && response.data.data.length != 0) {
          setCheckAction1("check-active");
        }
        if (response.data.data.length == 0) {
          noAllergy = (
            <ListItem
              className={`${listAction1}`}
              key={1}
              disableGutters
              sx={{
                borderRadius: 6,
                backgroundColor: "#EFF0F6",
                my: 3,
                py: 1.8,
              }}
            >
              <IconButton onClick={handleAction1}>
                <Brightness1Icon
                  className={`${listAction1} line`}
                  sx={{ color: "#DFE6E9" }}
                />
              </IconButton>
              <ListItemText
                className={`${listAction1} line`}
                primary={"No Known Drug Allergies"}
                sx={{ px: 2 }}
              />
            </ListItem>
          );
        } else {
          // setCheckAction1("check-active");
          noAllergy = "";
        }

        //markAsReviewed();
      });
  };
  const setSurveryData= async (midData)=>{
    if(midData && midData.length > 0){
      midData.map((item,index)=>{
        if(item.multiple_type_id === 2){
          setState({ ...state, ["surveyAns_"+index]: item.answer});  
        }
        else {
          setState({ ...state, ["surveyAns_"+index]: item.multiple_type_id});  
        }
      });
    }
  }
  const get_survey_info = async (patient_id,appointmentId) => {
    await axios
      .get(
        server.domainURL +
          "webapi/v1/survey-questions?patient_id=" +
          patient_id +"&appoint_id="+appointmentId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(function (response) {
        // setCheckAction3("check-active");
        console.log("*********************************");
        console.log(response.data.data);
        if(response.data.data === undefined || response.data.data === null || response.data.data.length === 0 ){
          setCheckAction3("check-active");
        }
        setSurvey(response.data.data);
        setSurveryData(response.data.data);
        //markAsReviewed();
      });
  };
  const textedithandler = (e) => {
    if (e.target.id == "textedit") setCareGaps(e.target.value);
    else if (e.target.id == "goalsList") {
      setGoalsList(e.target.value);
    }
  };
  const get_gapincare_info = async (id) => {
    await axios
      .get(server.serverURL + "v1/gaps-in-care/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.data && response.data.data.length > 0) {
          setCheckAction4("check-active");
          setGapsInCare(response.data);
        }

        //markAsReviewed();
      });
  };
  const get_after_summary = async (id) => {
    await axios
      .get(server.serverURL + "v1/visit-summaries?patient_id=" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        console.log(localStorage);
        setafterSummary(response.data.data);
        let tempData = [];
        tempData = response.data.data.filter(
          (item, index) =>
            item["doctor_info"]["id"] == localStorage.getItem("userId")
        );
        let lastElement = [];
        if (response.data.data[0]) {
          setCheckAction5("check-active");
          setCheckAction6("check-active");
        }
        lastElement.push(tempData[0]);
        console.log(lastElement);
        if (lastElement.length > 0 && lastElement[0] != undefined)
          setSelVisitId(lastElement[0]["id"]);
        setAfterVisitSummary(lastElement);

        //markAsReviewed();
      });
  };
  const showSave = (e) => {
    setMedicationButton("Save");
    let l4 = list4;
    if (e.target.id === "list4") {
      setList4Action(e.target.value);
      l4 = e.target.value;
    }
    if (l4 !== "" && list3 != "" && medicineName !== "") {
      setMedicineSave(false);
    } else {
      setMedicineSave(true);
    }
  };
  const surveryAnsText =(e,name) =>{
    setState({ ...state, [name]: e.target.value });    
  }
  const formgaps = (e) => {
    if (e.target.name == "recommendation") {
      setrecommendation_for_resolution(e.target.value);
    } else if (e.target.name == "notes") {
      setNotes(e.target.value);
    } else if (e.target.name == "short_text") {
      setShortText(e.target.value);
    }
  };
  const save_gaps_info = () => {
    var text = careGaps;
    var lines = text.split("\n");
    console.log(patient);
    console.log(chatMedication);
    // let medicationarray = []
    // medication.map((item) => {
    //   let temp = {"id":item.id}
    //   medicationarray.push(temp)
    // })
    let medicationarray = [
      {
        medication_id: 643,
      },
    ];
    let gapscare = [
      {
        id: 5,
        id: 6,
      },
    ];
    let gapdata = {};
    gapdata = {
      patient_id: patient.id,
      medications: medicationarray,
      recommendation_for_resolution: recommendation_for_resolution,
      care_gaps_as_noted_on_survey: gapscare,
      notes: notes,
    };
    console.log(gapdata);
    axios
      .post(server.serverURL + "v1/gaps-in-care", gapdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        setrecommendation_for_resolution("");
        setNotes("");
        setChangeStatusValue(Math.random());
        setMarkStatus(0);
      });
  };
  const save_after_visit_summary = () => {
    var text = goalsList;
    var lines = text.split("\n");
    let medicationarray = [
      {
        medication_id: 643,
      },
    ];
    let goals = [];
    lines.map((item) => {
      let goalItem = { value: item };
      goals.push(goalItem);
    });
    console.log(goals);
    let summaryData = {
      patient_id: patient.id,
      medications: medicationarray,
      short_text: shortText,
      goals: goals,
    };
    if (afterVisitSummary[0] === undefined) {
      axios
        .post(server.serverURL + "v1/visit-summaries", summaryData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setChangeStatusValue(Math.random());
          setMarkStatus(0);
        });
    }
    axios
      .put(server.serverURL + "v1/visit-summaries/" + selVisitId, summaryData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setChangeStatusValue(Math.random());
        setMarkStatus(0);
      });
  };
  const changeStatus = () => {
    if (markStatus == 0) setMarkStatus(1);
    else setMarkStatus(0);
  };

  const save = (data) => {
    
  };
  const markasPastVisitNote =()=>{
    let now = Moment(Date.now()).format("MM/DD/YYYY in hh:mm a");
    setMarkPastVisitTxt("Last reviewed on" + now);
  }
  const markAsReviewed = () => {
    let counter = 0;
    
    if(checkAction1 === "check-active"){
      counter++;
    }
    if(checkAction2 === "check-active"){
      counter++;
    }
    if(checkAction3 === "check-active"){
      counter++;
    }
    if(checkAction4 === "check-active"){
      counter++;
    }
    if(checkAction5 === "check-active"){
      counter++;
    }
    if(checkAction6 === "check-active"){
      counter++;
    }
    
    setActiveNumber(counter);
  }

  const myTheme = createTheme({
    // Set up your custom MUI theme here
  });

  return (
    <div
      className="room d-flex justify-content-center flex-column py-4 px-3"
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div>
        <div className="d-flex justify-content-between p-3">
          <div className="checked-title">
            Medication Therapy 
            <br /> Management Tasks
          </div>
          <div className="checked-info">
            {activeNumber} out of 6<br /> completed
          </div>
        </div>
      </div>

      <div className="accordation">
        <div className="d-flex">
          <CheckCircleIcon
            className={`${checkAction1}`}
            style={{ marginRight: 20, marginTop: 28 }}
          />
          <Accordion
            className="w-100"
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            sx={{
              py: 0.4,
              my: 0.8,
              backgroundColor: "#F7F7FC",
              borderRadius: 4,
              boxShadow: 0,
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}>
                Allergies
              </Typography>
              <div
                    className="text-center"
                    style={{
                      color: "#6308F7",
                      marginTop: 45,
                      marginBottom: 6,
                      fontWeight: 700,
                    }}
                  >{markAsReviewedAllergy !== undefined && markAsReviewedAllergy !== null && markAsReviewedAllergy !=="" ? markAsReviewedAllergy:""}
                  </div>
            </AccordionSummary>

            <AccordionDetails>
              {screenAction === 0 && (
                <div>
                  <List sx={{ width: "100%", bgcolor: "#F7F7FC" }}>
                    {allergy.map((item, i) => (
                      <ListItem
                        key={i}
                        disableGutters
                        sx={{
                          borderRadius: 4,
                          backgroundColor: "#6308F7",
                          my: 2,
                          py: 1.0,
                        }}
                      >
                        <IconButton onClick={handleAction1}>
                          <CheckBoxIcon
                            className="active"
                            sx={{
                              color: "#cccccc",
                              backgroundColor: "#FFFFFF",
                            }}
                          />
                        </IconButton>
                        <ListItemText
                          className="active"
                          primary={`${item.allergy_name} - ${item.interaction} ${item.allergy_type}`}
                          sx={{ px: 2, color: "#FFFFFF" }}
                        />
                      </ListItem>
                    ))}
                    {noAllergy}
                    <ListItem
                      className={`${listAction2}`}
                      key={2}
                      disableGutters
                      sx={{
                        borderRadius: 5,
                        backgroundColor: "#EFF0F6",
                        mt: 10,
                        py: 1.8,
                      }}
                    >
                      <IconButton onClick={handleAction2}>
                        <Brightness1Icon
                          className={`${listAction2} line`}
                          sx={{ color: "#DFE6E9" }}
                        />
                      </IconButton>
                      <ListItemText
                        className={`${listAction2} line`}
                        primary={"Add an Allergy"}
                        sx={{ px: 2 }}
                      />
                    </ListItem>
                  </List>
                  {
                    <div>
                      <div
                        className="text-center"
                        style={{
                          color: "#6308F7",
                          marginTop: 45,
                          marginBottom: 6,
                          fontWeight: 700,
                        }}
                      >
                        {markAsReviewedAllergy}
                      </div>
                      <button
                        onClick={noAllergyComplete}
                        className={`w-100 allergy-review-button ${reviewButton}`}
                        variant="contained"
                        // disabled={buttonDisableAction}
                        style={{
                          paddingBottom: 16,
                          paddingTop: 16,
                          borderRadius: 32,
                        }}
                      >
                        Mark As Reviewed
                      </button>
                    </div>
                  }
                </div>
              )}
              {screenAction === 1 && (
                <div>
                  {allergy.map((item, i) => (
                    <ListItem
                      key={i}
                      disableGutters
                      sx={{
                        borderRadius: 4,
                        backgroundColor: "#6308F7",
                        my: 2,
                        py: 1.0,
                      }}
                    >
                      <IconButton onClick={handleAction1}>
                        <CheckBoxIcon
                          className="active"
                          sx={{
                            color: "#cccccc",
                            backgroundColor: "#FFFFFF",
                          }}
                        />
                      </IconButton>
                      <ListItemText
                        className="active"
                        primary={`${item.allergy_name} - ${item.interaction} ${item.allergy_type}`}
                        sx={{ px: 2, color: "#FFFFFF" }}
                      />
                    </ListItem>
                  ))}
                  <input
                    id="list1"
                    value={list1}
                    type="text"
                    placeholder="Allergy"
                    className="w-100 login-form"
                    onChange={SaveOrBack}
                    style={{ margin: 5 }}
                  />
                  <input
                    id="list2"
                    value={list2}
                    type="text"
                    placeholder="Reaction"
                    className="w-100 login-form"
                    onChange={SaveOrBack}
                    style={{ margin: 5 }}
                  />
                  <Box sx={{ minWidth: 120 }}>
                    <Select
                      id="demo-simple-select"
                      value={age}
                      className="login-form w-100"
                      onChange={handleSelectChange}
                      style={colourStyles}
                    >
                      <MenuItem value="Mild">Mild</MenuItem>
                      <MenuItem value="Moderate">Moderate</MenuItem>
                      <MenuItem value="Severe">Severe</MenuItem>
                    </Select>
                  </Box>
                  {/* <Select
                  defaultValue={items[0]}
                  label="Single select"
                  options={items}
                  styles={colourStyles}
                /> */}
                  <ColorButton
                    className="w-25"
                    variant="contained"
                    onClick={completeAllergy}
                    style={{
                      float: "right",
                      marginTop: 12,
                      marginBottom: 12,
                      paddingBottom: 16,
                      paddingTop: 16,
                      borderRadius: 32,
                    }}
                  >
                    {backButtonAction}
                  </ColorButton>
                </div>
              )}
              {screenAction === 2 && (
                <div>
                  {allergy.map((item, i) => (
                    <ListItem
                      key={i}
                      disableGutters
                      sx={{
                        borderRadius: 4,
                        backgroundColor: "#6308F7",
                        my: 2,
                        py: 1.0,
                      }}
                    >
                      <IconButton onClick={handleAction1}>
                        <CheckBoxIcon
                          className="active"
                          sx={{
                            color: "#cccccc",
                            backgroundColor: "#FFFFFF",
                          }}
                        />
                      </IconButton>
                      <ListItemText
                        className="active"
                        primary={`${item.allergy_name} - ${item.interaction} ${item.allergy_type}`}
                        sx={{ px: 2, color: "#FFFFFF" }}
                      />
                    </ListItem>
                  ))}
                  <div
                    className="text-center"
                    style={{
                      color: "#6308F7",
                      marginTop: 45,
                      marginBottom: 6,
                      fontWeight: 700,
                    }}
                  >{`Last reviewed on ${Moment(markAsReviewedAllergy).format(
                    "MM/DD/YYYY in hh:mm a"
                  )}`}</div>
                  <ColorButton
                    className="w-100"
                    variant="contained"
                    onClick={completeAllergy}
                    style={{
                      float: "right",
                      marginBottom: 12,
                      paddingBottom: 16,
                      paddingTop: 16,
                      borderRadius: 32,
                    }}
                  >
                    Mark as reviewed
                  </ColorButton>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="d-flex">
          <CheckCircleIcon
            className={checkAction2}
            style={{ marginRight: 20, marginTop: 28 }}
          />
          <Accordion
            className="w-100"
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
            sx={{
              py: 0.4,
              my: 0.8,
              backgroundColor: "#F7F7FC",
              borderRadius: 5,
              boxShadow: 0,
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}>
                Current Medications
              </Typography>
              <div
                      className="text-center"
                      style={{
                        color: "#6308F7",
                        marginTop: 45,
                        marginBottom: 6,
                        fontWeight: 700,
                      }}
                    >
                      {markAsReviewedMedicationText !== undefined && markAsReviewedMedicationText !== null && markAsReviewedMedicationText !=="" ? markAsReviewedMedicationText : ""}
                    </div>
            </AccordionSummary>
            <AccordionDetails>
              {chatMedication.map((item, i) => (
                <ListItem
                  key={i}
                  disableGutters
                  sx={{
                    borderRadius: 4,
                    backgroundColor: "#6308F7",
                    my: 3,
                    py: 0.5,
                  }}
                >
                  <IconButton onClick={handleAction1}>
                    <CheckBoxIcon
                      className="active"
                      sx={{ color: "#914DFF", backgroundColor: "#FFFFFF" }}
                    />
                  </IconButton>
                  <ListItemText
                    className="active"
                    primary={item}
                    sx={{ px: 2, color: "#FFFFFF" }}
                  />
                  {/* <p className="active" key={i}>{item}</p> */}
                </ListItem>
              ))}
              {screenAction === 0 && (
                <div>
                  <ListItem
                    className={`${listAction3}`}
                    key={5}
                    disableGutters
                    sx={{ borderRadius: 10, backgroundColor: "#EFF0F6", my: 3 }}
                  >
                    <IconButton onClick={handleAction3}>
                      <Brightness1Icon
                        className={listAction3}
                        sx={{ color: "#DFE6E9" }}
                      />
                    </IconButton>
                    <ListItemText
                      className={`${listAction3}`}
                      primary={"Add an Medication"}
                      sx={{ px: 2 }}
                    />
                  </ListItem>
                </div>
              )}
              {screenAction === 0 &&
                markAsReviewedMedication == "MarkAsReview" && (
                  <div>
                    <div
                      className="text-center"
                      style={{
                        color: "#6308F7",
                        marginTop: 45,
                        marginBottom: 6,
                        fontWeight: 700,
                      }}
                    >
                      {markAsReviewedMedicationText}
                    </div>
                    <ColorButton
                      className="w-100"
                      variant="contained"
                      onClick={completeMedicine}
                      style={{
                        float: "right",
                        marginBottom: 12,
                        paddingBottom: 16,
                        paddingTop: 16,
                        borderRadius: 32,
                      }}
                    >
                      Mark as reviewed
                    </ColorButton>
                  </div>
                )}
              {screenAction === 1 && (
                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={drugs}
                      sx={{ width: 250 }}
                      onChange={handleSearchChange}
                      onInputChange={onHandleInputMedicationName}
                      renderInput={(params) => (
                        <TextField {...params} label="Medication name" />
                      )}
                      style={{
                        border: "2 solid transparent",
                        boxShadow: 0,
                        borderRadius: 24,
                      }}
                    />
                    <input
                      id="list3"
                      value={list3}
                      style={{ marginTop: 7, marginLeft: 20 }}
                      type="text"
                      placeholder="Strength"
                      className="w-50 login-form"
                      onChange={ShowDescription}
                    />
                  </div>
                  <div hidden={expandedDescription}>
                    <input
                      id="list4"
                      value={list4}
                      style={{ marginTop: 7 }}
                      type="text"
                      placeholder="Directions"
                      className="w-100 login-form"
                      onChange={showSave}
                    />
                    <ColorButton
                      className="w-25"
                      hidden={medicineSave}
                      variant="contained"
                      onClick={completeMedicine}
                      style={{
                        float: "right",
                        marginTop: 12,
                        marginBottom: 12,
                        paddingBottom: 12,
                        paddingTop: 12,
                        borderRadius: 32,
                      }}
                    >
                      {medicationButton}
                    </ColorButton>
                  </div>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="d-flex">
          <CheckCircleIcon
            className={checkAction3}
            style={{ marginRight: 20, marginTop: 28 }}
          />
          <Accordion
            className="w-100"
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            sx={{
              py: 0.4,
              my: 0.8,
              backgroundColor: "#F7F7FC",
              borderRadius: 5,
              boxShadow: 0,
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}>
                Survey Answers
              </Typography>
              <div
                        className="text-center"
                        style={{
                          color: "#6308F7",
                          marginTop: 45,
                          marginBottom: 6,
                          fontWeight: 700,
                        }}
                      >
                        {markAsSurveyAns}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {survey &&
                survey.map((item, index) => (
                  <div className="d-flex">
                    <div className="p-1">
                      <p style={{ fontWeight: 600 }}>Q{index + 1}.</p>
                    </div>
                    <div>
                      <p
                        className="pl-2"
                        style={{ fontWeight: 400, letterSpacing: 1.0 }}
                      >
                        {item.question_description}
                        <span style={{ color: "#610BEF", fontWeight: 600 }}>
                          {/* {" "}
                          {false && item.multiple_options &&
                            item.multiple_options.length !== 0 &&
                            item.multiple_type_id &&
                            item.multiple_type_id === 1 &&
                            item.multiple_options[item.multiple_type_id].name}
                          {item.multiple_type_id &&
                            item.multiple_type_id === 2 &&
                            item.answer} */}
                        </span>
                        {item.multiple_options && item.multiple_options.length !== 0 ? (
                          <div>
                            <Select
                                id="survey_demo-simple-select"
                                value={state["surveyAns_"+index] === null || state["surveyAns_"+index] === undefined ? item.answer : state["surveyAns_"+index]}
                                name ={"surveyAns_"+index}
                                className="login-form w-100"
                                onChange={(e)=>SurveyanwhandleSelectChange(e,"surveyAns_"+index)}
                                style={colourStyles}
                              >
                              {item.multiple_options.map((_mitem,_index)=>(                                
                                  <MenuItem value={_index}>{_mitem.name}</MenuItem>
                              ))}
                            </Select>
                          </div>
                        ):(<div/>)}
                        {item.multiple_type_id &&
                            item.multiple_type_id === 2 ?
                            (
                              <div>
                                <input
                                  type="text"
                                  name="recommendation"
                                  placeholder="Answer"
                                  className="login-form"
                                  onChange={(e)=>surveryAnsText(e,"surveyAns_"+index)}
                                  value={state["surveyAns_"+index] === null || state["surveyAns_"+index] === undefined ? item.answer : state["surveyAns_"+index]}
                                
                                />
                              </div>
                            ):(<div/>)
                            }
                      </p>
                    </div>
                  </div>
                ))}
                {survey && survey.length > 0 && !surveyAnsMakeAsView? (
                  <ColorButton
                      className="w-25"
                      variant="contained"
                      onClick={completeSurvery}
                      style={{
                        float: "right",
                        marginTop: 12,
                        marginBottom: 12,
                        paddingBottom: 12,
                        paddingTop: 12,
                        borderRadius: 32,
                      }}
                    >
                      Save
                  </ColorButton>
                ) : (<div/>)}
                <div
                        className="text-center"
                        style={{
                          color: "#6308F7",
                          marginTop: 45,
                          marginBottom: 6,
                          fontWeight: 700,
                        }}
                      >
                        {markAsSurveyAns}
                </div>
                {surveyAnsMakeAsView ? (
                  <ColorButton
                  className="w-100"
                  variant="contained"
                  onClick={markasreviewSurvey}
                  style={{
                    paddingBottom: 12,
                    paddingTop: 12,
                    borderRadius: 32,
                  }}
                  >
                    Mark As Reviewed
                  </ColorButton>
                ):(<div/>)}
                
            </AccordionDetails>
            
          </Accordion>
        </div>
        <div className="d-flex">
          <CheckCircleIcon
            className={checkAction6}
            style={{ marginRight: 20, marginTop: 28 }}
          />
          <Accordion
            className="w-100"
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
            sx={{
              py: 0.4,
              my: 0.8,
              backgroundColor: "#F7F7FC",
              borderRadius: 5,
              boxShadow: 0,
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}>
                Past Visit Notes
              </Typography>
              <div
                        className="text-center"
                        style={{
                          color: "#6308F7",
                          marginTop: 45,
                          marginBottom: 6,
                          fontWeight: 700,
                        }}
                      >
                        {markPastVisitTxt}
                </div>

            </AccordionSummary>
            <AccordionDetails>
              {afterSummary &&
                afterSummary.map((item, index) => (
                  <Accordion
                    className="mt-3"
                    expanded={subExpanded === "panel1" + (index + 1)}
                    onChange={subhandleChange("panel1" + (index + 1))}
                    style={{
                      backgroundColor: "#ECF0F1",
                      borderRadius: 15,
                      padding: 12,
                    }}
                  >
                    <AccordionSummary
                      aria-controls="panel1d-content"
                      id={`panel${index + 1}d-header`}
                    >
                      <div className="d-flex justify-content-between w-100">
                        <div className="d-flex">
                          <div>
                            <img
                              className="img-circle"
                              src={item["doctor_info"]["avatar"]}
                              style={{ width: 84, height: 84 }}
                            />
                          </div>
                          <div className="align-self-center pl-3 pt-3">
                            <p style={{ fontWeight: 700 }}>
                              Dr. {item["doctor_info"]["last_name"]}
                            </p>
                            <p style={{ fontWeight: 400 }}>
                              {item["doctor_info"]["speciality"]}
                            </p>
                          </div>
                        </div>
                        <div
                          className="align-self-center"
                          style={{ textAlign: "right" }}
                        >
                          <p style={{ fontWeight: 400 }}>
                            {item["reviewed_date"]}
                          </p>
                          <p style={{ fontWeight: 400 }}>
                            {Moment(item["created_at"]).format("hh:mm a")}
                          </p>
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className="pt-4">
                          <p style={{ fontWeight: 700, fontSize: 19 }}>
                            After Visit Summary
                          </p>
                        </div>
                        <div>
                          <p className="fw-400">Dear {patient.patient_name}.</p>
                          <p className="fw-400 pt-1">
                            {Moment(item["reviewed_date"]).format("MM/DD/YYYY")}{" "}
                            {item["short_text"]}
                          </p>
                        </div>
                        <div className="py-2">
                          <div>
                            <p className="fw-600">
                              During the course of our review, it was our goal
                              to:
                            </p>
                          </div>
                          <div className="w-85 mx-auto">
                            <ul>
                              {item["goals"].map((subitem) => (
                                <li
                                  style={{ fontWeight: 400, lineHeight: 1.4 }}
                                >
                                  {subitem["value"]}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p className="fw-400">
                              Your Current Medications Are
                            </p>
                          </div>
                          <div>
                            {chatMedication.map((item, i) => (
                              <ListItem
                                key={i}
                                disableGutters
                                sx={{
                                  borderRadius: 4,
                                  backgroundColor: "#6308F7",
                                  my: 3,
                                  py: 0.5,
                                }}
                                className="w-85 mx-auto"
                              >
                                <IconButton onClick={handleAction1}>
                                  <CheckBoxIcon
                                    className="active"
                                    sx={{
                                      color: "#914DFF",
                                      backgroundColor: "#FFFFFF",
                                    }}
                                  />
                                </IconButton>
                                <ListItemText
                                  className="active"
                                  primary={item}
                                  sx={{ px: 2, color: "#FFFFFF" }}
                                />
                              </ListItem>
                            ))}
                          </div>
                        </div>
                        <div className="py-2">
                          <div>
                            <p className="fw-400">
                              During the course of our review, it was our goal
                              to:
                            </p>
                          </div>
                          <div className="w-85 mx-auto">
                            <ul>
                              <li style={{ fontWeight: 400, lineHeight: 1.4 }}>
                                {gapsincare.data &&
                                  gapsincare.data.length !== 0 &&
                                  gapsincare.data[0][
                                    "recommendation_for_resolution"
                                  ]}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div style={{ padding: 8 }}>
                          <p
                            style={{ fontWeight: 400, lineHeight: 1.6 }}
                            dangerouslySetInnerHTML={{
                              __html:
                                gapsincare.data &&
                                gapsincare.data.length !== 0 &&
                                gapsincare.data[0]["notes"],
                            }}
                          />
                        </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              <div className="pt-3">
                <ColorButton
                  className="w-100"
                  variant="contained"
                  style={{
                    paddingBottom: 12,
                    paddingTop: 12,
                    borderRadius: 32,
                  }}
                  onClick={markasPastVisitNote}
                  
                >
                  Mark As Reviewed
                </ColorButton>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="d-flex flex-row">
          <CheckCircleIcon
            className={checkAction4}
            style={{ marginRight: 20, marginTop: 28 }}
          />
          <Accordion
            className="w-100"
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
            sx={{
              py: 0.4,
              my: 0.8,
              backgroundColor: "#F7F7FC",
              borderRadius: 5,
              boxShadow: 0,
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}>
                Gaps In Care
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div>
                  <p className="fw-600">
                    The Following Medication Interactions were Noted
                  </p>
                </div>
                <div>
                  {chatMedication.map((item, i) => (
                    <ListItem
                      key={i}
                      disableGutters
                      sx={{
                        borderRadius: 4,
                        backgroundColor: "#6308F7",
                        my: 3,
                        py: 0.5,
                      }}
                      className="w-85 mx-auto"
                    >
                      <IconButton onClick={handleAction1}>
                        <CheckBoxIcon
                          className="active"
                          sx={{ color: "#914DFF", backgroundColor: "#FFFFFF" }}
                        />
                      </IconButton>
                      <ListItemText
                        className="active"
                        primary={item}
                        sx={{ px: 2, color: "#FFFFFF" }}
                      />
                    </ListItem>
                  ))}
                </div>
              </div>
              <div className="p-2">
                <div>
                  <p className="fw-600">Input Recommendation for Resolution</p>
                </div>
                <div className="w-85 mx-auto p-3" style={{ borderRadius: 12 }}>
                  {markStatus == 1 && (
                    <input
                      type="text"
                      name="recommendation"
                      placeholder="Recommendation for resolution"
                      className="login-form"
                      onChange={formgaps}
                      value={recommendation_for_resolution}
                    />
                  )}

                  {/* <p style={{fontWeight:400, lineHeight:1.4}}>We suggest you contact your primary doctor to resolve this.</p> */}
                  {markStatus == 0 && (
                    <p style={{ fontWeight: 400, lineHeight: 1.4 }}>
                      {gapsincare.data &&
                        gapsincare.data.length !== 0 &&
                        gapsincare.data[0]["recommendation_for_resolution"]}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-2">
                <div>
                  <p className="fw-600">Care Gaps As Noted on Survey</p>
                </div>
                <div className="w-85 mx-auto p-3">
                  {markStatus == 0 && (
                    <ul>
                      <li style={{ fontWeight: 400, lineHeight: 1.4 }}>
                        We suggest you contact your primary doctor to resolve
                        this.
                      </li>
                      <li style={{ fontWeight: 400, lineHeight: 1.4 }}>
                        This patient is at risk for care coordination issues and
                        has barrires to obtaining care.
                      </li>
                      <li style={{ fontWeight: 400, lineHeight: 1.4 }}>
                        This access may be affecting compliance.
                      </li>
                    </ul>
                  )}
                  {markStatus == 1 && (
                    <textarea
                      rows="5"
                      cols="40"
                      id="textedit"
                      style={{ padding: 14 }}
                      placeholder="Notes Addressing Patient’s Needs"
                      className="edit-form"
                      onChange={textedithandler}
                    >
                      {careGaps}
                    </textarea>
                  )}
                </div>
              </div>
              <div className="p-2">
                <div>
                  <p>Notes Addressing Patient’s Needs</p>
                </div>
                <div className="w-85 mx-auto p-3" style={{ borderRadius: 12 }}>
                  {markStatus == 1 && (
                    <input
                      type="text"
                      name="notes"
                      placeholder="Notes Addressing Patient’s Needs"
                      className="login-form"
                      onChange={formgaps}
                      value={notes}
                    />
                  )}
                  {markStatus == 0 && (
                    <p
                      style={{ fontWeight: 400, lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{
                        __html:
                          gapsincare.data &&
                          gapsincare.data.length !== 0 &&
                          gapsincare.data[0]["notes"],
                      }}
                    />
                  )}
                </div>
              </div>
              <div style={{ padding: 8 }}>
                <ColorButton
                  className="w-100"
                  variant="contained"
                  style={{
                    paddingBottom: 12,
                    paddingTop: 12,
                    borderRadius: 32,
                  }}
                  onClick={markStatus === 1 ? save_gaps_info : changeStatus}
                >
                  {button_text[markStatus]}
                </ColorButton>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="d-flex">
          <CheckCircleIcon
            className={checkAction5}
            style={{ marginRight: 20, marginTop: 28 }}
          />
          <Accordion
            className="w-100"
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
            sx={{
              py: 0.4,
              my: 0.8,
              backgroundColor: "#F7F7FC",
              borderRadius: 5,
              boxShadow: 0,
            }}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls="panel6bh-content"
              id="panel6bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}>
                After Visit Summary
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {afterVisitSummary &&
                  afterVisitSummary.length > 0 &&
                  afterVisitSummary[0] !== undefined &&
                  afterVisitSummary.map((item,_mm) => (
                    <div key={_mm}>
                      <div>
                        <p className="fw-400">Dear {patient.patient_name}.</p>
                        <p className="fw-400 pt-1">
                          {markStatus && (
                            <input
                              type="text"
                              name="short_text"
                              placeholder="Recommendation for resolution"
                              className="login-form"
                              onChange={formgaps}
                              value={shortText}
                            />
                          )}
                          {!markStatus &&
                            Moment(item["reviewed_date"]).format("MM/DD/YYYY")}
                          {!markStatus && item["short_text"]}
                        </p>
                      </div>
                      <div className="py-2">
                        <div>
                          <p className="fw-600">
                            During the course of our review, it was our goal to:
                          </p>
                        </div>
                        <div className="w-85 mx-auto">
                          {markStatus === 0 && (
                            <ul>
                              {item["goals"].map((subitem,_mindex) => (
                                <li key={_mindex}
                                  style={{ fontWeight: 400, lineHeight: 1.4 }}
                                >
                                  {subitem["value"]}
                                </li>
                              ))}
                            </ul>
                          )}
                          {markStatus === 1 && (
                            <textarea
                              rows="5"
                              cols="40"
                              id="goalsList"
                              style={{ padding: 14 }}
                              placeholder="Notes Addressing Patient’s Needs"
                              className="edit-form"
                              onChange={textedithandler}
                            >
                              {goalsList}
                            </textarea>
                          )}
                        </div>
                      </div>
                      <div>
                        <div>
                          <p className="fw-400">Your Current Medications Are</p>
                        </div>
                        <div>
                          {chatMedication.map((item, i) => (
                            <ListItem
                              key={i}
                              disableGutters
                              sx={{
                                borderRadius: 4,
                                backgroundColor: "#6308F7",
                                my: 3,
                                py: 0.5,
                              }}
                              className="w-85 mx-auto"
                            >
                              <IconButton onClick={handleAction1}>
                                <CheckBoxIcon
                                  className="active"
                                  sx={{
                                    color: "#914DFF",
                                    backgroundColor: "#FFFFFF",
                                  }}
                                />
                              </IconButton>
                              <ListItemText
                                className="active"
                                primary={item}
                                sx={{ px: 2, color: "#FFFFFF" }}
                              />
                            </ListItem>
                          ))}
                        </div>
                      </div>
                      <div className="py-2">
                        <div>
                          <p className="fw-400">
                            During the course of our review, it was our goal to:
                          </p>
                        </div>
                        <div className="w-85 mx-auto">
                          <ul>
                            <li style={{ fontWeight: 400, lineHeight: 1.4 }}>
                              {gapsincare.data &&
                                gapsincare.data.length !== 0 &&
                                gapsincare.data[0][
                                  "recommendation_for_resolution"
                                ]}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div style={{ padding: 8 }}>
                        <p
                          style={{ fontWeight: 400, lineHeight: 1.6 }}
                          dangerouslySetInnerHTML={{
                            __html:
                              gapsincare.data &&
                              gapsincare.data.length !== 0 &&
                              gapsincare.data[0]["notes"],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                {afterVisitSummary[0] === undefined && (
                  <div>
                    <div>
                      <p className="fw-400">Dear {patient.patient_name}.</p>
                      <p className="fw-400 pt-1">
                        <input
                          type="text"
                          name="short_text"
                          placeholder="Recommendation for resolution"
                          className="login-form"
                          onChange={formgaps}
                          value={shortText}
                        />
                      </p>
                    </div>
                    <div className="py-2">
                      <div>
                        <p className="fw-600">
                          During the course of our review, it was our goal to:
                        </p>
                      </div>
                      <div className="w-85 mx-auto">
                        <textarea
                          rows="5"
                          cols="40"
                          id="goalsList"
                          style={{ padding: 14 }}
                          placeholder="Notes Addressing Patient’s Needs"
                          className="edit-form"
                          onChange={textedithandler}
                        >
                          {goalsList}
                        </textarea>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ padding: 8 }}>
                  <ColorButton
                    className="w-100"
                    variant="contained"
                    style={{
                      paddingBottom: 12,
                      paddingTop: 12,
                      borderRadius: 32,
                    }}
                    onClick={
                      markStatus === 1 ? save_after_visit_summary : changeStatus
                    }
                  >
                    {button_text[markStatus]}
                  </ColorButton>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
