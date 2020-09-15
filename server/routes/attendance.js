const { Router } = require("express");
const router = Router();

const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Student = require("../models/Student");

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

router.get("/class/:classId", async (req, res) => {
  try {
    const cls = await (await Class.findById(req.params.classId)).toJSON();
    const stu = cls.students;
    let data = [];
    for (let i = 0; i < stu.length; i++) {
      console.log(stu);
      try {
        const det = await Student.findById(stu[i].student);
        const att = await Attendance.find({ studentId: stu[i].student });
        console.log({
          name: det.name,
          rollNo: det.info.rollNo,
          _id: det._id,
          attendance: att.map((at) => at.status),
        });
        data.push({
          name: det.name,
          rollNo: det.info.rollNo,
          attendance: att.map((at) => at.status),
          _id: det._id,
        });
      } catch (err) {
        console.log(err);
      }
    }
    console.log(data);
    res.json({ data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// router.get("/months", async (req, res) => {
//   const agg = await Attendance.aggregate([
//     { $project: { month: { $month: "$date" }, studentId: 1, status: 1 } },
//     {
//       $group: {
//         _id: { month: "$month", stid: "$studentId" },
//         ssum: { $sum: 1 },
//         stats: "$status",
//       },
//     },
//   ]);
//   console.log(agg);
// });

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

router.post("/class", async (req, res) => {
  let { date, attendances } = req.body;
  date = date.slice(0, 10);
  console.log(date: {
    $gte: new Date(date),
    $lt: new Date(date + 1),
  });
  const exists = await Attendance.find({
    date: {
      $gte: new Date(date),
      $lt: new Date(date + 1),
    },
    studentId: attendances[0].studentId,
  });
  console.log({
    date,
    studentId: attendances[0].studentId,
  });
  console.log(exists);
  if (exists.length === 0) {
    let data = attendances.map((at) => {
      at.date = date;
      return at;
    });
    try {
      console.log(data);
      // const result = await Attendance.insertMany(data);
      // res.json({ result });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(400).json({ error: "Attendance already exists" });
  }
});

module.exports = router;
