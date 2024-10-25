// https://cn.tradingview.com/chart/dkIO7LpR/?symbol=TVC%3ANI225
let result = [];
let preResult = [];
let codes = [
    {
        code: "6758",
        title: "索尼集团",
        weight: 5.08
    },
    {
        code: "8306",
        title: "三菱日联金融",
        weight: 4.84
    },
    {
        code: "6902",
        title: "DENSO",
        weight: 3.80
    },
    {
        code: "4063",
        title: "Shin-Etsu Chemical",
        weight: 3.69
    },
    {
        code: "SMFG",
        title: "SMFG",
        weight: 3.47
    },
    {
        code: "8766",
        title: "Tokio Marine",
        weight: 3.45
    },
    {
        code: "8001",
        title: "ITOCHU",
        weight: 3.42
    },
    {
        code: "9432",
        title: "日本电报电话",
        weight: 3.17
    },
    {
        code: "5108",
        title: "BRIDGESTONE",
        weight: 2.75
    },
    {
        code: "8591",
        title: "ORIX",
        weight: 2.52
    },
].map((code,ind) => {
    result.push(`(price${ind} * weight${ind})`);
    preResult.push(`security(symbol${ind}, "D", close[1]) * weight${ind}`)
    return `symbol${ind} = input("${code.code}", title="${code.title}")
weight${ind} = input(${code.weight / 100}, title="${code.title} 权重")
price${ind} = security(symbol${ind}, "D", close)`;
});

let R = (`
// This Pine Script™ code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © usefulFlamingo90927
//@version=4
study("Custom Indicator", shorttitle="CI", overlay=true)

${codes.join('\r\n')}

// 计算叠加值
overlay_value = ${result.join(' + ')}
prev_overlay_value = ${preResult.join(' + ')}

// 绘制叠加值
plot(overlay_value, title="叠加值", color=color.blue )

// 计算变化率
change_ratio = (overlay_value - prev_overlay_value) / prev_overlay_value

// 绘制变化率
plot(change_ratio, title="变化率", color=color.green, style=plot.style_histogram)

`);

const fs = require('fs');

fs.writeFileSync('./script.rtx', R, 'utf-8')
