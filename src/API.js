import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080',
});

const methods = {};

methods.getByMonth = (month) => {
    return API.get('/items', { month });
}

export default methods;