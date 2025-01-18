<template>
    <a-drawer
        v-model:open="modalShow"
        title="设置"
        width="400px"
        @close="closeModal"
        placement="left">
        <LanguageSetting></LanguageSetting>
        <StyleSetting></StyleSetting>
        <PrecisionSetting></PrecisionSetting>
<!--        <DecimalFoldSetting></DecimalFoldSetting>-->
    </a-drawer>
</template>

<script lang="ts" setup>
import StyleSetting from "./StyleSetting.vue";
import LanguageSetting from "./LanguageSetting.vue"
import {defineModel} from "vue";
import PrecisionSetting from "./PrecisionSetting.vue";
// import DecimalFoldSetting from "./DecimalFoldSetting.vue";
const modalShow = defineModel();
function closeModal() {
    modalShow.value = false;
}
</script>

<style scoped>

</style>
