import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { registerUserPayload } from "./user.interface";

const registerUserIntoDB=async(payload:registerUserPayload)=>{

   const {name,email,password,profilePhoto}=payload;

   const isUserExists=await prisma.user.findUnique({
    where: {email}
  })

  if(isUserExists){
     throw new Error("User with this email already exists.");
  }

  const hashedPassword=await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

  const createdUser=await prisma.user.create({
    data:{
        name,
        email,
        password:hashedPassword,
        profile:{
            create:{
                profilePhoto
            }
        }
    }
  });

//   await prisma.profile.create({
//     data:{
//         userId:createdUser.id,
//         profilePhoto
    
//   }});

  const user=await prisma.user.findUnique({
    where:{
        id:createdUser.id,
        email:createdUser.email || email
    },
    omit:{
        password:true
    },
    include:{
        profile:true
    }
  });

  return user;
}

const getMyProfileFromDB=async(userId:string)=>{
   const user=await prisma.user.findUniqueOrThrow({
    where:{id:userId},
    omit:{
        password:true
    },
    include:{
        profile:true
    }
   })
   return user;
}

const updateMyProfileInDB=async(userId:string,payload:any)=>{
    const {name,email,profilePhoto,bio}=payload;

    const updatedUser=await prisma.user.update({
        where:{id:userId},
        data:{
            name:name,
            email:email,
            profile:{
                update:{
                    profilePhoto:profilePhoto,
                    bio:bio
                }
            }
        },
        omit:{
            password:true
        },
        include:{
            profile:true
        }
    })

    return updatedUser;

}

export const userService={
    registerUserIntoDB,
    getMyProfileFromDB,
    updateMyProfileInDB
}