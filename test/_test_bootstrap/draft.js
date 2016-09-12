// @flow
export function onChange(componentId:string, table:string, sysId:string, field:string, value:string) {
    return { type: 'DRAFT/ON_CHANGE', componentId, table, sysId, field, value };
}

export function onChangeBulk(componentId:string, value:Object) {
    return { type: 'DRAFT/ON_CHANGE_BULK', componentId, value };
}