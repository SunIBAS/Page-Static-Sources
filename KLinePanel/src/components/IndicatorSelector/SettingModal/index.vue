<template>
    <div class="setting-modal">
        <h2>{{ item.title }}</h2>
        <a-form :model="item" layout="vertical">
            <a-divider orientation="left">参数设置</a-divider>
            <a-form-item v-for="(param, index) in item.params" :key="index">
                <label>{{ param.name }}</label>
                <a-input-number
                    v-model:value="param.value"
                    style="width: 100%"
                />
            </a-form-item>
        </a-form>

        <div class="modal-footer">
            <a-button @click="$emit('close')">取消</a-button>
            <a-button type="primary" @click="handleSave">保存设置</a-button>
        </div>
    </div>
</template>

<script setup>
import {onMounted, watch} from "vue";

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

// 接收事件用于关闭弹窗
const emits = defineEmits(['close', 'save']);

// 存储当前的params数据以便检测变化
let prevParams;

// 深拷贝函数
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 初始化时的参数备份
onMounted(() => {
    prevParams = deepCopy(props.item.params);
});

// 监听 params 的变化，如果发生变化，则标记为已修改
watch(() => props.item.params, (newVal, oldVal) => {
    if (!deepEqual(newVal, oldVal)) {
        // 如果有变化，触发保存事件
        emits('save', newVal);
    }
});

// 保存设置
const handleSave = () => {
    const newParams = deepCopy(props.item.params);
    const settingKey = props.item.id;
    localStorage.setItem(settingKey, JSON.stringify(newParams));
};
</script>
