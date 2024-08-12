const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors())
const morgan = require('morgan');
app.use(express.json());
morgan.token("req-body",(req)=>{
  if(req.method === "POST"){
    return JSON.stringify(req.body)
  }else{
    return 
  }
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/", (req, res) => {
  res.send("<div><h1>hello from server</h1><h2>nothing here</h2></div>");
});
app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get('/info',(req,res)=>{
    const dateNow = new Date();
    
    res.send(`<div><h1>Phonebook has info for ${persons.length} people<br/>${dateNow.toString()}</h1></div>`)
})
app.get('/api/persons/:id',(req,res)=>{
   const id = req.params.id;
   const person = persons.find(obj=>obj.id === id)
   if(person){
     res.json(person)
   }else{
    res.status(404).end()
   }
})
app.delete('/api/persons/:id',(req,res)=>{
  const id = req.params.id;
  persons = persons.filter(obj=>obj.id !== id)
  res.status(204).end()
})
app.post('/api/persons',(req,res)=>{
  const taoID = Math.random() * (1000 + persons.length);
  const body = req.body
  if(!body.name || !body.number){
    return res.status(400).send("fking error")
  }
  const checkExistName = persons.find(obj=>obj.name === body.name)
  if(checkExistName){
    return res.status(400).json({error: 'name must be unique'})
  }

  const newPer = {
    "id": `${taoID}`,
     "name": body.name,
     "number": body.number
  }
  persons = persons.concat(newPer)
  res.json(persons)
})
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`sever running on port ${PORT}`);

});
