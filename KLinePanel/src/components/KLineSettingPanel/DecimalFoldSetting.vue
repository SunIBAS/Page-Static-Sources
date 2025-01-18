<template>
    <a-form-item
        label="折叠小数点/Decimal Fold">
        <a-checkbox v-model:checked="isFold"></a-checkbox>
    </a-form-item>
</template>

<script setup>
import {
    ref,
    watch
} from "vue";
import {
    getChart
} from './../../utils/chart.js'

const isFold = ref(false);

const subscriptNumbers = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉'
};

watch(isFold, (newVal, oldVal) => {
    const chart = getChart();
    if (newVal) {
        chart.setPrecision({ price: 10 });
        chart.setDecimalFold({
            format: value => {
                const vl = `${value}`;
                const reg = new RegExp('\\.0{3,}[1-9][0-9]*$');
                if (reg.test(vl)) {
                    const result = vl.split('.');
                    const lastIndex = result.length - 1;
                    const v = result[lastIndex];
                    const match = /0*/.exec(v);
                    if (match) {
                        const count = `${match[0].length}`;
                        result[lastIndex] = v.replace(/0*/, `0${count.replace(/\d/, $1 => subscriptNumbers[$1] ?? '')}`);
                        return result.join('.')
                    }
                }
                return vl;
            }
        });
    } else {
        // chart.setPrecision({ price: 10 });
        chart.setDecimalFold({ threshold: 1000 });
    }
})

</script>
