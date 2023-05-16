import { Middleware } from "redux";
import { StoreState } from "../store";
import { clearUnseenMessages } from "../unseen-messages/unseen-message-reducer";
import { setOpen, ToggleOpenAction, SetOpenAction, SetPageVisibleAction, SetUILanguageAction, setUILanguage } from "./ui-reducer";

export const uiMiddleware: Middleware<{}, StoreState> = store => next => (action: ToggleOpenAction | SetOpenAction | SetPageVisibleAction | SetUILanguageAction) => {
    switch (action.type) {
        case 'TOGGLE_OPEN': {
            const open = store.getState().ui.open;

            store.dispatch(setOpen(!open));

            break;
        }

        // if the webchat is opened while the page is active, reset unread messages
        case 'SET_OPEN': {
            if (action.open && store.getState().ui.isPageVisible) {
                store.dispatch(clearUnseenMessages());
            }

            break;
        }

        // if the page gets active while the webchat is open, reset unread messages
        case 'SET_PAGE_VISIBLE': {
            if (action.visible && store.getState().ui.open) {
                store.dispatch(clearUnseenMessages());
            }
            break;
        }
        // if the user changed the language, store the language to the redux store
        case 'SET_UI_LANGUAGE': {
            if (action.uiLanguage) {
                setUILanguage(action.uiLanguage);
            }

            break;
        }
    }

    return next(action);
}
