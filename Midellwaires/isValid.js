const bcrypt = require("bcryptjs");
exports.isValid = async (req, res, next) => {
  try {
    const  {code}  = req.body;
    const { userID } = req.params;
    const olduser = await User.findById(userID);
    if (!olduser) return res.status(404).json({ message: "user not found" })
    const isMatch = await bcrypt.compare(code.toString(), olduser.code.toString());
    if (!isMatch)
      return res.status(400).json({ message: "invalid code" });
    res.user = olduser;  
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};