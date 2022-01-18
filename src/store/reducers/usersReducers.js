// import { act } from 'react-dom/test-utils';

// import { users } from '../../service/users';

export const mainPart = (state = "intro", action) => {
    switch (action.type) {
        case "SET_MAIN_SECTION":
            return action.payload ? action.payload : "intro";
        default:
            return state;
    }
}

export const userInfo = (state = {}, action) => {
    switch (action.type) {
        case "USER_INFO_SET":
            return action.payload;
        default:
            return state;
    }
}

export const chatUserSelect = (state = {}, action) => {
    switch (action.type) {
        case "GET_SELECTED_CHAT_USER":
            return action.payload;
        default:
            return state;
    }
}

// Export reducer for getting patients list
export const patientsList = (state = [], action) => {
    switch (action.type) {
        case "PATIENTS_LIST":
            return action.payload;
        case "ADD_TO_PATIENTS_LIST":
            return [action.payload, ...state]
        default:
            return state;
    }
}

export const patientHealthData = (state = [], action) => {
    switch (action.type) {
        case "SET_PATIENT_HEALTH_DATA":
            return action.payload;
        default:
            return state;
    }
}

export const assignedData = (state = [], action) => {
    switch (action.type) {
        case "SET_ASSIGNED_DATA":
            return action.payload;
        default:
            return state;
    }
}

export const userTaskGroupList = (state = [], action) => {
    switch (action.type) {
        case "SET_PATIENT_TASK_DATA":
            return action.payload;
        default:
            return state;
    }
}

export const selectedTaskGroup = (state = null, action) => {
    switch (action.type) {
        case "SELECT_PATIENT_TASK_GROUP":
            return action.payload;
        default:
            return state;
    }
}
// Export reducer for getting selected patient
export const patientSelect = (state = null, action) => {
    switch (action.type) {
        case "SET_SELECTED_PATIENT":
            return action.payload;
        default:
            return state;
    }
}

// Export reducer for getting patient information
export const patientPersonalInfo = (state = {}, action) => {
    switch (action.type) {
        case "GET_PATIENT_PERSONAL_INFOS":
            return action.payload;
        default:
            return state;
    }
}

export const patientPersonalAllergy = (state = {}, action) => {
    switch (action.type) {
        case "GET_PATIENT_PERSONAL_ALLERGY":
            return action.payload;
        default:
            return state;
    }
}

export const medication = (state = [], action) => {
    switch (action.type) {
        case "GET_PATIENT_MEDICATION_DATAS":
            return action.payload;
        default:
            return state;
    }
}

export const addNewPatientStatus = (state = false, action) => {
    switch (action.type) {
        case "ADD_NEW_PATIENT_ACTION":
            return action.payload;
        default:
            return state;
    }
}

export const userRole = (state = "user", action) => {
    switch (action.type) {
        case "USER_ROLE_SETED":
            return action.payload;
        default:
            return state;
    }
}
