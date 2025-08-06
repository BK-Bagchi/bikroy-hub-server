import mongoose from "mongoose";
import addsInfo from "../models/adds.models.js";

export const getAddsInfo = async (req, res) => {
  try {
    const ads = await addsInfo.find();
    res.send(ads);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSpecificAdd = async (req, res) => {
  const { addId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(addId))
    return res.status(400).json({ error: "Invalid _id format" });

  try {
    const result = await addsInfo.findById(addId);
    if (!result) return res.status(404).json({ error: "Ad not found" });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postAdds = async (req, res) => {
  try {
    const result = await addsInfo.insertOne(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostedAdsByAnUser = async (req, res) => {
  try {
    const email = req.query.userEmail;
    const userAds = await addsInfo.find({ email });
    if (!userAds.length)
      return res.status(404).json({ error: "User not found" });
    res.json({ userAds });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editPostedAddsByAnUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.query._id))
    return res.status(400).json({ error: "Invalid _id format" });
  try {
    const { userEmail, _id } = req.query;
    const add = await addsInfo.findOne({
      _id: new mongoose.Types.ObjectId(_id),
      email: userEmail,
    });

    if (!add) return res.status(404).json({ error: "Ad not found" });
    res.json({ add });
  } catch (err) {
    console.error("Error fetching ad:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const putUpdateAdds = async (req, res) => {
  const { adId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(adId))
    return res.status(400).json({ error: "Invalid adId format" });

  try {
    const objectId = new mongoose.Types.ObjectId(adId);
    const updateData = { ...req.body };
    delete updateData._id;

    const result = await addsInfo.updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount)
      res.status(200).json({ message: "Ad updated successfully" });
    else res.status(404).json({ message: "Ad not found" });
  } catch (err) {
    console.error("Error updating ad:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postDeleteAdds = async (req, res) => {
  const { adId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(adId))
    return res.status(400).json({ error: "Invalid adId format" });

  try {
    const objectId = new mongoose.Types.ObjectId(adId);
    const result = await addsInfo.deleteOne({ _id: objectId });

    if (result.deletedCount)
      return res.status(200).json({ message: "Add Deleted Successfully" });
    else return res.status(404).json({ message: "Ad not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
