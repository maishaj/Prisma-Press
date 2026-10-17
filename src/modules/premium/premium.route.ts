import { Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { subscriptionGuard } from "../../middlewares/premiumGuard";

const router=Router();

router.get("/", auth(Role.ADMIN,Role.AUTHOR,Role.USER),subscriptionGuard(),premiumController.getPremiumContent);


export const premiumRoutes=router;