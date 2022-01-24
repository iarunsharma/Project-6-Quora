const UserModel = require("../models/userModel.js")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const ObjectId = require('mongoose').Types.ObjectId

//================================================================================================================================//
//----------     First API to create user     -----------------------------------------------------------------------------------//

const createUser = async function (req, res) {
    try {
        let userBody = req.body
        let { fname, lname, email, password,creditScore } = userBody
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        const userData = { fname, lname, email, password,creditScore }

        const userDetails = await UserModel.create(userData);
        return res.status(201).send({ status: true, message: "successfully user created", data: userDetails })
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createUser = createUser

//==================================================================================================================================//
//----------     Second API for userLogin     -------------------------------------------------------------------------------------//


const login = async (req, res) => {
    try {
        const Email = req.body.email
        const Password = req.body.password

        let user = await UserModel.findOne({ email: Email });
        if (user) {
            const { _id, password } = user
            const validPassword = await bcrypt.compare(Password, password);
            if (!validPassword) {
                return res.status(400).send({ message: "Invalid Password" })
            }
            let payload = { userId: _id, email: Email };
            const generatedToken = jwt.sign(payload, "Quora");
            res.header('user-login-key', generatedToken);
            return res.status(200).send({ status: true, data: { userId: user._id, token: generatedToken } });
        } else {
            return res.status(401).send({ status: false, message: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports.login = login


//=============================================================================================================================//
//----------     Third API to Get user    ------------------------------------------------------------------------------------//


const getUser = async function (req, res) {
    try {
        let decodedtokenUserId = req.userId
        
        const userId = req.params.userId
        if (!(userId)) {
            return res.status(400).send({ status: false, message: 'Please provide valid userId' })
        }
        let checkId = ObjectId.isValid(userId)
         if (!(checkId)) {
            return res.status(400).send({ status: false, message: 'Please provide valid userId in queryparams' })
        }
        const searchprofile = await UserModel.findOne({ _id: userId })


        if (!searchprofile) {
            return res.status(404).send({ status: false, message: 'user  does not exist' })
        }
        if (!decodedtokenUserId === userId) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }

        const Data = await UserModel.find({ _id: userId })
        return res.status(200).send({ status: true, message: 'user profile details', data: Data })

    } catch (error) {

        return res.status(500).send({ success: false, error: error.message });
    }
}


module.exports.getUser = getUser;

//=============================================================================================================================//
//----------    Fourth API to Update User     --------------------------------------------------------------------------------//

const UpdateUser = async (req, res) => {
    try {
      const  userId = req.params.userId;
       const TokenDetail = req.user
        const requestBody = req.body;
         let checkId = ObjectId.isValid(userId)
         if (!(checkId)) {
            return res.status(400).send({ status: false, message: 'Please provide valid userId in queryparams' })
        }


        const UserFound = await UserModel.findOne({ _id: userId })
        if (!UserFound) {
            return res.status(404).send({ status: false, message: `User not found with given UserId` })
        }
        if (!TokenDetail === userId) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }
        var { fname, lname, email, phone } = requestBody
        const UpdateData = { fname, lname, email, phone }
        const upatedUser = await UserModel.findOneAndUpdate({ _id: userId }, UpdateData, { new: true })
        res.status(200).send({ status: true, message: 'User updated successfully', data: upatedUser });

    } catch (error) {

        return res.status(500).send({ success: false, error: error.message });
    }
}

module.exports.UpdateUser = UpdateUser



