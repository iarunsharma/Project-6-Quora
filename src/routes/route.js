const express = require('express');
const router = express.Router();
const validator = require("../validation/validation");
const UserController= require("../controllers/userController")
const Middleware = require("../Middleware/authentication")
const QuestionController= require("../controllers/questionController")

const answerController=require("../controllers/answerController")

//userApi
router.post('/register', validator.checkUser, UserController.createUser);
router.post('/login',UserController.login)
router.get('/user/:userId/profile',Middleware.checkLogin,UserController.getUser)
router.put('/user/:userId/profile',validator.checkUpdateUser,Middleware.checkLogin,UserController.UpdateUser)

//questionApi
router.post('/question',Middleware.checkLogin,QuestionController.createquestion)
router.get('/questions',QuestionController.getQuestions )
router.get('/questions/:questionId',QuestionController.getQuestionById )
router.delete('/questions/:questionId',Middleware.checkLogin,QuestionController.deleteQuestion)
router.put('/questions/:questionId',Middleware.checkLogin,QuestionController.updatequestion )

//answerApi
router.post('/answer',Middleware.checkLogin,answerController.createAnswer)
router.get('/questions/:questionId/answer',answerController.getdetails)
router.put('/answer/:answerId',Middleware.checkLogin,answerController.updateanswer)
router.delete('/answer/:answerId',Middleware.checkLogin,answerController.deleteanswer)


module.exports = router;