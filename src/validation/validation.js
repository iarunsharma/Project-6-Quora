const validator = require("email-validator");
const userModel = require('../models/userModel');

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidMobileNum = function (value) {
    if (!(/^[6-9]\d{9}$/.test(value))) {
        return false
    }
    return true
}

const isValidSyntaxOfEmail = function (value) {
    if (!(validator.validate(value))) {
        return false
    }
    return true
}

const validString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


const checkUser = async (req, res, next) => {
    try {
        let userBody = req.body
        if (!isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }
        let { fname, lname, email, phone, password, creditScore } = userBody;
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "Please provide fname" });
        }
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "Please provide lname" });
        }
        if (!isValid(creditScore)) {
            return res.status(400).send({ status: false, message: "Please provide creditScore" });
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please provide Email id" });;
        }
        if (!isValidSyntaxOfEmail(email)) {
            return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
        }

        if (!validString(phone)) {
            return res.status(400).send({ status: false, message: 'phone number is Required' })
        }
        if (phone) {
            if (!isValid(phone)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide Phone number." })
            }
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: `Please enter a valid Indian phone number.` });
            }
            let isPhoneAlredyPresent = await userModel.findOne({ phone: phone })
            if (isPhoneAlredyPresent) {
                return res.status(400).send({ status: false, message: `Unable to update phone. ${phone} is already registered.` });
            }
        }
    
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please provide password" });;
        }
        let size = Object.keys(password.trim()).length
        if (size < 8 || size > 15) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
        }
        if (!isValid(creditScore)) {
             return res.status(400).send({ status: false, message: "Please provide creditScore" });
            }

        const isEmailAlreadyUsed = await userModel.findOne({ email }); 

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        }
        
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}




const checkUpdateUser = async (req, res, next) => {
    try {
        let userBody = req.body
        if (!isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }
        let { fname, lname, email, phone} = userBody;
        if (!validString(fname)) {
            return res.status(400).send({ status: false, message: "Please provide fname " });
        }

        if (!validString(lname)) {
            return res.status(400).send({ status: false, message: "Please provide lname" });
        }
       
        if (email) {
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide email" })
            }
            if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
                return res.status(400).send({ status: false, message: `Email should be a valid email address` });
            }
            let isEmailAlredyPresent = await userModel.findOne({ email: email })
            if (isEmailAlredyPresent) {
                return res.status(400).send({ status: false, message: `Unable to update email. ${email} is already registered.` });
            }
        }

        if (!validString(phone)) {
            return res.status(400).send({ status: false, message: 'phone number is Required' })
        }
        if (phone) {
            if (!isValid(phone)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide Phone number." })
            }
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: `Please enter a valid Indian phone number.` });
            }
            let isPhoneAlredyPresent = await userModel.findOne({ phone: phone })
            if (isPhoneAlredyPresent) {
                return res.status(400).send({ status: false, message: `Unable to update phone. ${phone} is already registered.` });
            }
        }             
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}



module.exports ={ checkUser ,isValidRequestBody,checkUpdateUser, isValidMobileNum}





