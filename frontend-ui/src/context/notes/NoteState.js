import NoteContext from "./noteContext";
import { useState } from "react";
import axios from "axios";
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all Notes
  const getNotes = () => {
    // API Call
    axios
      .get(`http://localhost:5000/api/notes/fetchNotes`, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response);
        setNotes(response.data);
      })
      .catch((err) => {
        console.log(`your error : ${err}`);
      });
  };

  // Add a Note
  const addNote = async (title, description) => {
    axios
      .post(
        "http://localhost:5000/api/notes/addnote",
        {
          title: title,
          description: description,
        },
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          getNotes();
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Delete a Note
  const deleteNote = async (id) => {
    // API Call
    axios
      .delete(`${host}/api/notes/deletenote/${id}`, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        const newNotes = notes.filter((note) => {
          return note._id !== id;
        });
        setNotes(newNotes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Edit a Note
  const editNote = async (id, title, description) => {
    // API Call

    axios
      .put(
        `${host}/api/notes/updatenote/${id}`,
        {},
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        let newNotes = JSON.parse(JSON.stringify(notes));
        console.log("Your notes", newNotes);

        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if (element._id === id) {
            newNotes[index].title = title;
            newNotes[index].description = description;
            break;
          }
        }
        setNotes(newNotes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
