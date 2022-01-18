import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import '../style.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../../../config/server';

import { showConfirm } from "../../my_confirm_dlg/showConfirmDlg";
import { showAlert } from "../../my_alert_dlg/showAlertDlg";

import LoadingOverlay from 'react-loading-overlay';
import { TASKADDINGSTATUS, TASKTYPE } from './enum_task';

export const LegacyAssignedTask = () => {
    const [visibleAddSection, setVisibleAddSection] = useState(false);
    const [addOptionSwitch, setSwitch] = useState(true);
    const [showSequence, setShowSequence] = useState(false);
    const [showTaskComponent, setShowTaskComponent] = useState("");

    const [selectedTaskTypeNo, setSelectedTaskTypeNo] = useState(0);

    const [taskTypeTitle, setTaskTypeTitle] = useState("Task Type");
    const userAssigedData = useSelector(state => state.assignedData);
    const userInfo = useSelector(state => state.patientSelect);
    const [listSequenceFalseItem, setListSequenceFalseItem] = useState([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
    const [listSequenceTrueItem, setListSequenceTrueItem] = useState([{ timename: "newtimeItem0", name: "newItem0", placeHolder: "Introduction Item #0" }]);
    const [newItemCounter, setNewItemCounter] = useState(1);
    const [lastTaskId, setLastTaskId] = useState("");

    const [userTaskList, setUserTaskList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [infoDetails, setInfoDetails] = useState({});

    const [tempTasks, setTempTasks] = useState([]);
    const [taskAddStatus, setTaskAddStatus] = useState(TASKADDINGSTATUS.new_task);


    // Show add section
    const showAddSection = async () => {
        setVisibleAddSection(true);
        // setIsShowingModal(true);        
    }

    // Hide add section
    const hideAddSection = () => {
        setVisibleAddSection(false);
    }

    // Toggle switch
    const toggleSwitch = () => {
        setSwitch(!addOptionSwitch);
    }

    // Switch style
    const switchIndividualStyle = {
        justifyContent: "flex-start",
    }

    const switchSequencedStyle = {
        justifyContent: "flex-end",
    }

    const task_ul_dropdown = {
        width: "100%",
        top: "0px",
        position: "absolute",
        left: "0px",
        padding: "0px",
        willChange: "transform",
        transform: "translate3d(0px, 37px, 0px)"
    }

    const onSetShowTaskType = () => {
        let classProperty = $("#task-type").attr("class");
        if (classProperty === "dropdown-menu task_ul_dropdown show") {
            $("#task-type").removeClass("show");
        } else {
            $("#task-template").removeClass("show");
            $("#task-type").addClass("show");
        }
        $(".type_btn").on("click", function (e) {
            switch (e.target.id) {
                case "medication_tab":
                    setShowTaskComponent("medication");
                    $("#task-type").removeClass("show");
                    setTaskTypeTitle("Prescribe Medication");
                    setSelectedTaskTypeNo(1);
                    break;
                case "treatment_tab":
                    setShowTaskComponent("treatment");
                    $("#task-type").removeClass("show");
                    setTaskTypeTitle("Treatment Plan");
                    setSelectedTaskTypeNo(2);
                    break;
                case "scheduling_tab":
                    setShowTaskComponent("scheduling");
                    $("#task-type").removeClass("show");
                    setTaskTypeTitle("Appointment Scheduling");
                    setSelectedTaskTypeNo(3);
                    break;
                case "referDoctor_tab":
                    setShowTaskComponent("referDoctor");
                    $("#task-type").removeClass("show");
                    setTaskTypeTitle("Refer to Doctor");
                    setSelectedTaskTypeNo(4);
                    break;
                case "list_tab":
                    setShowTaskComponent("list");
                    $("#task-type").removeClass("show");
                    setTaskTypeTitle("List");
                    setSelectedTaskTypeNo(5);
                    break;
                case "questionnaire_tab":
                    setShowTaskComponent("questionnaire");
                    $("#task-type").removeClass("show");
                    setTaskTypeTitle("Questionnaire");
                    setSelectedTaskTypeNo(6);
                    break;
                default:
                    setShowTaskComponent("");
                    setSelectedTaskTypeNo(0);
                    break;
            }
        })
    }

    useEffect(() => {
        if (userInfo.id !== undefined) {
            getPatientTaskList();
        }
    }, [userInfo]);

    const getPatientTaskList = () => {
        axios.get(server.serverURL + 'v1/tasks?patient_id=' + userInfo.id, { ...config })
            .then((res) => {
                setUserTaskList([...res.data.data.results]);
            })
            .catch((error) => {
                setUserTaskList([]);
            });
    }

    const onSetShowTaskTemplate = () => {
        let classProperty = $("#task-template").attr("class");
        if (classProperty.includes("show")) {
            $("#task-template").removeClass("show");
        } else {
            $("#task-type").removeClass("show");
            $("#task-template").addClass("show");
        }
    }

    const onToggleSequence = () => {
        setNewItemCounter(1);
        setListSequenceFalseItem([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
        setListSequenceTrueItem([{ name: "newItem0", timename: "newtimeItem0", placeHolder: "Introduction #0" }]);
        setShowSequence(!showSequence);
    }


    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token,
            'Content-Type': 'application/json',
        }
    }

    const onAddToTempTask = (e, taskId) => {
        e.preventDefault();
        var newTaskDetail = {};
        switch (taskId) {
            case TASKTYPE.list:
                if (showSequence === false) {
                    newTaskDetail = { ...onListShowSequenceFalseSubmit(e) };
                } else {
                    newTaskDetail = { ...onListShowSequenceTrueSubmit(e) };
                }
                break;
            case TASKTYPE.prescribe_medication:
                newTaskDetail = { ...onSubmitMedicationData(e) };
                break;
            case TASKTYPE.treatment_plan:
                newTaskDetail = { ...onSubmitTreatmentPlan(e) };
                break;
            case TASKTYPE.appintment_scheduling:
                newTaskDetail = { ...onSubmitAppointmentScheduling(e) };
                break;
            case TASKTYPE.refer_to_doctor:
                newTaskDetail = { ...onSubmitReferToDoctor(e) };
                break;
        }
        // console.log("newTaskDetail", newTaskDetail);
        setTempTasks([...tempTasks, newTaskDetail]);
        setInfoDetails({})
    }
    console.log(tempTasks);
    const onListShowSequenceFalseSubmit = (e) => {
        let taskDetailsItem = [];
        let taskDetailsSequences = {};
        for (let index = 0; index < listSequenceFalseItem.length; index++) {
            const element = listSequenceFalseItem[index];
            taskDetailsItem.push(e.target["false_item_" + index].value);
        }
        let taskDetails = {
            "items": taskDetailsItem,
            "sequences": taskDetailsSequences
        };

        let requestData = {
            "type_id": "1",
            "patient_id": userInfo.id,
            "task_name": e.target["listTaskTitle"].value,
            "task_dueDate": e.target["listDueDate"].value,
            "task_detail": taskDetails
        };
        return requestData;
        // // {lastTaskId === "" ? "Save Task" : "Update Task"}
        // if (await showConfirm({
        //     content: lastTaskId === "" ? 'Are you sure to add new Task?' : 'Are you sure to update the task?'
        // })) {
        //     // console.log(requestData)
        //     if (lastTaskId !== "") {
        //         requestData['task_id'] = lastTaskId;
        //     }
        //     console.log("loadign start");
        //     setIsLoading(true);
        //     axios.post(server.serverURL + 'v1/tasks', requestData, { ...config })
        //         .then(res => {
        //             setIsLoading(false);
        //             var data = res.data.data;
        //             getPatientTaskList();
        //             showAlert({ content: lastTaskId === "" ? 'Task has been added!' : 'Task has been updated.' });
        //             setLastTaskId(data.task_id);
        //         })
        //         .catch((err) => {
        //             setIsLoading(false);
        //         })
        // } else {
        //     console.log('no');
        // }
    }

    const onListShowSequenceTrueSubmit = (e) => {
        let taskDetailsItem = [];

        for (let index = 0; index < listSequenceTrueItem.length; index++) {
            taskDetailsItem.push({
                "sequence_time": e.target["true_item_timename_" + index].value,
                "instruction": e.target["true_item_name_" + index].value
            });
        }
        let taskDetailsSequences = {
            "medications_to_stop": e.target["listSequenceMedication"].value,
            "items": taskDetailsItem
        };

        let taskDetails = {
            "items": [],
            "sequences": taskDetailsSequences
        };
        let requestData = {
            "type_id": "1",
            "patient_id": userInfo.id,
            "task_name": e.target["listTaskTitle"].value,
            "task_dueDate": e.target["listDueDate"].value,
            "task_detail": taskDetails
        };
        return requestData;
    }

    const onSubmitMedicationData = (e) => {
        let requestData = {
            "type_id": "2",
            "task_name": e.target["medication_name"].value,
            "patient_id": userInfo.id,
            "description": "CVS Pharmacy 208 W Washington St.Chicago, IL 60606",
            "task_detail": {
                "strength": e.target['medication_strength'].value,
                "quantity": e.target['medication_quantity'].value,
                "dosage": e.target['medication_dosage'].value,
                "refill_number": e.target['medication_refills'].value,
                "frequency": e.target['medication_frequency'].value,
            }
        };
        return requestData;
    }
    const onSubmitTreatmentPlan = (e) => {
        let requestData = {
            "type_id": "3",
            "task_name": e.target["treatment_title"].value,
            'patient_id': userInfo.id,
            'description': "CVS Pharmacy 208 W Washington St.Chicago, IL 60606",
            'frequency': e.target['treatment_frequency'].value,
        }
        return requestData;

        // var params = new FormData();
        // params.append('type_id', "3");
        // params.append('task_name', e.target["treatment_title"].value);
        // params.append('patient_id', userInfo.id);
        // params.append('description', "CVS Pharmacy 208 W Washington St.Chicago, IL 60606");
        // params.append('frequency', e.target['treatment_frequency'].value);


        // if (await showConfirm({
        //     content: lastTaskId === "" ? 'Are you sure to add new Task?' : 'Are you sure to update the task?'
        // })) {
        //     // console.log(requestData)
        //     if (lastTaskId !== "") {
        //         params.append('task_id', lastTaskId);
        //     }
        //     console.log(params);
        //     setIsLoading(true);
        //     axios.post(server.serverURL + 'v1/tasks',
        //         params,
        //         {
        //             headers: {
        //                 'Authorization': 'Bearer ' + localStorage.token,
        //                 'content-type': `multipart/form-data; boundary=${params._boundary}`
        //             }
        //         }
        //     )
        //         .then(res => {
        //             setIsLoading(false);
        //             var data = res.data.data;
        //             getPatientTaskList();
        //             showAlert({ content: lastTaskId === "" ? 'Task has been added!' : 'Task has been updated.' });
        //             setLastTaskId(data.task_id);
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //             setIsLoading(false);
        //         });
        // } else {
        //     console.log("no");
        // }
    }

    const onSubmitAppointmentScheduling = (e) => {
        let requestData = {
            "type_id": "4",
            "task_name": e.target["appointment_title"].value,
            "task_dueDate": e.target["appointment_due_date"].value,
            "patient_id": userInfo.id,
            "description": "CVS Pharmacy 208 W Washington St.Chicago, IL 60606",
            "task_detail": {
                "phone_number": e.target['appointment_phone_number'].value,
                "address": e.target['appointment_address'].value,
            }
        };
        return requestData;
    }

    const onSubmitReferToDoctor = (e) => {
        let requestData = {
            "type_id": "5",
            "task_name": e.target["refer_doctor_title"].value,
            "task_dueDate": e.target["refer_doctor_due_date"].value,
            "patient_id": userInfo.id,
            "description": "CVS Pharmacy 208 W Washington St.Chicago, IL 60606",
            "task_detail": {
                "phone_number": e.target['refer_doctor_phone_number'].value,
                "address": e.target['refer_doctor_address'].value,
            }
        };
        return requestData;
    }

    const onSaveTemplateSubmit = async (e) => {
        e.preventDefault();
        // console.log(lastTaskId);
        if (lastTaskId === "") {
            showAlert({ content: "Please add the task, first." });
            return;
        }
        let requestData = {
            "template_name": e.target["template_name"].value,
        };

        if (await showConfirm({
            content: 'Are you sure to add new Task Theme?'
        })) {
            setIsLoading(true);
            axios.put(server.serverURL + 'v1/tasks/' + lastTaskId, requestData, { ...config })
                .then(res => {

                    setLastTaskId("");
                    //var data = res.data.data;
                    // console.log(res.data)
                    axios.get(server.serverURL + 'v1/tasks?patient_id=' + userInfo.id, { ...config })
                        .then((taskData) => {
                            // console.log(taskData)
                            setUserTaskList([...taskData.data.data.results]);
                            getPatientTaskList();
                            showAlert({ content: "New Task Theme has been added!" });
                            setIsLoading(false);
                        })
                        .catch((error) => {
                            setIsLoading(false);
                            setUserTaskList([]);
                        })
                }).catch((err) => {
                    setIsLoading(false);
                })
        } else {
            console.log("no");
        }
    }

    const onAddNewListSequenceFalseItem = () => {
        setNewItemCounter((newItemCounter + 1));
        let newItem = {
            name: "newItem" + newItemCounter,
            placeHolder: "Checklist Item #" + newItemCounter
        }
        let virtualNewItemArray = listSequenceFalseItem;
        virtualNewItemArray.push(newItem);
        setListSequenceFalseItem(virtualNewItemArray);
    }

    const onAddNewListSequenceTrueItem = () => {
        setNewItemCounter((newItemCounter + 1));
        let newItem = {
            timename: "newtimeItem" + newItemCounter,
            name: "newItem" + newItemCounter,
            placeHolder: "Introduction #" + newItemCounter
        }
        let virtualNewItemArray = listSequenceTrueItem;
        virtualNewItemArray.push(newItem);
        setListSequenceTrueItem(virtualNewItemArray);
    }
    const onClickTaskTemplate = (taskId) => {
        setInfoDetails({});
        $("#task-template").removeClass("show");
        $("#task-template").removeClass("show");
        $("#task-type").removeClass("show");
        // console.log(taskId);
        axios.get(server.serverURL + 'v1/tasks/' + taskId, { ...config })
            .then((res) => {
                // console.log(res);
                var data = res.data.data;
                applySelectedTemplate(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const onClickTask = (taskId) => {
        $("#task-template").removeClass("show");
        $("#task-type").removeClass("show");
        setVisibleAddSection(true);
        setInfoDetails({});
        // console.log(taskId);
        axios.get(server.serverURL + 'v1/tasks/' + taskId, { ...config })
            .then((res) => {
                // console.log(res);
                var data = res.data.data;
                applySelectedTask(data);
                applySelectedTemplate(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const onClickTempTask = (index) => {
        var data = tempTasks[index];
        console.log(data)
        applySelected_TEMP_Task(data);
        applySelected_TEMP_Template(data);
    }
    const applySelected_TEMP_Task = (taskInfo) => {
        setInfoDetails({});
        $("#task-template").removeClass("show");
        $("#task-type").removeClass("show");
        console.log(taskInfo);
        console.log(showSequence);
        var selectedInfo = {};
        switch (taskInfo.type_id) {
            case TASKTYPE.list:

                if (taskInfo.task_detail.items.length > 0) {
                    selectedInfo['listTaskTitle'] = taskInfo.task_name;
                    selectedInfo['listDueDate'] = taskInfo.task_dueDate;
                    for (var i = 0; i < taskInfo.task_detail.items.length; i++) {
                        selectedInfo['false_item_' + i] = taskInfo.task_detail.items[i];
                    }
                    setShowSequence(false);
                } else {
                    selectedInfo['listTaskTitle'] = taskInfo.task_name;
                    selectedInfo['listDueDate'] = taskInfo.task_dueDate;
                    selectedInfo['listSequenceMedication'] = taskInfo.task_detail.sequences.medications_to_stop;
                    for (var i = 0; i < taskInfo.task_detail.sequences.items.length; i++) {
                        selectedInfo['true_item_timename_' + i] = taskInfo.task_detail.sequences.items[i].sequence_time;
                        selectedInfo['true_item_name_' + i] = taskInfo.task_detail.sequences.items[i].instruction;
                    }
                    setShowSequence(false);
                }
                break;
            case TASKTYPE.prescribe_medication:
                selectedInfo['medication_name'] = taskInfo.task_name;
                selectedInfo['medication_strength'] = taskInfo.task_detail.strength;
                selectedInfo['medication_quantity'] = taskInfo.task_detail.quantity;
                selectedInfo['medication_dosage'] = taskInfo.task_detail.dosage;
                selectedInfo['medication_refills'] = taskInfo.task_detail.refill_number;
                selectedInfo['medication_frequency'] = taskInfo.task_detail.frequency;
                selectedInfo['medication_comment'] = taskInfo.description;
                break;
            case TASKTYPE.treatment_plan:
                selectedInfo['treatment_title'] = taskInfo.task_name;
                selectedInfo['treatment_frequency'] = taskInfo.frequency;
                selectedInfo['treatment_medias'] = taskInfo.description;
                break;
            case TASKTYPE.appintment_scheduling:
                selectedInfo['appointment_title'] = taskInfo.task_name;
                selectedInfo['appointment_due_date'] = taskInfo.task_dueDate;
                selectedInfo['appointment_phone_number'] = taskInfo.task_detail.phone_number;
                selectedInfo['appointment_address'] = taskInfo.task_detail.address;
                break;
            case TASKTYPE.refer_to_doctor:
                selectedInfo['refer_doctor_title'] = taskInfo.task_name;
                selectedInfo['refer_doctor_due_date'] = taskInfo.task_dueDate;
                selectedInfo['refer_doctor_phone_number'] = taskInfo.task_detail.phone_number;
                selectedInfo['refer_doctor_address'] = taskInfo.task_detail.address;
                break;
        };
        setInfoDetails({ ...selectedInfo });
    }
    const applySelected_TEMP_Template = (taskInfo) => {
        $("#task-type").removeClass("show");
        setSelectedTaskTypeNo(taskInfo.type_id);
        switch (taskInfo.type_id) {
            case "1":
                setShowTaskComponent("list");
                setTaskTypeTitle("List");
                if (taskInfo.task_detail === null) {
                    setNewItemCounter(1);
                    setListSequenceFalseItem([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
                    setListSequenceTrueItem([{ name: "newItem0", timename: "newtimeItem0", placeHolder: "Introduction #0" }]);
                    setShowSequence(false);
                } else if (taskInfo.task_detail.items.length > 0) {  //it's not sequence data
                    var itemList = [];
                    var items = taskInfo.task_detail.items;
                    for (var i = 0; i < items.length; i++) {
                        itemList.push({
                            name: `newItem${i}`,
                            placeHolder: `Checklist Item #${i}`
                        });
                    }
                    setListSequenceFalseItem([...itemList]);
                    setListSequenceTrueItem([{ name: "newItem0", timename: "newtimeItem0", placeHolder: "Introduction #0" }]);
                    setShowSequence(false);
                    setNewItemCounter(items.length);
                } else if (taskInfo.task_detail.sequences.items.length > 0) {  // it's sequence
                    var itemList = [];
                    var items = taskInfo.task_detail.sequences.items;
                    for (var i = 0; i < items.length; i++) {
                        itemList.push({
                            name: `newItem${i}`,
                            timename: `newtimeItem${i}`,
                            placeHolder: `Introduction #${i}`,
                        });
                    }
                    setListSequenceTrueItem([...itemList]);
                    setListSequenceFalseItem([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
                    setNewItemCounter(items.length);
                    setShowSequence(true);
                } else {
                    setNewItemCounter(1);
                    setListSequenceFalseItem([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
                    setListSequenceTrueItem([{ name: "newItem0", timename: "newtimeItem0", placeHolder: "Introduction #0" }]);
                    setShowSequence(false);
                }
                break;
            case "2":
                setShowTaskComponent("medication");
                setTaskTypeTitle("Prescribe Medication");
                break;
            case "3":
                setShowTaskComponent("treatment");
                setTaskTypeTitle("Treatment Plan");
                break;
            case "4":
                setShowTaskComponent("scheduling");
                setTaskTypeTitle("Appointment Scheduling");
                break;
            case "5":
                setShowTaskComponent("referDoctor");
                setTaskTypeTitle("Refer to Doctor");
                break;
            case "6":
                setShowTaskComponent("questionnaire");
                setTaskTypeTitle("Questionnaire");
                break;
            default:
                setShowTaskComponent("");
                break;
        }
    }


    const applySelectedTask = (taskInfo) => {
        setInfoDetails({});
        $("#task-template").removeClass("show");
        $("#task-type").removeClass("show");
        // console.log(taskInfo);
        // console.log(showSequence);
        var selectedInfo = {};
        setLastTaskId(taskInfo.id);
        switch (taskInfo.type_id) {
            case TASKTYPE.list:
                if (taskInfo.details.items.length > 0) {
                    selectedInfo['listTaskTitle'] = taskInfo.name;
                    selectedInfo['listDueDate'] = taskInfo.end_date;
                    for (var i = 0; i < taskInfo.details.items.length; i++) {
                        selectedInfo['false_item_' + i] = taskInfo.details.items[i];
                    }
                } else {
                    selectedInfo['listTaskTitle'] = taskInfo.name;
                    selectedInfo['listDueDate'] = taskInfo.end_date;
                    selectedInfo['listSequenceMedication'] = taskInfo.details.sequences.medications_to_stop;
                    for (var i = 0; i < taskInfo.details.sequences.items.length; i++) {
                        selectedInfo['true_item_timename_' + i] = taskInfo.details.sequences.items[i].sequence_time;
                        selectedInfo['true_item_name_' + i] = taskInfo.details.sequences.items[i].instruction;
                    }
                }
                break;
            case TASKTYPE.prescribe_medication:
                selectedInfo['medication_name'] = taskInfo.name;
                selectedInfo['medication_strength'] = taskInfo.details.strength;
                selectedInfo['medication_quantity'] = taskInfo.details.quantity;
                selectedInfo['medication_dosage'] = taskInfo.details.dosage;
                selectedInfo['medication_refills'] = taskInfo.details.refill_number;
                selectedInfo['medication_frequency'] = taskInfo.details.frequency;
                selectedInfo['medication_comment'] = taskInfo.description;
                break;
            case TASKTYPE.treatment_plan:
                selectedInfo['treatment_title'] = taskInfo.name;
                selectedInfo['treatment_frequency'] = taskInfo.details.frequency;
                selectedInfo['treatment_medias'] = taskInfo.details.link;
                break;
            case TASKTYPE.appintment_scheduling:
                selectedInfo['appointment_title'] = taskInfo.name;
                selectedInfo['appointment_due_date'] = taskInfo.end_date;
                selectedInfo['appointment_phone_number'] = taskInfo.details.phone_number;
                selectedInfo['appointment_address'] = taskInfo.details.address;
                break;
            case TASKTYPE.refer_to_doctor:
                selectedInfo['refer_doctor_title'] = taskInfo.name;
                selectedInfo['refer_doctor_due_date'] = taskInfo.end_date;
                selectedInfo['refer_doctor_phone_number'] = taskInfo.details.phone_number;
                selectedInfo['refer_doctor_address'] = taskInfo.details.address;
                break;
        };
        setInfoDetails({ ...selectedInfo });
    }

    const applySelectedTemplate = (taskInfo) => {
        $("#task-type").removeClass("show");
        setSelectedTaskTypeNo(taskInfo.type_id);
        switch (taskInfo.type_id) {
            case "1":
                setShowTaskComponent("list");
                setTaskTypeTitle("List");
                if (taskInfo.details === null) {
                    setNewItemCounter(1);
                    setListSequenceFalseItem([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
                    setListSequenceTrueItem([{ name: "newItem0", timename: "newtimeItem0", placeHolder: "Introduction #0" }]);
                    setShowSequence(false);
                } else if (taskInfo.details.items.length > 0) {  //it's not sequence data
                    var itemList = [];
                    var items = taskInfo.details.items;
                    for (var i = 0; i < items.length; i++) {
                        itemList.push({
                            name: `newItem${i}`,
                            placeHolder: `Checklist Item #${i}`
                        });
                    }
                    setListSequenceFalseItem([...itemList]);
                    setListSequenceTrueItem([{ name: "newItem0", timename: "newtimeItem0", placeHolder: "Introduction #0" }]);
                    setShowSequence(false);
                    setNewItemCounter(items.length);
                } else if (taskInfo.details.sequences.items.length > 0) {  // it's sequence
                    var itemList = [];
                    var items = taskInfo.details.sequences.items;
                    for (var i = 0; i < items.length; i++) {
                        itemList.push({
                            name: `newItem${i}`,
                            timename: `newtimeItem${i}`,
                            placeHolder: `Introduction #${i}`,
                        });
                    }
                    setListSequenceTrueItem([...itemList]);
                    setListSequenceFalseItem([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
                    setNewItemCounter(items.length);
                    setShowSequence(true);
                } else {
                    setNewItemCounter(1);
                    setListSequenceFalseItem([{ name: "newItem0", placeHolder: "Checklist Item #0" }]);
                    setListSequenceTrueItem([{ name: "newItem0", timename: "newtimeItem0", placeHolder: "Introduction #0" }]);
                    setShowSequence(false);
                }
                break;
            case "2":
                setShowTaskComponent("medication");
                setTaskTypeTitle("Prescribe Medication");
                break;
            case "3":
                setShowTaskComponent("treatment");
                setTaskTypeTitle("Treatment Plan");
                break;
            case "4":
                setShowTaskComponent("scheduling");
                setTaskTypeTitle("Appointment Scheduling");
                break;
            case "5":
                setShowTaskComponent("referDoctor");
                setTaskTypeTitle("Refer to Doctor");
                break;
            case "6":
                setShowTaskComponent("questionnaire");
                setTaskTypeTitle("Questionnaire");
                break;
            default:
                setShowTaskComponent("");
                break;
        }
    }
    const userThemeUIList = userTaskList.filter(x => x.template_name !== "" && x.is_template !== "0").map((taskInfo) => {
        return (
            <li className="dropdown-item type_btn"
                key={`user_task_theme_list_key_${taskInfo.id}`}
                onClick={() => onClickTaskTemplate(taskInfo.id)}>
                {taskInfo.template_name}
            </li>
        );
    });
    const userTaskUIList = userTaskList.map((taskInfo) => {
        return (
            <div className="patient-page-existing-task-style"
                key={`user_task_key_${taskInfo.id}`}
                onClick={() => onClickTask(taskInfo.id)}>
                <div className="patient-page-existing-task-title-style">
                    {taskInfo.name}
                </div>
                <div className="patient-page-existing-task-completed-style">
                    {taskInfo.end_date}
                </div>
            </div>
        );
    });

    const userTempTaskUIList = tempTasks.map((taskInfo, index) => {
        return (
            <div className="patient-page-existing-task-style"
                key={`user_task_selected_theme_list_key_${taskInfo.id}_${index}`}
                onClick={() => onClickTempTask(index)}>
                {taskInfo.task_name}
            </div>
        );
    });

    const confirmAndSendTask = () => {
        var requestData = {
            type_id: selectedTaskTypeNo,
            patient_id: userInfo.id,
        }
        switch (selectedTaskTypeNo) {
            case "1":
                if (showSequence === false) {
                    let taskDetailsItem = [];
                    let taskDetailsSequences = {};
                    for (let index = 0; index < listSequenceFalseItem.length; index++) {
                        taskDetailsItem.push(infoDetails["false_item_" + index].value);
                    }
                    let taskDetails = {
                        "items": taskDetailsItem,
                        "sequences": taskDetailsSequences
                    };
                    requestData = {
                        ...requestData,
                        task_name: infoDetails['listTaskTitle'],
                        task_dueDate: infoDetails['listDueDate'],
                        task_detail: taskDetails
                    }
                } else {
                    let taskDetailsItem = [];

                    for (let i = 0; i < listSequenceTrueItem.length; i++) {
                        taskDetailsItem.push({
                            sequence_time: infoDetails['true_item_timename_' + i],
                            instruction: infoDetails['true_item_name_' + i],
                        });
                    }
                    let taskDetailsSequences = {
                        medications_to_stop: infoDetails['listSequenceMedication'],
                        items: taskDetailsItem
                    };

                    let taskDetails = {
                        items: [],
                        sequences: taskDetailsSequences
                    };
                    requestData = {
                        ...requestData,
                        task_name: infoDetails['listTaskTitle'],
                        task_dueDate: infoDetails['listDueDate'],
                        task_detail: taskDetails
                    }
                }
                break;
            case "2":
                requestData = {
                    "type_id": "2",
                    "task_name": infoDetails["medication_name"],
                    "patient_id": userInfo.id,
                    "description": infoDetails["medication_comment"],
                    "task_detail": {
                        "strength": infoDetails['medication_strength'],
                        "quantity": infoDetails['medication_quantity'],
                        "dosage": infoDetails['medication_dosage'],
                        "refill_number": infoDetails['medication_refills'],
                        "frequency": infoDetails['medication_frequency'],
                    }
                };
                break;
            case "3":
                var params = new FormData();
                params.append('type_id', "3");
                params.append('task_name', infoDetails["treatment_title"]);
                params.append('patient_id', userInfo.id);
                params.append('frequency', infoDetails['treatment_frequency']);

                axios.post(server.serverURL + 'v1/tasks',
                    params,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.token,
                            'content-type': `multipart/form-data; boundary=${params._boundary}`
                        }
                    }
                )
                    .then(res => {
                        var data = res.data.data;
                        console.log(data);
                        setLastTaskId(data.task_id);
                        getPatientTaskList();
                        showAlert({ content: "Task has been added!" });
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        console.log(err);
                        setIsLoading(false);
                    });
                return;
            case "4":
                requestData = {
                    "type_id": "4",
                    "task_name": infoDetails["appointment_title"],
                    "task_dueDate": infoDetails["appointment_due_date"],
                    "patient_id": userInfo.id,
                    "task_detail": {
                        "phone_number": infoDetails['appointment_phone_number'],
                        "address": infoDetails['appointment_address'],
                    }
                };
                break;
            case "5":
                requestData = {
                    "type_id": "5",
                    "task_name": infoDetails["refer_doctor_title"],
                    "task_dueDate": infoDetails["refer_doctor_due_date"],
                    "patient_id": userInfo.id,
                    "task_detail": {
                        "phone_number": infoDetails['refer_doctor_phone_number'],
                        "address": infoDetails['refer_doctor_address'],
                    }
                };
                break;
        }
        setIsLoading(true);
        axios.post(server.serverURL + 'v1/tasks', requestData, { ...config })
            .then(res => {
                var data = res.data.data;
                console.log(data);
                setLastTaskId(data.task_id);
                getPatientTaskList();
                showAlert({ content: "Task has been added!" });
                setIsLoading(false);
            }).catch((err) => {
                setIsLoading(false);
            });
    }

    return (
        <LoadingOverlay
            active={isLoading}
            spinner
        >
            <div className="card-section">
                <div className="add-section-title-row">
                    <h1 className="card-title">Assigned Tasks</h1>
                </div>
                <div className="patient-page-existing-task-container-style">
                    {userTaskUIList}
                </div>

                <div className="title-section" />

                <div onClick={() => showAddSection()} className="add-button patient-page-add-task-button-style" >Add New Task</div>
                <div className="assigned-tasks-container row">
                    {userAssigedData.map((item, i) =>
                        <div key={i} className="assigned-task-card col-5">
                            <p className="assigned-task-text">{item.name}</p>
                            <p className="subscribe-text">{item.start_date}<br /></p>
                        </div>
                    )}
                </div>
                {visibleAddSection === true &&
                    <div className="add-section">
                        <div className="add-section-title-row">
                            <h1 className="add-section-title-title-text">Add New Task</h1>
                            <p className="add-section-cancel-text" onClick={() => hideAddSection()}>Cancel</p>
                        </div>
                        <p className="add-section-description">Create a new task by filling out the information below. You can chose to create an individual task or a series of tasks for the patient to complete in sequence.</p>
                        <div className="addTask_card_row">
                            <div className="task_btn-group show" style={{ float: 'left' }}>
                                <div onClick={() => { onSetShowTaskType(); }} className="col2-roundblocktask" data-toggle="dropdown" aria-expanded="true">
                                    <h4 className="round_head"><span className="task_type_btn">{taskTypeTitle}</span>
                                        <span className="round_arrow-add-task">&gt;</span>
                                    </h4>
                                </div>
                                <ul className="dropdown-menu task_ul_dropdown" id="task-type" x-placement="bottom-start" style={task_ul_dropdown}>
                                    <li className="dropdown-item type_btn" id="list_tab">List</li>
                                    <li className="dropdown-item type_btn" id="medication_tab">Prescribe Medication</li>
                                    <li className="dropdown-item type_btn" id="treatment_tab">Treatment Plan </li>
                                    <li className="dropdown-item type_btn" id="scheduling_tab">Appointment Scheduling</li>
                                    <li className="dropdown-item type_btn" id="referDoctor_tab">Refer to Doctor</li>
                                    <li className="dropdown-item type_btn" id="questionnaire_tab">Questionnaire</li>
                                </ul>
                            </div>
                            <span className="span_or">Or</span>
                            <div className="task_btn-group" style={{ float: 'right' }}>
                                <div onClick={() => { onSetShowTaskTemplate(); }} className="col2-roundblocktask " data-toggle="dropdown">
                                    <h4 className="round_head task_template_btn">
                                        Task Templates <span className="round_arrow-add-task">&gt;</span>
                                    </h4>
                                </div>
                                <ul id="task-template" className="dropdown-menu task_ul_dropdown save-as-template-list" style={task_ul_dropdown}>
                                    {/* <li className="dropdown-item type_btn">Pre-Surgery Checklist: <br></br> Bariatric Surgery</li> */}
                                    {userThemeUIList}
                                </ul>
                            </div>
                        </div>
                        {(showTaskComponent === "list" && showSequence === false) &&
                            <form className="add-input-section"
                                onSubmit={(e) => onAddToTempTask(e, TASKTYPE.list)}
                            >
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="listTaskTitle" className="add-inputs" placeholder="Task Title"
                                            value={infoDetails.listTaskTitle === undefined ? "" : infoDetails.listTaskTitle}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, listTaskTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="listDueDate"
                                            type="date" style={{ color: infoDetails.listDueDate === undefined ? "grey" : "black" }}
                                            className="add-inputs" placeholder="mm/dd/yyyy"
                                            value={infoDetails.listDueDate === undefined ? "" : infoDetails.listDueDate}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, listDueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {listSequenceFalseItem.map((item, index) => {
                                    return (
                                        <div key={index} className="input-row row">
                                            <div className="col-6">
                                                <input name={"false_item_" + index} className="add-inputs" placeholder={item.placeHolder}
                                                    value={infoDetails["false_item_" + index] === undefined ? "" : infoDetails["false_item_" + index]}
                                                    onChange={(e) => {
                                                        var details = { ...infoDetails };
                                                        details["false_item_" + index] = e.target.value;
                                                        setInfoDetails({ ...details });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-6"></div>
                                        </div>
                                    );
                                })
                                }
                                <div className="input-row row">
                                    <div className="col-10">
                                        <span
                                            onClick={() => { onAddNewListSequenceFalseItem(); }}
                                            className="task_input purplecol Medication_add_item_btn" style={{ cursor: "pointer" }}>
                                            Add Item
                                    </span>
                                    </div>
                                    <div className="col-2">
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-7">
                                        <div className="primary-button" onClick={() => { onToggleSequence() }}><p className="doctor-notes-button-text">Show in sequence</p></div>
                                    </div>
                                    <div className="col-4">
                                        <button className="primary-button" type={'submit'}><p className="doctor-notes-button-text">{lastTaskId === "" ? "Save Task" : "Update Task"}</p></button>
                                    </div>
                                </div>
                            </form>
                        }
                        {(showTaskComponent === "list" && showSequence === true) &&
                            <form className="add-input-section" onSubmit={(e) => onAddToTempTask(e, TASKTYPE.list)}>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="listTaskTitle" className="add-inputs" placeholder="Task Title"
                                            value={infoDetails.listTaskTitle === undefined ? "" : infoDetails.listTaskTitle}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, listTaskTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="listDueDate" type="date"
                                            type="date" style={{ color: infoDetails.listDueDate === undefined ? "grey" : "black" }}
                                            className="add-inputs" placeholder="Date"
                                            value={infoDetails.listDueDate === undefined ? "" : infoDetails.listDueDate}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, listDueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="listSequenceMedication" className="add-inputs" placeholder="Medications To Stop"
                                            value={infoDetails.listSequenceMedication === undefined ? "" : infoDetails.listSequenceMedication}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, listSequenceMedication: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                    </div>
                                </div>
                                {listSequenceTrueItem.map((item, i) => {
                                    return (
                                        <div key={i} className="input-row row">
                                            <div className="col-3">
                                                <input name={"true_item_timename_" + i} className="add-inputs" placeholder="Time"
                                                    value={infoDetails["true_item_timename_" + i] === undefined ? "" : infoDetails["true_item_timename_" + i]}
                                                    onChange={(e) => {
                                                        var details = { ...infoDetails };
                                                        details["true_item_timename_" + i] = e.target.value;
                                                        setInfoDetails({ ...details });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-5">
                                                <input name={"true_item_name_" + i} className="add-inputs" placeholder={item.placeHolder}
                                                    value={infoDetails["true_item_name_" + i] === undefined ? "" : infoDetails["true_item_name_" + i]}
                                                    onChange={(e) => {
                                                        var details = { ...infoDetails };
                                                        details["true_item_name_" + i] = e.target.value;
                                                        setInfoDetails({ ...details });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-4">
                                            </div>
                                        </div>
                                    );
                                })
                                }
                                <div className="input-row row">
                                    <div className="col-4">
                                        <span onClick={() => { onAddNewListSequenceTrueItem(); }} className="task_input purplecol Medication_add_item_btn" style={{ cursor: "pointer" }}>Add more</span>
                                    </div>
                                    <div className="col-8">
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-7">
                                        <div className="primary-button" onClick={() => { onToggleSequence() }}><p className="doctor-notes-button-text">Show in sequence</p></div>
                                    </div>
                                    <div className="col-4">
                                        <button className="primary-button"><p className="doctor-notes-button-text">{lastTaskId === "" ? "Save Task" : "Update Task"}</p></button>
                                    </div>
                                </div>
                            </form>
                        }

                        {showTaskComponent === "medication" &&
                            <form className="add-input-section" onSubmit={(e) => onAddToTempTask(e, TASKTYPE.prescribe_medication)}>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="medication_name" className="add-inputs" placeholder="Medication Name"
                                            value={infoDetails.medication_name === undefined ? "" : infoDetails.medication_name}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, medication_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="medication_strength" className="add-inputs" placeholder="Strength"
                                            value={infoDetails.medication_strength === undefined ? "" : infoDetails.medication_strength}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, medication_strength: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="medication_quantity" className="add-inputs" placeholder="Quantity"
                                            value={infoDetails.medication_quantity === undefined ? "" : infoDetails.medication_quantity}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, medication_quantity: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="medication_dosage" className="add-inputs" placeholder="Dosage"
                                            value={infoDetails.medication_dosage === undefined ? "" : infoDetails.medication_dosage}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, medication_dosage: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="medication_refills" className="add-inputs" placeholder="Number of Refills"
                                            value={infoDetails.medication_refills === undefined ? "" : infoDetails.medication_refills}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, medication_refills: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="medication_frequency" className="add-inputs" placeholder="Frequency"
                                            value={infoDetails.medication_frequency === undefined ? "" : infoDetails.medication_frequency}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, medication_frequency: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <textarea
                                            style={{ minHeight: "150px", padding: "20px" }} className="add-inputs" rows="4" cols="50"
                                            name="medication_comment"
                                            value={infoDetails.medication_comment === undefined ? "" : infoDetails.medication_comment}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, medication_comment: e.target.value })}

                                        />
                                    </div>
                                    <div className="col-6">
                                        <h3>Patient’s Preferred Pharmacy</h3>
                                        <hr />
                                        <div className="row col-12">
                                            <div className="check_icon"><i className="fa fa-check"></i></div>
                                            <h4>CVS Pharmacy<br /> 208 W Washington St.<br /> Chicago, IL 60606</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-7">
                                        <span className="task_input purplecol Medication_add_item_btn">Add Item</span>
                                    </div>
                                    <div className="col-4">
                                        <button className="primary-button"><p className="doctor-notes-button-text">{lastTaskId === "" ? "Save Task" : "Update Task"}</p></button>
                                    </div>
                                </div>
                            </form>
                        }
                        {showTaskComponent === "treatment" &&
                            <form className="add-input-section" onSubmit={(e) => onAddToTempTask(e, TASKTYPE.treatment_plan)}>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="treatment_title" className="add-inputs" placeholder="Task Title"
                                            value={infoDetails.treatment_title === undefined ? "" : infoDetails.treatment_title}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, treatment_title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="treatment_frequency" className="add-inputs" placeholder="Frequency"
                                            value={infoDetails.treatment_frequency === undefined ? "" : infoDetails.treatment_frequency}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, treatment_frequency: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="treatment_medias" className="add-inputs" placeholder="Links to picture, video, etc."
                                            value={infoDetails.treatment_medias === undefined ? "" : infoDetails.treatment_medias}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, treatment_medias: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <p>When adding multiple links,<br /> separate each with a comma</p>
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-7">
                                    </div>
                                    <div className="col-4">
                                        <button className="primary-button"><p className="doctor-notes-button-text">{lastTaskId === "" ? "Save Task" : "Update Task"}</p></button>
                                    </div>
                                </div>
                            </form>
                        }
                        {showTaskComponent === "scheduling" &&
                            <form className="add-input-section" onSubmit={(e) => onAddToTempTask(e, TASKTYPE.appintment_scheduling)}>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="appointment_title" className="add-inputs" placeholder="Task Title"
                                            value={infoDetails.appointment_title === undefined ? "" : infoDetails.appointment_title}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, appointment_title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="appointment_due_date" className="add-inputs" placeholder="Due Date"
                                            type="date" style={{ color: infoDetails.appointment_due_date === undefined ? "grey" : "black" }}
                                            value={infoDetails.appointment_due_date === undefined ? "" : infoDetails.appointment_due_date}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, appointment_due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="appointment_phone_number" className="add-inputs" placeholder="Phone Number"
                                            value={infoDetails.appointment_phone_number === undefined ? "" : infoDetails.appointment_phone_number}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, appointment_phone_number: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="appointment_address" className="add-inputs" placeholder="Address"
                                            value={infoDetails.appointment_address === undefined ? "" : infoDetails.appointment_address}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, appointment_address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-7">
                                    </div>
                                    <div className="col-4">
                                        <button className="primary-button"><p className="doctor-notes-button-text">{lastTaskId === "" ? "Save Task" : "Update Task"}</p></button>
                                    </div>
                                </div>
                            </form>
                        }
                        {showTaskComponent === "referDoctor" &&
                            <form className="add-input-section" onSubmit={(e) => onAddToTempTask(e, TASKTYPE.refer_to_doctor)} >
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="refer_doctor_title" className="add-inputs" placeholder="Task Title"
                                            value={infoDetails.refer_doctor_title === undefined ? "" : infoDetails.refer_doctor_title}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="refer_doctor_due_date" className="add-inputs" placeholder="Due Date" type="date"
                                            type="date" style={{ color: infoDetails.refer_doctor_due_date === undefined ? "grey" : "black" }}
                                            value={infoDetails.refer_doctor_due_date === undefined ? "" : infoDetails.refer_doctor_due_date}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="refer_doctor_phone_number" className="add-inputs" placeholder="Phone Number"
                                            value={infoDetails.refer_doctor_phone_number === undefined ? "" : infoDetails.refer_doctor_phone_number}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_phone_number: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="refer_doctor_address" className="add-inputs" placeholder="Address"
                                            value={infoDetails.refer_doctor_address === undefined ? "" : infoDetails.refer_doctor_address}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-7">
                                    </div>
                                    <div className="col-4">
                                        <button className="primary-button"><p className="doctor-notes-button-text">{lastTaskId === "" ? "Save Task" : "Update Task"}</p></button>
                                    </div>
                                </div>
                            </form>
                        }
                        {showTaskComponent === "questionnaire" &&
                            <form className="add-input-section" onSubmit={(e) => onAddToTempTask(e, TASKTYPE.refer_to_doctor)} >
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="refer_doctor_title" className="add-inputs" placeholder="Task Title"
                                            value={infoDetails.refer_doctor_title === undefined ? "" : infoDetails.refer_doctor_title}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="refer_doctor_due_date" className="add-inputs" placeholder="Due Date" type="date"
                                            type="date" style={{ color: infoDetails.refer_doctor_due_date === undefined ? "grey" : "black" }}
                                            value={infoDetails.refer_doctor_due_date === undefined ? "" : infoDetails.refer_doctor_due_date}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <input name="refer_doctor_phone_number" className="add-inputs" placeholder="Phone Number"
                                            value={infoDetails.refer_doctor_phone_number === undefined ? "" : infoDetails.refer_doctor_phone_number}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_phone_number: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input name="refer_doctor_address" className="add-inputs" placeholder="Address"
                                            value={infoDetails.refer_doctor_address === undefined ? "" : infoDetails.refer_doctor_address}
                                            onChange={(e) => setInfoDetails({ ...infoDetails, refer_doctor_address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-row row">
                                    <div className="col-7">
                                    </div>
                                    <div className="col-4">
                                        <button className="primary-button"><p className="doctor-notes-button-text">{lastTaskId === "" ? "Save Task" : "Update Task"}</p></button>
                                    </div>
                                </div>
                            </form>
                        }
                        {(showTaskComponent === "list" || showTaskComponent === "medication" || showTaskComponent === "treatment") &&
                            <form className="add-input-section" onSubmit={onSaveTemplateSubmit}>
                                <div className="input-row row">
                                    <div className="col-12">
                                        <h4 style={{ margin: "17px" }}>After you’ve saved the task, you can save the following set of tasks as a template for future use.</h4>
                                    </div>
                                    <div className="col-7">
                                        <input name="template_name" className="add-inputs" placeholder="Name of Template" />
                                    </div>
                                    <div className="col-5">
                                        <button className={lastTaskId === "" ? "primary-button patient-disabled-button" : "primary-button"}><p className={"doctor-notes-button-text"} >Save as Template</p></button>
                                    </div>
                                </div>
                            </form>
                        }
                        {showTaskComponent !== "" &&
                            <div style={{ marginTop: "20px" }}>
                                <div className="input-row row">
                                    <div className="col-6">
                                        <div className="patient-page-existing-task-container-style">
                                            {userTempTaskUIList}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <button className="primary-button"
                                            onClick={confirmAndSendTask}
                                        >
                                            <p className="doctor-notes-button-text">Confirm and Send Tasks</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }

            </div>
        </LoadingOverlay>
    )
}