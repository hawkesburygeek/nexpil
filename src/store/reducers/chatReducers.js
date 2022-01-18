
// Set patient for chat reducer
export const setPatientChat = (state = {}, action) => {
    switch (action.type) {
        case "SET_PATIENT_FOR_CHAT":
            return action.payload;
        case "SET_PATIENT_FOR_CHAT_CHANGED":
            return action.payload;
        default:
            return state;
    }
}