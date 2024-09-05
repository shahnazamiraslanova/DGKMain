import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IState } from './store';
import { az } from '../assets/lang/az';
import { en } from '../assets/lang/en';
import { ru } from '../assets/lang/ru';
import { environment } from '../core/configs/app.config';
import { ILang } from '../assets/lang/lang';

const initialState: IState = {
    loader: false,
    leftMenu: true,
    languages: [
        { id: 1, key: 'az', value: 'Az' },
        { id: 2, key: 'en', value: 'En' },
        { id: 3, key: 'ru', value: 'Ru' }
    ],
    locale: az,
    user: null,
    username: '', // Initialize username
    password: '',  // Initialize password
    token: ''      // Initialize token
};

export const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        setLoader: (state: IState, action: PayloadAction<boolean>) => {
            state.loader = action.payload;
        },
        toggleLeftMenu: (state: IState) => {
            state.leftMenu = !state.leftMenu;
        },
        setLocale: (state: IState, action: PayloadAction<ILang>) => {
            const lang = {
                az,
                en,
                ru
            };
            state.locale = lang[action.payload];
            localStorage.setItem(`${environment.applicationName}-locale`, action.payload);
        },
        setUser: (state: IState, action: PayloadAction<any>) => {
            // state.user = jwtDecode(action.payload);
            state.user = 'user';
        },
        setUsername: (state: IState, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setPassword: (state: IState, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setToken: (state: IState, action: PayloadAction<string>) => {
            state.token = action.payload;  // Set the token in state
        }
    },
});

export const { setLoader, toggleLeftMenu, setLocale, setUser, setUsername, setPassword, setToken } = rootSlice.actions;

export default rootSlice.reducer;
