/* type */
const LOGIN_USER = 'login_user';
const REGISTER_USER = 'register_user';
const AUTH_USER = 'auth_user';

/* reducer */
export default function user(state={}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
        case REGISTER_USER: 
            return {...state, registerSuccess: action.payload}
        case AUTH_USER:
            return {...state, userData: action.payload}
        default:
            return state
    }
}