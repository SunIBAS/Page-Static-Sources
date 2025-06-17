window.Toast = (function() {
    let toast = document.createElement('div');
    let style = document.createElement('style');
    toast.classList.add('toast');
    style.innerHTML = `        .toast {
            margin-top: 10px;
            position: fixed;
            /*top: -50px; !* 初始位置在上方 *!*/
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: transform 0.5s ease-out, opacity 0.5s ease-out;
            z-index: 2000;
        }
        .toast.show {
            /*top: 50px; !* 向下移动 *!*/
            opacity: 1;
        }
        .toast.hide {
            /*top: -50px;*/
            opacity: 0;
        }`;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    return function (text) {
        // const toast = document.getElementById("toast");
        toast.classList.add("show");
        toast.innerHTML = text;

        if (window.showToastId) {
            clearTimeout(window.showToastId);
        }
        if (window.hideToastId) {
            clearTimeout(window.hideToastId);
        }
        // 3秒后隐藏
        window.showToastId = setTimeout(() => {
            toast.classList.add("hide");
            window.hideToastId = setTimeout(() => {
                toast.classList.remove("show", "hide");
            }, 500); // 等待动画完成后移除类
        }, 3000);
    }
})();