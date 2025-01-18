import {
    registerLocale
} from "klinecharts"

let registerAllLocale = () => {
    registerAllLocale = () => {};
    registerLocale('ru-RU', {
        time: 'Время: ',
        open: 'Открой.: ',
        high: 'Высокий: ',
        low: 'Низкий: ',
        close: 'Б: ',
        volume: 'Объем: '
    })
    registerLocale("en-US", {
        time: 'Time: ',
        open: 'Open: ',
        high: 'High: ',
        low: 'Low: ',
        close: 'Close: ',
        volume: 'Vol: '
    })
    registerLocale("zh-CN", {
        time: '时: ',
        open: '开: ',
        high: '高: ',
        low: '低: ',
        close: '收: ',
        volume: '量: '
    })
};

export {
    registerAllLocale
}
export const language = [
    {
        label: "English",
        value: "en-US"
    },
    {
        label: "中文",
        value: "zh-CN"
    },
    {
        label: "ru",
        value: "ru-RU"
    }
]
