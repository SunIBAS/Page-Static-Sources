window.init_toggle_button = function () {
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    const container = document.querySelector('.sidebar');

    toggleSidebarButton.addEventListener('click', () => {
        container.classList.toggle('open');
        setTimeout(() => {
            window.ifr.contentWindow.ec.resize();
        },500);
    });
}
window.jsonData = {};
window.onload = function () {
    window.ifr = window.document.getElementById('ec_iframe');
    init_toggle_button();
    document.getElementById('draw').onclick = function () {
        window.setOption(document.getElementById('text').value);
    };
    document.getElementById('full_screen_draw').onclick = function () {
        localStorage.setItem("option", document.getElementById('text').value);
        window.open('./full_screen.html');
    };
    let addJsonInput = document.getElementById('addJsonInput');
    let jsonDatas = document.getElementById('jsonDatas');
    let jsonObjCount = 0;
    addJsonInput.onchange = function () {
        window.readFileFromInput(this,function (txt, filename) {
            let obj = JSON.parse(txt);
            let dataname = `data_${jsonObjCount}`;
            jsonObjCount++;
            // window.ifr.contentWindow[dataname] = obj;
            window.jsonData[dataname] = obj;
            jsonDatas.innerHTML += `<div id="jsonDatas" style="
    display: inline-block;
"><div><div style="
    line-height: 15px;
    font-size: 15px;
">${filename}</div><div style="
    line-height: 11px;
    font-size: 10px;
">${dataname}</div></div></div>`
        });
    };
    document.getElementById('addJsonBtn').onclick = function () {
        addJsonInput.click();
    };
    // init_ec_dom();
};

window.setOption = function(text) {
    // let ifr = window.document.getElementById('ec_iframe');
    window.ifr.contentWindow.location.reload();
    let id = setInterval(function () {
        if (window.ifr.contentWindow.setOption) {
            clearInterval(id);
            document.getElementById('text').value = text;
            for (let i in window.jsonData) {
                window.ifr.contentWindow[i] = window.jsonData[i];
                // debugger
            }
            try {
                window.ifr.contentWindow.setOption(text);
            } catch (e) {
                console.log(e);
                alert(e);
            }
        }
    }, 500);
};
window.readFileFromInput = function (fileInput, cb) {
    // 获取选定的文件
    const selectedFile = fileInput.files[0];

    // 创建 FileReader 对象
    const reader = new FileReader();

    // 为 FileReader 对象添加事件监听器以在文件加载完成后触发
    reader.onload = function(event) {
        // event.target.result 包含文件内容
        const fileContents = event.target.result;

        // 显示文件内容
        cb(fileContents, fileInput.files[0].name);
    };

    // 以文本格式读取文件内容
    reader.readAsText(selectedFile);
}