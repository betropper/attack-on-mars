// @flow
import AppClient from '../util/AppClient';
import { get } from 'lodash';

export function cancel(id:string) {
    return { type: 'COMMENT/CANCEL', id };
}

export function change(id:string, value:string) {
    return { type: 'COMMENT/CHANGE', id, value };
}

export function changeSignificant(id:string, significantValue:boolean) {
    return { type: 'COMMENT/CHANGE_SIGNIFICANT', id, significantValue };
}

export function failed(id:string, value:string, significantValue:boolean) {
    return { type: 'COMMENT/FAILED', id, value, significantValue };
}

export function save(id:string, value:string, significantValue:boolean) {
    return function(dispatch:Function, getState:Function) {
        dispatch(saving(id));

        const commentArea = get(getState(), ['commentAreas', id]);
        const promise = sendComment(commentArea);

        promise.done((result) => {
            const author = get(result, ['sys_created_by'], 'USER');
            dispatch(saved(id, value, author, significantValue, commentArea.comments.length + 1))
        })
    }
}

export function saved(id:string, value:string, author:string, significantValue:boolean, commentCount:number) {
    return { type: 'COMMENT/SAVED', id, value, author, significantValue, commentCount };
}

export function saving(id:string) {
    return { type: 'COMMENT/SAVING', id };
}


function sendComment(commentArea:Object) {
    const { significantValue, value, sysId, groupId } = commentArea;

    const significantHash = significantValue ? '#significant' : '';

    const journalPayload = {
        name: 'course',
        element_id: sysId,
        element: "comments",
        value: `#group-${groupId} ${significantHash} ${value}`,
    };
    const promise = (new AppClient).post('sys_journal_field', '', journalPayload);

    return promise;
}





