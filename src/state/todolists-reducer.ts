import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppActionsType, AppThunkType} from "./store";
import {AppStatusType, setAppStatusAC, SetAppStatusActionType} from "./app-reducer";


export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>

export type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodoListsActionType
    | ChangeTodolistEntityStatusActionType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: AppStatusType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: AppActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodolistDomainType = {...action.todolist, filter: 'all', entityStatus: 'idle'};
            return [newTodolist, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case 'SET-TODOLIST': {
            return action.todoLists.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
        case 'CHANGE-TODOLIST-ENTITY-STATUS': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.entityStatus = action.entityStatus;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodoListsAC = (todoLists: TodolistType[]) => ({type: 'SET-TODOLIST', todoLists} as const)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: AppStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    id,
    entityStatus
} as const)

export const getTodoListsThunkCreator = () => {
    return (dispatch: Dispatch<AppActionsType | SetAppStatusActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodoListsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const removeTodoListThunkCreator = (todolistId: string): AppThunkType => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const addTodoListThunkCreator = (title: string): AppThunkType => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const changeTodolistTitleThunkCreator = (id: string, title: string): AppThunkType => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}
