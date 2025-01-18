import { init, registerLocale } from 'klinecharts'

const chart_id = "chart_id_001"
export function initChart(domId) {
    window[chart_id] = init(domId);
    return window[chart_id];
}

export function getChart() {
    return window[chart_id];
}
