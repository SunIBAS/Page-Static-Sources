function checkWindow() {
    if (typeof window !== "undefined") {
        // 浏览器环境
        console.log("Running in a browser");
        return window === parent.window;
    } else if (typeof global !== "undefined") {
        // Node.js环境
        console.log("Running in Node.js");
        return true;
    }
};
let clickDomOnce = (function (){
    let onceMap = {};
    return (selector, key) => {
        if (key in onceMap) {
            return;
        }
        onceMap[key] = true;
        let id = setInterval(() => {
            let d = selector();
            if (d.length) {
                d[0].click();
                clearInterval(id);
                delete onceMap[key];
            }
        }, 500);
    };
})()
/**
 * @param group = {group: "", action: [{name: "", action() {}}, {name: "", action() {}}]}
 * @return [ { group: "", name: "", action() {} }, { group: "", name: "", action() {} },  ]
 */
let buildGroupAction = (group) => {
    return group.action.map(a => {
        return {
            group: group.name,
            ...a,
        }
    });
};

const Reg = {
    Float: /^[0-9]+.[0-9]+$/,
    Int: /^[0-9]+$/,
};
const NumberDear = {
    toNumberFloat(r, dv) {
        r = parseFloat(r.toString());
        return Reg.Float.test(r.toFixed(1)) ? r : (dv||0);
    },
    toNumberInt(r, dv) {
        r = parseInt(r.toString());
        return Reg.Int.test(r) ? r : (dv||0);
    }
};

export {
    checkWindow,
    clickDomOnce,
    buildGroupAction,
    NumberDear
}