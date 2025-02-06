import joi from "joi"

let userValid = joi.object({
    fullname:joi.string().required(),
    phone:joi.string().required().max(15),
    password:joi.string().required(),
    role:joi.string().required()

});

export default userValid;   