import express from "express";
import {
  getProfileInfo,
  postProfileInfo,
  postUserLogin,
} from "../controller/profileInfo.controller.js";

import {
  getAddsInfo,
  getSpecificAdd,
  postAdds,
  getPostedAdsByAnUser,
  editPostedAddsByAnUser,
  putUpdateAdds,
  postDeleteAdds,
} from "../controller/adds.controller.js";

const bikroyDotComRoutes = express();

// ✔ Default Route
bikroyDotComRoutes.get("/", (req, res) =>
  res.send("Welcome to Bikroy.com backend")
);

// ✔ User Login / Register
bikroyDotComRoutes.post("/userLogin", postUserLogin);

// ✔ Get Profile Info
bikroyDotComRoutes.get("/getProfileInfo", getProfileInfo);

// ✔ Update Profile Info
bikroyDotComRoutes.post("/postProfileInfo", postProfileInfo);

// ✔ Get All Ads
bikroyDotComRoutes.get("/getAddsInfo", getAddsInfo);

// ✔ Get Specific Ad
bikroyDotComRoutes.get("/getSpecificAdd", getSpecificAdd);

// ✔ Post New Add
bikroyDotComRoutes.post("/postAdds", postAdds);

// ✔ View Posted Adds by User
bikroyDotComRoutes.get("/getPostedAddsByAnUser", getPostedAdsByAnUser);

// ✔ Edit Specific Ad
bikroyDotComRoutes.get("/editPostedAddsByAnUser", editPostedAddsByAnUser);

// ✔ Update Ad
bikroyDotComRoutes.put("/updateAdds", putUpdateAdds);

// ✔ Delete Ad + Orders
bikroyDotComRoutes.post("/deleteAdds", postDeleteAdds);

export default bikroyDotComRoutes;
