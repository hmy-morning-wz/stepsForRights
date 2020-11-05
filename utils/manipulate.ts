'use strict';
// -------------------- 常用数据类型判断 ------------------------------

// 输入任意类型, 判断是否是 array 类型
let  isArray = Array.isArray || function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

// 判断是否为 object 对象
/**
 * Solves equations of the form a * x = b
 * @example <caption>Example usage of method1.</caption>
 * {%isObject%}
 * @returns {Number} Returns the value of x for the equation.
 */
function isObject(obj:any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

function isString(str:any) {
  return Object.prototype.toString.call(str) === '[object String]';
};

function isPromise(e:any) {
  return !!e && typeof e.then === 'function';
};

function isSymbol(d:any) {
  return Object.prototype.toString.call(d) === '[object Symbol]';
}

function isFunc(fuc:any) {
  let  t = Object.prototype.toString.call(fuc);
  return t === '[object Function]' || t === '[object AsyncFunction]';
}

/**
 * @desc 从一个对象通过操作序列来拿里面的值，做了基本防空措施
 * @param {object} state - 需要获取的数据源
 * @param {array} array - 操作路径
 * @param {any} initial - 默认值，当没有内容的时候
 * @example <caption>Example usage of getIn.</caption>
 * // testcase
 * {%common%}
 * // getIn
 * {%getIn%}
 * @returns {any} expected - 获取的值
 */
function getIn(state:any, array:string[],initial?:any|undefined) {
  //let  initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  let  obj =  Object.assign({}, state);

  for (let  i = 0; i < array.length; i++) {
    // when is undefined return init immediately
    if (typeof obj !== 'object' || obj === null) {
      return initial;
    }

    let  prop = array[i];

    obj = obj[prop];
  }
  if (obj === undefined || obj === null) {
    return initial;
  }

  return obj;
}

/**
 * @desc 一个对象通过操作序列来设置里面的值，做到自动添加值
 * @param {object} state - 需要获取的数据源
 * @param {array} array - 操作路径
 * @param {any} initial - 默认值，当没有内容的时候
 * @example <caption>Example usage of setIn.</caption>
 * // testcase
 * {%common%}
 * // setIn
 * {%setIn%}
 * @returns {any} expected - 返回操作完成后新的值
 */
// {%TITLE=操作%}
function setIn(state:any|[], array:string[]|number[], value:any) {
  if (!array) return state;
  let  setRecursively = function setRecursively(state:any|[], array:string[]|number[], value:any, index:number) {
    let  clone:any = {};
    let  prop:string|number = array[index];
    let  newState = void 0;

    if (array.length > index) {
      // get cloned object
      if (isArray(state)) {
        clone = state.slice(0);
      } else {
        clone = Object.assign({}, state);
      }
      // not exists, make new {}
      let m= state[prop] 
      newState = isObject(state) || isArray(state) && (m !== undefined) ?m : {};
      clone[prop] = setRecursively(newState, array, value, index + 1);
      return clone;
    }

    return value;
  };

  return setRecursively(state, array, value, 0);
}

/**
 * @desc 一个对象通过操作序列来删除里面的值, 做到防空, 返回新值
 * @param {object} state - 需要获取的数据源
 * @param {array} array - 操作路径
 * @example <caption>Example usage of deleteIn.</caption>
 * // testcase
 * {%common%}
 * // deleteIn
 * {%deleteIn%}
 * @returns {any} expected - 返回删除后新的对象 or 值
 */
function deleteIn(state:any|[], array:string[]|number[]) {
  let  deleteRecursively = function deleteRecursively(state:any, array:string[]|number[], index:number) {
    let  clone:any = {};
    let  prop:any = array[index];

    // not exists, just return, delete nothing
    if (!isObject(state) || state[prop] === undefined) {
      return state;
    }

    // not last one, just clone
    if (array.length - 1 !== index) {
      if (Array.isArray(state)) {
        clone = state.slice();
      } else {
           clone = Object.assign({}, state);
      }

      clone[prop] = deleteRecursively(state[prop], array, index + 1);

      return clone;
    }

    // delete here
    if (Array.isArray(state)) {
      clone = [...state.slice(0, prop), ...state.slice(prop + 1)];
    } else {
      clone = Object.assign({}, state);
      delete clone[prop];
    }

    return clone;
  };

  return deleteRecursively(state, array, 0);
}
export {isArray,isObject,isString,getIn,setIn,deleteIn}