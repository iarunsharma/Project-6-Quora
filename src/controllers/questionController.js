const questionModel = require('../models/questionModel')
const UserModel = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId;
const answerModel = require('../models/answerModel')

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.length === 0) return false
    return true;
}

//=================================================================================================================================//
//----------     Fifth API to create Question     --------------------------------------------------------------------------------//


const createquestion = async (req, res) => {
    try {
        const { askedBy,tag,description } = req.body;
        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }

        let checkid = ObjectId.isValid(askedBy);
        if (!checkid) {
            return res.status(400).send({ status: false, message: "Please provide a valid userId " })
        }
        if (req.userId != askedBy) {
            return res.status(401).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "Please provide description field" });
        }
        if (!isValid(tag)) {
            return res.status(400).send({ status: false, message: "Please provide tag field" });
        }
        
        const checkUser = await UserModel.findOne({ _id: askedBy })
        if (!checkUser) {
            return res.status(404).send({ status: false, msg: 'you are not a valid user' })
        }

            //   phase 2  
            if(checkUser.creditScore < 100){
                res.status(400).send({ status: false, message: `cannot post any question due to insufficient creditScore ${checkUser.creditScore}` })
                return
            }
            await UserModel.findOneAndUpdate({ _id: askedBy },{creditScore:checkUser.creditScore - 100},{new:true})
        const data = await questionModel.create(req.body)
        return res.status(201).send({ status:true, message: "successfully", data })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



//=================================================================================================================================//
//----------     Sixth API to Get Question     -----------------------------------------------------------------------------------//


const getQuestions = async (req, res) => {
    try {
        const query = req.query
        let filterQuery = { isDeleted: false }
        let { tag, sort } = query
        if (!isValid(tag)) {
            filterQuery['tag'] = tag
        }
        if (sort) {
            if (sort == "descending") {
                sort = -1
            }
            if (sort == "increasing") {
                sort = 1
            }
        }
        var question = await questionModel.find(filterQuery).select({askedBy:1 ,tag:1 ,description:1}).sort({ "createdAt": sort }).lean()
        for (let i = 0; i < question.length; i++) {
            let answer = await answerModel.find({ questionId: question[i]._id }).select({ text: 1, answeredBy: 1 })
            question[i].answers = answer
        }
        return res.status(200).send({ status: true, msg: "questions", Data: question })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//=================================================================================================================================//
//----------     Seventh API to getQuestionById     ------------------------------------------------------------------------------//

const getQuestionById = async function (req, res) {
    try {
  
      let questionId = req.params.questionId;
    let checkid = ObjectId.isValid(questionId);
        if (!checkid) {
            return res.status(404).send({ status: false, message: "Please provide a valid questionId " })
        }
  
      const questionDetail = await questionModel.findOne({ _id: questionId, isDeleted: false });
      if(!questionDetail){
        return res.status(404).send({status:false, message:"question not found"})
      }
  
      const answers = await answerModel.find({ questionId: questionId, isDeleted: false }).select({ text: 1, answeredBy: 1 });

      res.status(200).send({ status: true, message: 'question list', data: {...questionDetail.toObject(),answers}});
  
    } catch (error) {
  
      res.status(500).send({ status: false, error: error.message });
      
    }
  }

//=================================================================================================================================//
//----------     Eighth API to UpdateQuestion     --------------------------------------------------------------------------------//

const updatequestion = async (req, res) => {
    try {
        const params = req.params.questionId;
        const { askedBy,tag,description } = req.body;
        if (!isValidRequestBody(req.body)) {
            return res.status(404).send({ status: false, message: "Please provide data for successful registration" });
        }
        let checkid = ObjectId.isValid(askedBy);
        if (!checkid) {
            return res.status(400).send({ status: false, message: "Please provide a valid userId " })
        }
        let questionid = ObjectId.isValid(params);
        if (!questionid) {
            return res.status(400).send({ status: false, message: "Please provide a valid questionId " })
        }
        if (req.userId != askedBy) {
            return res.status(400).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        
        if(tag){
            if (!isValid(tag)) {
            return res.status(400).send({ status: false, message: "Please provide tag field" });
        }
        }
        if(description){
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "Please provide description field" });
        }
        }
       
        
        const updateUser = await UserModel.findOne({ _id: askedBy })
        if (!updateUser) {
            return res.status(404).send({ status: false, msg: 'you are not a valid user' })
        }
        
        const findquestion = await questionModel.findById({ _id: params,isDeleted:false })
       if (!findquestion) {

            return res.status(404).send({ status: false, message: `No question found ` })

        }

        const upatedquestion = await questionModel.findOneAndUpdate({ questionId: params  },{description:req.body.description,tag:req.body.tag}, { new: true })
        res.status(200).send({ status: true, message: 'question updated successfully', data: upatedquestion });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//=================================================================================================================================//
//----------     Ninth API to deleteQuestion     ---------------------------------------------------------------------------------//

const deleteQuestion = async (req, res) => {
    try {

        const params = req.params.questionId;
        
        let checkid = ObjectId.isValid(params);
        if (!checkid) {
            return res.status(400).send({ status: false, message: "Please provide a valid questionId " })
        }
        
        const findquestion = await questionModel.findById({ _id: params,isDeleted:false })

        if (!findquestion) {

            return res.status(404).send({ status: false, message: `No question found ` })

        }
        const askedBy = findquestion.askedBy
        if (req.userId != askedBy) {
            return res.status(400).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        
       
            const deleteData = await questionModel.findOneAndUpdate({ questionId: params }, { isDeleted: true}, { new: true });
            return res.status(200).send({ status: true, message: "question deleted successfullly.", data: deleteData })
        
    } catch (err) {
        return res.status(500).send({ status: false, message: "Something went wrong", Error: err.message })
    }
}

//-----------     EXPORTS     ----------------------------------------------------------------------------------------------------//

module.exports = {createquestion,deleteQuestion,updatequestion,getQuestionById,getQuestions }