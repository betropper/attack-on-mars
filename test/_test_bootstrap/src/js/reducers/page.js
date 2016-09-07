// @flow
import { assign, get } from 'lodash';
import update from 'react-addons-update';

const defaultState = {
    activeGroup: '',
    attachmentType: '',
    courseCode: '',
    courseName: '',
    createdOn: '',
    currentUrl: '',
    editComplete: false,
    errors: {},
    groupList: [],
    includeBreadcrumb: false,
    loading: false,
    message: '',
    messageAction: null,
    mode: '',
    printMode: false,
    scrollPosition: -1,
    shouldJump: false,
    stage: 'complete',
    status: '',
    sysId: '',
    previousSysId: '',
};

const page = (state:Object = defaultState, action:Object) => {
    switch(action.type) {

        case 'HOME/FETCHED':
            return { ...state, loading: true };

        case 'HOME/COMPLETE_COURSE_IN_PROGRESS':
            return update(state, { stage: { $set: "in-progress" }});

        case 'HOME/COMPLETE_COURSE_DONE':
            if(action.page === 'detail') {
                return update(state, { $merge: {
                    stage: "update-complete",
                    editComplete: action.value,
                    message: action.message,
                    messageAction: null,
                }});
            }
            return state;

        case 'HOME/MESSAGE_READ':
            return update(state, { $merge: {
                message: '',
                messageAction: null,
            }});

        case 'HOME/SHOW_MESSAGE':
            return update(state, { $merge: {
                message: action.message,
                messageAction: action.messageAction,
            }});

        case 'SERVER/FETCHED':
            return {
                ...state,
                attachmentType    : action.attachmentType,
                courseCode        : action.data.x_f5sl_cl_courses.code,
                courseName        : action.data.x_f5sl_cl_courses.name,
                createdOn         : action.data.createdOn,
                editComplete      : action.data.x_f5sl_cl_courses.edit_complete === "true",
                mode              : action.mode,
                status            : action.data.x_f5sl_cl_courses.status,
                loading           : false,
                groupList         : action.data.groupList,
                sysId             : action.data.x_f5sl_cl_courses.sys_id,
                previousSysId     : get(action.data.x_f5sl_cl_courses, ['previous_version', 'value'], null),
                shouldJump: true,
            };

        case 'GROUP/TOGGLE_EDIT':
            return {
                ...state,
                scrollPosition: action.scrollPosition,
            }

        case 'GROUP/SCROLL_COMPLETE':
            return {
                ...state,
                scrollPosition: -1,
            }


        case 'SERVER/FAILED':
            return {
                loading: false,
                ...state,
                errors: {
                    message: "",
                }
            }

        default:
            return state;
    }
};
export default page;
