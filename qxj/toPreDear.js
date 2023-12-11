const fs = require('fs');
const path = require('path');
const crypto = require('./crypto');
const turf = require('../leaflet/src/turf.min');
const left = require("./left.json");
const allContent = require("./all.content.json");

let basePath = 'D:\\all_code\\Pages\\Page-Static-Sources\\qxj';

let key = fs.readFileSync(path.join(basePath, 'key.txt'), 'utf-8');

function encrypto(text) {
    // let text = 'haha';
    // let key = "oo";
    return crypto.AES.encrypt(text, key).toString();
}

function encryptoGeoJson() {
    function calcInteract(pointGeoJson, polygonGeoJson) {

// 定义你的点矢量集合和面矢量（假设它们都是GeoJSON对象）
        const points = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [1, 1]
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [2, 2]
                    }
                },
                // 添加更多点的Feature
            ]
        };

        const polygons = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    properties: {
                        id: 1
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [0, 0],
                                [0, 3],
                                [3, 3],
                                [3, 0],
                                [0, 0]
                            ]
                        ]
                    }
                },
                // 添加更多面的Feature
            ]
        };

// 创建一个空的结果对象，用于存储点被分组到哪个面中
        const results = {};

// 遍历每个点
        pointGeoJson.features.forEach((pointFeature) => {
            const point = pointFeature.geometry;

            // 遍历每个面
            polygonGeoJson.features.forEach((polygonFeature) => {
                const polygon = polygonFeature.geometry;

                // 使用Turf.js的booleanWithin函数检查点是否在面内
                if (turf.booleanWithin(point, polygon)) {
                    const polygonID = polygonFeature.properties.adcode; // 假设你的面有一个唯一的id属性
                    if (!results[polygonID]) {
                        results[polygonID] = [];
                    }
                    results[polygonID].push(pointFeature);
                }
            });
        });

// 结果将包含每个面ID对应的点集合
//     console.log(results);
        return results;
    }
// testCalcInteract();

    let polygonGeoJSON = JSON.parse(fs.readFileSync('D:\\all_code\\Pages\\Page-Static-Sources\\qxj\\china.geojson', 'utf-8'));
    let dears = [
        {
            file: "A.0012.0004.M002",
        },
        {
            file: "D.0013.0001.M001",
            select: "country"
        },
        {
            file: "E.0009.0001.M001"
        }
    ];
    dears.forEach(dear => {
        if (dear.select === 'country') {
            let obj = JSON.parse(fs.readFileSync(`D:\\all_code\\Pages\\Page-Static-Sources\\qxj\\sourceGeojson/${dear.file}.geojson`, 'utf-8'));
            let ret = calcInteract(obj, polygonGeoJSON);
            for (let i in ret) {
                ret[i] = encrypto(JSON.stringify(ret[i]));
            }
            // ret.select = 'country';
            fs.writeFileSync(`D:\\all_code\\Pages\\Page-Static-Sources\\qxj\\geojson/${dear.file}.json`, JSON.stringify(ret), 'utf-8');
        } else {
            let ret = encrypto(fs.readFileSync(`D:\\all_code\\Pages\\Page-Static-Sources\\qxj\\sourceGeojson/${dear.file}.geojson`, 'utf-8'));
            fs.writeFileSync(`D:\\all_code\\Pages\\Page-Static-Sources\\qxj\\geojson/${dear.file}.json`, JSON.stringify(ret), 'utf-8');
        }
    });
}

function encryptoMenus() {
    let left = require('./left.json');
    let enLeft = [];
    for (let i = 0;i < left.length;i++) {
        enLeft.push({
            "title": encrypto(left[i].title),
            "content": encrypto(JSON.stringify(left[i].content))
        });
    }
    fs.writeFileSync(path.join(basePath, './datas/enLeft.json'), JSON.stringify(enLeft), 'utf-8');

    let allContent = require('./all.content.json');
    let enAllContent = {};
    for (let i in allContent) {
        enAllContent[i] = {
            p1: encrypto(JSON.stringify(allContent[i].p1)),
            p3: encrypto(JSON.stringify(allContent[i].p3)),
            p4: encrypto(JSON.stringify(allContent[i].p4)),
        }
    }
    fs.writeFileSync(path.join(basePath, './datas/en.all.content.json'), JSON.stringify(enAllContent), 'utf-8');
}

function encryptoApi() {
    let left = require('./apis/apiLeft.json');
    let enLeft = [];
    for (let i = 0;i < left.length;i++) {
        enLeft.push({
            "title": encrypto(left[i].title),
            "content": encrypto(JSON.stringify(left[i].content))
        });
    }
    fs.writeFileSync(path.join(basePath, './apis/en.apiLeft.json'), JSON.stringify(enLeft), 'utf-8');

    let allContent = require('./apis/apis.json');
    let enAllContent = {};
    for (let i in allContent) {
        enAllContent[i] = {
            info: encrypto(JSON.stringify(allContent[i].info)),
            params: encrypto(JSON.stringify(allContent[i].params)),
        }
    }
    fs.writeFileSync(path.join(basePath, './apis/en.apis.json'), JSON.stringify(enAllContent), 'utf-8');
}
encryptoApi();