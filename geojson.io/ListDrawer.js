// listDrawer.js

const ListDrawer = (() => {
    let drawer, overlay, listContainer, titleElem;

    function createDrawerElements() {
        if (document.getElementById("listDrawer")) return;

        const style = document.createElement("style");
        style.innerHTML = `
      #listDrawerOverlay {
        position: fixed;
        top: 0; right: 0; bottom: 0; left: 0;
        background: rgba(0,0,0,0.4);
        display: none;
        z-index: 999;
      }
      #listDrawer {
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
      #listDrawer.open {
        right: 0;
      }
      #listDrawer h3 {
        margin-top: 0;
      }
      .list-item {
        padding: 10px;
        border: 1px solid #ddd;
        margin: 8px 0;
        border-radius: 6px;
      }
      .list-item-header {
        font-weight: bold;
        margin-bottom: 6px;
      }
      .list-item-buttons {
        display: flex;
        gap: 10px;
      }
      .list-item-buttons button {
        flex: 1;
        padding: 6px;
        cursor: pointer;
        border-radius: 4px;
        border: none;
      }
      .btn-select {
        background-color: #4CAF50;
        color: white;
      }
      .btn-delete {
        background-color: #f44336;
        color: white;
      }
      .list-actions {
        margin-top: auto;
        text-align: right;
      }
    `;
        document.head.appendChild(style);

        overlay = document.createElement("div");
        overlay.id = "listDrawerOverlay";
        overlay.onclick = closeDrawer;

        drawer = document.createElement("div");
        drawer.id = "listDrawer";
        drawer.innerHTML = `
      <h3 id="listDrawerTitle">列表</h3>
      <div id="listDrawerContent"></div>
      <div class="list-actions">
        <button onclick="ListDrawer.close()">关闭</button>
      </div>
    `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        titleElem = document.getElementById("listDrawerTitle");
        listContainer = document.getElementById("listDrawerContent");
    }

    function openDrawer({ title = "列表", items = [], onSelect = null, onDelete = null }) {
        createDrawerElements();

        titleElem.textContent = title;
        listContainer.innerHTML = "";

        items.forEach((item, index) => {
            const wrapper = document.createElement("div");
            wrapper.className = "list-item";

            const header = document.createElement("div");
            header.className = "list-item-header";
            header.textContent = item.name || `Item ${index + 1}`;

            const btnGroup = document.createElement("div");
            btnGroup.className = "list-item-buttons";

            const btnSelect = document.createElement("button");
            btnSelect.className = "btn-select";
            btnSelect.textContent = "选择";
            btnSelect.onclick = () => {
                if (typeof onSelect === "function") {
                    onSelect(item, index);
                }
            };

            const btnDelete = document.createElement("button");
            btnDelete.className = "btn-delete";
            btnDelete.textContent = "删除";
            btnDelete.onclick = () => {
                if (typeof onDelete === "function") {
                    onDelete(item, index);
                }
            };

            btnGroup.appendChild(btnSelect);
            btnGroup.appendChild(btnDelete);

            wrapper.appendChild(header);
            wrapper.appendChild(btnGroup);
            listContainer.appendChild(wrapper);
        });

        drawer.classList.add("open");
        overlay.style.display = "block";
    }

    function closeDrawer() {
        drawer.classList.remove("open");
        overlay.style.display = "none";
    }

    return {
        initDrawer: openDrawer,
        close: closeDrawer,
    };
})();
