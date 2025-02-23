<template>
    <a-drawer
        :maskStyle="{background: '#00000020'}"
        v-model:open="modalShow"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        title="设置"
        width="400px"
        @close="closeModal"
        placement="left">
        <a-button type="link" @click="editorModalShow=true">添加指标</a-button>
        <IndicatorEditor v-model="editorModalShow"></IndicatorEditor>
        <!-- 弹窗组件 -->
        <a-modal v-model:open="settingModalVisible">
            <SettingModal v-model:item="currentItem" @close="settingModalVisible=false"/>
        </a-modal>
        <a-divider></a-divider>
        <a-list item-layout="horizontal" :data-source="data">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #title>
                            {{ item.title }}
                            <a-button type="link" @click="setIndicator(item)">设置</a-button>
                        </template>
                        <template #description>
                            <div v-html="item.description"></div>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>

<script lang="ts" setup>
import IndicatorEditor from "./IndicatorEditor/index.vue"
import SettingModal from './SettingModal/index.vue'
import {
    defineModel,
    ref
} from 'vue'
import {
    RegisterIndicator
} from "./registerIndicator"
RegisterIndicator();
const editorModalShow = ref(false);
const modalShow = defineModel();
const settingModalVisible = ref(false);
function closeModal() {
    modalShow.value = false;
};
interface DataItem {
    id: string,
    title: string;
    description: string;
    params: object[]
}
const currentItem = ref<DataItem>();
const data: DataItem[] = [
    {
        id: 'default_macd',
        title: 'MACD',
        description: "<a target='_blank' href='https://github.com/klinecharts/KLineChart/blob/main/src/extension/indicator/movingAverageConvergenceDivergence.ts'>文档</a>",
        params: [
            {
                name: "快线移动平均",
                value: 12,
            },
            {
                name: "慢线移动平均",
                value: 26,
            },
            {
                name: "移动平均",
                value: 9,
            },
        ]
    },
    // {
    //     title: 'Ant Design Title 2',
    //     description: "Ant Design xxxxx",
    // },
    // {
    //     title: 'Ant Design Title 3',
    //     description: "Ant Design aaaaaaa",
    // },
    // {
    //     title: 'Ant Design Title 4',
    //     description: "Ant Design dqwdqwdqwdqdwaaaa",
    // },
];
const setIndicator = function(item: DataItem) {
    console.log(item);
    currentItem.value = item;
    settingModalVisible.value = true;
    // window.chart.createIndicator({
    //     name: item.title,
    //     params: item.params.map(_=>_.value)
    // });
};
</script>

<style>
.list-item-title {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #9C27B0;
    color: white;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
}
</style>
