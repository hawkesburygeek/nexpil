import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from '../store/reducers';
import { createLogger } from 'redux-logger';
import mySaga from './patientsSaga';

// Creat saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let middlewares = [sagaMiddleware, createLogger()];
if (process.env.NODE_ENV === 'production') middlewares = [sagaMiddleware];

// Export store from saga and reducer
export const store = createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

// Run the saga middleware
sagaMiddleware.run(mySaga);
