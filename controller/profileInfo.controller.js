import profileInfo from "../models/profile.models.js";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";
dotenv.config();

//firebase admin initialization
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
export const postUserLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "idToken is required" });

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const { name, email, picture, uid } = decodedToken;
    const displayName = name;
    const photoURL = picture;
    //prettier-ignore
    const token = jwt.sign({ uid, displayName, email, photoURL }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    let user = await profileInfo.findOne({ email });
    if (!user) {
      user = await profileInfo.create({
        displayName: name,
        email: email,
        photoURL: picture,
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      },
    });
  } catch (err) {
    //prettier-ignore
    if (err.code === "auth/argument-error" || err.code === "auth/id-token-expired")
      return res.status(401).json({ error: "Invalid or expired ID token" });

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProfileInfo = async (req, res) => {
  try {
    const email = req.query.userEmail;
    const data = await profileInfo.find({ email });
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postProfileInfo = async (req, res) => {
  try {
    const { email, ...rest } = req.body;
    const result = await profileInfo.updateOne({ email }, { $set: rest });
    result.modifiedCount > 0
      ? res.status(200).json({ message: "Profile info updated" })
      : res.status(404).json({ message: "Profile not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
