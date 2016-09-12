// @flow
import RestClient from '../util/RestClient';
import RestFactory from '../util/RestFactory';
import moment from 'moment';
import { each, mapValues } from 'lodash';

export function addFile(groupId:string, table:string, sysId:string, file:Object, existingFiles:Array<Object>) {
    return function(dispatch:Function, getState:Function) {
        dispatch(adding());

        const promises = {
            upload: (new RestClient).upload(table, sysId, file)
        };
        // Add any existing files to the queue to be deleted
        each(existingFiles, (existingFile, key) => {
            promises[key] = performDelete(existingFile);
        });

        (new RestFactory).promisesToRetryableParallel(promises,
            (results) => dispatch(added(groupId, results.upload)),
            (err) => {
                console.error("Attachment add/delete failed");
                dispatch(addFailed(file));
            });
    }
}
export function adding() {
    return { type: 'ATTACHMENT/ADDING' };
}
export function added(id:string, file:Object) {
    return { type: 'ATTACHMENT/ADDED', id, file };
}
export function addFailed(file:Object) {
    return { type: 'ATTACHMENT/ADD_FAILED', file };
}
export function deleteFile(id:string, file:Object) {
    // TODO maybe pushed into a service like comments
    performDelete(file);
    return { type: 'ATTACHMENT/DELETE', id, file };
}

export function undoDelete(groupId:string, sysId:string) {
    return function(dispatch:Function, getState:Function) {
        (new RestFactory).promisesToRetryableParallel({
            file: (new RestClient).patch('sys_attachment', sysId, '', { "u_sys_deleted_on": '' }, [], false),
        }, (results) => {
            dispatch(undoDeleteComplete(groupId, results.file));
        }, (err) => {
            console.error("Attachment undo delete failed");
            dispatch(undoFailed());
        });
    };
}

export function undoDeleteComplete(groupId:string, file:Object) {
    return { type: 'ATTACHMENT/UNDO_DELETE', groupId, file };
}

export function undoFailed() {
    return { type: 'ATTACHMENT/UNDO_DELETE_FAIL' };
}

function performDelete(file:Object) {
    return (new RestClient).patch('sys_attachment', file.sys_id, '', { "u_sys_deleted_on": moment().format("YYYY-MM-DD HH:mm:ss") }, [], false);
}