import { prisma } from "../../lib/prisma"

const createComment=async()=>{

}

const getCommentByAuthorId=async()=>{
    
}

const getCommentByPostId=async(postId:string)=>{
     const comment=await prisma.comment.findMany({
        where:{
            postId
        },
     })

     return comment;
}

const updateComment=async()=>{
    
}

const deleteComment=async()=>{
    
}

const moderateComment=async()=>{
    
}

export const commentService={
    createComment,
    getCommentByAuthorId,
    getCommentByPostId,
    updateComment,
    deleteComment,
    moderateComment
}
