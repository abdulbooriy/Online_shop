import joi from "joi";

function orderValidation(data){
    let orders = joi.object({
        user_id: joi.number().positive().required(),
        totalPrice: joi.number().positive().required()
    });
    return orders.validate(data,{abortEarly:true});
}

export default orderValidation;