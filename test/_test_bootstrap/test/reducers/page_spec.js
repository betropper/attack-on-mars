import chai from 'chai';
const assert = chai.assert;

import page from '../../src/js/reducers/page';

describe('pages/reducers/page', () => {
    it('returns initial state', () => {
        assert.deepEqual(page(undefined, {}), {
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        })
    });

    it('should handle SERVER/FETCHING by updating the loading flag', () => {
        assert.deepEqual(page({
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        }, {
            type: 'SERVER/FETCHING',
        }), {
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: true,
            groupList: [],
            subtitle: '',
            sysId: '',
        });
    });

    it('should handle HOME/COMPLETE_COURSE_IN_PROGRESS by updating the stage variable to inprogress', () => {
        assert.deepEqual(page({
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        }, {
            type: 'HOME/COMPLETE_COURSE_IN_PROGRESS',
        }), {
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'in-progress',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        });
    });

    it('should handle HOME/COMPLETE_COURSE_DONE by updating the stage variable to update-complete and the editComplete variable only when on detail page', () => {
        assert.deepEqual(page({
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        }, {
            type: 'HOME/COMPLETE_COURSE_DONE',
            page: 'detail',
            value: true,
        }), {
            courseCode: '',
            courseName: '',
            editComplete: true,
            stage: 'update-complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        });
    });

    it('should handle HOME/COMPLETE_COURSE_DONE by not updating the state when not on detail page', () => {
        assert.deepEqual(page({
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        }, {
            type: 'HOME/COMPLETE_COURSE_DONE',
            page: 'other',
            value: true,
        }), {
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [],
            subtitle: '',
            sysId: '',
        });
    });

    it('should handle SERVER/FETCHED by linking through all the appropraite data. It should also mark loading as false', () => {
        assert.deepEqual(page({
            courseCode: '',
            courseName: '',
            editComplete: false,
            stage: 'complete',
            status: '',
            includeBreadcrumb: false,
            printMode: false,
            loading: true,
            groupList: [],
            subtitle: '',
            sysId: '',
        }, {
            type: 'SERVER/FETCHED',
            data: {
                x_f5sl_cl_courses: {
                    code: 'code123',
                    name: 'name123',
                    edit_complete: 'true',
                    status: 'my-status',
                    sys_id: '123abc',
                },
                groupList: [1, 2, 7, 8],
                page: {
                    subtitle: 'my subtitle',
                }
            }
        }), {
            courseCode: 'code123',
            courseName: 'name123',
            editComplete: true,
            stage: 'complete',
            status: 'my-status',
            includeBreadcrumb: false,
            printMode: false,
            loading: false,
            groupList: [1, 2, 7, 8],
            subtitle: 'my subtitle',
            sysId: '123abc',
        });
    });

    it('should handle SERVER/FETCHED and convert edit-complete to bool for both true/false values', () => {
        assert.isTrue(false, 'needs tests');
    });
});