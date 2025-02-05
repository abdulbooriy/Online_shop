import joi from 'joi';

function productValidation(data){
    const products = joi.object({
        name_ru: joi.string().min(4).max(30).required(),
        name_uz: joi.string().min(4).max(30).required(),
        brand_id: joi.number().positive().required(),
        country_id: joi.number().positive().required(),
        price: joi.number().positive().required(),
        oldPrice: joi.number().positive().required(),
        available: joi.boolean().required(),
        description_uz: joi.string().min(3).max(250).required(),
        description_ru: joi.string().min(3).max(250).required(),
        washable: joi.boolean().required(),
        size: joi.string().min(3).max(20).required(),
        image: joi.string().min(3).max(50).required()
    });
    return products.validate(data,{abortEarly:true});
}

export default productValidation;




