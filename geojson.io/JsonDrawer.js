// jsonDrawer.js

const JsonDrawer = (() => {
    let drawer, overlay, jsonInput, errorMessage, saveCallback;

    let validName = ['json']

    function createDrawerElements(name, cb) {
        if (!validName.includes(name)) {
            throw "name is required";
        }
        if (document.getElementById("jsonDrawer")) return cb();

        // 创建样式
        const style = document.createElement("style");
        style.innerHTML = `
      #jsonDrawerOverlay {
        position: fixed;
        top: 0; right: 0; bottom: 0; left: 0;
        background: rgba(0,0,0,0.4);
        display: none;
        z-index: 999;
      }
      #jsonDrawer {
        position: fixed;
        top: 0; right: -400px;
        width: 400px; height: 100%;
        background: #fff;
        box-shadow: -2px 0 10px rgba(0,0,0,0.2);
        padding: 20px;
        box-sizing: border-box;
        transition: right 0.3s ease;
        z-index: 1000;
        display: flex;
        flex-direction: column;
      }
      #jsonDrawer.open {
        right: 0;
      }
      #jsonDrawer textarea {
        width: 100%; 
        flex: 1;
        resize: vertical;
        font-family: monospace;
        font-size: 14px;
      }
      #jsonDrawer .actions {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
      }
      #jsonDrawer .error {
        color: red;
        margin-top: 10px;
        font-size: 12px;
      }
    `;
        document.head.appendChild(style);

        // 创建 HTML 元素
        overlay = document.createElement("div");
        overlay.id = "jsonDrawerOverlay";
        overlay.onclick = closeDrawer;

        drawer = document.createElement("div");
        drawer.id = "jsonDrawer";
        drawer.innerHTML = `
      <h3>编辑 JSON / WKT </h3>
      <textarea id="jsonDrawerInput" placeholder="{ }"></textarea>
      <div class="error" id="jsonDrawerError"></div>
      <div class="actions">
        <button id="jsonDrawerSaveBtn">保存</button>
        <button onclick="JsonDrawer.close()">关闭</button>
      </div>
    `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        jsonInput = document.getElementById("jsonDrawerInput");
        errorMessage = document.getElementById("jsonDrawerError");

        document.getElementById("jsonDrawerSaveBtn").onclick = () => {
            try {
                const obj = jsonInput.value;
                errorMessage.textContent = "";
                if (typeof saveCallback === "function") {
                    saveCallback(obj);
                }
                closeDrawer();
            } catch (e) {
                errorMessage.textContent = "无效的 JSON：" + e.message;
            }
        };
        window.editor = CodeMirror.fromTextArea(jsonInput, {
            mode: "application/json",    //实现groovy代码高亮
            // mode: "text/x-java", //实现Java代码高亮
            lineNumbers: true,	//显示行号
            theme: "dracula",	//设置主题
            lineWrapping: true,	//代码折叠
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            matchBrackets: true,	//括号匹配
            //readOnly: true,        //只读
        });
        setTimeout(() => {
            cb();
        });
    }

    function openDrawer(initialData = {}, onSave = null, name='json') {
        createDrawerElements(name, () => {
            jsonInput.value = JSON.stringify(initialData || {}, null, 2);
            errorMessage.textContent = "";
            drawer.classList.add("open");
            overlay.style.display = "block";
            saveCallback = onSave;
            window.editor.setSize('100%', '100%');     //设置代码框的长宽
        });
    }

    function closeDrawer() {
        if (drawer) drawer.classList.remove("open");
        if (overlay) overlay.style.display = "none";
    }

    return {
        initDrawer: ({ initialData = {}, onSave = null, name = "json" } = {}) =>
            openDrawer(initialData, onSave, name),
        close: closeDrawer,
    };
})();
