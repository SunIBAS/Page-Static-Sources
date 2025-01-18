window.onload = function () {
    // 创建地图
    window.map = L.map('map',{
        dragging: false // 禁用拖动
    }).setView([40.54720023441049, 86.04492187500001], 5);
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map);

    // 创建不同的图层
    fetch('./geojson/china.json').then(_=>_.json()).then(json => {
        var china = L.geoJSON(json, {
            style: function(feature) {
                switch (feature.properties.party) {
                    case 'Republican': return {color: "#ff0000"};
                    case 'Democrat':   return {color: "#0000ff"};
                }
            }
        });
        fetch('./geojson/xinjiang.json').then(_=>_.json()).then(json => {
            var xinjiang = L.geoJSON(json, {
                style: function(feature) {
                    switch (feature.properties.party) {
                        case 'Republican': return {color: "#ff0000"};
                        case 'Democrat':   return {color: "#0000ff"};
                    }
                }
            });

            var layers = [
                china, xinjiang
            ]

            // 在不同缩放级别切换图层
            map.on('zoomend', function () {
                // map.panTo([40.54720023441049, 86.04492187500001]);
                var currentZoom = map.getZoom();

                if (currentZoom >= 5) {
                    layers.map(_ => _.remove());
                    xinjiang.addTo(map);
                } else {
                    layers.map(_ => _.remove());
                    china.addTo(map);
                }
            });
            xinjiang.addTo(map);
        });
    });

    let mm = new MarkerManager(map);
    mm.addMarker(43.9406,81.3264,{"Admin_Code_CHN": "654021", "Station_Id_C": "51431", "Lat": "43.9406", "Lon": "81.3264", "Alti": "662.5", "UPDATE_TIME": "2021-12-29 11:18:57", "Year": "2020", "Mon": "1", "Day": "23", "Hour": "12", "SVWC": "999999", "SRHU": "999999", "SWWC": "999999", "SVMS": "999999", "Q_SVWC": "9", "Q_SRHU": "9", "Q_SWWC": "9", "Q_SVMS": "9"});
};