const fs = require("fs")

const {
  asyncReadFile,
  asyncWriteFile
} = require('./dao')

exports.getTask = async (req, res) => {
  const id = req.params.id
  const file = await asyncReadFile('./data.json')
  const tasks = JSON.parse(file).filter(function (e) { return e.id == id; })
  tasks.length == 0 ? res.status(404).send() : res.send(tasks[0])
}

exports.getAllTasks = (req, res) => fs.readFile(req.app.locals.dataFilePath, "utf-8", (err, data) => {
  if (err) {
    return res.status(500).send()
  }
  res.send(JSON.parse(data))
})

exports.createTask = async (req, res) => {
  const newTask = req.body
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const tasks = JSON.parse(file)
  if (tasks.filter(function (e) { return e.id == newTask.id; }).length != 0) {
    res.status(400).send()
  } else {
    newTask.createdTime = new Date()
    tasks.push(newTask)
    await asyncWriteFile(JSON.stringify(tasks), req.app.locals.dataFilePath)
    res.status(201).send(tasks)
  }
}


