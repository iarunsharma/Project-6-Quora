const mongoose = require ('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;
const answerSchema = new mongoose.Schema({
    
answeredBy: {
      type: ObjectId,
      ref: 'User',
      required:true
    },
    text:{
        type: String,
        required:true
    },
    questionId:{
        type: ObjectId,
      ref: 'question',
      required:true
    }
    }, { timestamps: true } )

module.exports = mongoose.model('answers',answerSchema)