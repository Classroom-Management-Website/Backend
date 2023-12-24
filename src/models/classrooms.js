module.exports = (sequelize,Datatypes) =>{
    const Classrooms = sequelize.define("classrooms",{
        maLop:{
            type: Datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tenLopHoc:{
            type: Datatypes.STRING(50),
            allowNull: false
        },
        lichHoc:{
            type: Datatypes.STRING(50),
            allowNull: false,
            unique: true,
        }
        
    }, {
        // // Vô hiệu hóa cột updatedAt
        // updatedAt: false,

        // // Nếu bạn muốn vô hiệu hóa cả createdAt và updatedAt
        // timestamps: false
    });
    
    return Classrooms;

};