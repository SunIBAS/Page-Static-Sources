function addInfo(map) {
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this._div.style.background = 'white';
        this._div.style.padding = '5px';
        this.update();
        return this._div;
    };

// method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        let html = '';
        for (let i in props) {
            html += `<b>${i}</b>: ${props[i]}<br>`;
        }
        this._div.innerHTML = '<div style="font-size: 20px;font-weight: bold;">Information</div>' + html;
    };
    info.addTo(map);
    return info;
}

class MarkerManager {
    constructor(map) {
        this.map = map;
        this.marks = [];
        this.info = addInfo(map);
    }
    clear() {
        this.marks.forEach(m => m.remove());
        this.marks = [];
    }
    addMarker(x, y, objs) {
        var marker = L.marker([x, y]).addTo(this.map);
        // var marker = L.circle([x, y], {
        //     color: 'red',
        //     fillColor: '#f03',
        //     fillOpacity: 0.5,
        //     radius: 500
        // }).addTo(map);
        marker.on('mouseover', (function (objs, marker) {
            window.marker = marker;
            this.info.update(objs);
            marker._icon.style.background = 'black';
        }).bind(this, objs, marker));
        marker.on('mouseout', (function (objs, marker) {
            marker._icon.style.background = 'none';
        }).bind(this, objs, marker));
        this.marks.push(marker);
    }
}