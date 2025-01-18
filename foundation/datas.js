const Count = {
    H(n) {
        return n * 100;
    },
    K(n) {
        return n * 1000;
    },
    TK(n) {
        return n * 10000;
    }
}
const DearType = {
    BUY: 'BUY',
    SALE: "SALE",
    STEP: "STEP"
};
class Dear {
    constructor(DearType, count, date) {
        this.DearType = DearType;
        this.count = count;
        this.date = date;
    }
}
class Found {
    constructor(code) {
        this.code = code.toString();
        this.dears = [];
        this.end = false;
    }
    addDear(dearType, count, date) {
        this.dears.push(new Dear(dearType, count, +date));
        return this;
    }
    addStep(count, date) {
        if (Array.isArray(date)) {
            date.forEach(d => {
                this.dears.push(new Dear(DearType.STEP, count, +d));
            });
        } else {
            this.dears.push(new Dear(DearType.STEP, count, +date));
        }
        return this;
    }
    toJson() {
        return {
            code: this.code,
            dears: this.dears,
            end: this.end,
        }
    }
    toEnd() {
        this.end = true;
        return this;
    }
    sortDear() {
        this.dears.sort((a,b) => a.date - b.date);
        return this;
    }
}

const datas = [
    new Found("270042")
        .addDear(DearType.BUY, 150, 20181022)
        .addDear(DearType.SALE, 142.7, 20190220)
        .addDear(DearType.BUY, Count.K(2), 20210329)
        .addDear(DearType.BUY, Count.K(1), 20210727)
        .addDear(DearType.STEP, Count.H(5), 20210825)
        .addDear(DearType.STEP, Count.H(5), 20210830)
        .addDear(DearType.STEP, Count.H(5), 20210907)
        .addDear(DearType.STEP, Count.H(5), 20210913)
        .addDear(DearType.STEP, Count.H(5), 20210922)
        .addDear(DearType.BUY, Count.K(1), 20210924)
        .addDear(DearType.STEP, Count.H(5), 20210927)
        .addDear(DearType.STEP, Count.H(5), 20211008)
        .addDear(DearType.STEP, Count.H(5), 20211011)
        .addDear(DearType.BUY, Count.K(2), 20220316)
        .addDear(DearType.BUY, Count.K(2), 20220315)
        .addDear(DearType.STEP, Count.H(5), 20220321)
        .addDear(DearType.STEP, Count.H(2), 20220328)
        .addDear(DearType.STEP, Count.H(2), 20220406)
        .addDear(DearType.STEP, Count.H(2), 20220411)
        .addDear(DearType.STEP, Count.H(2), 20220418)
        .addDear(DearType.STEP, 50, 20220425)
        .addDear(DearType.STEP, 50, 20220505)
        .addDear(DearType.STEP, 50, 20220509)
        .addDear(DearType.SALE, 3946.65, 20220510)
        .addDear(DearType.STEP, 50, 20220523)
        .addDear(DearType.BUY, Count.K(2), 20220528)
        .addDear(DearType.BUY, Count.H(5), 20220531)
        .addDear(DearType.STEP, 50, 20220531)
        .addDear(DearType.STEP, 50, 20220606)
        .addDear(DearType.STEP, 50, 20220613)
        .addDear(DearType.STEP, 50, 20220621)
        .addDear(DearType.BUY, Count.K(1), 20220626)
        .addStep(50, [
            20220627, 20220705, 20220711, 20220718, 20220725,
            20220801, 20220808, 20220815, 20220822, 20220829,
            20220906, 20220913, 20220919, 20220926, 20221010,
            20221128, 20221205, 20221212, 20221219, 20221227,
            20230103, 20230109, 20230117, 20230130, 20230206,
            20230213, 20230221, 20230227, 20230306, 20230313,
            20230320, 20230327, 20230403, 20230410, 20230417,
            20230424, 20230504, 20230508, 20230522, 20230530,
            20230605, 20230612, 20230620, 20230626, 20230703,
            20230710, 20230717, 20230724, 20230731, 20230807,
            20230814
        ])
        .addDear(DearType.BUY, Count.K(2), 20231015)
        .addDear(DearType.SALE, 384328, 20230314)
        .addDear(DearType.BUY, 826917, 20230814)
        .sortDear(),
    new Found("006008")
        .addDear(DearType.BUY, Count.K(3), 20201128)
        .addDear(DearType.BUY, Count.K(1), 20201208)
        .addDear(DearType.BUY, Count.H(8), 20201218)
        .addDear(DearType.BUY, Count.K(1), 20201222)
        .addDear(DearType.BUY, Count.H(5), 20201224)
        .addDear(DearType.SALE, 1193.63, 20210106)
        .addDear(DearType.SALE, 2954.13, 20210111)
        .addDear(DearType.BUY, Count.K(1), 20210424)
        .addDear(DearType.SALE, 1043.52, 20210611)
        .toEnd(),
    new Found("501058")
        .addDear(DearType.BUY, 500, "20200228")
        .addDear(DearType.BUY, 500, "20200306")
        .addDear(DearType.BUY, 400, "20200317")
        .addDear(DearType.BUY, 500, "20200324")
        .addDear(DearType.SALE, 1215.26, "20200716")
        .addDear(DearType.SALE, 1216.78, "20200717")
        .addDear(DearType.BUY, Count.K(1), "20200121")
        .addDear(DearType.BUY, Count.H(5), "20200129")
        .addDear(DearType.BUY, Count.H(5), "20200201")
        .addDear(DearType.BUY, Count.H(5), "20200218")
        .addDear(DearType.BUY, Count.H(5), "20200218")
        .addDear(DearType.BUY, Count.H(5), "20200222")
        .addDear(DearType.BUY, Count.H(5), "20200223")
        .addDear(DearType.BUY, Count.H(5), "20200224")
        .addDear(DearType.SALE, 3927.10, "20210226")
        .toEnd(),
    new Found("001092")
        .addDear(DearType.BUY, Count.H(5), 20210730)
        .addDear(DearType.BUY, Count.H(8), 20210915)
        .addDear(DearType.BUY, Count.H(9), 20210915)
        .addDear(DearType.BUY, Count.K(1), 20210924)
        .addDear(DearType.BUY, Count.K(1.5), 20211120)
        .addDear(DearType.BUY, Count.K(2), 20220315)
        .addDear(DearType.SALE, 5743.53, 20230314)
        .toEnd(),
    new Found("004877")
        .addDear(DearType.BUY, Count.K(2), 20210908)
        .addDear(DearType.BUY, Count.K(1), 20211110)
        .addDear(DearType.BUY, Count.H(6), 20211206)
        .addDear(DearType.BUY, Count.H(5), 20211215)
        .addDear(DearType.SALE, 3003.84, 2021)
        .addDear(DearType.BUY, 2001, 20230825)
        .addStep(100, [
            20230825, 20230828, 20230905, 20230911, 20230918,
            20230918, 20230925, 20231009, 20231016, 20231024,
            20231030, 20231106, 20231113, 20231120, 20231127,
            20231204, 20231211, 20231218, 20231227, 20240102,
            20240108, 20240116
        ]),
    new Found("006075")
        .addDear(DearType.BUY, Count.K(2), 20210329)
        .addStep(100, 20220325)
        .addStep(400, [
            20220328, 20220406, 20220411, 20220418, 20220423,
        ])
        .addDear(DearType.SALE, 1893.89, 20220423)
        .addStep(50, [
            20220425, 20220505, 20220509, 20220516, 20220523,
            20220531, 20220606, 20220613, 20220621, 20220627,
            20220705, 20220711, 20220718, 20220725, 20220801,
            20220808, 20220815, 20220822, 20220829, 20220906,
            20220913, 20220919, 20220926, 20221010, 20221128,
            20221205, 20221212, 20221219, 20221227, 20230103,
            20230109, 20230117, 20230130, 20230206, 20230213,
            20230221, 20230227, 20230306, 20230313,
        ])
        .addDear(DearType.SALE, 3961,76, 20230511)
        .toEnd(),
    new Found("010769")
        .addDear(DearType.BUY, Count.K(2), 20210714)
        .addDear(DearType.BUY, Count.H(3), 20210720)
        .addDear(DearType.BUY, Count.H(4), 20210722)
        .addDear(DearType.BUY, Count.H(4), 20210723)
        .addDear(DearType.BUY, Count.H(3), 20210726)
        .addStep(100, [
            20210727, 20210803, 20210810, 20210817, 20210824,
            20210831, 20210907, 20210914, 20210922, 20210928,
            20211008, 20211012, 20211019, 20211026, 20211102,
            20211109, 20211116, 20211123, 20211130, 20211207,
            20211214, 20211221, 20211228, 20220104, 20220111,
            20220118, 20220125, 20220207, 20220208, 20220215,
            20220222, 20220301, 20220308, 20220315
        ])
        .addDear(DearType.BUY, Count.H(3), 20210727)
        .addDear(DearType.BUY, Count.H(2), 20210728)
        .addDear(DearType.SALE, 1763.72, 20210901)
        .addDear(DearType.SALE, 581.59, 20211115)
        .addDear(DearType.BUY, Count.H(6), 20211126)
        .addDear(DearType.BUY, Count.H(6), 20211214)
        .addDear(DearType.BUY, Count.H(5), 20211215)
        .addDear(DearType.BUY, Count.K(1), 20220315)
        .addDear(DearType.SALE, 944.73, 20220419)
        .addDear(DearType.BUY, Count.H(6), 20220425)
        .addDear(DearType.SALE, 550.90, 20220626)
        .addDear(DearType.SALE, 4958.16, 20220626)
        .addDear(DearType.SALE, 1019.48, 20220702)
        .toEnd()
]