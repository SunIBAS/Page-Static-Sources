<template>
    <a-modal
        v-model:open="modalShow"
        title="导入数据"
        width="100%"
        wrap-class-name="full-modal"
        :footer="null"
        @close="closeModal">
        <a-input-search
            v-model:value="dataUrl"
            placeholder="数据源路径"
            enter-button
            @search="importFromUrl"/>
        <a-tabs v-model:activeKey="activeKey"
                style="flex: 1;" ref="tabs">
            <a-tab-pane key="1" tab="数据">
                <MonacoEditor lang-type="json" :content="dataContent"
                              :style="{height: `${tabHeight}px`}"></MonacoEditor>
            </a-tab-pane>
            <a-tab-pane key="2" tab="处理" force-render>
                <MonacoEditor lang-type="javascript"
                              ref="dearContentRef"
                              :content="dearContent"
                              :style="{height: `${tabHeight}px`}"></MonacoEditor>
            </a-tab-pane>
            <a-tab-pane key="3" tab="导入到图表">
                <a-button @click="importFromUrl()">重新拉取数据</a-button>
                <a-button @click="importChart()">导入</a-button>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script setup>
import {
    ref,
    watch,
    defineEmits
} from "vue";
import MonacoEditor from "./../MonacoEditor/index.vue"
import {addResizeListener} from "../../utils/windowResize.js";
import {
    showLoading,
    hideLoading
} from "../../utils/Loading.js";

const activeKey = ref("1");
const modalShow = defineModel();
const tabs = ref();
const tabHeight = ref(0);
const dearContentRef = ref();
function closeModal() {
    modalShow.value = false;
};
const dataContent = ref("{}");
const dataUrl = ref("http://localhost:8811/normalGet?url=https%3A%2F%2Ffapi.binance.com%2Ffapi%2Fv1%2Fklines%3Finterval%3D1m%26limit%3D10%26symbol%3DXMRUSDT%26timestamp%3D1736681082109");
function importFromUrl() {
    showLoading();
    fetch(dataUrl.value, {
        method: "get",
    }).then(_ => _.json()).then(_ => {
        dataContent.value = JSON.stringify(_,'','\t');
        hideLoading();
    });
};
const emit = defineEmits(["importChart"])
function importChart() {
    dearContent.value = dearContentRef.value.getEditorValue();
    eval(dearContent.value);
    const datas = window.dearSourceData(JSON.parse(dataContent.value));
    emit("importChart", datas);
    closeModal();
}

const dearContent = ref(`// 最终导出格式
// [{
//     "timestamp": 1517846400000,
//     "open": 7424.6,
//     "high": 7511.3,
//     "low": 6032.3,
//     "close": 7310.1,
//     "volume": 224461
// }]
window.dearSourceData = function(obj) {
    return obj.map(o => {
        return {
            "timestamp": o[0],
            "open": o[1],
            "high": o[2],
            "low": o[3],
            "close": o[4],
            "volume": o[5]
        };
    });
}
`)

function refreshTabHeight() {
    if (tabs && tabs.value && tabs.value.$el) {
        tabHeight.value = window.innerHeight - 166;
    } else {
        setTimeout(refreshTabHeight, 500);
    }
};

addResizeListener(refreshTabHeight)
watch(modalShow, (newVal, oldVal) => {
    if (newVal) {
        refreshTabHeight();
    }
})
</script>

<style lang="less">
.full-modal .ant-modal {
    width: 100%;
    transform-origin: unset;
    margin: 0;
    position: unset;
    padding: 0;
}
.full-modal .ant-modal-content {
    border-radius: unset;
    top: 0;
    margin: 0;
    width: 100vw;
}
.full-modal .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
}
.full-modal .ant-modal-body {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
