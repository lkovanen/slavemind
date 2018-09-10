import { connectRoutes } from 'redux-first-router'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { appReducer } from '../reducers/appReducer'

const history = createHistory()

const routesMap = { 
    HOME: '/',
    APP: '/:id',
}

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap);

const rootReducer = combineReducers({ location: reducer, appId: appReducer })
const middlewares = applyMiddleware(middleware)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(enhancer, middlewares));

export default store;