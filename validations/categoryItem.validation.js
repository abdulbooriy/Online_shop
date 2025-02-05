import Joi from "joi";

function categoryItemValidation(data) {
    const categoryItem = Joi.object({
        category_id: Joi.number().required().positive(),
        product_id: Joi.number().required().positive(),
    });
    return categoryItem.validate(data, {abortEarly: true});
}

export default categoryItemValidation;