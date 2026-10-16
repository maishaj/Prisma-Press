import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionServices } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const userId=req.user?.id;

   const result=await subscriptionServices.createCheckoutSession(userId as string);

   sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Checkout completed successfully.",
    data:result
   })
})

const handleWebhook=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    console.log("WEBHOOK ROUTE HIT!");

    console.log("Is Buffer:", Buffer.isBuffer(req.body));
     const event=req.body as Buffer;
     const signature=req.headers['stripe-signature'];

     await subscriptionServices.handleWebhook(event,signature as string);

     sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Webhook triggered successfully",
        data:null
     })
})

export const subscriptionController={
    createCheckoutSession,
    handleWebhook
}

