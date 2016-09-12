// @flow
import update from 'react-addons-update';
import { isArray, each, unset, merge, mergeWith, without, update as _update } from 'lodash';

const defaultState = {};

const draft = (state:Object = defaultState, action:Object) => {
    switch(action.type) {
        case 'DRAFT/ON_CHANGE':
            return merge({}, state, { [action.componentId]: { [action.table]: { [action.sysId]: { [action.field]: action.value }}}});

        case 'DRAFT/ON_CHANGE_BULK':
            return merge({}, state, { [action.componentId]: action.value });

        case 'CRUD_TABLE/RECORD_ADDED':
            return mergeWith({}, state, {
                [action.entryId]: {
                    [action.table]: {
                        [action.newId]: {
                            ...action.defaultData,
                            sys_id: action.newId,
                        },
                    },
                    blocks: {
                        [action.blockId]: {
                            records: [action.newId]
                        }
                    }
                },
            }, (objValue, srcValue) => isArray(objValue) ? objValue.concat(srcValue) : undefined); // Pushs into an array instead of smashing it

        case 'MAPPING/DELETED':
            const deletedSucceededState = merge({}, state);
            _update(deletedSucceededState, [action.entryId, 'blocks', action.blockId, 'records'], records => without(records, action.sysId));
            return deletedSucceededState;

        case 'MAPPING/SAVE_SUCCEEDED':
            const saveSucceededState = merge({}, state);
            unset(saveSucceededState, [action.entryId, action.table]);
            return saveSucceededState;

        case 'FORM/SAVED':
            const newState = merge({}, state);
            each(action.sysIds, sysId => unset(newState, [action.table, sysId]));
            return newState;

        case 'SERVER/FETCHED':
        case 'HOME/FETCHED':
            return defaultState;

        default:
            return state;
    }
};
export default draft;

