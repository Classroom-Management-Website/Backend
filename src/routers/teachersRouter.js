const teachersController = require("../controllers/teachersController")

const router = require('express').Router()

// router.get('/',teachersController.getAllTeachers)

// router.get('/:id',teachersController.getOneTeachers)

router.post('/register',teachersController.registerTeachers)

router.post('/login',teachersController.loginTeachers)

router.get('/auth/me',teachersController.checkToken)

router.put('/changePassword',teachersController.verifyToken,teachersController.updatePassword)

router.delete('/:id',teachersController.deleteTeachers)

module.exports = router