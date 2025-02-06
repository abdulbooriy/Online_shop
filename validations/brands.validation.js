import Joi from "joi";

function brandValidation(data) {
    const brands = Joi.object({
        name_uz: Joi.string().required(),
        name_ru: Joi.string().required(),
        image: Joi.string().required(),
    });
    return brands.validate(data, {abortEarly: true});
}

export default brandValidation;