const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//html routes
app.get('/notes', (req, res) => 
    // should return the notes.html file
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) => 
    // should return the index.html file
    res.sendFile(path.join(__dirname, '/public/index.html'))
)


//api routes
app.get('/api/notes', (req, res) => {
    // should read the db.json file and return all saved notes as JSON
    fs.readFile("/db/db.json","utf-8",(err,data)=>{
        if(err){
            return res.status(500).json({msg:"error reading db"})
        } else {
            const dataArr = JSON.parse(data);
            return res.json(dataArr)
        }
    })
})

app.post('/api/notes', (req, res) => {
    // should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
    fs.readFile('/db/db.json', 'utf-8', (err, data) => {
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
            fs.writeFile('/db/db.json', JSON.stringify(dataArr, null, 4), (err) => {
                if (err) {
                    return res.status(500).json({msg: 'error writing db'})
                } else {
                    return res.json(newNote)
                }
            })
        }
    })
})


// BONUS
app.delete('/api/notes/:id', (req, res) => {
    // should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
})


app.listen(3001, () =>
  console.log(`App listening at http://localhost:3001 🚀`)
);