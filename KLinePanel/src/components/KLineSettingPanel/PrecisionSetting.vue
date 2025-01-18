<template>
    <a-form-item
        label="价格精度/Price Precision">
        <a-input-number
            @change="changePrecision"
            v-model:value="price"></a-input-number>
    </a-form-item>
    <a-form-item
        label="量精度/Volume Precision">
        <a-input-number
            @change="changePrecision"
            v-model:value="volume"></a-input-number>
    </a-form-item>
</template>
<script setup lang="ts">
import {
    getChart
} from "./../../utils/chart.js"
import {ref} from "vue";
const price = ref(1);
const volume = ref(1);
function changePrecision() {
    const chart = getChart();
    chart.setPriceVolumePrecision(price.value, volume.value);
}
</script>
