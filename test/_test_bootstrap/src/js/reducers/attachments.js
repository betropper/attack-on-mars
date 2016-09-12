// @flow
import { assign } from 'lodash';
import update from 'react-addons-update';

const defaultState = {
    handbookAttachment: [],
    loading: false,
    message: '',
    deletedSysId: null,
    deletedFileName: null,
};

const attachments = (state:Object = defaultState, action:Object) => {
    switch(action.type) {
        case 'SERVER/FETCHED':
            return {
                ...state,
                handbookAttachment : action.data.handbookAttachment
            };

        case 'GROUP/TOGGLE_EDIT':
            return {
                ...state,
                message: '',
            };

        case 'ATTACHMENT/ADDING':
            return {
                ...state,
                message: '',
                deletedSysId: null,
                deletedFileName: null,
                loading: true,
            };

        case 'ATTACHMENT/ADDED':
            return {
                ...state,
                loading: false,
                message: "The progression map has been saved.",
                deletedSysId: null,
                deletedFileName: null,
                handbookAttachment : [action.file],
            };

        case 'ATTACHMENT/ADD_FAILED':
        case 'ATTACHMENT/UNDO_DELETE_FAIL':
            return {
                ...state,
                loading: false,
                message: "The progression map failed to save.",
                deletedSysId: null,
                deletedFileName: null,
                handbookAttachment : [],
            };

        case 'ATTACHMENT/UNDO_DELETE':
            return {
                ...state,
                loading: false,
                message: "Undo deleted successful",
                deletedSysId: null,
                deletedFileName: null,
                handbookAttachment : [ action.file ],
            };

        case 'ATTACHMENT/DELETE':
            return {
                ...state,
                message: '',
                deletedFileName: action.file.file_name,
                deletedSysId: action.file.sys_id,
                handbookAttachment : [],
            };

        default:
            return state;
    }
};
export default attachments;

