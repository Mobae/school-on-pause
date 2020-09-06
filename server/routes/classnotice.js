const { Router } = require("express");
const router = Router();

const auth = require("../middleware/auth");
const { teacher, admin } = require("../middleware/rank");

const ClassNotice = require("../models/ClassNotice");

router.get("/", auth, teacher, async (req, res) => {
  try {
    const { class_ } = req.body;
    const notices = ClassNotice.find({ class: class_ });
    res.status(200).json({ notices });
  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
});

router.post("/", auth, teacher, async (req, res) => {
  try {
    const { title, description, author, date, teacherClass } = req.body;
    const classNotice = new ClassNotice({
      title,
      description,
      author,
      date,
      class: teacherClass,
    });
    await classNotice.save();
  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
});

router.delete("/", auth, admin, async (req, res) => {
  try {
    const { class_, id } = req.body;
    const classNotice = ClassNotice.findOne({ class_, id });
    classNotice.status = "archived";
    await classNotice.save();
  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
});

module.exports = router;