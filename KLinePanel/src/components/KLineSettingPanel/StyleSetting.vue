<template>
    <teleport to="body">
        <div ref="colorPickerRef" style="display: none;">
            <color-picker :isWidget="true"
                          v-model:pureColor="currentColor">
                <template v-slot:extra>
                    <div style="text-align: right;">
                        <a-button type="link" @click="closeColorPicker">选好了</a-button>
                    </div>
                </template>
            </color-picker>
        </div>
    </teleport>
    <a-form-item
        label="K样式">
        <a-select
            ref="select"
            v-model:value="currentStyle"
            style="width: calc(100% - 60px);margin-right: 5px;"
            :options="stylesOptions"
            @change="handleChangeStyle">
        </a-select>
        <a-button type="link" @click="openStyleModal"><BorderOuterOutlined /></a-button>
    </a-form-item>
    <a-modal v-model:open="styleModalShow" title="K线样式">
        <a-form>
            <a-form-item label="涨-柱子颜色">
                <div @click="e => showColorPicker(e, `currentStyleInfo.value.candle.bar.upColor`)"
                     :style="`margin-left: 20px;background: ${currentStyleInfo.candle.bar.upColor};width: 60px;height: 20px;`"></div>
            </a-form-item>
            <a-form-item label="涨-边框颜色">
                <div @click="e => showColorPicker(e, `currentStyleInfo.value.candle.bar.upBorderColor`)"
                     :style="`margin-left: 20px;background: ${currentStyleInfo.candle.bar.upBorderColor};width: 60px;height: 20px;`"></div>
            </a-form-item>
            <a-form-item label="涨-上线颜色">
                <div @click="e => showColorPicker(e, `currentStyleInfo.value.candle.bar.upWickColor`)"
                     :style="`margin-left: 20px;background: ${currentStyleInfo.candle.bar.upWickColor};width: 60px;height: 20px;`"></div>
            </a-form-item>
            <a-form-item label="跌-柱子颜色">
                <div @click="e => showColorPicker(e, `currentStyleInfo.value.candle.bar.downColor`)"
                     :style="`margin-left: 20px;background: ${currentStyleInfo.candle.bar.downColor};width: 60px;height: 20px;`"></div>
            </a-form-item>
            <a-form-item label="跌-边框颜色">
                <div @click="e => showColorPicker(e, `currentStyleInfo.value.candle.bar.downBorderColor`)"
                     :style="`margin-left: 20px;background: ${currentStyleInfo.candle.bar.downBorderColor};width: 60px;height: 20px;`"></div>
            </a-form-item>
            <a-form-item label="跌-下线颜色">
                <div @click="e => showColorPicker(e, `currentStyleInfo.value.candle.bar.downWickColor`)"
                     :style="`margin-left: 20px;background: ${currentStyleInfo.candle.bar.downWickColor};width: 60px;height: 20px;`"></div>
            </a-form-item>
        </a-form>

        <template v-slot:footer>
            <div style="text-align: right;">
                <a-button type="primary"
                          @click="closeStyleModal">选好了</a-button>
            </div>
        </template>
    </a-modal>
</template>
<script setup lang="ts">
import {
    stylesOptions,
    styles as _style_origin_,
    registerAllStyles
} from "./options/Styles";
let stylesOrigin = _style_origin_;
import {BorderOuterOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";
import {getChart} from "../../utils/chart";
import {registerStyles} from "klinecharts";
// 注册所有样式
registerAllStyles();
// 选择默认样式
const currentStyle = ref("default")
// 样式修改[表单]
const styleModalShow = ref(false);
// 当前在[颜色选取框]中的颜色
const currentColor = ref("red");
// [颜色选择框]的 dom 对象（用于将改对象移动到需要显示的位置）
const colorPickerRef = ref();
// 当前在[颜色选取框]中编辑的颜色的对象字符串（用于定位到获取或保存颜色的对象）
let tmp_color = null;
// 显示[颜色选取框]
function showColorPicker(target, color) {
    tmp_color = color;
    const box = target.currentTarget.getBoundingClientRect();
    currentColor.value = eval(color);
    colorPickerRef.value.style.display = "unset";
    colorPickerRef.value.style.position = "absolute";
    colorPickerRef.value.style.left = `${box.left}px`;
    colorPickerRef.value.style.top = `${box.top}px`;
}
// 关闭[颜色选取框]
function closeColorPicker() {
    colorPickerRef.value.style.display = "none";
    eval(`${tmp_color}="${currentColor.value}"`);
}
function handleChangeStyle() {
    let chart = getChart();
    chart.setStyles(currentStyle.value);
};
// window.colorPickerRef = colorPickerRef;
// 设置当前需要被编辑或保存的样式
const currentStyleInfo = ref({
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
})
// 打开样式[表单]
function openStyleModal() {
    currentStyleInfo.value = stylesOrigin[currentStyle.value].style;
    styleModalShow.value = true;
};
// 关闭样式[表单]
function closeStyleModal() {
    const styleName = `style_name_${(new Date().getTime())}`;
    const styleCopy = Object.assign({}, currentStyleInfo.value);
    registerStyles(styleName, styleCopy);
    stylesOrigin[styleName] = {
        label: styleName,
        style: styleCopy
    };
    stylesOptions.push({
        value: styleName,
        label: styleName,
    });
    currentStyle.value = styleName;
    handleChangeStyle();
}
</script>
