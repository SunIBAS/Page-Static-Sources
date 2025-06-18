function customExport(group) {
    const features = [];
    let hasCirle = false;

    group.eachLayer(layer => {
        let feature = layer.toGeoJSON();

        if (layer instanceof L.Circle) {
            // 手动加入 radius 到 properties
            feature.properties = feature.properties || {};
            feature.properties._radius = layer.getRadius(); // 单位是米
            feature.properties._type = "circle";
            hasCirle = true;
        }

        features.push(feature);
    });

    return {
        geojson: {
            type: "FeatureCollection",
            features: features
        },
        hasCirle: hasCirle,
    };
}


class DrawFeature {
    constructor(map, whenOpenDrawer=()=>{}) {
        this.map = map;
        this.drawControl = null;
        this.drawItems = null;
        this.features = [
            // {
            //     id: id,
            //     feature: feature,
            // }
        ];
        this.currentEditId = null;
        this.whenOpenDrawer = whenOpenDrawer;
        // this._init_drawer_();
    }
    addFeature(feature, id) {
        this.features = [
            {
                id: id,
                feature: feature,
            }
        ];
    }
    createFeature() {}
    removeFeature(id) {}

    toDraw(id) {
        let selectFeature = this.features.filter(feature => feature.id === id);
        if (selectFeature.length) {
            this.currentEditId = id;
            this._init_drawer_(selectFeature[0].feature);
        }
    }

    getDrawObj() {
        let opt = {};
        for (let key in this.drawItems._layers) {
            opt = this.drawItems._layers[key].options;
            break;
        }
        return {
            geojson: customExport(this.drawItems).geojson,
            options: opt,
        }
    }

    toCreate() {
        this.currentEditId = null;
        this._init_drawer_()
    }

    stopDrawing() {
        if (this.drawControl) {
            this.map.removeControl(this.drawControl);
            this.drawControl = null;
        }
    }

    _init_drawer_(feature) {
        this.whenOpenDrawer();
        if (this.drawControl) {
            this.map.removeControl(this.drawControl);
        }
        if (this.drawItems) {
            this.map.removeLayer(this.drawItems);
        }
        this.drawItems = L.featureGroup();
        this.drawItems.addTo(this.map);
        let $drawItems = this.drawItems;

        if (feature) {
            this.map.removeLayer(feature);
            feature.eachLayer(function (layer) {
                $drawItems.addLayer(layer);
            });
        }

        this.drawControl = new L.Control.Draw({
            edit: {
                featureGroup: this.drawItems,
                poly: {
                    allowIntersection: false
                }
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true
                }
            }
        });
        map.addControl(this.drawControl);
        map.on(L.Draw.Event.CREATED, function (event) {
            var layer = event.layer;
            $drawItems.addLayer(layer);
            console.log(event);
        });

        if (feature) {
            document.querySelector('.leaflet-draw-edit-edit').click()
        }
    }
}