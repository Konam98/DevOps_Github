import { createStore, applyMiddleware } from 'redux';
import { StateType } from 'typesafe-actions';
import { createMessageMiddleware } from './messages/message-middleware';
import { registerMessageHandler } from './messages/message-handler';
import { optionsMiddleware } from './options/options-middleware';
import { reducer } from './reducer';
import { registerTypingHandler } from './typing/typing-handler';
import { createConnectionMiddleware } from './connection/connection-middleware';
import { createConfigMiddleware } from './config/config-middleware';
import { createAnalyticsMiddleware } from './analytics/analytics-middleware';
import { registerConnectionHandler } from './connection/connection-handler';
import { Webchat } from '../components/Webchat';
import { IWebchatSettings } from '../../common/interfaces/webchat-config';
import { uiMiddleware } from './ui/ui-middleware';
import { registerUiHandler } from './ui/ui-handler';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createAutoInjectMiddleware } from './autoinject/autoinject-middleware';
import {createStateSyncMiddleware, initStateWithPrevTab} from "redux-state-sync";

export type StoreState = StateType<typeof reducer>;

// creates a store and connects it to a webchat client
export const createWebchatStore = (webchat: Webchat, url: string, overrideWebchatSettings?: IWebchatSettings) => {
    const { client } = webchat;
    const reduxStateSyncConfig = {
        whitelist: ["ADD_MESSAGE"]
    };
    
    const store = createStore(
        reducer,
        composeWithDevTools(applyMiddleware(
            createAnalyticsMiddleware(webchat),
            createConnectionMiddleware(client),
            createMessageMiddleware(client),
            createConfigMiddleware(url, overrideWebchatSettings),
            createAutoInjectMiddleware(webchat),
            optionsMiddleware,
            uiMiddleware,
            createStateSyncMiddleware(reduxStateSyncConfig),

        ))
    );

    registerMessageHandler(store, client);
    registerTypingHandler(store, client);
    registerConnectionHandler(store, client);
    registerUiHandler(store);
    initStateWithPrevTab(store);
    
    return store;
}