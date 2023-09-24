var create_nonce = (function () {
    let words = '0123456789asdfghjklqwertyuiopzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let len = [8,4,4,4,12];
    let total_len = words.length;
    let get_c = function() {
        return words[parseInt(Math.random() * total_len)];
    };
    return function() {
        return len.map(l => {
            let chs = [];
            for (let i = 0;i < l;i++) chs.push(get_c());
            return chs.join('');
        }).join('-');
    }
})();
// 数据描述 P1
// dataClassId: A.0029.0005.M001
// url: http://10.185.90.120:28298/MMD/api/rest/new/portal/coremeta/mCode
// nonce: e0fc26af-b60c-4191-9378-0e031b4f660e
// timestamp: 1695202097363
// sign: AFC865959027653797AAD108B98D95E6
function buildReqP1Url(dataClassId) {
    let url = "http://10.185.90.120:28298/MMD/api/rest/new/portal/coremeta/mCode";
    let nonce = create_nonce();
    let timestamp = new Date().getTime();
    let str = [
        `dataClassId=${dataClassId}`,
        `nonce=${nonce}`,
        `timestamp=${timestamp}`,
        `url=${url}`,
    ].join('&');
    str += '&sign=' + jQuery.md5(str).toUpperCase();
    let link = `http://10.185.64.50:8088/cmadaas/extHttp/doGet.action?${str}`;
    return fetch(link, {method: 'get'}).then(_=>_.json());
}
// buildReqP4Url(ret.DS[0].dataCode).then(ret => window.ret = ret)
// 服务描述 P3
// interfaceId: getDataListByDDataId
// userId: api_manager
// dDataId: A.0029.0004.M001
// url: http://10.185.90.120:28008/cmadaas/music/api
// nonce: f5887e6c-a3e6-4802-943f-db7420895b25
// timestamp: 1695204166678
// sign: 0A34BDCF5B798BCD4AB0E624BB7765F1
function buildReqP3Url(dDataId) {
    let interfaceId = "getDataListByDDataId";
    let userId = "api_manager";
    let url = "http://10.185.90.120:28008/cmadaas/music/api";
    let nonce = create_nonce();
    let timestamp = new Date().getTime();
    let str = [
        `dDataId=${dDataId}`,
        `interfaceId=${interfaceId}`,
        `nonce=${nonce}`,
        `timestamp=${timestamp}`,
        `url=${url}`,
        `userId=${userId}`,
    ].join('&');
    str += '&sign=' + jQuery.md5(str).toUpperCase();
    let link = `http://10.185.64.50:8088/cmadaas/extHttp/doGet.action?${str}`;
    return fetch(link, {method: 'get'}).then(_=>_.json());
}


// 要素列表 P4
// interfaceId: getDataEleByDataCode
// userId: api_manager
// dataCode: SURF_CHN_MON_MMUT_19812010
// url: http://10.185.90.120:28008/cmadaas/music/api
// nonce: 5d186d5a-c679-447b-b762-6d8f8f331d49
// timestamp: 1695204166759
// sign: 8EA2FF40249252BA2B8B18F3F637527F
function buildReqP4Url(dataCode) {
    let interfaceId = "getDataEleByDataCode";
    let userId = "api_manager";
    let url = "http://10.185.90.120:28008/cmadaas/music/api";
    let nonce = create_nonce();
    let timestamp = new Date().getTime();
    let str = [
        `dataCode=${dataCode}`,
        `interfaceId=${interfaceId}`,
        `nonce=${nonce}`,
        `timestamp=${timestamp}`,
        `url=${url}`,
        `userId=${userId}`,
    ].join('&');
    str += '&sign=' + jQuery.md5(str).toUpperCase();
    let link = `http://10.185.64.50:8088/cmadaas/extHttp/doGet.action?${str}`;
    return fetch(link, {method: 'get'}).then(_=>_.json());
};

var runPromiseByArray = (promise, arr) => {
    let doing = false;
    return new Promise(s => {
        let id = setInterval(() => {
            if (!doing) {
                doing = true;
                if (arr.length) {
                    let obj = arr.pop();
                    promise(obj)
                        .then(() => {
                            doing = false;
                        });
                } else {
                    clearInterval(id);
                    s();
                }
            }
        }, 500);
    });
};
window.all = {};
function onePromise(dDataId) {
    return buildReqP1Url(dDataId).then(ret_1 => {
        window.all[dDataId] = {
            p1: ret_1,
            p4: []
        };
        return buildReqP3Url(dDataId).then(ret_3 => {
            window.all[dDataId].p3 = ret_3;
            if (ret_3.DS && ret_3.DS.length) {
                return runPromiseByArray(code => {
                    return buildReqP4Url(code).then(ret_4 => {
                        window.all[dDataId].p4.push(ret_4);
                        return true;
                    });
                }, ret_3.DS.map(_=>_.dataCode));
            } else {
                return true;
            }
        });
    });
};
runPromiseByArray(onePromise, objs).then(() => console.log('over'));