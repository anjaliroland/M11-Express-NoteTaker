const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for homepage
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

// GET Route for reading and returning saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if(err){
            return res.status(500).json({msg:'error reading db'})
        } else {
            const dataArr = JSON.parse(data);
            return res.json(dataArr)
        }
    })
})

// POST Route for adding new notes
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({msg: 'error reading db'})
        } else {
            const dataArr = JSON.parse(data);
            const newNote = {
                id: uuid.v4(),
                title: req.body.title,
                text: req.body.text
            }
            console.log(newNote);
            dataArr.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(dataArr, null, 4), (err) => {
                if (err) {
                    return res.status(500).json({msg: 'error writing db'})
                } else {
                    return res.json(newNote)
                }
            })
        }
    })
})


// DELETE Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({msg: 'error reading from db'})
        } else {
            const dataArr = JSON.parse(data);
            const filteredData = dataArr.filter((note) => note.id !== noteId);
            fs.writeFile('./db/db.json', JSON.stringify(filteredData, null, 4), (err) => {
                if (err) {
                    return res.status(500).json({msg: 'error deleting from db'})
                } else {
                    return res.json({msg: 'note deleted successfully'})
                }
            })
        }
    })
})


app.listen(3001, () =>
  console.log(`App listening at http://localhost:3001 🚀`)
);