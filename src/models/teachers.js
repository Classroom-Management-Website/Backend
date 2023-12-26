module.exports = (sequelize, DataTypes) => {
    const Teachers = sequelize.define("teachers", {
        // Các trường mô hình của bạn ở đây
        maGv: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passWord:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        sdt:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fullName:{
            type: DataTypes.STRING,
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
