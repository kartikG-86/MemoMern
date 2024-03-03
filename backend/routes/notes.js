const express = require('express')
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const {body,validationResult} = require('express-validator')


// Fetch all Notes of logged in user
router.get('/fetchNotes',fetchuser, async(req,res)=>{
    const notes = await Notes.find({user:req.user.id})
    res.json(notes)
})


// Add new note of logged in user
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', 'Description must be atleast 15 characters').isLength({ min: 15 }),], async (req, res) => {
        try {

            const note = await Notes.create({
                title:req.body.title,
                description:req.body.description,
                user:req.user.id
            })
          
            res.json(note)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })


// update an existing note
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
       

       // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        console.log(note)
        if (!note) {
             return res.status(404).send("Not Found")
             }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router