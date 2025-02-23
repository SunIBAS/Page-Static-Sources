import {
    registerIndicator
} from "klinecharts"

export function RegisterIndicator() {
    registerIndicator({
        name: "name",
        shortName: "short_name",
        precision: 4,
        calcParams: [
            {
                key: "name_a",
                title: "title_a",
                type: "line",
                indicator: 'close'
            }
        ],
        // 是否需要显示 ohlc(open high low close)柱
        // 看不懂，好像没区别
        shouldOhlc: false,
        // 定义默认的 figures
        figures: [
            {
                key: "name_a",
                title: "title_a",
                type: "line",
                indicator: 'close'
            }
        ],
        // 可以根据 calcParams 定义动态的 figures
        regenerateFigures: calcParams => calcParams.map(c => {
            return {
                key: c.key,
                title: c.title,
                type: c.type,
            }
        }),
        // 和 price 保持相同精度
        series: "price",
        // createTooltipDataSource(params) {
        //     // debugger
        //     let v = params.indicator.result[params.crosshair.realDataIndex];
        //     if (v) {
        //         return {
        //             name: params.indicator.shortName,
        //             calcParamsText: "",
        //             values: params.indicator.figures.map(f => {
        //                 return {
        //                     title: {
        //                         text: f.title,
        //                         color: "blue"
        //                     },
        //                     value: (v && f.key in v ? v[f.key] * 100 : "")
        //                 }
        //             })
        //         }
        //     } else {
        //         return {
        //             name: '',
        //             calcParamsText: "",
        //             values: []
        //         }
        //     }
        // },
        calc(dataList, indicator) {
            // const close = dataList.map(_ => _.close);
            const {
                calcParams,
                // 这里的 figure 可以来自 figure 或 regenerateFigures(calcParams)
                figures,
            } = indicator;
            debugger
            const map = ["open", "close", "low", "high"]
            return dataList.map(dl => {
                // let obj = {};
                // figures.map((fig, idx) => {
                //     obj[fig.key] = (dl[map[idx % 4]] + dl[map[(idx + 1) % 4]]) / 2;
                // });
                // return obj;
                let obj = {};
                calcParams.map((param, idx) => {
                    obj[param.key] = dl[param.indicator];
                });
                return obj;
            })
        }
    })
}
