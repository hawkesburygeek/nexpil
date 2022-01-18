import React, { useEffect, useState } from 'react'
import MyCheckBox from '../../my_check_box/my_check_box';
import { showConfirm } from '../../my_confirm_dlg/showConfirmDlg';
import '../style.css'
import TaskTemplateDropdownWidget from './commonComponents/taskTemplateDropdownWidget/taskTemplateDropdownWidget';
import TaskTypeDropdownWidget from './commonComponents/taskTypeDropdownWidget/taskTypeDropdownWidget';
import AppointmentTaskWidget from './detailTasks/appointmentTaskWidget';
import ListTaskWidget from './detailTasks/listTaskWidget';
import MedicationTaskWidget from './detailTasks/medicationTaskWidget';
import Questionnaire from './detailTasks/questionnaire';
import ReferTaskWidget from './detailTasks/referTaskWidget';
import TreatmentTaskWidget from './detailTasks/treatmentTaskWidget';
import { TASKTYPE } from './enum_task';
import _ from 'lodash';
import axios from '../../../api/axios';
import { useDispatch, useSelector } from 'react-redux';

function TaskSectionBody(props) {
    const dispatch = useDispatch();
    const { setVisibleBody, taskTemplateList, onSubmitTaskGroup, setIsLoading, isFromChat, isFromNote, pharmacyList } = props;
    const selectedGroup = useSelector(state => state.selectedTaskGroup);
    const updateSelectedGroup = payload => dispatch({ type: "SELECT_PATIENT_TASK_GROUP", payload: payload });

    const isNew = selectedGroup ? false : true

    console.log("TaskSectionBody isNew Value: ", isNew);
    const [selTaskType, setSelTaskType] = useState(TASKTYPE.none);
    const [selTaskTemplate, setSelTaskTemplate] = useState("");
    const [groupName, setGroupName] = useState("");
    const [isTemplate, setIsTemplate] = useState(false);

    const [tempTaskList, setTempTaskList] = useState([]);
    const [selTempTask, setSelTempTask] = useState(null);
    const [selTempTaskIndex, setSelTempTaskIndex] = useState(-1);

    console.log("isTemplate ===> ", isTemplate)
    useEffect(() => {
        setSelTaskTemplate("");
    }, [taskTemplateList]);

    useEffect(() => {
        if (!_.isEmpty(selTaskTemplate)) {
            console.log("selected template ===> ", selTaskTemplate);
            setGroupName("");
            setIsTemplate(false);
            setTempTaskList([]);
            setSelTempTask(null);
            setSelTempTaskIndex(-1);
            updateSelectedGroup(null);

            getTaskListBasedOnTemplateID(selTaskTemplate.id);
        }
    }, [selTaskTemplate]);// eslint-disable-line react-hooks/exhaustive-deps

    const onDeleteTask = async (index, taskInfo) => {
        if (await showConfirm({
            content: 'Are you sure to delete this task?'
        })) {
            // console.log(`${index} has been deleted`);
            // console.log(taskInfo);
            let filteredList;
            if (taskInfo.id === undefined) {
                filteredList = tempTaskList.filter((x, index) => x !== index);
                var task = tempTaskList[index];
                filteredList = tempTaskList.filter(x => x !== task);
            } else {
                filteredList = tempTaskList.filter((x) => x.id !== taskInfo.id);

                axios.delete("v1/tasks/" + taskInfo.id).then((res) => {
                    console.log(res)
                }).catch((e) => { console.log(e) });
            }

            // console.log(filteredList);
            setTempTaskList([...filteredList]);
        } else {

        }
    }


    const getTaskListBasedOnTemplateID = (templateId) => {
        if (templateId === "") {
            return "";
        }

        setIsLoading(true);
        axios.get('v1/tasks/' + templateId)
            .then((res) => {
                setIsLoading(false);
                const task = res.data.data;
                console.log("task ===> ", task);
                // var taskList = task.results;
                // var tempList = [];
                // for (var i = 0; i < taskList.length; i++) {
                //     var task = taskList[i];
                //     tempList = [...tempList, {
                //         task_detail: { ...task.details },
                //         task_name: task.name,
                //         task_dueDate: task.end_date,
                //         type_id: task.type_id
                //     }];

                // }
                // console.log("tempList = ", tempList);
                // setTempTaskList([...tempList]);
                console.log("task === ", task);
                setTempTaskList([{
                    task_detail: task.details,
                    task_name: task.name,
                    task_dueDate: task.end_date,
                    type_id: task.type_id
                }]);
            })
            .catch((error) => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        console.log("selectedGroup ===> ", selectedGroup);
        setSelTaskType(TASKTYPE.none);
        setSelTaskTemplate("");
        if (selectedGroup) {
            console.log("Is old : ", selectedGroup)
            onSetTempTaskListFromServer([...selectedGroup.results])
            setGroupName(selectedGroup.group_name);
            setIsTemplate(parseInt(selectedGroup.is_template) === 1);
        } else {
            // console.log("Is new")
            setGroupName("");
            setIsTemplate(false);
            setTempTaskList([]);
            setSelTempTask(null);
            setSelTempTaskIndex(-1);
        }
    }, [selectedGroup]);

    // console.log(taskTemplateList);

    const onSetTempTaskListFromServer = (taskList) => {
        var tempList = [];
        for (var i = 0; i < taskList.length; i++) {
            var task = taskList[i];
            tempList = [...tempList, {
                ...task,
                task_detail: { ...task.details },
                task_name: task.name,
                task_dueDate: task.end_date
            }];

        }
        setTempTaskList([...tempList]);
    }

    const onSubmitTask = (taskInfo, taskNo) => {
        console.log("taskInfo --- ", taskInfo);
        console.log("taskNo --- ", taskNo);
        if (taskNo === -1) {
            setTempTaskList([...tempTaskList, { ...taskInfo }]);
        } else {
            updateTempTaskList(taskInfo, taskNo);
        }
        setSelTempTask(null);
        setSelTempTaskIndex(-1);
    }

    const updateTempTaskList = (taskInfo, taskNo) => {
        var tempList = tempTaskList;
        tempList[taskNo] = { ...taskInfo };
        console.log(" updated tempList === ", tempList)
        setTempTaskList([...tempList]);
    }
    console.log(" tempTaskList === ", tempTaskList)

    const onClickTempTask = (index) => {
        console.log(" onClickTempTask index ==> ", tempTaskList)
        console.log(" onClickTempTask index ==> ", tempTaskList[index])
        setSelTempTask(tempTaskList[index]);
        setSelTempTaskIndex(index);
        setSelTaskType(tempTaskList[index].type_id);
    }
    const onClickTaskDropdownList = (taskType) => {
        setSelTaskType(taskType);
        setSelTempTask(null);
        setSelTempTaskIndex(-1);
    }
    const onClickCancel = () => {
        dispatch({ type: "SELECT_PATIENT_TASK_GROUP", payload: null });
        setVisibleBody(false);
    }
    const userTempTaskUIList = tempTaskList.map((taskInfo, index) => {
        return (
            <div key={index} className="patient-page-existing-task-style">
                <span onClick={() => onClickTempTask(index)}>
                    {taskInfo.task_name}
                </span>
                <span className="patient-page-delete-group-button"
                    onClick={() => onDeleteTask(index, taskInfo)}>
                    &times;
                </span>
            </div>
        );
    });

    const sameTaskUIList = tempTaskList.map((taskInfo, index) => {
        if (parseInt(taskInfo.type_id) !== parseInt(selTaskType)) {
            return <div key={index} style={{ display: "none" }}></div>
        }
        return (
            <div key={index} className="patient-page-existing-task-style">
                <span onClick={() => onClickTempTask(index)}>
                    {taskInfo.task_name}
                </span>
                <span className="patient-page-delete-group-button" onClick={() => onDeleteTask(index, taskInfo)}>
                    &times;
                </span>
            </div>
        );
    });

    console.log("typeof selTaskType === ", typeof selTaskType)
    console.log("selTaskType === ", selTaskType)
    console.log("selTempTask === ", selTempTask)
    console.log("selTempTaskIndex === ", selTempTaskIndex)
    
    return (
        <div className="add-section" style={{ background: isFromNote ? "white" : "transparent", padding: isFromNote ? 20 : 0, paddingTop: 50, borderRadius: isFromNote ? 20 : 0 }}>
            <div className="add-section-title-row">
                <h1 className="add-section-title-title-text">{isNew ? "Add New Task" : "Update the Task"}</h1>
                <p className="add-section-cancel-text" onClick={onClickCancel}>Cancel</p>
            </div>
            <p className="add-section-description">Create a new task by filling out the information below. You can chose to create an individual task or a series of tasks for the patient to complete in sequence.</p>
            {
                isFromChat
                    ? <div div style={{ width: "100%" }}>
                        <div style={{ width: "100%" }}>
                            <TaskTypeDropdownWidget
                                selTaskType={selTaskType}
                                setSelTaskType={onClickTaskDropdownList}
                                sameTaskUIList={sameTaskUIList}
                                selTaskTemplate={selTaskTemplate}
                                isFromChat={isFromChat}
                            />
                        </div>
                        <div style={{ width: "100%" }}>
                            <TaskTemplateDropdownWidget
                                selTaskTemplate={selTaskTemplate}
                                setSelTaskTemplate={setSelTaskTemplate}
                                taskTemplateList={taskTemplateList}
                                tempTaskList={tempTaskList}
                                sameTaskUIList={sameTaskUIList}
                                isFromChat={isFromChat}
                            />
                        </div>
                    </div>
                    : <div className="addTask_card_row">
                        <TaskTypeDropdownWidget
                            selTaskType={selTaskType}
                            setSelTaskType={onClickTaskDropdownList}
                            sameTaskUIList={sameTaskUIList}
                            selTaskTemplate={selTaskTemplate}
                        />
                        <span className="span_or">Or</span>
                        <TaskTemplateDropdownWidget
                            selTaskTemplate={selTaskTemplate}
                            setSelTaskTemplate={setSelTaskTemplate}
                            taskTemplateList={taskTemplateList}
                            tempTaskList={tempTaskList}
                            sameTaskUIList={sameTaskUIList}
                        />
                    </div>
            }

            <div className="add_task_detail_container">
                {parseInt(selTaskType) === TASKTYPE.list &&
                    <ListTaskWidget
                        isNew={!selTempTask || selTempTaskIndex === -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        isFromChat={isFromChat}
                    />}
                {parseInt(selTaskType) === TASKTYPE.prescribe_medication &&
                    <MedicationTaskWidget
                        isNew={!selTempTask || selTempTaskIndex === -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                        pharmacyList={pharmacyList}
                    />}
                {parseInt(selTaskType) === TASKTYPE.treatment_plan &&
                    <TreatmentTaskWidget
                        isNew={!selTempTask || selTempTaskIndex === -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />}
                {parseInt(selTaskType) === TASKTYPE.appintment_scheduling &&
                    <AppointmentTaskWidget
                        isNew={!selTempTask || selTempTaskIndex === -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />}
                {parseInt(selTaskType) === TASKTYPE.refer_to_doctor &&
                    <ReferTaskWidget
                        isNew={!selTempTask || selTempTaskIndex === -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />}
                {parseInt(selTaskType) === TASKTYPE.questionnaire &&
                    <Questionnaire
                        isNew={!selTempTask || selTempTaskIndex === -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />
                }
            </div>

            <div className="add-input-section" style={{ marginTop: isFromChat ? 5 : 30 }}>
                <div className="input-row row">
                    <div className="col-12">
                        <input className="add-inputs task-group-name-input" placeholder="Name of Task Set"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            disabled={isNew ? "" : "disabled"}
                        />
                    </div>
                    <div className="col-12 patient-page-existing-task-container-style" style={{ marginTop: isFromChat ? 5 : 20 }}>
                        {userTempTaskUIList}
                    </div>
                </div>
            </div>

            <div>
                <div style={{ marginTop: isFromChat ? 5 : 20 }}>
                    <div className="input-row row">
                        <div className={isFromChat ? "col-12" : "col-6"}>
                            <MyCheckBox
                                isChecked={isTemplate}
                                setIsChecked={setIsTemplate}
                                isFromChat={isFromChat}
                            />
                        </div>
                        <div className={isFromChat ? "col-12" : "col-6"}>
                            <button className={tempTaskList.length === 0 ? "primary-button patient-disabled-button" : "primary-button"}
                                onClick={() => onSubmitTaskGroup(groupName, tempTaskList, isTemplate)}>
                                <p className="doctor-notes-button-text">
                                    {isNew ? "Confirm and Send Tasks" : "Confirm and Update Tasks"}
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskSectionBody
