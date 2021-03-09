

const chalk = require ('chalk')
const yargs = require ('yargs')
const notes = require('./notes.js')

//customise yargs version
yargs.version ('1.1.0')

//create add
yargs.command({
    command:'add',
    describe: 'Add a new note',
     builder:{
         title: {
             describe: 'Note title',
             demandOption: true, 
             type : 'string'
         },
         body:{
             describe: "Note body",
             demandOption:'true',
             type:'string'
         }
     },
    handler(argv){
        notes.addNotes(argv.title, argv.body)
    }
})
// create remove cpmmand 
yargs.command({
    command : 'remove',
    describe: 'remove a note',
    builder:{
        title:{
            describe: 'note title',
            demandOption: 'true',
            type: 'string'
        }
    },
    handler (argv){
        notes.removeNotes(argv.title)
    }
})
//Listing the note
yargs.command({
    command: 'list',
    describe:'list the note',
    handler (argv){
        notes.listNotes(argv.title)
    }
})
//Reading the note
yargs.command({
    command: "read",
    describe: 'read the note',
    builder:{
        title:{
            describe:'note title',
            demandOption:true,
            type : 'string'
        }
    },
    handler(argv){
        notes.readNotes(argv.title)
    }
})
//add, remove, read, list
//console.log(yargs.argv)
yargs.parse()