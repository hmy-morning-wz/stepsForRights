import { CALL_AJAX, CALL_RPC } from './symbols';
import { getUserId } from '../utils/TinyAppHttp';
const modeMap = {
    ajax: CALL_AJAX,
    rpc: CALL_RPC
};
export default function servicesCreactor(obj, mode = 'ajax') {
    return Object.keys(obj)
        .reduce((p, v) => {
        const func = obj[v];
        p[v] = async function ({ dispatch, commit }, payload) {
            let globalData = getApp().globalData;
            const value = func(payload, globalData);
            if (value.data && 'userId' in value.data && (!value.data.userId)) {
                let userId = await getUserId();
                value.data.userId = userId;
            }
            value.type = value.type || v;
            console.log("services dispatch start", value.type);
            await dispatch(modeMap[mode], value);
            if (value.nextAction) {
                console.log("services nextAction dispatch", value.nextAction);
                if (typeof value.nextAction === 'string') {
                    await dispatch(value.nextAction);
                }
                else if (value.nextAction.length) {
                    await Promise.all(value.nextAction.map((name, index) => {
                        console.log("services nextAction dispatch", index, name);
                        return dispatch(name);
                    }));
                }
            }
            console.log("services dispatch end", value.type);
        };
        return p;
    }, {});
}
