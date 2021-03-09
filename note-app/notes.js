
const fs = require('fs')
const chalk = require('chalk')
const getNotes = () => {
    return 'Your note'
}


const addNotes = ( title, body) =>{
    const notes = loadNotes()
    const duplicateNotes = notes.find((notes)=> notes.title === title)

    if (!duplicateNotes){
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
        console.log(chalk.green.inverse('New note added'))
    }else{
        console.log(chalk.red.inverse('note title exist'))
    }
}
const saveNotes = (notes) =>{
  const dataJSON = JSON.stringify(notes)
  fs.writeFileSync('notes.json', dataJSON)
}
const loadNotes = () => {
    try{
        const  dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    }catch(e){
        return []
    }
}

const removeNotes =(title)=>{
    notes = loadNotes()
    const doubleNote = notes.filter((notes) => notes.title !== title)
    if (notes.length > doubleNote){
        console.log(chalk.green.inverse("Note removed"))
        saveNotes(doubleNote)
    }else{
        console.log(chalk.red.inverse("No note found"))
    }
    
}
const listNotes = ()=>{
    notes = loadNotes()
    notes.forEach((note) =>{
        console.log(chalk.inverse('your note'))
        console.log(note.title)
    })
}
const readNotes =(title)=>{
    const notes = loadNotes()
    const readMe = notes.find((note)=> note.title === title)
    if(readMe){
        console.log(chalk.inverse(readMe.title))
        console.log(chalk.green(readMe.body))
    }else{
        console.log(chalk.red('No Note found'))
    }
}
module.exports = {
    getNotes:getNotes,
    addNotes:addNotes,
    removeNotes:removeNotes,
    listNotes : listNotes,
    readNotes : readNotes
}