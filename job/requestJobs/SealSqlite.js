// const initSqlJs = require('./../sqlite');
// 创建一个数据库连接
// initSqlJs({
//     // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
//     // You can omit locateFile completely when running in node
//     locateFile: file => `D:\\all_code\\Pages\\Page-Static-Sources\\job\\requestJobs\\test\\sqlite_20231211.db`
// }).then(SQL => {
//     const db = new SQL.Database();
//     let sqlstr = "CREATE TABLE hello (a int, b char); \
// INSERT INTO hello VALUES (0, 'hello'); \
// INSERT INTO hello VALUES (1, 'world');";
//     db.run(sqlstr); // Run the query without returning anything
//     // console.log("run")
//     // Prepare an sql statement
//     const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");
//
//     // Bind values to the parameters and fetch the results of the query
//     const result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
//     console.log(result); // Will print {a:1, b:'world'}
// }).catch(console.log);
const fs = require("fs");
const initSqlJs = require('./sqlite.js');

class TableColumnDefined {
    static SourceType = {
        Array: "Array",
        String: "String",
        Number: "Number",
    }
    static TableColumnType = {
        Integer() {
            return "Integer"
        },
        Varchar(len) {
            return `varchar(${len > 0 ? len : 32})`
        }
    }
    constructor(name, type, primaryKey, sourceType, auto) {
        this.name = name;
        this.type = type;
        this.primaryKey = !!primaryKey;
        if (sourceType) {
            this.sourceType = sourceType;
        } else {
            switch (this.type) {
                case TableColumnDefined.SourceType.Number:
                    this.sourceType = sourceType;
                default:
                    this.sourceType = TableColumnDefined.SourceType.String;
            }
        }
        this.auto = !!auto;
    }

}
class Table {
    constructor(tableName, defined) {
        this.tableName = tableName;
        this.defined = defined;
        this._filter_();
    }
    _filter_() {
        let cn = [];
        this.defined = this.defined.filter(d => {
            if (cn.includes(d.name)) {
                return false;
            } else {
                cn.push(d.name);
                return true;
            }
        })
    }
    createTableSql() {
        let columns = this.defined.map(def => {
            return `${def.name} ${def.type} ${def.primaryKey ? 'primary key' : ""} ${def.auto ? 'autoincrement' : ''}`
        }). join(',');
        return `create table if not exists ${this.tableName} (${columns});`;
    }
    insertSql(obj) {
        // insert into ${tb}('') values('');
        let fields = [];
        let values = [];
        this.defined.forEach(def => {
            if (!def.auto) {
                if (def.name in obj) {
                    let value = obj[def.name];
                    fields.push(def.name);
                    if (def.sourceType === TableColumnDefined.SourceType.Array) {
                        value = JSON.stringify(value);
                    } else if (def.sourceType === TableColumnDefined.SourceType.Number) {
                        value += '';
                    }
                    try {
                        values.push(`"${value.replace(/"/g,'@#@')}"`);
                    } catch (e) {
                        console.log(def);
                        console.log(value);
                        console.log(e);
                        throw e;
                    }
                }
            }
        });
        return `insert into ${this.tableName}(${fields.join(',')}) values(${values.join(',')})`;
    }
    selectAll(db) {
        // Prepare an sql statement
        const stmt = db.prepare(`SELECT * FROM ${this.tableName}`);

        // Bind values to the parameters and fetch the results of the query
        // const result = stmt.getAsObject();
        // console.log(result); // Will print {a:1, b:'world'}
        let ret = [];
        while (stmt.step()) {
            let r = stmt.get().map(_ => {
                if (typeof _ === "string") {
                    return _.replace(/@#@/g,'"');
                }
                return _;
            })
            ret.push(r);
        } // Will print [0, 'hello']
        // free the memory used by the statement
        stmt.free();
        return ret;
    }
}

class Sqlite {
    constructor(SQL, dbFile) {
        this.SQL = SQL;
        this.dbFile = dbFile;
        this.db = null;
        this.tables = [
            new Table("baseTable", [
                new TableColumnDefined("id", TableColumnDefined.TableColumnType.Integer(), true, TableColumnDefined.SourceType.Number, true),
                new TableColumnDefined("tableName", TableColumnDefined.TableColumnType.Varchar(256)),
                new TableColumnDefined("tableDefined", TableColumnDefined.TableColumnType.Varchar(4096)),
            ])
        ];
        this._init_file_();
    }

