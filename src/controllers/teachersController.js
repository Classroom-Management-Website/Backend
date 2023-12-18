const { password } = require('../config/dbConfig');
const db = require('../models')
const jwt = require('jsonwebtoken');
const Teachers = db.teachers

const registerTeachers = async(req,res) =>{
    try{
        if(!req.body){
            return res.status(400).json({error:"Bad request: Missing request body"})
        }
        const inf = {
            userName: req.body.userName,
            passWord: req.body.passWord,
            fullName: req.body.fullName,
            sdt: req.body.sdt
        }
        const teachers = await Teachers.create(inf)
        console.log(teachers)
        const token = jwt.sign({ userId: teachers.id, userName: teachers.userName }, 'LuckyAndPower', { expiresIn: '24h' });
        return res.status(201).json({ token, message: 'Register Success' })
    }catch(error){
        console.log(error);
        // Handle SequelizeUniqueConstraintError
        if (error.name === 'SequelizeUniqueConstraintError') {
            let customMessage = 'Tai Khoan Da Ton Tai';
            return res.status(409).json({ error: customMessage });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const loginTeachers = async(req, res) => {
    try {
        const { userName, passWord } = req.body;

        const teacher = await Teachers.findOne({ where: { userName,passWord } });

        if (!teacher) {
            return res.status(401).json('Incorrect UserName or PassWord');
        }

        const token = jwt.sign({ userId: teacher.id, userName: teacher.userName }, 'LuckyAndPower', { expiresIn: '100h' });
        return res.json({token,message:'Login Success'});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const checkToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        // Tách phần "Bearer " khỏi token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'LuckyAndPower');
        if (decoded) {
            const userName = decoded.userName;
            console.log('User Name:', userName);

            // Truy vấn tất cả thông tin trừ mật khẩu từ userName trong cơ sở dữ liệu
            const teacher = await Teachers.findOne({
                where: { userName: userName },
                attributes: { exclude: ['passWord'] }
            });

            if (teacher) {
                res.status(200).json({ teacher: teacher, message: "Success" });
            } else {
                res.status(404).json({ error: "Teacher not found for the given userName" });
            }
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getTeacherPassword = async (userName) => {
    try {
        const teacher = await Teachers.findOne({
            where: { userName: userName },
        });

        return teacher ? teacher.passWord : null;
    } catch (error) {
        return res.status(404).json({ error: "Teacher not found" });
    }
};


// Middleware to extract and verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    // Tách phần "Bearer " khỏi token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
    }
    // console.log(token)
    jwt.verify(token, 'LuckyAndPower', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        req.userName = decoded.userName;
        next();
    });
};

const updatePassword = async(req, res) => {
    try {
        const userName = req.userName;
        const { oldPassword, newPassword } = req.body;

        const currentPassword = await getTeacherPassword(userName);

        if (oldPassword === currentPassword) {
            console.log(newPassword)
            const [updatedRowsCount, updatedPassword] = await Teachers.update(
                {passWord: newPassword  },
                { where: { userName }, returning: true }
            );
            if (updatedRowsCount === 0) {
                res.status(404).json({ error: "Cập nhật mật khẩu không thành công" });
                return;
            }
            res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
        } else {
            res.status(400).json({ error: "Mật khẩu cũ không đúng" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// const updateTeachers = async(req,res) =>{
//     try{
//         const id = req.params.id;
//         const [updateRows] = await Teachers.update(req.body,{where:{MaGv: id}})

//         if(updateRows === 0){
//             return res.status(400).json({error: "update not found"})
//         }
//         const updateTeachers = await Teachers.findByPk(id);
//         return res.status(200).json(updateTeachers);
//     } catch (error) {
//         console.log(error);
//         // Handle SequelizeUniqueConstraintError
//         if (error.name === 'SequelizeUniqueConstraintError') {
//             let customMessage = 'Duplicate entry: ';
//             return res.status(409).json({ error: customMessage });
//         }
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

// const getAllTeachers = async(req,res) =>{
//     try{
//         let teachers = await Teachers.findAll({})
//         res.status(200).json(teachers)
//     }catch(error){
//         console.log(error)
//         res.status(500).json({error:"Internal Server Error"})
//     }
// }

// const getOneTeachers = async(req,res) =>{
//     try{
//         let id = req.params.id
//         const teachers = await Teachers.findOne({where:{maGv:id}})
//         if(!teachers){
//             res.status(404).json({error:"Teachers not found"})
//             return;
//         }
//         res.status(200).json(teachers)
//     }catch(error){
//         console.log(error)
//         res.status(500).json({error:"Internal Server Error"})
//     }
// } 

const deleteTeachers = async(req,res) => {
    try{
        let id = req.params.id
        const teachers = await Teachers.destroy({where:{maGv:id}})
        if(!teachers){
            res.status(404).json({error:"RecruitmentPost not found"})
            return;
        }
        res.status(200).json('Delete complete')
    }catch(error){
        res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports={
    registerTeachers,
    loginTeachers,
    deleteTeachers,
    checkToken,
    updatePassword,
    verifyToken
}