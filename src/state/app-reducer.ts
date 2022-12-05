
const initialState: InitialStateType = {
    status: 'idle',
    error: null
}


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':

            return {...state, error: action.error}
        default:
            return state
    }
}

export type AppStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type InitialStateType = {
    status: AppStatusType
    error: string | null
}
export type ActionsType = SetAppStatusActionType | SetAppErrorActionType;

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>


export const setAppStatusAC = (status: AppStatusType) => ({
    type: 'APP/SET-STATUS', status
} as const)

export const setAppErrorAC = (error: string | null) => ({
    type: 'APP/SET-ERROR', error
}  as const)