function pasteFromClipboard() {
    return navigator.clipboard.readText().then(text => {
        for (let i in vectorDearFunction) {
            let fail = false;
            let obj = null;
            try {
                obj = vectorDearFunction[i](text);
            } catch (e) {
                fail = true;
            }
            if (!fail) {
                return ({
                    type: i,
                    data: obj,
                })
            }
        }
        Toast("无法解析粘贴内容")
        return {type: null}
    }).catch(e => {
        console.error(e);
        Toast(e)
    });
};