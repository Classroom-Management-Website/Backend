const db = require('../models')
const Classrooms = db.classrooms
const Teachers = db.teachers


const jwt = require('jsonwebtoken');

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

// Function to get teacher's maGv by userName
const getTeacherMaGv = async (userName) => {
    try {
        const teacher = await Teachers.findOne({
            where: { userName: userName },
            attributes: { exclude: ['passWord'] }
        });

        return teacher ? teacher.maGv : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


const addClassroom = async (req, res) => {
    try {
        const userName = req.userName;
        const { tenLopHoc, lichHoc } = req.body;

        const maGv = await getTeacherMaGv(userName);

        if (maGv) {
            const classroom = await Classrooms.create({ tenLopHoc, lichHoc, maGv });
            res.status(201).json(classroom);
        } else {
            res.status(404).json({ error: "Teacher not found for the given userName" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateClassroom = async (req, res) => {
    try {
        const { maLop } = req.params;
        const { tenLopHoc, lichHoc } = req.body;
        const userName = req.userName;

        const maGv = await getTeacherMaGv(userName);

        if (maGv) {
            // Check if the classroom with maLop belongs to the teacher with maGv
            const classroom = await Classrooms.findOne({
                where: { maLop, maGv },
            });

            if (!classroom) {
                res.status(403).json({
                    error: "You are not allowed to update this classroom",
                });
                return;
            }

            const [updatedRowsCount, updatedClassroom] = await Classrooms.update(
                { tenLopHoc, lichHoc, maGv },
                { where: { maLop }, returning: true }
            );

            if (updatedRowsCount === 0) {
                res.status(404).json({ error: "Classroom not found" });
                return;
            }

            res.status(200).json(updatedClassroom[0]);
        } else {
            res
                .status(404)
                .json({ error: "Teacher not found for the given userName" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// Controller xóa lớp học trong phạm vi giáo viên đang đăng nhập
const deleteClassroom = async (req, res) => {
    try {
        const { maLop } = req.params;
        const userName = req.userName
        const maGv = await getTeacherMaGv(userName);

        // Kiểm tra xem lớp học có tồn tại và thuộc về giáo viên đang đăng nhập không
        const deletedRowsCount = await Classrooms.destroy({
            where: { maLop, maGv: maGv }
        });

        if (deletedRowsCount === 0) {
            res.status(404).json({ error: "Classroom not found or not owned by the logged-in teacher" });
            return;
        }

        res.status(200).json('Delete complete');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getClassroomsByTeacher = async (req, res) =>{
    try{
        const userName = req.userName;
        const maGv = await getTeacherMaGv(userName);
        if (maGv) {
            const classrooms = await Classrooms.findAll({
                where: {maGv},
                attributes: { exclude: ['maGv'] }
            })
            res.status(200).json(classrooms);
        } else {
            res.status(404).json({ error: "Teacher not found for the given userName" });
        }
    }catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const diemDanh = async (req, res) => {
    try {
        const { maLop } = req.params;
        const { thoiGianDiemDanh } = req.body;
        const userName = req.userName;
        const maGv = await getTeacherMaGv(userName);

        const classroom = await Classrooms.findOne({
            where: { maLop: maLop, maGv: maGv }
        });

        if (!classroom) {
            return res.status(403).json({ error: "Lớp học này không thuộc về bạn" });
        }

        // Lấy giá trị hiện tại của thongTinBuoiVang
        const existingThongTinBuoiVang = JSON.parse(classroom.thongTinDiemDanh) || [];

        // Kiểm tra giá trị thoiGianVang
        if (thoiGianDiemDanh) {
            // Thêm giá trị mới vào mảng nếu nó không tồn tại
            if (!existingThongTinBuoiVang.includes(thoiGianDiemDanh)) {
                existingThongTinBuoiVang.push(thoiGianDiemDanh);

                // Cập nhật thông tin buổi vắng
                await Classrooms.update(
                    { thongTinDiemDanh: JSON.stringify(existingThongTinBuoiVang) },
                    { where: { maGv, maLop } }
                );

                res.status(200).json({ message: "Điểm danh thành công" });
            } else {
                res.status(200).json({ message: "Thời gian đã được điểm danh trước đó" });
            }
        } else {
            res.status(400).json({ error: "Thiếu thời gian vắng" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    addClassroom,
    updateClassroom,
    deleteClassroom,
    getClassroomsByTeacher,
    verifyToken,
    diemDanh,
};