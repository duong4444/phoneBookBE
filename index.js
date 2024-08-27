const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const phonebook = require("./models/phonebook");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("<div><h1>hello from server</h1><h2>nothing here</h2></div>");
});
app.get("/api/persons", (req, res) => {
  phonebook.find({}).then((pb) => {
    res.json(pb);
  });
});
app.get("/info", (req, res) => {
  const dateNow = new Date();
  phonebook.countDocuments({}).then((count) => {
    res.send(
      `<div><h1>Phonebook has info for ${count} people<br/>${dateNow.toString()}</h1></div>`
    );
  });
});
app.get("/api/persons/:id", (req, res) => {
  phonebook.findById(req.params.id).then((pb) => {
    res.json(pb);
  });
});
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebook
    .findByIdAndDelete(id)
    .then((delPB) => {
      if (delPB) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "phonebook not found" });
      }
    })
    .catch((error) => {
      console.error("Error deleting phonebook:", error);
      res.status(500).json({ error: "internal server error" });
    });
});
app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }
  const newPerson = new phonebook({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  const person = {
    name: body.name,
    number: body.number,
  };
  person.number = req.body.number;
  phonebook
    .findByIdAndUpdate(id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON());
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message});
  }

  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
