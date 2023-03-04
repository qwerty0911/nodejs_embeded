const mysql = require('mysql');

const client = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gachon654321',
    database: 'sensordb'
});

const dbif = {
    insert: (data) => {
        let stamptime = new Date();
        client.query('INSERT INTO sonic VALUES (?,?)', [stamptime, data], (err, result) => {
            if (err) {
                console.log("DB 저장 실패...");
            } else console.log("DB 저장 성공!");
        });
    },
    select: () => {
        client.query('SELECT * FROM `sonic`', (err, results, fields) => {
            console.log("-------------------현재까지 DB에 저장된 내용------------------");
            results.forEach((element, i) => {
                let d = element.stamp, srt = '';
                str += d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate() + '';
                str += d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.';
                str += d.getMilliseconds() + ' ' + element.distance + 'cm';
                console.log(str);
            });
            console.log("----------------------------------------------------");
        })
    },
    delete: () => { },
    update: () => { }
}

module.exports.insert = function (data) { dbif.insert(data); };
module.exports.select = function () { dbif.select(); };
module.exports.delete = function () { dbif.delete(); };
module.exports.update = function () { dbif.update(); };