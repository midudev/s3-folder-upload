const {promises: fs} = require('fs')

async function readFilesFor(path = './') {
  const entries = await fs.readdir(path, {withFileTypes: true})
  // Get files within the current directory and add a path key to the file objects
  const files = entries
    .filter(file => !file.isDirectory())
    .map(file => `${path + file.name}`)
  // Get folders within the current directory
  const folders = entries.filter(folder => folder.isDirectory())
  /*
    Add the found files within the subdirectory to the files array by calling the
    current function itself
  */
  for (const folder of folders)
    files.push(...(await readFilesFor(`${path}${folder.name}/`)))

  return files
}

module.exports = readFilesFor
