const express = require('express');
const classroomsController = require('../controllers/classroomsController');

const router = express.Router();

router.post('/',classroomsController.verifyToken ,classroomsController.addClassroom);

router.put('/:maLop',classroomsController.verifyToken, classroomsController.updateClassroom);

router.delete('/:maLop',classroomsController.verifyToken, classroomsController.deleteClassroom);

router.get('/',classroomsController.verifyToken, classroomsController.getClassroomsByTeacher);

module.exports = router;
