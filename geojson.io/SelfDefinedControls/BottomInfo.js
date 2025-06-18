class BottomInfo {
    static UpdateLatLong(dom,e) {
        var n = e.latlng
            , o = n.lng
            , a = n.lat
            , s = "".concat(Math.abs(o).toFixed(5), "°").concat(o >= 0 ? "N" : "S")
            , c = "".concat(Math.abs(a).toFixed(5), "°").concat(a >= 0 ? "E" : "W");
        dom.innerHTML = "Position:".concat(s, "&nbsp;&nbsp;").concat(c)
    }
    constructor(map) {
        this.map = map;
        this.basemap = null;
        this.mapContent = null;
        this.ms = new MapSelector(map,this.setBaseMap.bind(this));
        this.init();
    }
    init() {
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.bottom = 0;
        div.style.width = '100vw';
        div.style.height = '20px';
        div.style.lineHeight = '20px';
        div.style.fontSize = '12px';
        div.style.zIndex = 1000;
        div.style.background = 'rgba(4,15,27,.7)';
        div.style.color = '#5ba5ff';
        div.style.display = 'flex';
        div.style.padding = '0 20px';
        div.style.boxSizing = "border-box";

        // 显示底图信息
        let mapInfoDiv = document.createElement('div');
        mapInfoDiv.style.width = '40px';
        mapInfoDiv.style.paddingRight = '5px';
        mapInfoDiv.style.textAlign = 'center';
        let mapSelection = document.createElement('div');
        let style = `width: 15px;height: 20px;fill: #2196f3;cursor: pointer;`
        mapSelection.innerHTML = `<div style="width: 5px;height: 5px;"></div><svg style="width: 28px;"><path d="M0,12 L14,0 L28,12 L24,12 L14,2 L4,12 L0,12 Z"stroke="black" stroke-width="0" fill="white"></path></svg>`;
        mapSelection.style.height = '31px';
        mapSelection.style.position = 'absolute';
        mapSelection.style.bottom = 0;
        mapSelection.style.width = '40px';
        mapSelection.style.background = '#4d5359';
        mapSelection.style.textAlign = 'center';
        mapSelection.style.borderRadius = '5px 5px 0 0';
        mapInfoDiv.style.cursor = 'zoom-in';
        div.appendChild(mapInfoDiv);
        mapInfoDiv.appendChild(mapSelection);
        // mapInfoDiv.appendChild();
        mapSelection.onclick = () => {
            this.ms.toggle();
        };

        // 显示经纬度
        let latLonDiv = document.createElement('div');
        latLonDiv.style.flex = 1;
        div.appendChild(latLonDiv);

        // 显示缩放比和比例尺
        let scalaDiv = document.createElement('div');
        let scalaDivChildrenText = document.createElement('div');
        let scalaDivChildren = document.createElement('div');
        scalaDiv.style.flex = 1;
        scalaDiv.style.display = 'flex';

        scalaDivChildrenText.style.paddingRight = '5px';
        scalaDivChildren.style.height = '5px';
        scalaDivChildren.style.marginTop = '8px';
        scalaDivChildren.style.borderWidth = '0px 2px 2px 2px';
        scalaDivChildren.style.borderColor = 'white';
        scalaDivChildren.style.borderStyle = 'solid';
        scalaDiv.appendChild(scalaDivChildrenText);
        scalaDiv.appendChild(scalaDivChildren);
        div.appendChild(scalaDiv);

        // 显示 zoom 大小
        let zoomDiv = document.createElement('div');
        zoomDiv.style.flex = 1;
        div.appendChild(zoomDiv);
        document.body.appendChild(div);

        this.mapContent = document.createElement('div');
        this.mapContent.style.flex = 1;
        div.appendChild(this.mapContent);

        if (this.map) {
            // this.ms = new MapSelector(map);
            L.control.scale().addTo(map);
            this.map.on("mousemove", (function(e) {
                BottomInfo.UpdateLatLong(latLonDiv,e);
            }));
            BottomInfo.UpdateLatLong(latLonDiv,{
                latlng: this.map.getCenter()
            });
            let id = setInterval(() => {
                let sl = document.getElementsByClassName('leaflet-control-scale');
                if (sl.length) {
                    clearInterval(id);
                    // sl[0].style.display = 'none';
                    sl[0].parentElement.style.display = 'none';
                    this.map.on('zoomend',() => {
                        scalaDivChildrenText.innerText = sl[0].children[0].innerHTML;
                        scalaDivChildren.style.width = sl[0].children[0].style.width;
                        zoomDiv.innerText = `Zoom : ${this.map.getZoom()}`;
                    });
                    scalaDivChildrenText.innerText = sl[0].children[0].innerHTML;
                    scalaDivChildren.style.width = sl[0].children[0].style.width;
                    zoomDiv.innerText = `Zoom : ${this.map.getZoom()}`;
                }
            },500);
            this.ms.changeLayer(`arcgis`,'WorldImagery')
        }
    }

    setBaseMap(url,attribution) {
        if (this.basemap) {
            this.basemap.remove();
        }
        this.basemap = L.tileLayer(url).addTo(this.map);
        if (attribution) {
            this.mapContent.style.display = 'block';
            this.mapContent.innerHTML = attribution;
            this.basemap.setZIndex(-1);
        } else {
            this.mapContent.style.display = 'none';
        }
        let as = this.mapContent.getElementsByTagName('a');
        for (let i = 0;i < as.length;i++) {
            as[i].style.color = 'white';
            as[i].setAttribute('target','_blank');
        }
        return this;
    }
}

