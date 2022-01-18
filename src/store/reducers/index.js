import { combineReducers } from 'redux';
import {
    mainPart,
    userInfo, 
    patientsList, 
    patientSelect, 
    patientPersonalInfo,
    medication,
    addNewPatientStatus,
    userRole,
    patientHealthData,
    assignedData,
    chatUserSelect,
    userTaskGroupList,
    selectedTaskGroup,
    patientPersonalAllergy
} from './usersReducers';
import {
    setPatientChat,
} from './chatReducers';

// Export combined reducers
export default combineReducers({
    mainPart,
    userInfo,
    patientsList,
    patientSelect,
    patientPersonalInfo,
    setPatientChat,
    medication,
    addNewPatientStatus,
    userRole,
    patientHealthData,
    assignedData,
    chatUserSelect,
    userTaskGroupList,
    selectedTaskGroup,
    patientPersonalAllergy
})
