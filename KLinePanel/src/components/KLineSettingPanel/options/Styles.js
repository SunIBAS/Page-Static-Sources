import { registerStyles } from 'klinecharts';

const styles = {
    test: {
        label: "测试",
        style: {
            candle: {
                bar: {
                    upColor: '#72f65f',
                    upBorderColor: '#813211',
                    upWickColor: '#a6de1b',
                    downColor: '#f86c70', // 柱子颜色
                    downBorderColor: '#0509ff', // 边框颜色
                    downWickColor: '#ec24ea', // 下跌线颜色
                }
            }
        }
    },
    default: {
        label: "默认",
        style: {
            candle: {
                bar: {
                    upColor: '#2b821d',
                    upBorderColor: '#2b821d',
                    upWickColor: '#2b821d',
                    downColor: '#c12e34',
                    downBorderColor: '#c12e34',
                    downWickColor: '#c12e34',
                }
            }
        }
    },
    defaultEmp: {
        label: "默认-增强",
        style: {
            candle: {
                bar: {
                    upColor: '#b3e747',
                    upBorderColor: '#b3e747',
                    upWickColor: '#b3e747',
                    downColor: '#e826cf',
                    downBorderColor: '#e826cf',
                    downWickColor: '#e826cf',
                }
            }
        }
    },
    bGreenSRed: {
        label: "涨绿跌红",
        style: {
            candle: {
                bar: {
                    upColor: '#c12e34',
                    upBorderColor: '#c12e34',
                    upWickColor: '#c12e34',
                    downColor: '#2b821d',
                    downBorderColor: '#2b821d',
                    downWickColor: '#2b821d',
                }
            }
        }
    },
    bGreenSRedEmp: {
        label: "涨绿跌红-增强",
        style: {
            candle: {
                bar: {
                    upColor: '#e826cf',
                    upBorderColor: '#e826cf',
                    upWickColor: '#e826cf',
                    downColor: '#b3e747',
                    downBorderColor: '#b3e747',
                    downWickColor: '#b3e747',
                }
            }
        }
    }
};

let registerAllStyles = () => {
    registerAllStyles = () => {};
    for (let i in styles) {
        registerStyles(i, styles[i].style);
    }
};

const stylesOptions = (() => {
    const obj = [];
    for (let i in styles) {
        obj.push({
            value: i,
            label: styles[i].label
        });
    }
    return obj;
})();

export {
    registerAllStyles,
    stylesOptions,
    styles,
}
