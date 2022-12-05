import React, {useCallback, useEffect} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './components/AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Menu} from '@mui/icons-material';
import {
     addTodoListThunkCreator,
    changeTodolistFilterAC,
     changeTodolistTitleThunkCreator,
    FilterValuesType, getTodoListsThunkCreator,
    removeTodoListThunkCreator,
    TodolistDomainType
} from './state/todolists-reducer'
import {
    addTaskThunkCreator,
    removeTaskThunkCreator, updateTaskThunkCreator
} from './state/tasks-reducer';
import {useDispatch} from 'react-redux';
import {useAppSelector} from './state/store';
import {TaskStatuses, TaskType} from './api/todolists-api'
import {LinearProgress} from "@mui/material";
import { ErrorSnackbars } from './components/ErrorSnackbar';
import {AppStatusType} from "./state/app-reducer";



export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)

    const status = useAppSelector<AppStatusType>((state)=> state.app.status)
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getTodoListsThunkCreator())
    }, []);


    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = removeTaskThunkCreator(id, todolistId);
        dispatch(thunk);
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = addTaskThunkCreator(title, todolistId);
        dispatch(thunk);
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        const thunk = updateTaskThunkCreator(id, {status}, todolistId);
        dispatch(thunk);
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const thunk = updateTaskThunkCreator(id, {title: newTitle}, todolistId);
        dispatch(thunk);
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodoListThunkCreator(id);
        dispatch(thunk);
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleThunkCreator(id, title);
        dispatch(thunk);
    }, []);

    const addTodolist = useCallback((title: string) => {
        const thunk = addTodoListThunkCreator(title);
        dispatch(thunk);
    }, [dispatch]);

    return (
        <div className="App">
            <AppBar position="static">
                <ErrorSnackbars/>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];

                            return <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        entityStatus={tl.entityStatus}
                                        tasks={allTodolistTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
