const fs = require('fs');
const {
    TableColumnDefined,
    Sqlite,
    InitSqlJs
} = require('./../../Sqlite/SealSqlite');

InitSqlJs("D:\\all_code\\Pages\\Page-Static-Sources\\job\\requestJobs\\jobs.db").then(db => {
    let tb = db.tables[1];
    let ret = db.selectAll(tb);
    fs.writeFileSync('./job.json', JSON.stringify(ret), 'utf-8')
});