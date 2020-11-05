import { getIn, setIn, deleteIn } from "./manipulate";
export default class GlobalData {
    constructor(data) {
        this._data = {};
        this._timerId = 0;
        this._reday = false;
        Object.assign(this, data);
        this.load();
    }
    getScene() {
        let globalData = this;
        return (globalData.query && globalData.query.scene) || globalData.scene;
    }
    sleep(time) {
        return new Promise((r, _) => {
            setTimeout(() => {
                r();
            }, time || 0);
        });
    }
    async load() {
        my.getStorage({ key: "_GlobalData", success: (res) => {
                if (res && res.data) {
                    Object.assign(this._data, res.data);
                }
            },
            complete: () => {
                this._reday = true;
            }
        });
    }
    store() {
        my.setStorage({ key: "_GlobalData", data: this._data, success: () => {
                console.log("GlobalData store success");
            } });
    }
    async clear() {
        await this.reday();
        this._data = {};
        this.store();
    }
    condense() {
        let keys = Object.keys(this._data);
        keys && keys.length && keys.forEach((key) => {
            let ret = getIn(this._data, [key], {});
            if (ret && ret.expire && (ret.t + ret.expire < +Date.now())) {
                this._data = deleteIn(this._data, [key]);
            }
        });
    }
    async reday() {
        let count = 0;
        while (count < 100) {
            if (this._reday)
                return true;
            await this.sleep(100);
            count++;
        }
    }
    async set(key, data, option = {}) {
        if (!this._reday) {
            await this.reday();
        }
        let { expire } = option;
        this._data = setIn(this._data, [key], { data, expire: expire || (365 * 24 * 60 * 60000), t: +Date.now() });
        if (this._timerId) {
            clearTimeout(this._timerId);
        }
        this._timerId = setTimeout(() => {
            this._timerId = 0;
            this.condense();
            this.store();
        }, 1000);
    }
    async get(key) {
        if (!this._reday) {
            await this.reday();
        }
        let ret = getIn(this._data, [key], {});
        if (ret && ret.expire && (ret.t + ret.expire < +Date.now())) {
            this._data = deleteIn(this._data, [key]);
            return null;
        }
        return ret.data;
    }
    getIn(key) {
        let ret = getIn(this._data, [key], {});
        if (ret && ret.expire && (ret.t + ret.expire < +Date.now())) {
            this._data = deleteIn(this._data, [key]);
            return null;
        }
        return ret.data;
    }
}
