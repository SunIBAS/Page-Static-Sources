# 来源

- [easy-flow](https://github.com/lettersporter/easy-flow)

- 添加了上传和下载 png、svg 三个功能

```html
<!-- 这个是原有的 -->
<el-button type="text" icon="el-icon-download" size="large" @click="downloadData"></el-button>
<!-- 下面三个是新增的 -->
<el-button type="text" icon="el-icon-upload" size="large" @click="uploadData"></el-button>
<el-button type="text" icon="el-icon-Picture" size="large" @click="downloadPng">PNG</el-button>
<el-button type="text" icon="el-icon-Picture" size="large" @click="downloadSvg">SVG</el-button>
```

- 对应上面三个按钮新增的方法

```js
const app = {
    methods: {
        // 从 json 恢复
        uploadData() {
            uploadJson()
                .then(json => {
                    this.dataReload(json);
                });
        },
        downloadPng() {
            toSvg("efContainer", "png");
        },
        downloadSvg() {
            toSvg("efContainer", "svg");
        },
    }
}
```

- 新增的下载 png 和 svg 的方法

```javascript
import './html2canvas.min.js'
import {
    toSvg
} from './toSvg';
```

- toSvg.js

```javascript
import domtoimage from 'dom-to-image';

// type = png / svg
function toSvg(jsPlumbId, type='png') {
    const jsPlumbContainer = document.getElementById(jsPlumbId);

    jsPlumbContainer.style.overflow = "visible"; 
    jsPlumbContainer.style.flex = 'none';
    jsPlumbContainer.style.width = `${jsPlumbContainer.scrollWidth}px`;
    function over() {
        jsPlumbContainer.style.overflow = "scroll";
        jsPlumbContainer.style.flex = 1;
        jsPlumbContainer.style.width = 'unset';
    }
    
    if (type === 'png') {
        // 导出为 PNG
        domtoimage.toPng(jsPlumbContainer)
        .then(function(dataUrl) {
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = 'jsPlumbDiagram.png';
            downloadLink.click();
            over();
        })
        .catch(function(error) {
            console.error('PNG 导出失败:', error);
            over();
        });
    } else {
        // 导出为 SVG
        domtoimage.toSvg(jsPlumbContainer)
        .then(function(dataUrl) {
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = 'jsPlumbDiagram.svg';
            downloadLink.click();
            over();
        })
        .catch(function(error) {
            console.error('SVG 导出失败:', error);
            over();
        });
    }

}

export {
    toSvg
}
```

- [html2canvas.min.js](./html2canvas.min.js)