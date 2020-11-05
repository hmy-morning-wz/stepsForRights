'use strict';
let isArray = Array.isArray || function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
;
function isString(str) {
    return Object.prototype.toString.call(str) === '[object String]';
}
;
function isPromise(e) {
    return !!e && typeof e.then === 'function';
}
;
function isSymbol(d) {
    return Object.prototype.toString.call(d) === '[object Symbol]';
}
function isFunc(fuc) {
    let t = Object.prototype.toString.call(fuc);
    return t === '[object Function]' || t === '[object AsyncFunction]';
}
function getIn(state, array, initial) {
    let obj = Object.assign({}, state);
    for (let i = 0; i < array.length; i++) {
        if (typeof obj !== 'object' || obj === null) {
            return initial;
        }
        let prop = array[i];
        obj = obj[prop];
    }
    if (obj === undefined || obj === null) {
        return initial;
    }
    return obj;
}
function setIn(state, array, value) {
    if (!array)
        return state;
    let setRecursively = function setRecursively(state, array, value, index) {
        let clone = {};
        let prop = array[index];
        let newState = void 0;
        if (array.length > index) {
            if (isArray(state)) {
                clone = state.slice(0);
            }
            else {
                clone = Object.assign({}, state);
            }
            let m = state[prop];
            newState = isObject(state) || isArray(state) && (m !== undefined) ? m : {};
            clone[prop] = setRecursively(newState, array, value, index + 1);
            return clone;
        }
        return value;
    };
    return setRecursively(state, array, value, 0);
}
function deleteIn(state, array) {
    let deleteRecursively = function deleteRecursively(state, array, index) {
        let clone = {};
        let prop = array[index];
        if (!isObject(state) || state[prop] === undefined) {
            return state;
        }
        if (array.length - 1 !== index) {
            if (Array.isArray(state)) {
                clone = state.slice();
            }
            else {
                clone = Object.assign({}, state);
            }
            clone[prop] = deleteRecursively(state[prop], array, index + 1);
            return clone;
        }
        if (Array.isArray(state)) {
            clone = [...state.slice(0, prop), ...state.slice(prop + 1)];
        }
        else {
            clone = Object.assign({}, state);
            delete clone[prop];
        }
        return clone;
    };
    return deleteRecursively(state, array, 0);
}
export { isArray, isObject, isString, getIn, setIn, deleteIn };
