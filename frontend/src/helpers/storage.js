import api from "../api";
import { userValue } from "../App";
import User from "../models/user";


export const getUser = () => {
    const { setUser } = userValue;

    const rememberMe = localStorage.getItem('rememberme');
    let user = new User();

    if (rememberMe === "true") {
        user.id = localStorage.getItem('id');
        user.username = localStorage.getItem('username');
        user.email = localStorage.getItem('email');
        user.jwt = localStorage.getItem('jwt');
        user.admin = localStorage.getItem('admin');
    } else {
        if (sessionStorage.getItem('username')) {
            user.id = sessionStorage.getItem('id');
            user.username = sessionStorage.getItem('username');
            user.email = sessionStorage.getItem('email');
            user.jwt = sessionStorage.getItem('jwt');
            user.admin = sessionStorage.getItem('admin');
        }
    }

    user.setUser = setUser;
    if (user.jwt) api.defaults.headers.common['Authorization'] = 'Bearer ' + user.jwt;

    return user;
}