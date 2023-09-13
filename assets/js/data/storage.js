import config from '../utils/const.js'
let books = []
const isStorageExist = () => {
  if (typeof (Storage) === 'undefined') {
    // eslint-disable-next-line no-undef
    Swal.fire({
      title: 'Kesalahan!',
      text: 'Browser anda tidak mendukung local storage',
      icon: 'error'
    })
    return false
  }
  return true
}

const saveBookData = () => {
  if (isStorageExist()) {
    const booksData = JSON.stringify(books)
    localStorage.setItem(config.STORAGE_KEY, booksData)
    document.dispatchEvent(new Event(config.SAVED_EVENT))
  }
}
const loadDataFromStorage = () => {
  if (!isStorageExist()) return
  const serializedData = localStorage.getItem(config.STORAGE_KEY)
  const data = JSON.parse(serializedData)

  if (data !== null) {
    books = data
    document.dispatchEvent(new Event(config.RENDER_EVENT))
  }
}

const findBook = (bookId) => {
  for (const book of books) {
    if (book.id === bookId) return book
  }
  return null
}

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) return index
  }

  return -1
}

const searchBook = (title) => {
  return books.filter((book) => {
    return (book.title.toLowerCase().match(title.toLowerCase())) ? book : null
  })
}
export { books, isStorageExist, saveBookData, loadDataFromStorage, findBookIndex, findBook, searchBook }
