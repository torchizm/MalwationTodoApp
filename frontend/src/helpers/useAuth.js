import api from "../api";
import { getUser } from "./storage";

export const login = async (email, password, rememberMe) => {
	try {
		const res = await api.post('login', {
			email: email,
			password: password
		});

		if (!res.status === 200) {
			return { success: false, user: undefined };
		}
		
		api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;

		const resIsAdmin = await api.get('user/isAdmin');

		localStorage.setItem('rememberme', rememberMe);
		const storage = (rememberMe) ? localStorage : sessionStorage;

		storage.setItem('id', res.data._id);
		storage.setItem('username', res.data.username);
		storage.setItem('email', res.data.email);
		storage.setItem('role', res.data.role);
		storage.setItem('jwt', res.data.token);
		storage.setItem('admin', resIsAdmin.data.admin);

		const user = getUser();
		return { success: true, user: user };
	} catch (error) {
		return { success: false, user: undefined };
	}
};

export const register = async (username, email, password) => {
	try {
		const res = await api.post('register', {
			username: username,
			email: email,
			password: password
		})

		if (!res.status === 200 || res.data.message) {
			return { success: false }
		}
		
		localStorage.setItem('rememberme', true);
		localStorage.setItem('id', res.data._id);
		localStorage.setItem('username', res.data.username);
		localStorage.setItem('email', res.data.email);
		localStorage.setItem('role', res.data.role);
		localStorage.setItem('jwt', res.data.token);
		localStorage.setItem('admin', 'false');
	
		api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
		
		const user = getUser();
		return { success: true, user: user };
	} catch (error) {
		return { success: false };
	}
}

export const logout = async () => {
	let storages = [sessionStorage, localStorage];

	storages.forEach(storage => {
		storage.removeItem('id');
		storage.removeItem('rememberme');
		storage.removeItem('username');
		storage.removeItem('email');
		storage.removeItem('role');
		storage.removeItem('admin');
		storage.removeItem('jwt');
	});
	
	const user = getUser();
	user.setUser({});

	await api.post('logout');
	api.defaults.headers.common['Authorization'] = undefined;
}

export const isAdmin = async () => {
	const res = await api.get('user/isAdmin');
	return res.data.admin;
}