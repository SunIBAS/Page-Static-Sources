export class Cache {
    constructor(defaultCache, defaultCacheCheck) {
        this.key = "_video_speed_cache_";
        this.objType = defaultCacheCheck;
        this.obj = this.get() || {};
        for (let i in defaultCache) {
            if (!(i in this.obj)) {
                this.obj[i] = defaultCache[i];
            }
        }
    }
    set(key, value) {
        if (key in this.objType) {
            this.obj[key] = this.objType[key](value);
        } else {
            this.obj[key] = value;
        }
        this.store();
        return this;
    }
    store() {
        localStorage.setItem(this.key, JSON.stringify(this.obj));
    }
    checkData(data) {
        for (let i in this.objType) {
            data[i] = this.objType[i](data[i]);
        }
        return data;
    }
    get() {
        let data = localStorage.getItem(this.key);
        if (!data) {
            return null;
        }
        try {
            data = JSON.parse(data)
        } catch (e) {
            return null;
        } finally {
            return this.checkData(data);
        }
    }
    clear() {
        setTimeout(() => {
            localStorage.removeItem(this.key);
        }, 1000);
    }
}