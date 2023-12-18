
const dbConfig = require('../config/dbConfig.js')
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.server,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: true, // Đối với Azure SQL. Nếu không, bạn có thể loại bỏ hoặc đặt là false.
                trustServerCertificate: true // Đối với chứng chỉ tự ký trong môi trường phát triển.
            }
        },
        port: dbConfig.port,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

// const sequelize = new Sequelize(
//     dbConfig.DB,
//     dbConfig.USER,
//     dbConfig.PASSWORD,
//     {
//         host:dbConfig.HOST,
//         port:dbConfig.port,
//         dialect:dbConfig.dialect,
//         operatorsAliases:false,
//         pool:{
//             max:dbConfig.pool.max,
//             min:dbConfig.pool.min,
//             acquire:dbConfig.pool.acquire,
//             idle:dbConfig.pool.idle
//         }

//     }
// )

sequelize.authenticate()
    .then(()=> {
        console.log('Connection has been established successfully.')

    })
    .catch(err=>{
        console.error('Unable to connect to the database:', err)
    })

const db ={}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })

db.teachers = require('./teachers.js')(sequelize, DataTypes)
db.classrooms = require('./classrooms.js')(sequelize,DataTypes)
db.students = require('./students.js')(sequelize,DataTypes)

db.teachers.hasMany(db.classrooms, { foreignKey: 'maGv' });
db.classrooms.belongsTo(db.teachers, { foreignKey: 'maGv' });

db.classrooms.hasMany(db.students, { foreignKey: 'maLop' });
db.students.belongsTo(db.classrooms, { foreignKey: 'maLop' });

module.exports =db