class MapSelector {
    static createLine(text,obj,container,onclick) {
        onclick = onclick || (() => {});
        let line = document.createElement('div');
        line.classList.add('map-selector-line');
        line.innerHTML = text;
        let list = [];
        if ('variants' in obj) {
            for (let i in obj.variants) {
                list.push(i);
            }
        } else {
            list.push('Default');
        }
        line.onmousemove = function() {
            if (window.__tmp__line__) {
                window.__tmp__line__.style.color = 'white';
            }
            window.__tmp__line__ = this;
            container.innerHTML = ``;
            container.innerHTML = list.map(_ => `<div class="map-selector-line" name="${_}">${_}</div>`).join('');
            this.style.color = '#5381f3';
            let ls = container.getElementsByClassName('map-selector-line');
            for (let i = 0;i < ls.length;i++) {
                ls[i].onclick = function() {
                    // console.log(`text = ${text}`);
                    // console.log(`name = ${this.getAttribute('name')}`);
                    // console.log(obj);
                    onclick(text,this.getAttribute('name'));
                }
            }
        }
        return line;
    }
    static maps = {
        Stadia: {
            options: {
                maxZoom: 20,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            },
            variants: {
                AlidadeSmooth: {
                    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
                },
                AlidadeSmoothDark: {
                    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                },
                OSMBright: {
                    url: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png'
                },
                Outdoors: {
                    url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
                }
            }
        },
        USGS: {
            options: {
                maxZoom: 20,
                attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
            },
            variants: {
                USGSTopo: {
                    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}'
                },
                USImagery: {
                    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'
                },
                USImageryTopo: {
                    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}'
                }
            }
        },
        CartoDB: {
            url: 'https://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}{r}.png',
            options: {
                attribution: 'OpenStreetMap &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20,
                variant: 'light_all'
            },
            variants: {
                Positron: 'light_all',
                PositronNoLabels: 'light_nolabels',
                PositronOnlyLabels: 'light_only_labels',
                DarkMatter: 'dark_all',
                DarkMatterNoLabels: 'dark_nolabels',
                DarkMatterOnlyLabels: 'dark_only_labels',
                Voyager: 'rastertiles/voyager',
                VoyagerNoLabels: 'rastertiles/voyager_nolabels',
                VoyagerOnlyLabels: 'rastertiles/voyager_only_labels',
                VoyagerLabelsUnder: 'rastertiles/voyager_labels_under'
            }
        },
        arcgis: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/{variant}/MapServer/tile/{z}/{y}/{x}',
            variants: {
                WorldStreetMap: {
                    options: {
                        variant: 'World_Street_Map',
                        attribution:
                            'Tiles &copy; Esri &mdash; ' +
                            'Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                    }
                },
                DeLorme: {
                    options: {
                        variant: 'Specialty/DeLorme_World_Base_Map',
                        minZoom: 1,
                        maxZoom: 11,
                        attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme'
                    }
                },
                WorldTopoMap: {
                    options: {
                        variant: 'World_Topo_Map',
                        attribution:
                            'Tiles &copy; Esri &mdash; ' +
                            'Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
                    }
                },
                WorldImagery: {
                    options: {
                        variant: 'World_Imagery',
                        attribution:
                            'Tiles &copy; Esri &mdash; ' +
                            'Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    }
                },
                WorldTerrain: {
                    options: {
                        variant: 'World_Terrain_Base',
                        maxZoom: 13,
                        attribution:
                            'Tiles &copy; Esri &mdash; ' +
                            'Source: USGS, Esri, TANA, DeLorme, and NPS'
                    }
                },
                WorldShadedRelief: {
                    options: {
                        variant: 'World_Shaded_Relief',
                        maxZoom: 13,
                        attribution: 'Tiles &copy; Esri &mdash; Source: Esri'
                    }
                },
                WorldPhysical: {
                    options: {
                        variant: 'World_Physical_Map',
                        maxZoom: 8,
                        attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service'
                    }
                },
                OceanBasemap: {
                    options: {
                        variant: 'Ocean_Basemap',
                        maxZoom: 13,
                        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
                    }
                },
                NatGeoWorldMap: {
                    options: {
                        variant: 'NatGeo_World_Map',
                        maxZoom: 16,
                        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
                    }
                },
                WorldGrayCanvas: {
                    options: {
                        variant: 'Canvas/World_Light_Gray_Base',
                        maxZoom: 16,
                        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                    }
                }
            }
        },
        Others: {
            variants: {
                CyclOSM: {
                    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 20,
                        attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: OpenStreetMap'
                    }
                },
                openstreet_france: {
                    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 20,
                        attribution: '&copy; OpenStreetMap France | OpenStreetMap'
                    }
                },
                openstreet_hot: {
                    url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
                    options: {
                        attribution:
                            'OpenStreetMap, ' +
                            'Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> ' +
                            'hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
                    }
                },
                openstreet_de: {
                    url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 18
                    }
                },
                opnvkarte: {
                    url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 18,
                        attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data OpenStreetMap'
                    }
                },
                OpenTopoMap: {
                    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 17,
                        attribution: 'Map data: OpenStreetMap, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    }
                },
                OpenRailwayMap: {
                    url: 'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 19,
                        attribution: 'Map data: OpenStreetMap | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    }
                },
            }
        },
    }
    constructor(map,layerChange) {
        this.map = map;
        this.panel = null;
        this.layerChange = layerChange || (() => {});
        this.status = {
            show: false,
            true: 'flex',
            false: 'none'
        };
        this.init();
    }
    init() {
        let panel = document.createElement('div');
        let panelA = document.createElement('div');
        let panelAContent = document.createElement('div');
        let panelABottom = document.createElement('div');
        let panelB = document.createElement('div');
        this.panel = panel;
        panel.style.display = 'none';
        // panel.style.display = 'flex';
        panel.style.position = 'absolute';
        panel.style.left = '2px';
        panel.style.bottom = '22px';
        panel.style.zIndex = '10000';
        panelA.appendChild(panelAContent);
        panelA.appendChild(panelABottom);
        panelAContent.style.background = 'rgba(0,0,0,0.7)';
        panelAContent.style.padding = '10px';
        panelAContent.style.Width = '120px';
        panelAContent.style.height = '238px';
        panelABottom.style.height = '12px';
        panelABottom.style.width = '120px';
        panelABottom.style.overflow = 'hidden';
        panelABottom.innerHTML = `<svg ><path d="M0,12 L16,12 L16,7 A5,5 0 0,1 21,2 L54,2 A5,5 0 0,1 59,7 L59,12 L120,12 L120,0 L0,0 L0,12 Z" stroke="black" stroke-width="0" fill="rgba(0, 0, 0, 0.7)"></path></svg>`;
        panelB.style.background = 'rgba(0,0,0,0.7)';
        panelB.style.padding = '10px';
        panelB.style.marginLeft = '2px';
        panelB.style.minWidth = '200px';
        for (let i in MapSelector.maps) {
            panelAContent.appendChild(MapSelector.createLine(i,MapSelector.maps[i],panelB,this.changeLayer.bind(this)));
        }

        panel.appendChild(panelA);
        panel.appendChild(panelB);
        document.body.appendChild(panel);
    }
    toggle() {
        this.status.show = !this.status.show;
        this.panel.style.display = this.status[this.status.show];
    }
    changeLayer(providerName,type) {
        let url = '';
        let abstract = '';
        let providers = MapSelector.maps[providerName];
        let variants = providers.variants[type];
        // console.log(providers)
        // console.log(variants)
        if (typeof variants === 'object' && 'url' in variants) {
            url = variants.url;
            if (`options` in variants && `attribution` in variants.options) {
                abstract = variants.options.attribution;
            }
        } else if (typeof variants === 'object' && `options` in variants && 'variant' in variants.options) {
            url = providers.url.replace('{variant}',variants.options.variant);
            abstract = variants.options.attribution;
        } else if (typeof variants === 'string') {
            url = providers.url.replace('{variant}',variants);
        }
        if (`options` in providers && `attribution` in providers.options) {
            abstract = providers.options.attribution;
        }
        // console.log(`url = ${url}`);
        // console.log(`abstract = ${abstract}`);
        this.layerChange(url,abstract);
    }
}