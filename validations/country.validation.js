import Joi from "joi";

function countryValidation(data) {
    const country = Joi.object({
        name_uz: Joi.string().required(),
        name_ru: Joi.string().required(),
    });
    return country.validate(data, {abortEarly: true});
}

export default countryValidation;