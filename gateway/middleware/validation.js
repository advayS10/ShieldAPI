const joi = require('joi')

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required(),
});

const signupSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required()
});

const validateRequest = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    req.validateBody = value;
    next();
};

module.exports = {
    validateLogin: validateRequest(loginSchema),
    validateSignup: validateRequest(signupSchema),
}