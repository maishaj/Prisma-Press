import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

// const registerUser=async (req: Request, res: Response) => {
//   try{
//     const payload = req.body;
  
//     const user=await userService.registerUserIntoDB(payload);

//         res.status(httpStatus.CREATED).json({ 
//         success:true,
//         statusCode:httpStatus.CREATED,
//         message: "User registered successfully",
//         data:{
//             user
//         } 
//     });
//   }
//   catch(error){
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success:false,
//         statusCode:httpStatus.INTERNAL_SERVER_ERROR,
//         message:"Failed to register user",
//         error:(error as Error).message
//        })
//   }
// }

const registerUser=catchAsync(async (req: Request, res: Response, next:NextFunction)=>{
    const payload = req.body;
  
    const user=await userService.registerUserIntoDB(payload);

        sendResponse(res,{
          success:true,
          statusCode:httpStatus.CREATED,
          message: "User registered successfully",
          data:{
            user
        }})
    });


const getMyProfile=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

       const profile=await userService.getMyProfileFromDB(req.user?.id as string);

        sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User profile fetched succesfully!",
        data:{
            profile
        }
       })
})

const updateMyProfile=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId=req.user?.id as string;

    const payload=req.body;

    const updatedProfile=await userService.updateMyProfileInDB(userId,payload);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User profile updated successfully!",
        data:{
            updatedProfile
        }
    })
})

export const userController={
    registerUser,
    getMyProfile,
    updateMyProfile
}

