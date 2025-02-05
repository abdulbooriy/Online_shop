import joi from "joi";

let userPatchValid = joi.object({
    fullname:joi.string(),
    phone:joi.string(),
    password:joi.string(),
    role:joi.string()
});

export default userPatchValid;