#!/usr/bin/node



const fs = require('fs')
const sizeOf = require('image-size')
const FileType = require('file-type')
const tesseract = require("node-tesseract-ocr")

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}




const args = process.argv.slice(2)

const directory = args[0]

fs.readdir(directory, (err, files) => {
    if (err) {
        throw err
    }

    // files object contains all files names
    // log them on console

    let index = {}

    files.forEach(async file => {
        try {
            const file_type = await FileType.fromFile(directory + file)
            const transcription = await tesseract.recognize(directory + file, config)
              

            const dimensions = sizeOf(directory + file)
            index[file] = {
                file,
                file_type,
                dimensions,
                transcription
            }

            writeIndex(JSON.stringify(index))
            console.log(index)
        } catch(e){
            console.log(e)
        }
    })

})


function writeIndex(index_data){
	fs.writeFile(`${directory}/index.json`, index_data, err => {
	  if (err) {
	    console.error(err)
	    return
	  }
	  //file written successfully
	})

}

