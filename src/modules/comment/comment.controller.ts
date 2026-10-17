import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { commentService } from "./comment.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status';

const createComment=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})

const getCommentByAuthorId=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})

const getCommentByPostId=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {postId}=req.params;
    const result=await commentService.getCommentByPostId(postId as string);

    sendResponse(res,{
     success:true,
     statusCode:httpStatus.OK,
     message:"Comment retrieved successfully.",
     data:result
    })
})

const updateComment=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})

const deleteComment=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})

const moderateComment=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})


export const commentController={
     createComment,
     getCommentByAuthorId,
     getCommentByPostId,
     updateComment,
     deleteComment,
     moderateComment
}