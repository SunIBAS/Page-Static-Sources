# 知网验证码跳过

```javascript
function loadImage2Canvas(img) {
    const canvas = document.createElement('canvas');
    canvas.height = img.height;
    canvas.width = img.width;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    return {
        canvas,
        ctx,
        imageData: ctx.getImageData(0, 0, img.width, img.height)
    };
};

function findWhiteAndCount(can) {
    var height = can.canvas.height;
    var width = can.canvas.width;
    var defaultX = 4;
    var defaultY = 0;
    for (let h = 0;h < height;h++) {
        var index = (h * width + defaultX) * 4;
        var r = can.imageData.data[index];
        var g = can.imageData.data[index + 1];
        var b = can.imageData.data[index + 2];
        var a = can.imageData.data[index + 3];
        if (r === 255 && g === 255 && b === 255 && a === 255) {
            defaultY = h;
            break;
        }
    }
    var whiteCount = 0;
    for (let w = 0;w < width;w++) {
        var index = (defaultY * width + w) * 4;
        var r = can.imageData.data[index];
        var g = can.imageData.data[index + 1];
        var b = can.imageData.data[index + 2];
        var a = can.imageData.data[index + 3];
        if (r === 255 && g === 255 && b === 255 && a === 255) {
            whiteCount++;
        }
    }
    return {
        height: defaultY,
        whiteCount,
        width,
    }
}

function findPix(can, obj) {
    var width = can.canvas.width;
    var forWidth = width - obj.width;
    var pixel = -1;
    for (var i = 0;i < forWidth;i++) {
        var index = (obj.height * width + i) * 4;
        var r = can.imageData.data[index];
        var g = can.imageData.data[index + 1];
        var b = can.imageData.data[index + 2];
        var a = can.imageData.data[index + 3];
        var whiteCount = 1;
        if (r === 255 && g === 255 && b === 255 && a === 255) {
            for (var j = 1;j < obj.width;j++) {
                var index = (obj.height * width + i + j) * 4;
                var r = can.imageData.data[index];
                var g = can.imageData.data[index + 1];
                var b = can.imageData.data[index + 2];
                var a = can.imageData.data[index + 3];
                if (r === 255 && g === 255 && b === 255 && a === 255) {
                    whiteCount++;
                }
            }
            if (whiteCount >= obj.whiteCount) {
                console.log(`pixel = ${i}`);
                pixel = i;
                break;
            }
        }
    }
    return pixel;
}

function all() {
    let block = loadImage2Canvas(document.getElementsByClassName('imgBlock')[0]);
    let full = loadImage2Canvas(document.getElementsByClassName('verify-img-panel')[0].childNodes[0]);
    let obj = findWhiteAndCount(block);
    console.log(obj);
    obj.whiteCount -= 5;
    var pixel = findPix(full, obj);
    console.log(`all pixel = ${pixel}`);
    toMove(document.getElementsByClassName('imgBlock')[0], pixel + obj.width);
}

// 模拟鼠标事件的函数
function simulateMouseEvent(element, eventType, clientX, clientY) {
    const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        clientX: clientX,
        clientY: clientY,
    });
    element.dispatchEvent(event);
}
function toMove(dom, xmove) {
    // let dom = document.getElementsByClassName('imgBlock')[0];
    const rectA = dom.getBoundingClientRect();
    const startX = rectA.left + rectA.width / 2;
    const startY = rectA.top + rectA.height / 2;
    const targetX = startX + xmove;
    const targetY = startY;
    // 1. 模拟鼠标按下在 A 上
    simulateMouseEvent(dom, 'mousedown', startX, startY);

    // 2. 模拟鼠标移动到 B 的位置
    simulateMouseEvent(document, 'mousemove', targetX, targetY);

    // 3. 模拟鼠标释放
    simulateMouseEvent(document, 'mouseup', targetX, targetY);
}

setTimeout(() => {
    let id = setInterval(() => {
        let dom = document.getElementsByClassName('imgBlock')[0];
        if (dom) {
            all();
        } else {
            // 判断是否好了
            if (document.body.innerText.includes("验证成功") || document.body.innerText.includes("null")) {
                console.log("over");
                clearInterval(id);
                window.close();
            }
        }
    }, 5000);
}, 10000);
```