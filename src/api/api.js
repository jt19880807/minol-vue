import axios from 'axios';
let host='http://127.0.0.1:8080';
export const login=params=>{
    return axios.post(`${host}/login`,params)
};
export const test=params=>{
    return axios.get(`${host}/user`,params)
};
