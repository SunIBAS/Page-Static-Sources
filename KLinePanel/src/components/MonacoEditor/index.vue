<template>
    <div ref="editor"></div>
</template>

<script setup>
import {
    ref,
    onMounted,
    defineProps,
    watch,
    defineExpose
} from "vue"
// import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js"
import * as monaco from "monaco-editor"
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution'
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
//@ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
//@ts-ignore

import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
//@ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
//@ts-ignore
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
//@ts-ignore
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
const editor = ref();

const {
    langType,
    theme,
    content
} = defineProps({
    langType: {
        default: "javascript",
    },
    theme: {
        default: "vs-dark",
    },
    content: {
        default: ""
    }
})

// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        if (label === 'json') return new JsonWorker()
        if (label === 'css') return new CssWorker()
        if (label === 'html') return new HtmlWorker()
        return new EditorWorker()
    }
}
let editorObj = null;
onMounted(() => {
    // editor.value.id = "editor";
    editorObj = monaco.editor.create(editor.value, {
        value: content, // `const foo = () => 0;`,
        language: langType, // 'javascript',
        theme: theme,// 'vs-dark',
        automaticLayout: true,
        scrollBeyondLastLine: false,
    });
    window.editor = editorObj;
})
defineExpose({
    getEditorValue() {
        return editorObj.getValue();
    }
});
watch(() => content, (value) => {
    if (editorObj) {
        editorObj.setValue(value);
    }
})
</script>