    _base_table_() {
        this._create_table_(this.tables[0])
    }
    _create_table_(tb) {
        // console.log(tb)
        let baseTableCreateSql = tb.createTableSql();
        // console.log(baseTableCreateSql);
        this.db.run(baseTableCreateSql);
        let insertSql = this.tables[0].insertSql({
            tableName: tb.tableName,
            tableDefined: JSON.stringify(tb.defined)
        });
        this.db.run(insertSql);
        this._save_()
    }
    _insert_base_table_() {

    }

    _init_file_() {
        if (!fs.existsSync(this.dbFile)) {
            console.log("create new db");
            this.db = new this.SQL.Database();
            this._base_table_();
        } else {
            console.log("load db")
            const filebuffer = fs.readFileSync(this.dbFile);
            this.db = new this.SQL.Database(filebuffer);
            this.tables = this.tables[0].selectAll(this.db).map(t => {
                return new Table(t[1], JSON.parse(t[2]));
            })
        }
    }
    _save_() {
        const data = this.db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(this.dbFile, buffer);
    }

    // {
    //     "jobId": "790009",
    //     "status": "1",
    //     "jobName": "电子商务专任老师",
    //     "companyId": "81051",
    //     "minWage": "7000",
    //     "maxWage": "10000",
    //     "wageType": "1",
    //     "experienceType": "0",
    //     "educationType": "3",
    //     "amount": "若干",
    //     "jobCategoryId": "33",
    //     "welfareTag": "4,9,16,37,114,103",
    //     "provinceId": "1964",
    //     "cityId": "2011",
    //     "companyName": "广东东软学院——高校人才网直荐",
    //     "companyType": "2",
    //     "companyNature": "2",
    //     "releaseTime": "12-04",
    //     "refreshTime": "2023-12-10 02:05:00",
    //     "applyType": "1",
    //     "applyAddress": "gddrxy2023@163.com",
    //     "announcementId": "167174",
    //     "deliveryWay": "2",
    //     "majorId": "119",
    //     "isMiniapp": "1",
    //     "isEstablishment": "2",
    //     "isCooperation": "2",
    //     "companyLogo": "https://img.gaoxiaojob.com/uploads/company_logo/20231205144834_29957.jpg",
    //     "wage": "0.7-1万/月",
    //     "announcementName": "急聘！广东东软学院2023硕士教师招聘公告",
    //     "templateId": "1",
    //     "experience": "",
    //     "education": "硕士研究生",
    //     "jobCategory": "专职教师/教学科研岗",
    //     "welfareTagArr": [
    //         "提供住房公寓",
    //         "周末双休"
    //     ],
    //     "areaName": "广东-佛山",
    //     "city": "佛山",
    //     "companyTypeName": "普通本科院校",
    //     "companyNatureName": "民营（私营）",
    //     "jobRecord": "工商管理",
    //     "applyStatus": "2",
    //     "userEmail": "",
    //     "isEmailApply": "2",
    //     "shortRefreshTime": "12-10",
    //     "refreshDate": "12-10",
    //     "url": "/job/detail/790009.html",
    //     "companyUrl": "/company/detail/81051.html",
    //     "announcementUrl": "/announcement/detail/167174.html",
    //     "isFast": "2",
    //     "isTop": "2"
    // }
    createTableByObj(obj, tableName, idFields) {
        let table = null;
        this.tables.forEach(t => {
            if (t.tableName === tableName) {
                table = t;
            }
        });
        if (table) {
            return table;
        }
        let tableContent = [
            new TableColumnDefined("id", TableColumnDefined.TableColumnType.Integer(), true, TableColumnDefined.SourceType.Number, true)
        ];
        if (idFields) {
            tableContent[0] = idFields;
        }
        for (let i in obj) {
            if (typeof obj[i] === "string") {
                let v = +obj[i];
                if (v.toString() === obj[i]) {
                    obj[i] = v;
                    // tableContent[i] = {type: "integer", SourceType: TableColumnDefined.SourceType.Number};
                    tableContent.push(new TableColumnDefined(i, TableColumnDefined.TableColumnType.Integer(), false, TableColumnDefined.SourceType.Number))
                } else {
                    // tableContent[i] = {type: "varchar(256)", SourceType: TableColumnDefined.SourceType.String};
                    tableContent.push(new TableColumnDefined(i, TableColumnDefined.TableColumnType.Varchar(256), false, TableColumnDefined.SourceType.String))
                }
            } else {
                if (obj[i] instanceof Array) {
                    // tableContent[i] = {type: "varchar(256)", sourceType: TableColumnDefined.SourceType.Array};
                    tableContent.push(new TableColumnDefined(i, TableColumnDefined.TableColumnType.Varchar(256), false, TableColumnDefined.SourceType.Array))
                }
            }
        }
        table = new Table(tableName, tableContent);
        this._create_table_(table);
        return table;
    }
    insertObj(obj, table) {
        let insertSql = table.insertSql(obj);
        this.db.run(insertSql);
        this._save_()
    }

