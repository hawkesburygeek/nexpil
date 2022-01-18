import Axios from 'axios';
import { server } from '../config/server';


// const qs = require('querystring')
const base_URL = server.serverURL;

// let base_URL = process.env.NODE_ENV === "development" ? `http://localhost:5000/api` : `https://app.quotehard.com/api`;
console.log("______ process.env.NODE_ENV ____", process.env.NODE_ENV)

let axios = Axios.create({
   baseURL: `${base_URL}`,
   headers: {
      'Content-Type': 'application/json',
   }
});

const token = localStorage.getItem('token');
console.log("__ token __", token);

if (token) axios.defaults.headers.common['Authorization'] = "Bearer " + token;
else axios.defaults.headers.common['Authorization'] = "";

export default axios;