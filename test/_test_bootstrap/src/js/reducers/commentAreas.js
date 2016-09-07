// @flow
import moment from 'moment';
import { assign } from 'lodash';

const newComment = (value, author, significantValue) => {
    return {
        author: author,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        significantValue,
        value,
    };
};

const commentArea = (state, action) => {
    switch(action.type) {

        case 'COMMENT/SAVED':
            const { significantValue, value, author } = action;
            return assign({}, state, {
                saving: false,
                significantValue: false,
                value: '',
                comments: [...state.comments, newComment(value, author, significantValue)],
            });

        case 'COMMENT/SAVING':
            return assign({}, state, {
                saving: true,
            });


        case 'COMMENT/CHANGE':
            return assign({}, state, {
                value: action.value,
            });

        case 'COMMENT/CHANGE_SIGNIFICANT':
            return assign({}, state, {
                significantValue: !state.significantValue,
            });

        default:
            return state;
    }
};

const commentAreas = (state:Object = {}, action:Object) => {
    switch(action.type) {
        case 'SERVER/FETCHED':
            return action.data.commentAreas;

        case 'COMMENT/CANCEL':
        case 'COMMENT/CHANGE':
        case 'COMMENT/SAVING':
        case 'COMMENT/SAVED':
        case 'COMMENT/CHANGE_SIGNIFICANT':
            return assign({}, state, {
                [action.id]: commentArea(state[action.id], action)
            });


        default:
            return state;
    }
};
export default  commentAreas;

