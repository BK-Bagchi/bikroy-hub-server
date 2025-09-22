import express from "express";
import {
  getAddsInfo,
  getSpecificAdd,
  postAdds,
  getPostedAdsByAnUser,
  editPostedAddsByAnUser,
  putUpdateAdds,
  postDeleteAdds,
  putUpdateAddStatus,
} from "../controller/adds.controller.js";

const addsRouter = express.Router();

// ✔ Get All Ads//
addsRouter.get("/getAddsInfo", getAddsInfo);

// ✔ Get Specific Ad//
addsRouter.get("/getSpecificAdd", getSpecificAdd);

// ✔ Post New Add//
addsRouter.post("/postAdds", postAdds);

// ✔ View Posted Adds by User//
addsRouter.get("/getPostedAddsByAnUser", getPostedAdsByAnUser);

// ✔ Edit Specific Ad//
addsRouter.get("/editPostedAddsByAnUser", editPostedAddsByAnUser);

// ✔ Update Ad//
addsRouter.put("/updateAdds", putUpdateAdds);

// ✔ Update Ad Status//
addsRouter.put("/updateAddStatus", putUpdateAddStatus);

// ✔ Delete Ad//
addsRouter.post("/deleteAdds", postDeleteAdds);

export default addsRouter;
