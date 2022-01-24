const mongoose = require ('mongoose')


const questionSchema = new mongoose.Schema({
  description: {
      type:String,
      required: true
      },
  tag: {
      type: [String]
    },
  askedBy: {
      type: String,
      ref: 'User'
    },
  deletedAt: {
    type:Date
 }, 

  isDeleted: {
       type:Boolean,
       default: false
    },
}, { timestamps: true } )

module.exports = mongoose.model('question',questionSchema)