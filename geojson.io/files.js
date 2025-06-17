window.vectorType = {
    "geojson": "geojson",
    "wkt": "wkt"
}
function dearGeoJSONContent(content) {
    return JSON.parse(content); // 解析 JSON
}
const dearWktContent = (function () {
    let wkt = null;
    return function (content) {
        if (!wkt) {
            wkt = new Wkt.Wkt();
        }
        wkt.read(content);
        return wkt.toObject()
    }
})();
window.vectorDearFunction = {
    [window.vectorType.geojson]: dearGeoJSONContent,
    [window.vectorType.wkt]: dearWktContent
};
function openVector() {
    return new Promise((s, f) => {
        let inp = document.createElement('input');
        inp.setAttribute('accept', ".json,.geojson,.kml,.shp");
        inp.type = 'file'
        inp.style.display = 'none';
        document.body.append(inp);
        inp.addEventListener("change", function(event) {
            const file = event.target.files[0]; // 获取用户选择的文件

            if (!file) {
                return;
            }
            let fname = file.name.toLocaleLowerCase();
            let vt = null;
            if (fname.endsWith('.json') || fname.endsWith('.geojson')) {
                vt = window.vectorType.geojson;
            } else if (fname.endsWith('.wkt')) {
                vt = window.vectorType.wkt;
            }
            if (vt in window.vectorType) {
                return readFileContent(file, window.vectorDearFunction[vt]).then(data => {
                    s({
                        data: data,
                        type: vt
                    })
                }).catch(f);
            } else {
                f("can not found dear function")
            }
        });
        inp.click()
    });
};

function readFileContent(file, dear) {
    return new Promise((s, f) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                s(dear(e.target.result));

            } catch (error) {
                f("JSON 解析失败：" + error.message);
            }
        };
        reader.readAsText(file); // 读取文件内容
    })
}