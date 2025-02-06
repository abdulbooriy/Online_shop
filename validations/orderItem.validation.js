import joi from "joi";

function orderItemValidation(data){
    let orderItems = joi.object({
        order_id: joi.number().positive().required(),
        product_id: joi.number().positive().required(),
        count: joi.number().positive().required(),
        total: joi.number().positive().optional()
    });
    return orderItems.validate(data,{abortEarly:true});
}

export default orderItemValidation;