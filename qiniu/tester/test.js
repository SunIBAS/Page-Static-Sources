async function testAuth() {
    // https://developer.qiniu.com/kodo/1201/access-token
    // # 假设有如下的管理请求：
    AccessKey = "jdpei1P9-y6toAf27mlOmPHjlED1xDC97Z5jCT7A".replace(/\n/g, '').trim()
    SecretKey = "c3SKwL0VgmiCfkyO_cLOKj8ybJaCbxFjhL5LMpfu".replace(/\n/g, '').trim()
    // AccessKey = "MY_ACCESS_KEY"
    // SecretKey = "MY_SECRET_KEY"
    // https://portal.qiniu.com/api/kodov2/rsf/list
    qHost = "rs.qiniu.com"
    path = "/list?bucket=ibas"
    url = `http://${qHost}${path}`
    // path = "/move/bmV3ZG9jczpmaW5kX21hbi50eHQ=/bmV3ZG9jczpmaW5kLm1hbi50eHQ="
    // url = `http://${qHost}${path}`
    // method = "POST"
    method = "GET"
    headers = {
        // 'Content-Type': 'application/json', // 根据需要添加其他头部
        // Host:           qHost,
        "Content-Type":   "application/x-www-form-urlencoded",
        "X-Qiniu-Date": new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString().replace(/-/g,'').replace(/:/g,'').split('.')[0] + 'Z',
        // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        // "Accept-Encoding": "gzip",
        // "Referer": "http://localhost:63342/"
    };
    headersStr = []
    for (let i in headers) {
        headersStr.push(`${i}: ${headers[i]}`);
    }
    // #则待签名的原始字符串是：
    signingStr = `${method} ${path}\nHost: ${qHost}\n${headersStr.join('\n')}\n\n`
    // console.log(signingStr)
    // #签名字符串是：
    // sign = "d6e2efb9933a97aa02cd916a909ea8238a053154"
    // 注意：签名结果是二进制数据，此处输出的是每个字节的十六进制表示，以便核对检查。
    // #编码后的签名字符串是：
    // encodedSign = "1uLvuZM6l6oCzZFqkJ6oI4oFMVQ="
    encodedSign = await createHmacSha1(SecretKey, signingStr)
    encodedSign = encodedSign.replace(/[ \n]/g, '')
    // #最终的管理凭证是：
    accessToken = `${AccessKey}:${encodedSign}`;
    headers.Authorization = `Qiniu ${accessToken}`;
    console.log(signingStr)
    console.log(headers)
    fetch(url, {
        method: method, // 或 POST
        // credentials: 'include', // 如果需要带上 cookie
        headers: headers,
    })
}

function toSign(
    method,
    host,
    path,
    headers
) {
    const headersMap = [];
    for (let i in headers) {
        headersMap.push(`${i}: ${headers[i]}`)
    }
    const signingStr = `${method} ${path}\nHost: ${host}\n${headersMap.join('\n')}\n\n`;
    return signingStr
}


function test1() {
    // GET https://rs-z0.qbox.me/stat/aWJhczpmZWF3ZmF3ZQ==
    var accessKey = "jdpei1P9-y6toAf27mlOmPHjlED1xDC97Z5jCT7A"
    var secretKey = "c3SKwL0VgmiCfkyO_cLOKj8ybJaCbxFjhL5LMpfu"
    var host = "rs-z0.qbox.me"
    var path = "/stat/aWJhczpmZWF3ZmF3ZQ=="
    var headers = {
        // "User-Agent": "QiniuGo/7.25.1 (windows; amd64; default) go1.20.5",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Qiniu-Date": "20250118T144501Z",
        // "Authorization": "Qiniu jdpei1P9-y6toAf27mlOmPHjlED1xDC97Z5jCT7A:7E9TLLYMd-1DdijLuW4vE42mVQY="
    }
    var signingStr = toSign("GET", host, path, headers);
    console.log(signingStr)
    createHmacSha1(secretKey, signingStr).then(console.log);
}
test1();

function 注册油猴插件() {
    // ==UserScript==
    // @name         油猴请求
    // @namespace    http://tampermonkey.net/
    // @version      2025-01-18
    // @description  try to take over the world!
    // @author       You
    // @match        http://localhost:63342/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
    // @grant        GM_xmlhttpRequest
    // @grant        unsafeWindow
    // ==/UserScript==

    (function () {
        unsafeWindow.customRequest = GM_xmlhttpRequest;
        console.log("GM_xmlhttpRequest is now accessible as customRequest on window.");
    })();
}
function test2() {
    // GET https://rs-z0.qbox.me/stat/aWJhczpmZWF3ZmF3ZQ==
    var accessKey = "jdpei1P9-y6toAf27mlOmPHjlED1xDC97Z5jCT7A"
    var secretKey = "c3SKwL0VgmiCfkyO_cLOKj8ybJaCbxFjhL5LMpfu"
    var host = "rsf-z0.qbox.me"
    var path = "/list?bucket=ibas&prefix=/name"
    // var path = "/list?bucket=ibas&prefix=keyPrefix"
    var headers = {
        // "User-Agent": "QiniuGo/7.25.1 (windows; amd64; default) go1.20.5",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Qiniu-Date": new Date().toISOString().replace(/-/g,'').replace(/:/g,'').split('.')[0] + 'Z',
        // "Authorization": "Qiniu jdpei1P9-y6toAf27mlOmPHjlED1xDC97Z5jCT7A:7E9TLLYMd-1DdijLuW4vE42mVQY="
    }
    var method = "GET"
    var signingStr = toSign(method, host, path, headers);
    console.log(signingStr)
    createHmacSha1(secretKey, signingStr).then(accessToken => {
        customRequest({
            method: "GET",
            url: `https://${host}${path}`,
            headers: {
                "User-Agen": "QiniuGo/7.25.1 (windows; amd64; default) go1.20.5",
                ...headers,
                "Authorization": `Qiniu ${accessKey}:${accessToken}`
            },
            onload: function (response) {
                console.log("Response:", response.responseText);
            }
        });
    })
}
// test2();

// GET /list?bucket=ibas&prefix=keyPrefix
// Host: rsf-z0.qbox.me
// Content-Type: application/x-www-form-urlencoded
// X-Qiniu-Date: 20250118T150854Z
