import { call, put, takeEvery } from 'redux-saga/effects';
import * as initialActions from '../store/actionNames/homePageActions';
import * as API from '../api';

/* These are saga functions for patient page. */


function* getSelectedUser(action) {
    try {
        yield put({ type: "GET_SELECTED_USER", payload: action.payload });
    } catch (e) {
        yield put({ type: "GET_SELECTED_USER_FAILED", message: e.message });
    }
}

function* getSelectedChatUser(action) {
    try {
        yield put({ type: "GET_SELECTED_CHAT_USER", payload: action.payload });
    } catch (e) {
        yield put({ type: "GET_SELECTED_CHAT_USER_FAILED", message: e.message });
    }
}

/* ----------- Call and dispatch functions ------------- */

// Get full patients list
function* getPatientsList() {
    try {
        const patients = yield call(API.resultGet, "v1/patients");
        yield put({ type: "PATIENTS_LIST", payload: patients.data.data.results })
    } catch (e) {
        yield put({ type: "GET_PATIENTS_LIST_FAILED", message: e.message });
    }
}

// Get selected patient from patient list
function* setPatientSelected(action) {
    try {
        yield put({ type: 'SET_SELECTED_PATIENT', payload: action.payload });
    } catch (e) {
        yield put({ type: 'SET_PATIENT_SELECT_FAILED' });
    }
}

// Get selected patient informations
function* getPatientPersonalInfo(action) {
    try {
        const patientPersonalInfo = yield call(API.getPatientPersonalInfoAPI, action.payload);
        yield put({ type: "GET_PATIENT_PERSONAL_INFOS", payload: patientPersonalInfo.data.data });
    } catch (e) {
        yield put({ type: "GET_PATIENT_PERSONAL_INFO_FAILED" });
    }
}
function* getPatientPersonalAllergy(action) {
    try {
        const patientPersonalAllergy = yield call(API.getPatientPersonalAllergyAPI, action.payload);
        yield put({ type: "GET_PATIENT_PERSONAL_ALLERGY", payload: patientPersonalAllergy.data.data });
    } catch (e) {
        yield put({ type: "GET_PATIENT_PERSONAL_ALLERGY_FAILED" });
    }
}

// Set patient to have chat with
function* setPatientChatTarget(action) {
    try {
        const patientSet = yield call(API.getPatientPersonalInfoAPI, action.payload.id);
        yield put({ type: "SET_PATIENT_FOR_CHAT", payload: patientSet.data.data })
    } catch (e) {
        yield put({ type: "SET_PATIENT_FOR_CHAT_FAILED" });
    }
}

// Change patient to have chat with
function* setPatientChatTargetChange(action) {
    try {
        const patientSets = yield call(API.getPatientPersonalInfoAPI, action.payload.id);
        yield put({ type: "SET_PATIENT_FOR_CHAT_CHANGED", payload: patientSets.data.data });
    } catch (e) {
        yield put({ type: "SET_PATIENT_FOR_CHAT_CHANGED_FAILED" });
    }
}


function* getAssignedData(action) {
    if (action["payload"] === "") {
        yield put({ type: "SET_ASSIGNED_DATA", payload: [] });
    } else {
        try {
            const patientSets = yield call(API.getAssignedDataAPI, action.payload);
            yield put({ type: "SET_ASSIGNED_DATA", payload: patientSets.data.data.results });
        } catch (e) {
            yield put({ type: "SET_ASSIGNED_DATA", payload: [] });
        }
    }
}
function* getPatientTaskData(action) {
    if (action["payload"] === "") {
        yield put({ type: "SET_PATIENT_TASK_DATA", payload: [] });
    } else {
        // console.log("TESt", action)
        try {
            const taskSets = yield call(API.getPatientTaskDataAPI, action.payload);
            // console.log(taskSets.data.data.results)
            yield put({ type: "SET_PATIENT_TASK_DATA", payload: taskSets.data.data.results })
        } catch (e) {
            yield put({ type: "SET_PATIENT_TASK_DATA", payload: [] });
        }
    }
}

function* getPatientHealthData(action) {
    try {
        const patientSets = yield call(API.getPatientHealthDataAPI, action.payload);
        console.log(" patient health data response ===> ", patientSets.data.data)
        yield put({ type: "SET_PATIENT_HEALTH_DATA", payload: patientSets.data.data && patientSets.data.data.length ? patientSets.data.data.results : null });
    } catch (e) {
        yield put({ type: "SET_PATIENT_HEALTH_DATA_FAILED" });
    }
}

function* getPatientMedicationData(action) {
    if (action["payload"] === "") {
        yield put({ type: "GET_PATIENT_MEDICATION_DATAS", payload: [] });
    } else {
        try {
            const patientSets = yield call(API.getPatientMedicationDataAPI, action.payload,action.appointId);
            yield put({ type: "GET_PATIENT_MEDICATION_DATAS", payload: patientSets.data.data.results });
        } catch (e) {
            yield put({ type: "GET_PATIENT_MEDICATION_DATAS", payload: [] });
        }
    }
}

function* onAddNewPatient(action) {
    yield put({ type: "ADD_NEW_PATIENT_ACTION", payload: action.payload });
}

function* onUserRoleSet(action) {
    yield put({ type: "USER_ROLE_SETED", payload: action.payload });
}

// Export saga functions
export default function* mySaga() {
    yield takeEvery(initialActions.GET_USER, getSelectedUser);
    yield takeEvery(initialActions.GET_USER_CHAT, getSelectedChatUser);
    yield takeEvery(initialActions.SET_PATIENT_SELECTED, setPatientSelected);
    yield takeEvery(initialActions.GET_PATIENTS_LIST, getPatientsList);
    yield takeEvery(initialActions.GET_PATIENT_PERSONAL_DATA, getPatientPersonalInfo);
    yield takeEvery(initialActions.GET_CHAT_PATIENT_TARGET, setPatientChatTarget);
    yield takeEvery(initialActions.SET_GET_CHAT_PATIENT_TARGET, setPatientChatTargetChange);
    yield takeEvery(initialActions.GET_PATIENT_MEDICATION_DATA, getPatientMedicationData);
    yield takeEvery(initialActions.ADD_NEW_PATIENT, onAddNewPatient);
    yield takeEvery(initialActions.USER_ROLE_SET, onUserRoleSet);
    yield takeEvery(initialActions.GET_PATIENT_HEALTH_DATA, getPatientHealthData);
    yield takeEvery(initialActions.GET_ASSIGNED_DATA, getAssignedData);
    yield takeEvery(initialActions.GET_PATIENT_TASK_DATA, getPatientTaskData)
    yield takeEvery(initialActions.GET_PATIENT_PERSONAL_ALLERGY, getPatientPersonalAllergy)
}
