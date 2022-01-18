import React, { useEffect, useState } from 'react';
import '../style.css';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirm } from "../../my_confirm_dlg/showConfirmDlg";
import { showAlert } from "../../my_alert_dlg/showAlertDlg";
import LoadingOverlay from 'react-loading-overlay';
// import { TASKADDINGSTATUS, TASKTYPE } from './enum_task';
import TaskSectionHeader from './taskSectionHeader';
import TaskSectionBody from './taskSectionBody';
import TaskSectionTail from './taskSectionTail';
import { getPharmacyList_FromCorePhp } from '../../../api/axiosAPIs';
import { GET_PATIENT_TASK_DATA } from '../../../store/actionNames';
import axios from '../../../api/axios';

function AssignedTask(props) {
    const { isFromNote, isAboveItem, isFromChat, homeUserName } = props;
    const userInfo = useSelector(state => state.patientSelect)
    const { setCreatedGroupId } = props;
    const dispatch = useDispatch();
    const userTaskGroupList = useSelector(state => state.userTaskGroupList);
    const setUserTaskGroupList = (payload) => dispatch({ type: "SET_PATIENT_TASK_DATA", payload });
    const [taskTemplateList, setTaskTemplateList] = useState([]);
    const [pharmacyList, setPharmacyList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const selectedGroup = useSelector(state => state.selectedTaskGroup);
    const updateSelectedGroup = payload => dispatch({ type: "SELECT_PATIENT_TASK_GROUP", payload: payload })
    const [visibleBody, setVisibleBody] = useState(false);
    // eslint-disable-next-line
    useEffect(() => {
        // console.log(userInfo);
        if (userInfo && userInfo.id) {
            getTaskTemplateList();
            getPharmacyList();
            getPatientTaskGroupList();
        }
    }, [userInfo]);// eslint-disable-line react-hooks/exhaustive-deps

    const getPharmacyList = () => {
        // getPharmacyList_FromCorePhp
        getPharmacyList_FromCorePhp(userInfo.id, res => {
            console.log("get pharmacy list api res : ", res);
            setPharmacyList([...res]);
        })
    }
    const getTaskTemplateList = () => {
        axios.get(`v1/tasks?is_template=1`)
            .then((res) => {
                var templateList = res.data.data.results.map((info) => {
                    return {
                        title: info.template_name,
                        id: info.id
                    }
                });
                // console.log(templateList);
                setTaskTemplateList([...templateList]);
            })
            .catch((err) => {
                setTaskTemplateList([]);
            })
    }
    const getPatientTaskGroupList = () => {
        // console.log("userInfo.id", userInfo.id);
        axios.get('v1/task-group?patient_id=' + userInfo.id)
            .then((res) => {
                console.log(res.data);
                setUserTaskGroupList([...res.data.data.results]);
            })
            .catch((error) => {
                setUserTaskGroupList([]);
            });
    }
    // const getPatientTaskList = () => {
    //     // console.log("userInfo.id", userInfo.id);
    //     axios.get('v1/tasks?patient_id=' + userInfo.id)
    //         .then((res) => {
    //             console.log(res.data);
    //             setUserTaskList([...res.data.data.results]);
    //         })
    //         .catch((error) => {
    //             setUserTaskList([]);
    //         });
    // }

    const onSubmitTaskGroup = async (groupName, taskList, isTemplate) => {
        console.log("group name :", groupName)
        console.log("taskList :", taskList);
        console.log("isTemplate :", isTemplate);
        // console.log('isTemplate', isTemplate);
        if (taskList.length === 0) {
            await showAlert({ content: "You need to add at least one task." });
            return;
        }
        if (!groupName) {
            await showAlert({ content: "Please type the name of task set" });
            return;
        }

        if (!selectedGroup) {
            console.log("adding new group")
            addNewGroup(groupName, taskList, isTemplate);
        } else {
            console.log("updating old group")
            updateGroup(groupName, taskList, isTemplate);
        }
        console.log(groupName + "----------");

    }
    const addNewGroup = async (groupName, taskList, isTemplate) => {
        console.log(userInfo);
        setIsLoading(true);
        const patient_id = userInfo.id;

        const groupParam = {
            group_name: groupName,
            patient_id: patient_id,
            is_template: isTemplate ? 1 : 0,
            template_name: groupName
        }
        axios.post('v1/task-group', groupParam)
            .then(async (res) => {

                // console.log(res);
                var response = res.data.data;
                if (response.status !== true) {
                    showAlert({ content: "Something went wrong" });
                }
                const group_id = response.task_group_id;

                for (var i = 0; i < taskList.length; i++) {
                    const taskParam = {
                        ...taskList[i],
                        patient_id: patient_id,
                        task_group_id: group_id
                    }
                    try {
                        axios.post('v1/tasks', taskParam);
                    } catch (e) {

                        console.log("error", e);
                        console.log(taskParam);
                    }
                }
                showAlert({ content: "Successfully added." });
                setIsLoading(false);

                setCreatedGroupId(group_id);

                var notifyParam = {
                    patient_id: patient_id,
                    title: "New TASK !",
                    body: `Dr.${homeUserName === undefined ? "The current Doctor" : homeUserName} has just sent the new task - ${groupName}`,
                    notification_id: 3,
                    group_id: group_id
                }
                // console.log(homeUserName);
                // console.log("notifyParam", notifyParam);
                axios.post('v1/push-notify', notifyParam).then((v) => {
                    console.log(v)
                }).catch((err) => {
                    console.log("err", err.message);
                });
                //  getPatientTaskGroupList();
                dispatch({ type: GET_PATIENT_TASK_DATA, payload: userInfo.id });

                updateSelectedGroup(null);
                setVisibleBody(false);
                getTaskTemplateList();
            })
            .catch((err) => {
                showAlert({ content: "Something went wrong" });
                setIsLoading(false);
                updateSelectedGroup(null);
            });
        // updateSelectedGroup("");
    }
    const updateGroup = async (groupName, taskList, isTemplate) => {
        const group_id = selectedGroup.id;
        const patient_id = userInfo.id;
        const taskGroupParam = {
            group_name: groupName,
            patient_id: patient_id,
            is_template: isTemplate ? 1 : 0,
            template_name: groupName
        };
        axios.put('v1/task-group/' + group_id, taskGroupParam).then(async ({ data }) => {
            console.log(" Update task group response : ", data);
            for (var i = 0; i < taskList.length; i++) {
                var task = taskList[i];
                console.log(" tttttttttttttttttask :: ", task)
                const taskParam = {
                    ...task,
                    patient_id: patient_id,
                    task_group_id: group_id,
                    is_template: isTemplate ? 1 : 0,
                }
                console.log(taskParam)
                if (task.id) {  // if already exist, update
                    axios.put('v1/tasks/' + task.id, taskParam).then((res) => {
                        console.log('Task updated !!!', res)
                    });
                } else {   // if new, create
                    axios.post('v1/tasks', taskParam).then(res => {
                        console.log('New Task added !!!', res)
                    });
                }
            }
            await showAlert({ content: "Successfully update the set of group !" });
            updateSelectedGroup(null);
            setVisibleBody(false);
        }).catch(err => {
            console.log(" Update task group error", err)
        });
    }
    const onDeleteGroup = async (groupId) => {
        if (await showConfirm({
            content: 'Are you sure to delete this group?'
        })) {
            // console.log(`${groupId} has been deleted`);
            // var _userTaskGroupList = userTaskGroupList.filter(x => x.id !== groupId);
            // setUserTaskGroupList([..._userTaskGroupList]);
            setIsLoading(true);
            axios.delete('v1/task-group/' + groupId)
                .then((res) => {
                    // console.log(res);
                    dispatch({ type: GET_PATIENT_TASK_DATA, payload: userInfo.id });
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        } else {

        }
    }
    const onSelectGroup = async (groupId) => {
        if (groupId === "") {
            updateSelectedGroup(null);
            return "";
        }
        console.log("groupId ===> ", groupId)
        setIsLoading(true);
        axios.get('v1/task-group/' + groupId)
            .then((res) => {
                console.log('taskgroup data response ==>', res);
                setIsLoading(false);
                var groupInfo = res.data.data;
                updateSelectedGroup({ ...groupInfo });
            })
            .catch((error) => {
                setIsLoading(false);
            })
    }
    return (
        <LoadingOverlay active={isLoading} spinner>
            <div className={isFromChat === true || isFromNote === true ? "" : "card-section"}>
                {(isFromNote !== true && isFromChat !== true) &&
                    <div className="add-section-title-row">
                        <h1 className="card-title">Assigned Tasks</h1>
                    </div>
                }
                <div className="row">
                    <div className="col-12">
                        <TaskSectionHeader
                            selectedGroup={selectedGroup}
                            onSelectGroup={onSelectGroup}
                            setVisibleBody={setVisibleBody}
                            onDeleteGroup={onDeleteGroup}
                            isFromChat={isFromChat}
                            userInfo={userInfo}
                            isFromNote={isFromNote}
                            isAboveItem={isAboveItem}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {visibleBody && <TaskSectionBody
                            setVisibleBody={setVisibleBody}
                            taskTemplateList={taskTemplateList}
                            onSubmitTaskGroup={onSubmitTaskGroup}
                            setIsLoading={setIsLoading}
                            isFromChat={isFromChat}
                            pharmacyList={pharmacyList}
                            userInfo={userInfo}
                            isFromNote={isFromNote}
                            isAboveItem={isAboveItem}
                        />}
                        <TaskSectionTail userInfo={userInfo} />
                    </div>
                </div>
            </div>
        </LoadingOverlay>
    )
}

export default AssignedTask
