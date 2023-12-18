const db = require('../models')
const Classrooms = db.classrooms
const Teachers = db.teachers
const Students = db.students

const jwt = require('jsonwebtoken');

const getTeacherMaGv = async (userName) => {
    try {
        const teacher = await Teachers.findOne({
            where: { userName: userName },
            attributes: { exclude: ['passWord'] }
        });

        return teacher ? teacher.maGv : null;
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

const getStudentsByClassroom = async (req, res) => {
    try {
        const { maLop } = req.params;
        const userName = req.userName;
        const maGv = await getTeacherMaGv(userName);
        // Kiểm tra xem lớp học có thuộc về giáo viên này không
        const classroom = await Classrooms.findOne({
            where: { maLop: maLop, maGv: maGv }
        });

        if (!classroom) {
            return res.status(403).json({ error: "Lớp học này không thuộc của bạn" });
        }

        // Lấy danh sách học sinh
        const students = await Students.findAll({
            where: { maLop: maLop }
        });

        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addStudentsByClassroom = async (req, res) => {
    try {
        const { tenHs, ngaySinh, soBuoiVang } = req.body;
        const { maLop } = req.params;
        const userName = req.userName;
        const maGv = await getTeacherMaGv(userName);
        // Kiểm tra xem lớp học có thuộc về giáo viên này không
        const classroom = await Classrooms.findOne({
            where: { maLop: maLop, maGv: maGv }
        });

        if (!classroom) {
            return res.status(403).json({ error: "Lớp học này không thuộc của bạn" });
        }
        const student = await Students.create({tenHs,ngaySinh,soBuoiVang,maLop})
        res.status(201).json(student)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteStudentsByClassroom = async (req, res) => {
    try {
        const { maLop } = req.params;
        const {maHs} = req.body
        const userName = req.userName;
        const maGv = await getTeacherMaGv(userName);
        // Kiểm tra xem lớp học có thuộc về giáo viên này không
        const classroom = await Classrooms.findOne({
            where: { maLop: maLop, maGv: maGv }
        });

        if (!classroom) {
            return res.status(403).json({ error: "Lớp học này không thuộc của bạn" });
        }

        // Kiểm tra xem lớp học có tồn tại và thuộc về giáo viên đang đăng nhập không
        const deletedRowsCount = await Students.destroy({
            where: { maHs:maHs, maLop: maLop }
        });

        if (deletedRowsCount === 0) {
            res.status(404).json({ error: "Học sinh này không thuộc lớp của bạn" });
            return;
        }

        res.status(200).json('Delete complete');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateStudentsByClassroom = async (req, res) => {
    try {
        const { maLop } = req.params;
        const {maHs,tenHs, ngaySinh, soBuoiVang} = req.body
        const userName = req.userName;
        const maGv = await getTeacherMaGv(userName);
        // Kiểm tra xem lớp học có thuộc về giáo viên này không
        const classroom = await Classrooms.findOne({
            where: { maLop: maLop, maGv: maGv }
        });

        if (!classroom) {
            return res.status(403).json({ error: "Lớp học này không thuộc của bạn" });
        }

        const [updatedRowsCount, updatedStudent] = await Students.update(
            { tenHs, ngaySinh, soBuoiVang, maLop },
            { where: { maHs }, returning: true }
        );

        if (updatedRowsCount === 0) {
            res.status(404).json({ error: "Không tìm thấy học sinh" });
            return;
        }

        res.status(200).json(updatedStudent[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports={
    verifyToken,
    getStudentsByClassroom,
    addStudentsByClassroom,
    deleteStudentsByClassroom,
    updateStudentsByClassroom
}