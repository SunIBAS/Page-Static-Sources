/**
 * Nonogram 求解器 - 逻辑推导 + 递归回溯版
 */
class NonogramSolver {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.height = rows.length;
        this.width = cols.length;
        this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(0));
        this.cache = new Map();
    }

    // 生成某一行所有可能的排列，并根据当前已知格点过滤
    getValidConfigs(constraints, length, currentLine) {
        const key = `${constraints.join(',')}-${length}-${currentLine.join('')}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const configs = [];
        const gen = (cIdx, start, path) => {
            if (cIdx === constraints.length) {
                const final = path.concat(Array(length - path.length).fill(2));
                if (this.isMatch(final, currentLine)) configs.push(final);
                return;
            }
            const len = constraints[cIdx];
            const remain = constraints.slice(cIdx + 1).reduce((a, b) => a + b + 1, 0);

            for (let s = start; s <= length - len - remain; s++) {
                const segment = Array(s - start).fill(2).concat(Array(len).fill(1));
                if (cIdx < constraints.length - 1) segment.push(2);

                const nextPath = path.concat(segment);
                if (this.isMatch(nextPath, currentLine.slice(0, nextPath.length))) {
                    gen(cIdx + 1, nextPath.length, nextPath);
                }
            }
        };

        gen(0, 0, []);
        this.cache.set(key, configs);
        return configs;
    }

    isMatch(partial, target) {
        return partial.every((v, i) => target[i] === 0 || target[i] === v);
    }

    async solve() {
        // 执行行级启发式搜索
        if (this.search(0)) return this.grid;
        return null;
    }

    search(r) {
        if (r === this.height) return true; // 成功填完所有行

        // 获取当前行所有可能的合法排列
        const rowConfigs = this.getValidConfigs(this.rows[r], this.width, this.grid[r]);

        for (const config of rowConfigs) {
            const backup = this.grid.map(row => [...row]);
            this.grid[r] = config;

            // 放置当前行后，检查所有列是否依然有解（剪枝核心）
            if (this.checkColsPotential()) {
                if (this.search(r + 1)) return true;
            }

            this.grid = backup; // 回溯
        }
        return false;
    }

    checkColsPotential() {
        for (let c = 0; c < this.width; c++) {
            const colData = this.grid.map(row => row[c]);
            // 只要有一列在当前约束下无解，立即剪枝
            const colConfigs = this.getValidConfigs(this.cols[c], this.height, colData);
            if (colConfigs.length === 0) return false;
        }
        return true;
    }
}
// 优化后的 parse 方法
const parse = (text) => {
    return text
        .trim()                    // 去掉首尾空格
        .split('\n')              // 按行分割
        .map(line => {
            // 使用正则匹配连续的数字
            // match 会返回一个数组，例如 ["1", "215", "5"]
            const matches = line.match(/\d+/g);
            
            // 如果这一行没数字，返回空数组，否则转为数字类型
            return matches ? matches.map(Number) : [];
        });
};

// 页面渲染函数
function draw(grid, rowsInfo, colsInfo) {
    const canvas = document.getElementById('pixelCanvas');
    const ctx = canvas.getContext('2d');

    const cellSize = 25; // 减小一点尺寸以适配更多像素
    const labelPadding = 10;

    // 1. 计算左侧和上方预留空间（寻找最长的描述序列）
    const maxRowLabels = Math.max(...rowsInfo.map(r => r.length));
    const maxColLabels = Math.max(...colsInfo.map(c => c.length));

    const offsetX = maxRowLabels * 20 + labelPadding; // 左侧宽度
    const offsetY = maxColLabels * 20 + labelPadding; // 上方高度

    canvas.width = grid[0].length * cellSize + offsetX;
    canvas.height = grid.length * cellSize + offsetY;

    // 清除画布
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. 绘制上方数字 (B - 列描述)
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#666";
    colsInfo.forEach((col, c) => {
        col.forEach((num, i) => {
            // 从底部向上写
            const x = offsetX + c * cellSize + cellSize / 2;
            const y = offsetY - labelPadding - (col.length - 1 - i) * 15;
            ctx.fillText(num, x, y);
        });
    });

    // 3. 绘制左侧数字 (A - 行描述)
    ctx.textAlign = "right";
    rowsInfo.forEach((row, r) => {
        row.forEach((num, i) => {
            // 从右向左写
            const x = offsetX - labelPadding - (row.length - 1 - i) * 15;
            const y = offsetY + r * cellSize + cellSize / 2 + 5;
            ctx.fillText(num, x, y);
        });
    });

    // 4. 绘制网格和像素
    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            const x = offsetX + c * cellSize;
            const y = offsetY + r * cellSize;

            // 填充颜色：1为黑，2为白（绘制X或空白），0为未知（灰色）
            if (cell === 1) {
                ctx.fillStyle = '#333';
            } else if (cell === 2) {
                ctx.fillStyle = '#fff';
            } else {
                ctx.fillStyle = '#f0f0f0';
            }
            ctx.fillRect(x, y, cellSize, cellSize);

            // 绘制网格线
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellSize, cellSize);

            // 每隔 5 个格子加粗边框，方便对齐
            if (r % 5 === 0 && c % 5 === 0) {
                ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                ctx.strokeRect(x, y, cellSize * 5, cellSize * 5);
            }

            // 如果是白色，画一个淡淡的小叉号以便区分
            if (cell === 2) {
                ctx.strokeStyle = '#eee';
                ctx.beginPath();
                ctx.moveTo(x + 5, y + 5); ctx.lineTo(x + cellSize - 5, y + cellSize - 5);
                ctx.moveTo(x + cellSize - 5, y + 5); ctx.lineTo(x + 5, y + cellSize - 5);
                ctx.stroke();
            }
        });
    });
}

function runSolver() {
    const rawA = document.getElementById('inputA').value;
    const rawB = document.getElementById('inputB').value;

    try {
        const A = parse(rawA);
        const B = parse(rawB);

        if (A.length !== B.length) alert("行和列的数量应相等");

        // 简单的验证
        if (A.length === 0 || B.length === 0) {
            alert("请输入完整的描述数据");
            return;
        }

        const solver = new NonogramSolver(A, B);
        solver.solve().then(result => {
            if (result) {
                draw(result, A, B);
            } else {
                alert("抱歉，该描述无解或逻辑过于复杂。");
            }
        });
    } catch (e) {
        alert("输入格式有误，请检查数字和逗号。");
    }
}