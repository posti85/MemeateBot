const fs = require('fs')
const path = require('path')

const dataFilePath = path.join(__dirname, '..', 'data.json')

const emptyData = {
  users: {},
  memes: []
}

let data

const load = (callback = () => {}) => {

  fs.stat(dataFilePath, function(error) {

    if (error) {

      data = emptyData
      callback()

    } else {

      fs.readFile(dataFilePath, 'utf8', (error, strData) => {

        try {

          data = JSON.parse(strData)
          callback()

        } catch (e) {

          callback(e)
        }
      })
    }
  })
}

const save = (callback = () => {}) => {

  const strData = JSON.stringify(data, null, 2)

  fs.writeFile(dataFilePath, strData, callback)
}

const get = () => {

  return data
}

module.exports = {
  load,
  save,
  get
}