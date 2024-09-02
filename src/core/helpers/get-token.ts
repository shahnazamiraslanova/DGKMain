import {environment} from '../configs/app.config';

export const getToken = (): string | null => {
    return localStorage.getItem(`token`);
};

export const setToken = (token: string) => {
    localStorage.setItem(`${environment.applicationName}-token`, token);
};

export const getUsername= (): string | null =>{
    return localStorage.getItem('username');
};