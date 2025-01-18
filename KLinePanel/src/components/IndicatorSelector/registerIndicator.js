import {
    registerIndicator
} from "klinecharts"

export function RegisterIndicator() {
    registerIndicator({
        name: "name",
        shortName: "short_name",
        precision: 4,
        calcParams: [2],
        // 是否需要显示 ohlc(open high low close)柱
        // 看不懂，好像没区别
        shouldOhlc: false,
        // 定义默认的 figures
        figures: [
            {
                key: "name_1",
                title: "title_1:",
                type: "line",
            }
        ],
        // 可以根据 calcParams 定义动态的 figures
        regenerateFigures: calcParams => calcParams.map(c => {
            return {
                key: `name_${c}`,
                title: `title_${c}:`,
                type: "line",
            }
        }),
        // 和 price 保持相同精度
        series: "price",
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
                let obj = {};
                figures.map((fig, idx) => {
                    obj[fig.key] = (dl[map[idx % 4]] + dl[map[(idx + 1) % 4]]) / 2;
                });
                return obj;
            })
        }
    })
}
