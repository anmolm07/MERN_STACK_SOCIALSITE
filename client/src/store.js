import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';

const initialstate={};

const middleWare=[thunk];

const store=createStore(rootReducer,initialstate,composeWithDevTools(applyMiddleware(...middleWare)));

export default store;