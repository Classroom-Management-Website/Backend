module.exports = (sequelize, DataTypes) => {
    const Teachers = sequelize.define("teachers", {
        // Các trường mô hình của bạn ở đây
        maGv: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName:{
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        passWord:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        sdt:{
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        fullName:{
            type: DataTypes.STRING(50),
            allowNull: true,
        }
    }, {
        // // Vô hiệu hóa cột updatedAt
        // updatedAt: false,

        // // Nếu bạn muốn vô hiệu hóa cả createdAt và updatedAt
        // timestamps: false
    });

    return Teachers;
};
