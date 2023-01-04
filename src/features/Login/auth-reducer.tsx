import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, LoginType, Result_code} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
};

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value;
        }
    }
});

export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;
// thunks
export const loginTC = (data: LoginType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === Result_code.OK) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        // @ts-ignore
        handleServerNetworkError(e, dispatch)
    }
}