    selectAll(table) {
        return table.selectAll(this.db);
    }
}

// const filebuffer = fs.readFileSync('test.sqlite');

function test() {
    initSqlJs().then(function(SQL){
        let sq = new Sqlite(SQL, "D:\\all_code\\Pages\\Page-Static-Sources\\job\\requestJobs\\test\\sql.db");
        let obj = {
            "jobId": "790009",
            "status": "1",
            "jobName": "电子商务专任老师",
            "companyId": "81051",
            "minWage": "7000",
            "maxWage": "10000",
            "wageType": "1",
            "experienceType": "0",
            "educationType": "3",
            "amount": "若干",
            "jobCategoryId": "33",
            "welfareTag": "4,9,16,37,114,103",
            "provinceId": "1964",
            "cityId": "2011",
            "companyName": "广东东软学院——高校人才网直荐",
            "companyType": "2",
            "companyNature": "2",
            "releaseTime": "12-04",
            "refreshTime": "2023-12-10 02:05:00",
            "applyType": "1",
            "applyAddress": "gddrxy2023@163.com",
            "announcementId": "167174",
            "deliveryWay": "2",
            "majorId": "119",
            "isMiniapp": "1",
            "isEstablishment": "2",
            "isCooperation": "2",
            "companyLogo": "https://img.gaoxiaojob.com/uploads/company_logo/20231205144834_29957.jpg",
            "wage": "0.7-1万/月",
            "announcementName": "急聘！广东东软学院2023硕士教师招聘公告",
            "templateId": "1",
            "experience": "",
            "education": "硕士研究生",
            "jobCategory": "专职教师/教学科研岗",
            "welfareTagArr": [
                "提供住房公寓",
                "周末双休"
            ],
            "areaName": "广东-佛山",
            "city": "佛山",
            "companyTypeName": "普通本科院校",
            "companyNatureName": "民营（私营）",
            "jobRecord": "工商管理",
            "applyStatus": "2",
            "userEmail": "",
            "isEmailApply": "2",
            "shortRefreshTime": "12-10",
            "refreshDate": "12-10",
            "url": "/job/detail/790009.html",
            "companyUrl": "/company/detail/81051.html",
            "announcementUrl": "/announcement/detail/167174.html",
            "isFast": "2",
            "isTop": "2"
        };
        let table = sq.createTableByObj(obj, "objs", new TableColumnDefined("jobId", TableColumnDefined.TableColumnType.Integer(), true, TableColumnDefined.SourceType.Number, false));
        sq.insertObj(obj, table);
        // let ret = sq.selectAll(sq.tables[0])
        // console.log(ret);
    });
}

module.export = {
    Sqlite,
    TableColumnDefined,
    Table,
}