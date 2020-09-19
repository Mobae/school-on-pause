const { Router } = require("express");
const jwt = require("jsonwebtoken");
router = Router();

const auth = require("../middleware/auth");

router.get("/login", (req, res) => {
  const token = req.get("auth-token");
  const { data } = jwt.verify(token, process.env.JWT_SECRET);
  if (data) {
    res.json({ success: "true" });
  } else {
    res.json({ success: "false" });
  }
});

module.exports = router;
