const { Router } = require("express");
const router = Router();

const Attendance = require("../models/Attendance");

const auth = require("../middleware/auth");

router.get("/student/:id", auth, async (req, res) => {
  console.log("hi from att");
  try {
    const studentId = req.params.id;
    const att = await Attendance.find({ studentId });
    console.log(att);
    return res.status(200).json({
      sucess: true,
      data: att,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      data: "Server error",
      err: err,
    });
  }
});

router.get("/student/:id/:month", auth, async (req, res) => {
  try {
    let result = [];
    const studentId = req.params.id;
    const reqMonth = req.params.month;
    const att = await Attendance.find({ studentId });
    console.log(att);
    for (let i = 0; i < att.length; i++) {
      const date = new Date(att[i].date);
      let month = date.getMonth();
      month = (month + 1).toString();
      console.log(reqMonth === month);
      if (reqMonth === month) {
        result.push(att[i]);
      }
    }
    return res.status(200).json({
      sucess: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      data: "Server error",
      err: err,
    });
  }
});

router.get("/months", async (req, res) => {
  const agg = await Attendance.aggregate([
    { $project: { month: { $month: "$date" } } },
    { $group: { _id: { month: "$month" } } },
  ]);
  console.log(agg);
});

router.post("/", auth, async (req, res) => {
  try {
    const studentId = req.body.studentId;
    const { status, date } = req.body;
    let attendance;
    if (date) {
      attendance = await Attendance.create({ studentId, date, status });
    } else {
      attendance = await Attendance.create({ studentId, status });
    }
    console.log(attendance);
    return res.status(201).json({
      sucess: true,
      data: attendance,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      data: "Server error",
      err: err,
    });
  }
});

module.exports = router;
