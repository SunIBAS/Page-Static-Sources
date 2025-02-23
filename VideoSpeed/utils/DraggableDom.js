export class DraggableDom {
    static Style = {
        // width: 100px;
        // height: 100px;
        backgroundColor: "lightblue",
        border: "2px solid #4CAF50",
        margin: "10px",
        padding: "10px",
        cursor: "move",
        position: "fixed",
        zIndex: 100000,
        borderRadius: "5px",
    }
    constructor(cache, parentDom = document.body) {
        this.cache = cache;
        this.toggleKey = this.cache.obj.toggleKey;
        this.show = cache.obj.show;
        this.id = `DD_${new Date().getTime()}`;
        this.dom = null;
        this.size = {
            width: 0,
            height: 0,
        };
        this.mark = null;
        if (this.cache.obj.top > window.innerHeight) {
            this.cache.set("top", 0);
        }
        if (this.cache.obj.left > window.innerWidth) {
            this.cache.set("left", 0);
        }
        this.style = {
            ...DraggableDom.Style,
            width: `${cache.obj.width}px`,
            height: `${cache.obj.height}px`,
            top: `${cache.obj.top}px`,
            left: `${cache.obj.left}px`,
            opacity: cache.obj.opacity ? cache.obj.opacity : 1,
            display: cache.obj.show ? 'unset' : 'none',
        };
        this.createDom(parentDom);
        this.dom.id = this.id;
        this.bindEvent();
        setTimeout(() => {
            this.size.width = this.dom.scrollWidth + 20;
            this.size.height = this.dom.scrollHeight + 20;
        }, 500);
    }
    toggleShow(v) {
        if (typeof v === 'boolean') {
            this.show = v;
        } else {
            this.show = !this.show;
        }
        this.dom.style.display = this.show ? 'unset' : 'none';
    }
    getDom() {
        if (this.dom) {
            let dom = this.dom.getElementsByClassName('dom');
            if (dom.length) {
                return dom[0];
            }
        }
        return null;
    }
    createDom(parentDom) {
        // <button accessKey="T" onClick="clickSubmit()">提交按钮</button>
        let btn = document.createElement('button');
        btn.style.display = 'none';
        btn.setAttribute("accessKey", this.toggleKey);
        btn.onclick = () => {
            if (this.dom) {
                this.toggleShow();
            }
        };
        this.mark = document.createElement('div');
        this.mark.style.width = "100vw";
        this.mark.style.height = "100vh";
        this.mark.style.position = "fixed";
        this.mark.style.left = "0";
        this.mark.style.top = "0";
        this.mark.style.display = "none";
        this.mark.style.zIndex = this.style.zIndex - 1;
        this.dom = document.createElement('div');
        this.dom .setAttribute('draggable', "true");
        this.dom.innerHTML = `<div>按下 &lt;ALT+${this.toggleKey}&gt; 可以[隐藏/显示]当前选项框</div><div class="dom"></div>`
        for (let i in this.style) {
            this.dom.style[i] = this.style[i];
        }
        parentDom.append(this.dom);
        parentDom.append(this.mark);
        parentDom.append(btn);
    }
    bindEvent() {
        // JavaScript 代码，实现拖拽功能
        let draggableElement = this.dom;
        let $this = this;
        draggableElement.ondragstart = function(event) {
            event.dataTransfer.setData('text/plain', event.target.id);
            $this.mark.style.display = 'block';
        }
        draggableElement.ondragend = function(event) {
            $this.mark.style.display = 'none';
        }

        document.body.ondragover = function(event) {
            event.preventDefault();
        };

        document.body.ondrop = function(event) {
            event.preventDefault();
            var data = event.dataTransfer.getData('text/plain');
            if (!data) {
                return;
            }
            var draggedElement = document.getElementById(data);

            // 获取鼠标位置
            var mouseX = event.clientX;
            var mouseY = event.clientY;

            // 设置元素的新位置
            draggedElement.style.left = mouseX - draggedElement.offsetWidth / 2 + 'px';
            draggedElement.style.top = mouseY - draggedElement.offsetHeight / 2 + 'px';
            $this.cache.set("top", parseFloat(draggedElement.style.top));
            $this.cache.set("left", parseFloat(draggedElement.style.left));
        };
    }
};