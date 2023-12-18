const express = require('express');

const router = express.Router();

const studentsController = require('../controllers/studentsController');
router.get('/:maLop',studentsController.verifyToken,studentsController.getStudentsByClassroom)
router.post('/:maLop',studentsController.verifyToken,studentsController.addStudentsByClassroom)
router.delete('/:maLop',studentsController.verifyToken,studentsController.deleteStudentsByClassroom)
router.put('/:maLop',studentsController.verifyToken,studentsController.updateStudentsByClassroom)
module.exports = router