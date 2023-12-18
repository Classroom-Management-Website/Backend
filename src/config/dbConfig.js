module.exports = {
    user: 'sa',
    password: '123456aA@$',
    server: 'localhost', 
    database: 'classroom',
    port: 1433,
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};
// module.exports={
//     HOST:'103.18.7.223',
//     USER:'ec65z2oifub8_db_admin',
//     PASSWORD:'tuta@IT1BK',
//     DB:'ec65z2oifub8_tuta',
//     dialect:'mysql',
//     port:3306,
//     pool:{
//         max:5,
//         min:0,
//         acquire:30000,
//         idle:10000
//     }
// }