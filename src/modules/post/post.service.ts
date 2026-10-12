import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface"

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

        // 1. Filtering/Exact Match without AND Operator in multiple fields:-

        // where:{
        //     title:"My Third Post",
        //     content:"Prisma"
        // },

        // 2. Filtering/Exact Match with AND Operator:-

        // where:{
        //     AND:[
        //         {
        //            title:"My Third Post",
        //         },
        //         {
        //             content:"Prisma"
        //         },
        //         {
        //             tags:{
        //                 equals:[
        //                     "TypeScript"
        //                 ]
        //             }
        //         }
        //     ]
        // },

        // 3. Searching/Partial Search with OR Operator:-

        // where:{
        //     OR:[
        //         {
        //             title:{
        //                 contains:"Ronaldo",
        //                 mode:"insensitive"
        //             }
        //         },
        //         {
        //             content:{
        //                 contains:"Ron",
        //                 mode:"insensitive"
        //             }
        //         }
        //     ]
        // },

        // 4. Combining Searching(OR Operator) and Filtering(AND Operator):-

        // where:{
        //    //Filtering:-
        //    AND:[
        //     {
        //       //Searching:-
        //       OR:[
        //         {
        //            title:{
        //             contains:"Ron",
        //             mode:"insensitive"
        //            }
        //         },
        //         {
        //            content:{
        //             contains:"Ron",
        //             mode:"insensitive"
        //            }
        //         }
        //       ]
        //     },
        //     {
        //        title:"Ronaldo Nazario"
        //     },
        //     {
        //        content:"Ronaldo"
        //     }
        //    ]
        // },

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
   const transactionResult=await prisma.$transaction(
    async(tx)=>{

        const [totalPosts, 
               totalPublishedPosts,
               totalDraftPosts,
               totalArchivedPosts,
               totalComments,
               totalApprovedComments,
               totalRejectedComments,
               totalPostViewsAggregate
              ]=await Promise.all([
            await tx.post.count(),

            await tx.post.count({
            where:{
                status:PostStatus.PUBLISHED
            }
            }),
            await tx.post.count({
            where:{
                status:PostStatus.DRAFT
            }
            }),
            await tx.post.count({
            where:{
                status:PostStatus.ARCHIVE
            }
            }),
            await tx.comment.count(),
            await tx.comment.count({
            where:{
                status:CommentStatus.APPROVED
            }
            }),
            await tx.comment.count({
            where:{
                status:CommentStatus.REJECTED
            }
            }),
            await tx.post.aggregate({
            _sum:{
                views:true
            }
            })
        ])

        return {
            totalPosts, 
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalPostViews:totalPostViewsAggregate._sum.views
        }
    })

   return transactionResult;
}

const getMyPosts=async(authorId:string)=>{
     const result=await prisma.post.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            comments:true,
            author:{
                omit:{
                    password:true
                }
            },
            _count:{
            select:{
                comments:true
            }
        }
        },
     })
     return result;
}

const getPostById=async(postId:string)=>{
    const transactionResult=await prisma.$transaction(
        async(tx)=>{
            await tx.post.update({
                where:{
                    id:postId
                },
                data:{
                    views:{
                        increment:1
                    }
                }
            });

            const post=await tx.post.findUniqueOrThrow({
                where:{
                    id:postId
                },
                include:{
                    author:{
                        omit:{
                            password:true
                        }
                    },
                    comments:true,
                    _count:{
                        select:{
                            comments:true
                        }
                    }
                }
            });
            return post;
        }
    );
    return transactionResult;
}

const updatePost=async(postId:string, payload:IUpdatePostPayload, authorId:string, isAdmin:boolean)=>{
     const post=await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
     })

     if(!isAdmin && post.authorId!==authorId){
        throw new Error("You are not the owner of this post!");
     }

     const result=await prisma.post.update({
        where:{
            id:postId
        },
        data:payload,
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        }
     })
    return result;
}

const deletePost=async(postId:string, authorId:string, isAdmin:boolean)=>{
   const post=await prisma.post.findUniqueOrThrow({
    where:{
        id:postId
    }
   });

   if(!isAdmin && post.authorId!==authorId){
      throw new Error("You are not the owner of this post!");
    }

    const result=await prisma.post.delete({
        where:{
            id:postId
        }
    })
    return null;
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
