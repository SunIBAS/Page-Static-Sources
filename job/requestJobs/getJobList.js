const https = require('https');
const fs = require('fs');
const {
    TableColumnDefined,
    Sqlite,
    InitSqlJs
} = require('./../Sqlite/SealSqlite')

url = page => `https://www.gaoxiaojob.com/job/home-list?areaId=1964&currentPage=${page}`;

/**
 * 发送 HTTP GET 请求
 * @param {string} url - 请求的 URL
 */
function httpGetRequest(url) {
    return new Promise((s, f) => {
        const request = https.request(url, { method: 'GET' }, (response) => {
            let body = '';
            // 监听数据事件
            response.on('data', (chunk) => {
                body += chunk.toString();
            });
            // 监听结束事件
            response.on('end', () => {
                // callback(null, body);
                s(body);
            });
            // 监听错误事件
            response.on('error', (err) => {
                // callback(err, null);
                f(err);
            });
        });
        // 监听请求错误事件
        request.on('error', (err) => {
            // callback(err, null);
            f(err);
        });
        // 发送请求
        request.end();
    })
};

// httpGetRequest(url(1)).then(console.log)
let targetPage = 100;
let currentPage = 1;
let req = (function (targetPage) {
    let currentPage = 1;
    let requesting = false;
    let rets = [];
    targetPage += 1;
    return {
        req: function () {
            if (requesting) {
                return true;
            } else {
                if (currentPage === targetPage) {
                    return false;
                } else {
                    requesting = true;
                    console.log(`${currentPage} / ${targetPage}`);
                    httpGetRequest(url(currentPage)).then(ret => JSON.parse(ret).data.list)
                        .then(ret => {
                            // console.log(ret);
                            currentPage++;
                            requesting = false;
                            rets = rets.concat(...ret);
                        });
                    return true;
                }
            }
        },
        result() {
            return rets;
        }
    }
})(targetPage);

InitSqlJs("D:\\all_code\\Pages\\Page-Static-Sources\\job\\requestJobs\\jobs.db").then(db => {
    let obj = {"jobId":790009,"status":1,"jobName":"电子商务专任老师","companyId":81051,"minWage":7000,"maxWage":10000,"wageType":1,"experienceType":0,"educationType":3,"amount":"若干","jobCategoryId":33,"welfareTag":"4,9,16,37,114,103","provinceId":1964,"cityId":2011,"companyName":"广东东软学院——高校人才网直荐","companyType":2,"companyNature":2,"releaseTime":"12-04","refreshTime":"2023-12-10 02:05:00","applyType":1,"applyAddress":"gddrxy2023@163.com","announcementId":167174,"deliveryWay":2,"majorId":119,"isMiniapp":1,"isEstablishment":2,"isCooperation":2,"companyLogo":"https://img.gaoxiaojob.com/uploads/company_logo/20231205144834_29957.jpg","wage":"0.7-1万/月","announcementName":"急聘！广东东软学院2023硕士教师招聘公告","templateId":1,"experience":"","education":"硕士研究生","jobCategory":"专职教师/教学科研岗","welfareTagArr":["提供住房公寓","周末双休"],"areaName":"广东-佛山","city":"佛山","companyTypeName":"普通本科院校","companyNatureName":"民营（私营）","jobRecord":"工商管理","applyStatus":2,"userEmail":"","isEmailApply":2,"shortRefreshTime":"12-10","refreshDate":"12-10","url":"/job/detail/790009.html","companyUrl":"/company/detail/81051.html","announcementUrl":"/announcement/detail/167174.html","isFast":2,"isTop":2};
    let table = db.createTableByObj(obj, "objs", new TableColumnDefined("jobId", TableColumnDefined.TableColumnType.Integer(), true, TableColumnDefined.SourceType.Number, false));
    db.insertObj(obj, table);

    // sq.insertObj(obj, table);
    let id = setInterval(function () {
        if (!req.req()) {
            clearInterval(id);
            console.log("over");
            let records = req.result();
            records.forEach((ret,ind) => {
                console.log(`${ind} / ${records.length}`);
                db.insertObj(ret, table);
            });
            // console.log(req.result());
        }
    });
});

// let id = setInterval(function () {
//     if (!req.req()) {
//         clearInterval(id);
//         console.log("over");
//         console.log(req.result());
//     }
// });