import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router=Router();

router.post("/",auth(Role.USER,Role.ADMIN,Role.AUTHOR),commentController.createComment);
router.get("/author/:authorId",commentController.getCommentByAuthorId);
router.get("/:commentId",commentController.getCommentByCommentId);
router.put("/:commentId",auth(Role.USER,Role.ADMIN,Role.AUTHOR),commentController.updateComment);
router.delete("/:commentId",auth(Role.USER,Role.ADMIN,Role.AUTHOR),commentController.deleteComment);
router.put("/:commentId/moderate",auth(Role.ADMIN),commentController.moderateComment);


export const commentRoutes=router;
