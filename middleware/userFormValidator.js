const Joi = require('joi');
const findUser = require('../repositories/usersRepository').findUser

const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(8).required(),
});


module.exports = function userFormValidator  (req, res, next) {
    const result = schema.validate(req.body)
    if(result.error) {
        return res.status(400).json({message: result.error.details[0].message})
    }
    const user = findUser(req.body.email)
    if(user) {
        return res.status(400).json({message: 'Email already in use'})
    }
    if(!req.value) {
        req.value = {}
    }
    req.value['body'] = result.value
    next()
}


