//Credence assignment_ Aryan-Bansal
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Credence", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema and model
const credenceSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String,
});

const Credence = mongoose.model("Credence", credenceSchema);

//"CREATE" endpoint
app.post("/create", async (req, res) => {
  try {
    const newDocument = new Credence(req.body);
    const result = await newDocument.save();
    res.status(201).send(`New document inserted with _id: ${result._id}`);
  } catch (error) {
    res.status(500).send("Error inserting document: " + error.message);
  }
});

//Read endpoint
app.get("/read", async (req, res) => {
  try {
    const docs = await Credence.find();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).send("Error fetching documents: " + error.message);
  }
});

//update endpoint
app.put("/update/:id", async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      img: req.body.img,
      summary: req.body.summary,
    };
    const document = await Credence.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      res.status(404).send("Document not found");
    } else {
      res.status(200).json(document);
    }
  } catch (error) {
    res.status(500).send("Error updating document: " + error.message);
  }
});

// "DELETE" endpoint
app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedDocument = await Credence.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).send("Document not found");
    }
    console.log("Deleted: ", deletedDocument);
    res.status(200).send("Document deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting document: " + error.message);
  }
});

//home page
app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});
// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
