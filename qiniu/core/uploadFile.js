// https://developer.qiniu.com/kodo/1312/upload
function uploadFile(token, file, fileKey) {
    const observable = qiniu.upload(
        file,
        fileKey || file.name,
        token,
        undefined,
        {
            checkByMD5: true,
            debugLogLevel: 'INFO',
            // uphost: uphost && uphost.split(',')
        }
    )
    // https://developer.qiniu.com/kodo/1283/javascript
    const next = function (res) {
        const {
            uploadInfo, // 只有分片上传时才返回该字段
            chunks,     // Array<ProgressCompose> 每个 chunk 的上传信息，只有分片上传有此字段
            total,
        } = res;
        // const [{
        //     id, // 上传任务的唯一标识。
        //     url // 上传地址。
        // }] = uploadInfo;
        // const {
        //     size,    // chunk 的尺寸
        //     loaded,  // 已经发送完毕的尺寸
        //     percent, // 进度比例，范围在 0 - 100
        //     fromCache// 是否是来自缓存
        // } = chunks;
        // const {
        //     loaded,  // 已上传大小，单位为字节。
        //     total,   // 本次上传的总量控制信息，单位为字节，注意这里的 total 跟文件大小并不一致。
        //     percent, // 当前上传进度，范围：0～100。
        // } = total;
    };
    const error = function (err) {
        // const {
        //     QiniuError: {
        //         name,   // QiniuErrorName 错误的类型。
        //         message,// string 错误的信息。
        //         stack   // string 调用堆栈信息。
        //     },
        //     QiniuRequestError: {
        //         data,   // any 服务端返回的错误信息，如果不是标准的 json 格式，则该字段为 undefined。
        //         reqId,  // string xhr 请求错误的 X-Reqid。
        //         code,   // number 请求错误状态码，可查阅码值对应 说明。
        //         isRequestError // 固定为 true，不推荐使用，即将废弃。
        //     },
        //     QiniuNetworkError: {
        //         // reqId, // 由于请求可能还未真正发出，所以可能无法收集到 reqId，该字段可能为 ''。
        //     }
        // } = err;
        console.log("error");
        console.log(err);
    };
    const complete = function (res) {
        console.log('complete');
        console.log(res);
    };
    const subscription = observable.subscribe(next, error, complete) // 这样传参形式也可以
}









