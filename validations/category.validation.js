import Joi from 'joi';

function categoryValidation(data) {
    const category = Joi.object({
        name_ru: Joi.string().required(),
        name_uz: Joi.string().required(),
        image: Joi.string().required(),
    });
    return category.validate(data, {abortEarly: true});
}

export default categoryValidation;