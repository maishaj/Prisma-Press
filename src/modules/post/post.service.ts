import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"

const createPost=async(payload:ICreatePostPayload, userId:string)=>{
    const result=await prisma.post.create({
        data:{
            ...payload,
            authorId:userId
        }
    })
    return result;
}

const getAllPosts=async()=>{
    const posts=await prisma.post.findMany({
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        }
    });
    return posts;
}

const getPostsStats=async()=>{

}

const getMyPosts=async()=>{

}

const getPostById=async()=>{

}

const updatePost=async()=>{

}

const deletePost=async()=>{

}

export const postService={
    createPost,
    getAllPosts,
    getPostsStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
}
