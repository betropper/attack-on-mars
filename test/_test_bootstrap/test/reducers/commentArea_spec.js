import chai from 'chai';
const assert = chai.assert;

import moment from 'moment';

import page from '../../src/js/reducers/commentAreas';

describe('pages/reducers/commentArea', () => {
    it('returns an empty array when values are null.', () => {
        assert.deepEqual(page({},{}), {})
    });
   

    it('should handle SERVER/FETCHED by returning action.data.commentAreas even if there are none', () => {
        assert.deepEqual(page({},{
          type: 'SERVER/FETCHED',
          data: {
            commentAreas: {}
          }
        }), {})
    });

    
    it('should handle SERVER/FETCHED by returning action.data.commentAreas', () => {
        assert.deepEqual(page({},{
          type: 'SERVER/FETCHED',
          data: {
            commentAreas: {
              'test': {},
              'test1': {}
            }
          }
        }),{
            'test': {},
            'test1': {}
            })
    });


    it('should handle COMMENT/CANCEL by returning the state', () => {
        assert.deepEqual(page({
          'test': {},
          'test2': {}
        },{
          type: 'COMMENT/CANCEL',
          id: 'test'  
        }), {
         'test': {},
         'test2': {}
        })
    });


    it('should handle COMMENT/SAVING by creating a saving state and a commentArea if there is none', () => {
        assert.deepEqual(page({},{
          type: 'COMMENT/SAVING',
          id: ''
        }),{
          '': {
            saving: true  
          }
        })
    });


    it('should handle COMMENT/SAVING by updating the state to saving without altering any other values. It should also handle non-boolean values', () => {
        assert.deepEqual(page({
        'test': {
          saving: 4,
          value: 'test'
        },
        'test1': {}
        },{
          type: 'COMMENT/SAVING',
          id: 'test'
        }),{
          'test': {
            saving: true,
            value: 'test'
          },
          'test1': {}
        })
    });

    it('should handle COMMENT/SAVING by updating the state to saving', () => {
        assert.deepEqual(page({
          'test': {
            saving: false
          }
        },{
          type: 'COMMENT/SAVING',
          id: 'test'
        }),{
          'test': {
            saving: true  
          }
        })
    });

    it('should handle COMMENT/SAVED by updating the state of the commentArea for established values', () => {
        assert.deepEqual(page({
        'test': {
          saving: true,
          value: ''
        },
        'test1': {
          saving: true,
          comments: [20]
        }
        },{
          type: 'COMMENT/SAVED',
          id: 'test1',
          value: 'text',
          author: 'testing',
          significantValue: true
        }),{
          'test': {
            saving: true,
            value: ''
          },
          'test1': {
            saving: false,
            value: '',
            significantValue: false,
            comments: [
              20,
              {
                "author": "testing",
                "date": moment().format('YYYY-MM-DD HH:mm:ss'),
                "significantValue": true,
                "value": "text"
              }]
          }
        })
    });

    it('should handle COMMENT/SAVED by updating the state of the commentArea for null values', () => {
        assert.deepEqual(page({
        'test': {
          saving: true,
          value: ''
        },
        'test1': {}
        },{
          type: 'COMMENT/SAVED',
          id: 'test1',
          value: '',
          author: '',
          significantValue: ''
        }),{
          'test': {
            saving: true,
            value: ''
          },
          'test1': {
            saving: false,
            value: '',
            significantValue: false,
            comments: [
              {
                "author": "",
                "date": moment().format('YYYY-MM-DD HH:mm:ss'),
                "significantValue": true,
                "value": "text"
              }]
          }
        })
    });


    it('should handle COMMENT/CHANGE by updating the state of the commentArea for null values', () => {
        assert.deepEqual(page({
        'test': {
          saving: true,
          value: ''
        },
        'test1': {}
        },{
          type: 'COMMENT/CHANGE',
          id: 'test1',
          value: '',
          author: '',
          significantValue: ''
        }),{
          'test': {
            saving: true,
            value: ''
          },
          'test1': {
            value: '',
          }
        })
    });
   

    it('should handle COMMENT/CHANGE by updating the state of the commentArea for odd values', () => {
        assert.deepEqual(page({
        'test': {
          saving: true,
          value: 'asdfasdfsdfasdfasdfasdfasdfasdfasdfasf'
        },
        'test1': {}
        },{
          type: 'COMMENT/CHANGE',
          id: 'test',
          value: 'asdfasdfsdfasdfasdfasdfasdfasdfasdfasf',
          author: '',
          significantValue: ''
        }),{
          'test': {
            saving: true,
            value: 'asdfasdfsdfasdfasdfasdfasdfasdfasdfasf'
          },
          'test1': {}
        })
    });
  
    it('should handle COMMENT/CHANGE by updating the state of the commentArea for numbers', () => {
        assert.deepEqual(page({
        'test': {
          saving: true,
          value: -1
        },
        'test1': {}
        },{
          type: 'COMMENT/CHANGE',
          id: 'test',
          value: -1,
          author: '',
          significantValue: ''
        }),{
          'test': {
            saving: true,
            value: -1
          },
          'test1': {}
        })
    });

    it('should handle COMMENT/CHANGE_SIGNIFICANT by inversing the significantValue if it is a boolean. It should also only change the significantValue of the state', () => {
        assert.deepEqual(page({
        'test': {
          saving: true,
          value: -1
        },
        'test1': {
          significantValue: true
        }
        },{
          type: 'COMMENT/CHANGE_SIGNIFICANT',
          id: 'test',
          value: -1,
          author: '',
        }),{
          'test': {
            saving: true,
            value: -1
          },
          'test1': {
            significantValue: false
          }
        })
    });

    it('should handle COMMENT/CHANGE_SIGNIFICANT if significantValue is not a boolean by returning the state', () => {
        assert.deepEqual(page({
        'test': {
          saving: true,
          value: -1
        },
        'test1': {
          significantValue: 'test'
        }
        },{
          type: 'COMMENT/CHANGE_SIGNIFICANT',
          id: 'test',
          value: -1,
          author: '',
        }),{
          'test': {
            saving: true,
            value: -1
          },
          'test1': {
            significantValue: 'test'
          }
        })
    });


    it('should handle COMMENT/CHANGE_SIGNIFICANT by making a significantValue if there is none', () => {
        assert.deepEqual(page({
        'test': {}
        },{
          type: 'COMMENT/CHANGE_SIGNIFICANT',
          id: 'test',
          author: '',
        }),{
          'test': {
            significantValue: null
          }
        })
    });

});
