const expect = require('chai').expect

const getFileExtension = require('../../lib/get-file-extension')

describe('GetFileExtension', () => {
  it('Should return the expected extension of a javascript file', () => {
    expect(getFileExtension('file.js')).equal('js')
  })

  it('Should return the expected extension of a css file', () => {
    expect(getFileExtension('file.css')).equal('css')
  })

  it('Should return the expected extension (css) of a brotli file', () => {
    expect(getFileExtension('file.css.br', {previous: true})).equal('css')
  })

  it('Should return the expected extension (js) of a gzip file with extension .gzip', () => {
    expect(getFileExtension('file.js.gzip', {previous: true})).equal('js')
  })

  it('Should return the expected extension (js) of a gzip file with extension .gz', () => {
    expect(getFileExtension('file.js.gz', {previous: true})).equal('js')
  })
})
