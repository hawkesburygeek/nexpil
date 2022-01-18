import axios from './axios';
import { server } from '../config/server';

// ==================> APIs <===================//

const qs = require('querystring')
// const URL = server.serverURL;

export const config = {
   headers: {
      'Authorization': 'Bearer ' + localStorage.token
   }
}

// Get patients list API
export function result(endPointURL) {
   return axios.post(endPointURL)
}

export function resultPost(endPointURL) {
   return axios.post(endPointURL)
}

export function resultGet(endPointURL) {
   return axios.get(endPointURL, {
      headers: {
         'Authorization': 'Bearer ' + localStorage.token
      }
   })
}

// Get patients informations API
export function getPatientPersonalInfoAPI(patientID) {
   return axios.get('v1/patients/' + patientID, {
      headers: {
         'Authorization': 'Bearer ' + localStorage.token
      }
   });
}

export function getPatientPersonalAllergyAPI(patientID) {
   return axios.get('v1/allergy/' + patientID, {
      headers: {
         'Authorization': 'Bearer ' + localStorage.token
      }
   });
}

export function getPatientMedicationDataAPI(patientID,appointId = null) {
   if(appointId === null || appointId == undefined || appointId === ""){
      return axios.get('v1/patient-medication/' + patientID, {
         headers: {
            'Authorization': 'Bearer ' + localStorage.token
         }
      });
   }
   else {
      return axios.get('v1/patient-medication/' + patientID +"/" + appointId, {
         headers: {
            'Authorization': 'Bearer ' + localStorage.token
         }
      });
   }
   
}

export function getPatientHealthDataAPI(patientID) {
   return axios.get('v1/patient-health-data/' + patientID, {
      headers: {
         'Authorization': 'Bearer ' + localStorage.token
      }
   });
}


export function getAssignedDataAPI(patientID) {
   return axios.get('v1/tasks?patient_id=' + patientID, {
      headers: {
         'Authorization': 'Bearer ' + localStorage.token
      }
   });
}
export function getPatientTaskDataAPI(patientID) {

   return axios.get('v1/task-group?patient_id=' + patientID, {
      headers: {
         'Authorization': 'Bearer ' + localStorage.token
      }
   });
}

const config_urlEncoded = {
   headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + localStorage.token
   }
}
export function getHealthGlucoseData_FromCorePhp(patientID, startDate, endDate, callback) {
   const url = server.domainURL + "/nexpil/health_bloodglucose.php";
   const param = {
      choice: 3,
      userid: patientID,
      startdate: startDate,
      enddate: endDate
   }
   // console.log("start to fetch health data")
   axios.post(url, qs.stringify(param), { ...config_urlEncoded })
      .then((result) => {
         // console.log("health data fetched", result);
         if (callback !== undefined) {
            callback(result.data);
         }
      })
      .catch((err) => {
         console.log("Error", err);
         if (callback !== undefined)
            callback("Error")
      });
}
export function getOtherHealthData_FromCorePhp(patientID, startDate, endDate, callback) {
   const url = server.domainURL + "/nexpil/health_data.php";
   const param = {
      user_id: patientID,
      startdate: startDate,
      enddate: endDate
   }
   // console.log("start to fetch health data")
   axios.post(url, qs.stringify(param), { ...config_urlEncoded })
      .then((result) => {
         // console.log("health data fetched", result);
         if (callback !== undefined) {
            callback(result.data);
         }
      })
      .catch((err) => {
         console.log("Error", err);
         if (callback !== undefined)
            callback("Error")
      })
}

export function getPharmacyList_FromCorePhp(patientID, callback) {
   const url = server.domainURL + "/nexpil/patient_pharmacy.php";
   const param = {
      user_id: patientID
   }
   // console.log("start to fetch health data")
   axios.post(url, qs.stringify(param), { ...config_urlEncoded })
      .then((result) => {
         // console.log("health data fetched", result);
         if (callback !== undefined) {
            callback(result.data);
         }
      })
      .catch((err) => {
         console.log("Error", err);
         if (callback !== undefined)
            callback("Error")
      })
}