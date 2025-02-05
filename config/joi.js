import joi from "joi"

let userValid = joi.object({
    fullname:joi.string().required(),
    phone:joi.string().required().max(15),
    password:joi.string().required(),
    role:joi.string().required()

});


let userPatchValid = joi.object({
    fullname:joi.string(),
    phone:joi.string(),
    password:joi.string(),
    role:joi.string()

});

export { userValid, userPatchValid}
