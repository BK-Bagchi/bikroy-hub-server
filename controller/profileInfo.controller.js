import profileInfo from "../models/profile.models.js";

export const postUserLogin = async (req, res) => {
  try {
    const { displayName, email, photoURL } = req.body;
    const exists = await profileInfo.findOne({ email });

    if (exists) return res.status(200).json({ message: "Login successful" });

    const result = await profileInfo.insertOne({
      displayName,
      email,
      photoURL,
    });
    result.insertedId
      ? res.status(200).json({ message: "User created successfully" })
      : res.status(500).json({ error: "Failed to insert user details" });
  } catch (err) {
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
