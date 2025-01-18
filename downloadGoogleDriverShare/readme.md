# 下载分享的谷歌云盘数据

- [测试数据](https://www.gloh2o.org/mswx/)

> 具体流程一：打开一个未登录的 Chrome 窗口

![img.png](./imgs/openNewChromeWin.png)

> 具体流程二：设置下载位置

![img.png](./imgs/setDownload.png)

> 具体流程三：配置下载脚本

1. 打开链接
2. 打开开发者模式
3. 刷新页面
4. 在 ```network``` 中筛选 ```items:list```
5. 选择第一个有 ```{;}``` 图标的请求
6. 找到下图的 ```6``` 个参数 (url、k43、next、x-Google-Drive-Client-Version、x-Goog-Ext-...-Jspb、X-Goog-FileIdmask)

![img.png](./imgs/openLink.png)

![img.png](./imgs/params.png)

```javascript
var config = {
    headers: {
        "x-goog-fieldmask": "items(parent,modified_date_millis,modified_by_me_date_millis,last_viewed_by_me_date_millis,file_size,owner(id,focus_user_id,is_me,type),shortcut_details(target_id,target_mime_type,target_lookup_status),last_modifying_user(id,focus_user_id,is_me,type),has_thumbnail,thumbnail_version,title,mime_type,id,resource_key,shared,shared_with_me_date_millis,capabilities(can_copy_non_authoritative,can_download_non_authoritative,can_copy,can_download,can_edit,can_add_children,can_delete,can_remove_children,can_share,can_trash,can_rename,can_read_team_drive,can_move_team_drive_item),user_role,explicitly_trashed,quota_bytes_used,starred,file_extension,sharing_user(id,focus_user_id,is_me,type),spaces,trashed,restricted,version,viewed,team_drive_id,has_own_permissions,create_date_millis,trashing_user(id,focus_user_id,is_me,type),trashed_date_millis),continuation_token,search_response_metadata(incomplete_search,moonshine_item_ids,query_suggestions(spell_response,nlp_response))",
        "x-goog-ext-472780938-jspb": "W1sxMDIsMCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwxLFsiQ05pV2pNcUxpSW9ERlVtUE9Ra2RPYzR5Q2ciLCIwODc2MDk2Ny1GQUVCLTRFN0YtOUIzRS03REZGRkE5MDU0QjUiXSxudWxsLFsyXV1d",
        "X-Goog-Drive-Client-Version": "drive.web-frontend_20241124.18_p0",
    },
    k43: "10WzUuhijtSt-nQU2vlFaKfa-32ADzg1V",
    url: "https://drivefrontend-pa.clients6.google.com/v1/items:list?key=AIzaSyC1qbk75NzWBvSaDh6KnsjjA9pIrP4lYIE",
    next: "~!!~AI9FV7RivN09ih3eweeeDsbTv_yoJOYjoU1gH1Apzb1pRQFmt3hGH8yEXhDSU1aeK1lgI2aLZZggV4KWlOfNocDZz4Xr_TVbvxHvn9hQlLKVyH_iLjf-TLeRrzyyw9qpmJDac2opJTArGHnA4G1Ei-ckEvLpd0FBLoITff2YxFwBKU0gihLdb_7Fa_scVUINWT7n7bU24nbHU7L8T3AD63WZqgC_Juag9Gigyb3ayv6vR8CQadTvfagVKDMMd7hFO3h7NkMzj0QRORf0_hk2tl0bSVTZASu32-JEBFqouMyGAUIJfIbOWb2cRqLtWiyFtJe_Vfd05J7Z",
};
// 自动更新为下一个请求 token
var nOne = config.next;
function getBody(nOne) {
    return `[[null,null,null,null,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,[4,1,1],null,null,null,null,null,null,null,null,null,null,[[1]],null,null,null,null,null,null,null,[["${config.k43}"]]],[1000,"${nOne||''}"]]`
};
// 用于自动结束下载（下载请求是一个环形请求）
var keys = [];
var headers = {
    ...config.headers,
    "content-type": "application/json+protobuf",
    "accept-language": "zh-CN",
    "x-goog-authuser": "0"
};

/**
 * @param content 要保存的内容
 * @param filename 文件名
 */
var funDownload = function (content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

window.running = false;
window.rid = null;
function toFetch() {
    return fetch(config.url,{
        method: 'post',
        credentials: "include",
        body: getBody(nOne),
        headers: headers,
    }).then(_=>_.json()).then(ret => {
        // localStorage.setItem(`dr_${new Date().getTime()}`, JSON.stringify(ret[0]));
        funDownload(JSON.stringify(ret[0]));
        nOne = ret[1];
        if (!keys.length) {
            // build keys
            keys = ret[0].map(_=>_[0]);
        } else {
            // check keys
            let cKeys = ret[0].map(_=>_[0]);
            let repeat = false;
            cKeys.forEach(k => repeat |= keys.includes(k));
            if (repeat) {
                clearInterval(window.rid);
                console.log("感觉结束了");
                return;
            }
        }
        window.running = false;
        window.fetch_result = ret;
    });
}

window.rid = setInterval(() => {
    if (window.running) return;
    window.running = true;
    toFetch();
}, 1000);
```

> 具体流程四：生成下载脚本

```javascript
const fs = require('fs');
const path = require('path');
const basePath = 'c:\\xx\\xx\\xx'; // 下载文件位置
const basePathName = path.basename(basePath);

const pythonPath = "E:\\ProgramData\\anaconda3\\python.exe" // python3 路径
const bats = [];
const keys = [];
fs.readdirSync(basePath).forEach(filename => {
    if (filename.endsWith('.txt')) {
        const contentJson = JSON.parse(fs.readFileSync(path.join(basePath, filename), 'utf-8'));
        contentJson.forEach(f => {
            if (keys.includes(f[0])) return;
            keys.push(f[0]);
            bats.push(`if not exist ${f[2]} "${pythonPath}" test_dl.py -id=${f[0]} -fn=${f[2]}`);
        })
    }
});
fs.writeFileSync(`dl_${basePathName}.bat`, bats.join('\r\n'), 'utf-8');
```

> 具体流程五：开始下载

1. 将下面 python 保存为 dl.py 文件
2. 将生成的 bat 文件和 dl.py 放到空文件夹中
3. 点击 bat 文件开始下载

```python
#!/usr/bin/env python
from __future__ import unicode_literals
import os
import re
import sys
import unicodedata
import argparse
import logging
from contextlib import contextmanager
from datetime import datetime, timedelta

try:
    # Python3
    from urllib.request import Request, build_opener, HTTPCookieProcessor
    from html.parser import HTMLParser
    from http.cookiejar import CookieJar
except ImportError:
    # Python2
    from HTMLParser import HTMLParser
    from urllib2 import Request, build_opener, HTTPCookieProcessor
    from cookielib import CookieJar

try:
    from html import unescape
except ImportError:
    html = HTMLParser()
    unescape = html.unescape

ITEM_URL = "https://drive.google.com/open?id={id}"
FILE_URL = "https://drive.usercontent.google.com/download?id={id}&export=download&authuser=0"
FOLDER_URL = "https://drive.google.com/embeddedfolderview?id={id}#list"
CHUNKSIZE = 64 * 1024
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"

ID_PATTERNS = [
    re.compile("/file/d/([0-9A-Za-z_-]{10,})(?:/|$)", re.IGNORECASE),
    re.compile("/folders/([0-9A-Za-z_-]{10,})(?:/|$)", re.IGNORECASE),
    re.compile("id=([0-9A-Za-z_-]{10,})(?:&|$)", re.IGNORECASE),
    re.compile("([0-9A-Za-z_-]{10,})", re.IGNORECASE),
]
FOLDER_PATTERN = re.compile(
    '<a href="(https://drive.google.com/.*?)".*?<div class="flip-entry-title">(.*?)</div>.*?<div class="flip-entry-last-modified"><div>(.*?)</div>',
    re.DOTALL | re.IGNORECASE,
)
CONFIRM_PATTERNS = [
    re.compile(b"confirm=([0-9A-Za-z_-]+)", re.IGNORECASE),
    re.compile(b"name=\"confirm\"\\s+value=\"([0-9A-Za-z_-]+)\"", re.IGNORECASE),
]
UUID_PATTERN = re.compile(b"name=\"uuid\"\\s+value=\"([0-9A-Za-z_-]+)\"", re.IGNORECASE)

FILENAME_PATTERN = re.compile('filename="(.*?)"', re.IGNORECASE)


def output(text):
    try:
        sys.stdout.write(text)
    except UnicodeEncodeError:
        sys.stdout.write(text.encode("utf8"))


# Big thanks to leo_wallentin for below sanitize function (modified slightly for this script)
# https://gitlab.com/jplusplus/sanitize-filename/-/blob/master/sanitize_filename/sanitize_filename.py
def sanitize(filename):
    blacklist = ["\\", "/", ":", "*", "?", '"', "<", ">", "|", "\0"]
    reserved = [
        "CON",
        "PRN",
        "AUX",
        "NUL",
        "COM1",
        "COM2",
        "COM3",
        "COM4",
        "COM5",
        "COM6",
        "COM7",
        "COM8",
        "COM9",
        "LPT1",
        "LPT2",
        "LPT3",
        "LPT4",
        "LPT5",
        "LPT6",
        "LPT7",
        "LPT8",
        "LPT9",
    ]

    filename = unescape(filename).encode("utf8").decode("utf8")
    filename = unicodedata.normalize("NFKD", filename)

    filename = "".join(c for c in filename if c not in blacklist)
    filename = "".join(c for c in filename if 31 < ord(c))
    filename = filename.rstrip(". ")
    filename = filename.strip()

    if all([x == "." for x in filename]):
        filename = "_" + filename
    if filename in reserved:
        filename = "_" + filename
    if len(filename) == 0:
        filename = "_"
    if len(filename) > 255:
        parts = re.split(r"/|\\", filename)[-1].split(".")
        if len(parts) > 1:
            ext = "." + parts.pop()
            filename = filename[: -len(ext)]
        else:
            ext = ""
        if filename == "":
            filename = "_"
        if len(ext) > 254:
            ext = ext[254:]
        maxl = 255 - len(ext)
        filename = filename[:maxl]
        filename = filename + ext
        filename = filename.rstrip(". ")
        if len(filename) == 0:
            filename = "_"

    return filename


def url_to_id(url):
    for pattern in ID_PATTERNS:
        match = pattern.search(url)
        if match:
            return match.group(1)


class GDriveDL(object):
    def __init__(self, quiet=False, overwrite=False, mtimes=False, continue_on_errors=False):
        self._quiet = quiet
        self._overwrite = overwrite
        self._mtimes = mtimes
        self._continue_on_errors = continue_on_errors
        self._create_empty_dirs = True
        self._opener = build_opener(HTTPCookieProcessor(CookieJar()))
        self._processed = []
        self._errors = []

    def _error(self, message):
        logging.error(message)
        self._errors.append(message)
        if not self._continue_on_errors:
            sys.exit(1)

    @property
    def errors(self):
        return self._errors

    @contextmanager
    def _request(self, url):
        logging.debug("Requesting: {}".format(url))
        req = Request(url, headers={"User-Agent": USER_AGENT})

        f = self._opener.open(req)
        try:
            yield f
        finally:
            f.close()

    def _get_modified(self, modified):
        if not modified or not self._mtimes:
            return None

        try:
            if ":" in modified:
                hour, minute = modified.lower().split(":")
                if "pm" in minute:
                    hour = int(hour) + 12
                hour = int(hour)+7  # modified is UTC-7 so +7 to utc time
                minute = minute.split(" ")[0]
                now = datetime.utcnow().replace(hour=0, minute=int(minute), second=0, microsecond=0)
                modified = now + timedelta(hours=hour)
            elif "/" in modified:
                modified = datetime.strptime(modified, "%m/%d/%y")
            else:
                now = datetime.utcnow()
                modified = datetime.strptime(modified, "%b %d")
                modified = modified.replace(year=now.year)
        except:
            logging.debug("Failed to convert mtime: {}".format(modified))
            return None

        return int((modified - datetime(1970, 1, 1)).total_seconds())

    def _set_modified(self, file_path, timestamp):
        if not timestamp:
            return

        try:
            os.utime(file_path, (timestamp, timestamp))
        except:
            logging.debug("Failed to set mtime")

    def _exists(self, file_path, modified):
        if self._overwrite or not os.path.exists(file_path):
            return False

        if modified:
            try:
                return int(os.path.getmtime(file_path)) == modified
            except:
                logging.debug("Failed to get mtime")

        return True

    def process_file(self, id, directory, verbose=True, filename=None, modified=None, confirm="", uuid=""):
        file_path = None
        modified_ts = self._get_modified(modified)

        if filename:
            file_path = (
                filename
                if os.path.isabs(filename)
                else os.path.join(directory, filename)
            )
            if self._exists(file_path, modified_ts):
                print("{file_path} [Exists]".format(file_path=file_path))
                return

        url = FILE_URL.format(id=id)
        if confirm:
            url += '&confirm={}'.format(confirm)
        if uuid:
            url += '&uuid={}'.format(uuid)

        logging.debug("Requesting: {}".format(url))
        with self._request(url) as resp:
            if "ServiceLogin" in resp.url:
                self._error("{}: does not have link sharing enabled".format(id))
                return

            if verbose:
                headers = "\n".join(["{}: {}".format(h, resp.headers.get(h)) for h in resp.headers])
                logging.debug("Headers:\n{}".format(headers))

            content_disposition = resp.headers.get("content-disposition")
            if not content_disposition:
                if confirm:
                    # The content-disposition header is an indication that the download confirmation worked
                    self._error("{}: content-disposition not found and confirm={} did not work".format(id, confirm))
                    return

                html = resp.read(CHUNKSIZE)
                if verbose:
                    logging.debug("HTML:\n{}".format(html))

                if b"Google Drive - Quota exceeded" in html:
                    self._error("{}: Quota exceeded for this file".format(id))
                    return

                for pattern in CONFIRM_PATTERNS:
                    confirm = pattern.search(html)
                    if confirm:
                        break

                uuid = UUID_PATTERN.search(html)
                uuid = uuid.group(1).decode() if uuid else ''

                if confirm:
                    confirm = confirm.group(1).decode()
                    logging.debug("Found confirmation '{}', trying it".format(confirm))
                    return self.process_file(
                        id, directory, verbose, filename=filename, modified=modified, confirm=confirm, uuid=uuid
                    )
                else:
                    logging.debug("Trying confirmation 't' as a last resort")
                    return self.process_file(
                        id, directory, verbose, filename=filename, modified=modified, confirm='t', uuid=uuid
                    )

            if not file_path:
                filename = FILENAME_PATTERN.search(content_disposition).group(1)
                file_path = os.path.join(directory, sanitize(filename))
                if self._exists(file_path, modified_ts):
                    logging.info("{file_path} [Exists]".format(file_path=file_path))
                    return

            directory = os.path.dirname(file_path)
            if not os.path.exists(directory):
                os.makedirs(directory)
                logging.info(
                    "Directory: {directory} [Created]".format(directory=directory)
                )

            try:
                with open(file_path, "wb") as f:
                    dl = 0
                    last_out = 0
                    while True:
                        chunk = resp.read(CHUNKSIZE)
                        if not chunk:
                            break

                        if (
                            b"Too many users have viewed or downloaded this file recently"
                            in chunk
                        ):
                            self._error("{}: Quota exceeded for this file".format(id))
                            return

                        dl += len(chunk)
                        f.write(chunk)
                        if not self._quiet and (
                            not last_out or dl - last_out > 1048576
                        ):
                            output(
                                "\r{} {:.2f}MB".format(
                                    file_path,
                                    dl / 1024 / 1024,
                                )
                            )
                            last_out = dl
                            sys.stdout.flush()
            except:
                if os.path.exists(file_path):
                    os.remove(file_path)
                raise
            else:
                self._set_modified(file_path, modified_ts)

        if not self._quiet:
            output("\n")


def main(args=None):
    parser = argparse.ArgumentParser(
        description="简化的直下代码"
    )
    parser.add_argument(
        "-id",
        "--id",
        help="文件 id",
    )
    parser.add_argument(
        "-fn",
        "--filename",
        default=None,
        help="存储文件名（这个名字必须和谷歌云盘上的名称一致，避免错误）",
    )
    parser.add_argument(
        "-dir",
        "--directory",
        default=".",
        help="存储文件夹路径",
    )
    args = parser.parse_args(args)
    gdrive = GDriveDL()
    gdrive.process_file(
        args.id, directory=args.directory, filename=args.filename
    )

    if gdrive.errors:
        sys.exit(1)

if __name__ == "__main__":
    main()
```
