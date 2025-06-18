
window.layer_cache_name = "all_layers"

window.cacheObject = (function (storage) {
    let c = new class{
        constructor() {
            this.data = new Map();
        }
        set(key, value) {
            this.data[key] = value;
            storage.set(key, value);
        }
        get(key, defaultValue) {
            if (key in this.data) {
            } else {
                this.data[key] = storage.get(key) || defaultValue;
            }
            return this.data[key];
        }
        delete(key) {
            storage.delete(key);
            delete this.data[key];
        }
    };
    return c;
})({
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        let obj = null;
        try {
            obj = JSON.parse(localStorage.getItem(key));
        } catch (e) {
        } finally {
        }
        return obj;
    },
    delete(key) {
        localStorage.removeItem(key);
    }
});

window.cacheLayerStyle = (function () {
    let all_layers = window.cacheObject.get(window.layer_cache_name, [])
    return {
        addNewLayer(layer, obj, id, name) {
            if (!id) {
                id = new Date().getTime();
                name = prompt("命名该对象", id)
            }
            if (!name) {
                let obj = all_layers.filter(al => al.id === id);
                if (obj.length !== 0) {
                    name = obj[0].name;
                }
            }
            layer.id = id;
            let fid = null;
            for (let id in layer._layers) {
                fid = id;
                break;
            }
            let firstLayer = layer._layers[fid];

            let oldSetStyle = firstLayer.setStyle;
            firstLayer.setStyle = function (value) {
                oldSetStyle.bind(firstLayer)(value);
                window.cacheObject.set(`layer.${id}.style`, firstLayer.options);
            }
            window.cacheObject.set(`layer.${id}.obj`, obj);
            if (all_layers.filter(al => al.id === id).length === 0) {
                all_layers.push({
                    id: id,
                    name: name,
                });
            }
            window.cacheObject.set(window.layer_cache_name, all_layers);
            return {
                layer,
                obj,
                id,
                name,
            }
        },
        updateLayer(obj, id, name) {
            window.cacheObject.set(`layer.${id}.obj`, obj);
            if (name && all_layers.filter(al => al.id === id).length === 0) {
                all_layers.push({
                    id: id,
                    name: name,
                });
            }
            window.cacheObject.set(window.layer_cache_name, all_layers);
        }
    }
})();