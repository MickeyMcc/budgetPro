import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080',
});

const methods = {};

methods.getTransactionsByMonth = (month) => {
    return API.get('/transactions/month', { month });
}

methods.getBudgetByMonth = (month) => {
    return API.get('/budgets/month', { month })
}

export default methods;