const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')
const courses = require('./_data/courses.json')
dotenv.config({ path: "./config/config.env" });
//const bootcamps = require('./_data/bootcamps.json')
//Load Model
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

//Load env config 


//Connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex:true
})

const db = mongoose.connection;
//Connected
db.once('open', function () {
    console.log(`Connected to db`.brightGreen.inverse)
})

//Error db
db.on('error', function (err) {
    console.error('Connection Error'.brightRed)
})

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

async function importData() {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log('Data Imported'.green)
        process.exit()
    }
    catch (err) {
        console.error(err)
    }
}

async function deleteData() {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log('Data destroyed'.yellow)
        process.exit()
    }
    catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-d') {
    deleteData()
} else if (process.argv[2] === '-i') {
    console.log("Importing data")
    importData()
}



