<template>
    <a-drawer
        v-model:open="modalShow"
        class="editor_code_custom_class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        title="编辑指标函数"
        width="800px"
        @close="closeModal"
        placement="left">
        <a-form>
            <a-form-item label="指标代码 (英文)">
                <a-input v-model="indicatorName"></a-input>
            </a-form-item>
            <a-form-item label="显示名称 (英文)">
                <a-input v-model="indicatorLabel"></a-input>
            </a-form-item>
            <a-form-item label="默认参数 (数组)">
                <a-input></a-input>
            </a-form-item>
            <a-form-item label="操作">
                <a-space wrap>
                    <a-button type="primary">重新生成默认代码</a-button>
                    <a-button type="primary" @click="refreshTabHeight">自适应编辑器大小</a-button>
                </a-space>
            </a-form-item>
            <a-form-item label="处理函数">
                <MonacoEditor lang-type="json" :content="codeContent"
                              :style="{height: `${codeEditorHeight}px`}"></MonacoEditor>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script setup lang="ts">
import {defineModel, ref, watch } from "vue"
// @ts-ignore
import MonacoEditor from "./../../MonacoEditor/index.vue"
// @ts-ignore
import {addResizeListener} from "../../../utils/windowResize";
const modalShow = defineModel();
function closeModal() {
    modalShow.value = false;
};
const indicatorName = ref("")
const indicatorLabel = ref("")
const indicatorParams = ref("")

const indicatorConfig = {
    name: "name",
    shortName: "short_name",
    // precision: 4,
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
}

const codeContent = ref("");
const codeEditorHeight = ref(0);
function refreshTabHeight() {
    let dom = document.getElementsByClassName('editor_code_custom_class');
    if (dom.length) {
        const body = dom[0].getElementsByClassName('ant-drawer-body')[0];
        codeEditorHeight.value = body.clientHeight - (32 + 24) * 4 - 24 * 3;
    } else {
        setTimeout(refreshTabHeight, 500);
    }
};

addResizeListener(refreshTabHeight)
watch(modalShow, (newVal) => {
    if (newVal) {
        refreshTabHeight();
    }
})
</script>

