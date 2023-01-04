import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{status: RequestStatusType}>) =>{
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        }
    }
})


export const appReducer = slice.reducer;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
}

export const setAppErrorAC = slice.actions.setAppErrorAC; //(error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = slice.actions.setAppStatusAC; //(status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>


