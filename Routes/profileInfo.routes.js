import express from "express";
import {
  getFavoriteAdds,
  getProfileInfo,
  patchAddToFavorites,
  postProfileInfo,
  postUserLogin,
} from "../controller/profileInfo.controller.js";
import { authenticateJWTToken } from "../middleware/authJWT.middleware.js";

const profileInfoRouter = express.Router();

// ✔ User Login / Register//
profileInfoRouter.post("/userLogin", postUserLogin);

// ✔ Get Profile Info//
profileInfoRouter.get("/getProfileInfo", authenticateJWTToken, getProfileInfo);

// ✔ Update Profile Info//
profileInfoRouter.post("/postProfileInfo", postProfileInfo);

// ✔ Adds ad to favorites//
profileInfoRouter.patch("/addToFavorites", patchAddToFavorites);

// ✔ Get favorites ads//
profileInfoRouter.get("/getFavoriteAdds", getFavoriteAdds);

export default profileInfoRouter;
