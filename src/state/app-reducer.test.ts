import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let startState: InitialStateType;

beforeEach(()=> {
    startState = {
        error: null,
        status: 'idle'
    }
})

test('correct error should be said', () => {

    const endState = appReducer(startState, setAppErrorAC('some error'))

    expect(endState.error).toBe('some error');
})
test('correct status should be said', () => {

    const endState = appReducer(startState, setAppStatusAC('loading'))

    expect(endState.status).toBe('loading');
})