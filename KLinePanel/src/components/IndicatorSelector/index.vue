<template>
    <a-drawer
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
        <a-divider></a-divider>
        <a-list item-layout="horizontal" :data-source="data">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #avatar>
                            <div style="display: grid;">
                                <a-button type="link">导入</a-button>
                                <a-button type="link">修改</a-button>
                            </div>
                        </template>
                        <template #title>
                            {{ item.title }}
                        </template>
                        <template #description>
                            {{ item.description }}
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>

<script lang="ts" setup>
import IndicatorEditor from "./IndicatorEditor/index.vue"
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
function closeModal() {
    modalShow.value = false;
};
interface DataItem {
    title: string;
    description: string
}
const data: DataItem[] = [
    {
        title: 'Ant Design Title 1',
        description: "Ant Design",
    },
    {
        title: 'Ant Design Title 2',
        description: "Ant Design xxxxx",
    },
    {
        title: 'Ant Design Title 3',
        description: "Ant Design aaaaaaa",
    },
    {
        title: 'Ant Design Title 4',
        description: "Ant Design dqwdqwdqwdqdwaaaa",
    },
];
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
