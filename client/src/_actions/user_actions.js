import axios from 'axios';

export function loginUser(dataToSubmit) {
    const request = axios.post('/api/user/login', dataToSubmit) 
        .then(res => res.data)

    return {
        type: 'login_user',
        payload: request
    }
}

export function registerUser(dataToSubmit) {
    const request = axios.post('/api/user/register', dataToSubmit) 
        .then(res => res.data)

    return {
        type: 'register_user',
        payload: request
    }
}

export function auth() {
    const request = axios.get('/api/user/auth') 
        .then(res => res.data)

    return {
        type: 'auth_user',
        payload: request
    }
}
