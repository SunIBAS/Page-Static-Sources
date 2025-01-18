<template>
    <a-form-item
        label="语言/Language">
        <a-select
            ref="select"
            v-model:value="currentLanguage"
            style="width: 100%"
            :options="language"
            @change="handleChangeLanguage">
        </a-select>
    </a-form-item>
</template>

<script setup lang="ts">

import {
    language,
    registerAllLocale
} from "./options/Locale.js"
import {
    getChart
} from "./../../utils/chart.js"
import {
    defineModel,
    ref
} from 'vue'
registerAllLocale();

const currentLanguage = ref("en-US")
function handleChangeLanguage() {
    let chart = getChart();
    chart.setLocale(currentLanguage.value);
}

</script>
