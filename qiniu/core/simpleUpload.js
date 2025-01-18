const host = "https://upload.qiniup.com/";

class SimpleUpload {
    static upload(file, token, key, fname) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("token", token);
        fd.append("key", key);
        fd.append("fname", fname);
        return fetch(host, {
            method: "post",
            data: fd,
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        });
    }
}