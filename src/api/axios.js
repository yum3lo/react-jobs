import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3500',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export default instance;