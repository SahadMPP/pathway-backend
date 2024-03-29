const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

// for image
const multer = require('multer');

const path = require("path");

const cors = require("cors");


const app = express();

app.use("/uploads", express.static("uploads"));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// getting model instence

const Student = require("./user_student");

const Teacher = require("./user_teacher");

const Tutorial = require("./tutorial");

const Complaint = require("./complaint");

const Lession = require("./lession");

const Progress = require("./prograss");

const Subject = require("./subject");
// image codes setups

//multer conficaration

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");

    },
    filename: (req, file, cb) => {
        cb(null, req.params.id + ".jpg");
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || IdleDeadline.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
    // fileFilter: fileFilter,
});



//  connecting to mongodb

// const uri = "mongodb+srv://muhdsahad4916:kxvAcV0xZ5MePTKI@testmongo.se5zzhy.mongodb.net/flutter";

const uri = "mongodb+srv://muhdsahad4916:kxvAcV0xZ5MePTKI@testmongo.se5zzhy.mongodb.net/?retryWrites=true&w=majority"

mongoose.set("strictQuery", true);

mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", () => {
    console.log("connection error")


})

db.once("open", () => {

    console.log("connected in mongodb")

    app.get("/", function (req, res) {
        res.send("we are in line locally");
    })

    // updating lesson cover image
    app.patch("/api/add/image_coverImage/:id", upload.single('coverImage'), async (req, res) => {
        let id = req.params.id;
        try {
            const updateLession = await Lession.findByIdAndUpdate(
                id,
                { $set: { coverImage: req.file.path } },
                { new: true }
            );
            if (!updateLession) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.status(200).json(updateLession); // Corrected variable name
        } catch (error) {
            res.status(500).json({ message: "Failed to update lesson", error: error.message }); // Corrected message
        }
    });

    // updating lesson profile image

    app.patch("/api/add/image_lessonProfile/:id", upload.single('lessonProfileImage'), async (req, res) => {
        let id = req.params.id;
        try {
            const updateLession = await Lession.findByIdAndUpdate(
                id,
                { $set: { lessonProfileImage: req.file.path } },
                { new: true }
            );
            if (!updateLession) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.status(200).json(updateLession); // Corrected variable name
        } catch (error) {
            res.status(500).json({ message: "Failed to update lesson", error: error.message }); // Corrected message
        }
    });

    // updating profile image studentImage

    app.patch("/api/add/student_image/:id", upload.single('profileImage'), async (req, res) => {
        let id = req.params.id;
        try {
            const updateStudentImg = await Student.findByIdAndUpdate(
                id,
                { $set: { profileImage: req.file.path } },
                { new: true }
            );
            if (!updateStudentImg) {
                return res.status(404).json({ message: "student not found" });
            }
            res.status(200).json(updateStudentImg);
        } catch (error) {
            res.status(500).json({ message: "Failed to update student", error: error.message }); // Corrected message
        }
    });


     // updating  proflie image studentImage

    app.patch("/api/add/teacher_image/:id", upload.single('profileImage'), async (req, res) => {
        let id = req.params.id;
        try {
            const updateTeacherImg = await Teacher.findByIdAndUpdate(
                id,
                { $set: { profileImage: req.file.path } },
                { new: true }
            );
            if (!updateTeacherImg) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json(updateTeacherImg);
        } catch (error) {
            res.status(500).json({ message: "Failed to update Teacher", error: error.message }); // Corrected message
        }
    });


    // Authentication Apis ------------------------

    //  adding  student
    app.post("/api/add_student", async (req, res) => {
        console.log(req.body);

        const userEmail = req.body.email;

        // not add student if already in added
        const existingUser = await Student.findOne({ email: userEmail });

        if (existingUser) {
            console.log("user already exist");

            return res.status(404).json({
                "status": "User with this email already exists"
            })
        }

        // adding student if not added

        let data = Student(req.body);

        try {
            let dataToStore = await data.save();
            res.status(200).json(dataToStore);
        } catch (error) {

            res.status(400).json({
                "status": error.massage
            })

        }

    })


    //  login for student
    app.post("/api/log_student", async (req, res) => {

        console.log("student log is called");
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        const existingUser = await Student.findOne({ email: userEmail });

        if (!existingUser) {
            return res.status(400).json({
                "status": "user not registed in database"
            })
        }

        if (existingUser.password == userPassword) {
            return res.status(200).json(existingUser)
        } else {
            return res.status(404).json({
                "status": "password is wrong"
            })
        }

    });

    //  login for teacher
    app.post("/api/log_teacher", async (req, res) => {

        console.log("teacher log is called");
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        const existingUser = await Teacher.findOne({ email: userEmail });

        if (!existingUser) {
            return res.status(400).json({
                "status": "user not registed in database"
            })
        }

        if (existingUser.password == userPassword) {

            return res.status(200).json(existingUser)
        } else {
            return res.status(404).json({
                "status": "password is wrong"
            })
        }

    });



    // Admin side / tutorial crud Apis ------------------------

    // add tutorial
    app.post("/api/add_tutorial", async (req, res) => {
        let data = Tutorial(req.body);

        try {
            let dataToStore = await data.save();
            res.status(200).json(dataToStore);
        } catch (error) {

            res.status(400).json({
                "status": error.massage
            })
        }

    });

    // get tutorial
    app.get("/api/get_tutorial", async (req, res) => {
        try {
            let data = await Tutorial.find();
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "Status": "Data not found",
                "error": error.massage,
            })
        }
    });

    // update tutorial
    app.put("/api/update_tutorial/:id", async (req, res) => {
        const tutorialId = req.params.id;
        const updateData = req.body;

        try {

            const updatedTutorial = await Tutorial.findByIdAndUpdate(tutorialId, updateData, { new: true });


            if (!updatedTutorial) {
                return res.status(404).json({ message: "Tutorial not found" });
            }


            res.status(200).json(updatedTutorial);
        } catch (error) {

            res.status(500).json({ message: "Failed to update tutorial", error: error.message });
        }
    });

    // delete tutorial
    app.delete("/api/delete_tutorial/:id", async (req, res) => {
        let id = req.params.id;

        try {
            const data = await Tutorial.findByIdAndDelete(id);
            res.status(200).json({
                "status": "delete successfully",
            })
        } catch (error) {
            res.status(400).json(error.massage);
        }
    });

    // complaint CURD Apis ------------------------

    // add complaint

    app.post("/api/add_complaint", async (req, res) => {
        let data = Complaint(req.body);

        try {
            let dataToStore = await data.save();
            res.status(200).json(dataToStore);
        } catch (error) {

            res.status(400).json({
                "status": error.massage
            })
        }


    });

    // get all complaint  

    app.get("/api/get_complaint", async (req, res) => {
        try {
            let data = await Complaint.find();
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "Status": "Data not found",
                "error": error.massage,
            })
        }
    });

    // delete complaint

    app.delete("/api/delete_complaint/:id", async (req, res) => {
        let id = req.params.id;

        try {
            const data = await Complaint.findByIdAndDelete(id);
            res.status(200).json({
                "status": "delete successfully",
            })
        } catch (error) {
            res.status(400).json(error.massage);
        }
    });


    // Teacher side -- crud

    //  adding  teacher
    app.post("/api/add_teacher", async (req, res) => {

        const userEmail = req.body.email;

        // not add teacher if already in here
        const existingUser = await Teacher.findOne({ email: userEmail });

        if (existingUser) {
            console.log("user already exist");

            return res.status(404).json({
                "status": "User with this email already exists"
            })
        }


        // add teacher is not existe


        let data = Teacher(req.body);

        try {
            let dataToStore = await data.save();
            res.status(200).json(dataToStore);
        } catch (error) {

            res.status(400).json({
                "status": error.massage
            })

        }

    })

    app.get("/api/get_teacher", async (req, res) => {
        try {
            let data = await Teacher.find()
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "status": error.massage
            })
        }
    });

    app.get("/api/get_teacherById/:id", async (req, res) => {
        let id = req.params.id;
        try {
            let data = await Teacher.findById(id)
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "status": error.massage
            })
        }
    });

    // getting one student

    app.get("/api/get_studentById/:id", async (req, res) => {
        let id = req.params.id;
        try {
            let data = await Student.findById(id)
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "status": error.massage
            })
        }
    });

    app.put("/api/update_teacher/:id", async (req, res) => {
        const teacherlId = req.params.id;
        const updateData = req.body;
        try {
            const updatedTeacher = await Teacher.findByIdAndUpdate(teacherlId, updateData, { new: true });
            if (!updatedTeacher) {
                return res.status(404).json({ message: "Tutorial not found" });
            }
            res.status(200).json(updatedTeacher);
        } catch (error) {
            res.status(500).json({ message: "Failed to update tutorial", error: error.message });
        }
    });
    // update student
    app.put("/api/update_student/:id", async (req, res) => {
        let studentId = req.params.id;
        let updateData = req.body;
        let options = { new: true };

        try {
            const updatedstudent = await Student.findByIdAndUpdate(studentId, updateData, options);
            if (!updatedstudent) {
                return res.status(404).json({ message: "student not found" });
            }
            res.status(200).json(updatedstudent);
        } catch (error) {
            res.status(500).json({ message: "Failed to update student", error: error.message });
        }
    });

    // student side crud ------------

    app.get("/api/get_student", async (req, res) => {
        try {
            let data = await Student.find();
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "status": error.massage
            })
        }
    });

    // lession crud

    app.post("/api/add_lession", async (req, res) => {
        let data = Lession(req.body);

        try {
            let dataToStore = await data.save();
            res.status(200).json(dataToStore);
        } catch (error) {

            res.status(400).json({
                "status": error.massage
            })
        }

    });

    // get tutorial
    app.get("/api/get_lession", async (req, res) => {
        try {
            let data = await Lession.find();
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "Status": "Data not found",
                "error": error.massage,
            })
        }
    });

    // get one lesson

    app.get("/api/get_lessionById/:id", async (req, res) => {
        let id = req.params.id;
        try {
            let data = await Lession.findById(id);
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "Status": "Data not found",
                "error": error.massage,
            })
        }
    });
    // update tutorial
    app.put("/api/update_lession/:id", async (req, res) => {
        const tutorialId = req.params.id;
        const updateData = req.body;

        try {

            const updatedTutorial = await Lession.findByIdAndUpdate(tutorialId, updateData, { new: true });


            if (!updatedTutorial) {
                return res.status(404).json({ message: "Tutorial not found" });
            }


            res.status(200).json(updatedTutorial);
        } catch (error) {

            res.status(500).json({ message: "Failed to update tutorial", error: error.message });
        }
    });

    // delete tutorial
    app.delete("/api/delete_lession/:id", async (req, res) => {
        let id = req.params.id;

        try {
            const data = await Lession.findByIdAndDelete(id);
            res.status(200).json({
                "status": "delete successfully",
            })
        } catch (error) {
            res.status(400).json(error.massage);
        }
    });


    // progress Api ---------------------------

    app.post("/api/add_progress", async (req, res) => {
        let data = Progress(req.body);

        try {
            let updateProgress = await data.save();
            res.status(200).json(updateProgress);
        } catch (error) {
            res.status(400).json({
                "status": error.massage
            });
        }

    });

    app.delete("/api/delete_progress/:id", async (req, res) => {
        let id = req.params.id;
        try {
            var deletedData = await Progress.findByIdAndDelete(id);
            res.status(200).json({
                "status": "delete successfully",
            })
        } catch (error) {
            res.status(400).json({
                "Status": error.massage
            })
        }

    });
     
    app.get("/api/get_progress",async(req,res)=>{
       try {
        let data = await Progress.find();
        res.status(200).json(data);
       } catch (error) {
        res.status(404).json({
            "Status": error.massage
        })
       }
    });

    app.get("/api/get_progressById/:id", async (req, res) => {
        let id = req.params.id;
        try {
            let data = await Progress.findById(id);
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json({
                "Status": "Data not found",
                "error": error.massage,
            })
        }
    });
    

    app.put("/api/update_progress/:id", async (req, res) => {
        const tutorialId = req.params.id;
        const updateData = req.body;
        
        try {
            const updatedSubject = await Progress.findByIdAndUpdate(tutorialId, updateData, { new: true });
            if (!updatedSubject) {
                return res.status(404).json({ message: "progress card not found" });
            }
            res.status(200).json(updatedSubject);
        } catch (error) {

            res.status(500).json({ message: "Failed to update progress", error: error.message });
        }
    });
    
    // subject ---------------------

    app.get("/api/get_subject",async(req,res)=>{
        try {
         let data = await Subject.find();
         res.status(200).json(data);
        } catch (error) {
         res.status(404).json({
             "Status": error.massage
         })
        }
     });

     app.put("/api/update_subject/:id", async (req, res) => {
        const tutorialId = req.params.id;
        const updateData = req.body;
        
        try {
            const updatedSubject = await Subject.findByIdAndUpdate(tutorialId, updateData, { new: true });
            if (!updatedSubject) {
                return res.status(404).json({ message: "Subject not found" });
            }
            res.status(200).json(updatedSubject);
        } catch (error) {

            res.status(500).json({ message: "Failed to update Subject", error: error.message });
        }
    });

    app.get("/api/get_subjectById/:subjectName", async (req, res) => {
        try {
            const subjectName = req.params.subjectName;
            const data = await Subject.findOne({ subject: subjectName });
            if (!data) {
                return res.status(404).json({ message: "Subject not found" });
            }
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    
 
});



// connecting to server


const server = app.listen(5000, () => {
    console.log("connected to port 5000");
})


// setuping websoket


const io = require('socket.io')(server);

const connectUser = new Set();

io.on('connection', (socket) => {

    console.log("socket Connected Successfully", socket.id);
    connectUser.add(socket.id);
    io.emit('connected-user', connectUser.size);


    socket.on('disconnect', () => {
        console.log('Disconnected socket', socket.id);
        connectUser.delete(socket.id);
        io.emit('connected-user', connectUser.size);
    });
    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message-receive', data);

    });
});
