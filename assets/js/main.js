import DarkMode from './utils/darkmode.js'
import config from './utils/const.js'
import swRegister from './utils/register-sw.js'
import {
  loadDataFromStorage,
  books,
  saveBookData,
  findBookIndex,
  findBook,
  searchBook,
  generateBookObject
} from './data/storage.js'

const unfinishBookList = document.getElementById('unfinish-book-list')
const finishBookList = document.getElementById('finish-book-list')
const inputBookTitle = document.getElementById('input-book-title')
const inputBookButton = document.getElementById('input-book-button')
const cancelBookButton = document.getElementById('cancel-book-button')
const searchBookForm = document.getElementById('search-book-form')
const insertBookForm = document.getElementById('insert-book-form')
const fieldTitle = document.getElementById('title')
const fieldAuthor = document.getElementById('author')
const fieldYear = document.getElementById('year')
const fieldIsComplete = document.getElementById('is_complete')

const changeMode = (value = '') => {
  const isEditMode = !!value

  if (isEditMode) {
    fieldTitle.focus()
  }
  cancelBookButton.classList.toggle('d-none', !isEditMode)
  inputBookTitle.innerText = isEditMode ? 'Ubah Buku' : 'Tambah Buku Baru'
  inputBookButton.innerText = isEditMode ? 'Ubah Buku' : 'Tambah Buku'
  inputBookButton.value = isEditMode ? value : ''
}
const insertBook = () => {
  let message = 'Berhasil Menambahkan Buku!'
  const title = fieldTitle.value
  const author = fieldAuthor.value
  const year = fieldYear.value
  const isComplete = fieldIsComplete.checked
  const bookObject = generateBookObject(title, author, year, isComplete)
  if (inputBookButton.value) {
    const bookIndex = findBookIndex(parseInt(inputBookButton.value))
    if (bookIndex === -1) {
      const resetEvent = new Event('reset')
      insertBookForm.dispatchEvent(resetEvent)
      // eslint-disable-next-line no-undef
      Swal.fire({
        title: 'Terjadi Kesalahan!',
        text: 'Buku Tidak Tersedia',
        icon: 'error'
      })
      changeMode()
      return
    }
    books[bookIndex] = bookObject
    message = 'Berhasil Mengubah Buku!'
  } else {
    books.push(bookObject)
  }
  // eslint-disable-next-line no-undef
  Swal.fire({
    title: 'Berhasil!',
    text: message,
    icon: 'success'
  })

  document.dispatchEvent(new Event(config.RENDER_EVENT))
  saveBookData()
}

const makeBook = (bookObject) => {
  const { id, title, author, year, isComplete } = bookObject
  const bookCard = document.createElement('div')
  bookCard.classList.add('card', 'card-secondary')
  bookCard.setAttribute('id', id)
  bookCard.innerHTML = `
    <div class="card-body mt-2">
      <h2>${title}</h2>
      <h3>${author}</h3>
      <h3>${year}</h3>
    </div>
    `
  const bookCardFooter = document.createElement('div')
  bookCardFooter.classList.add(
    'card-footer',
    'd-flex',
    'justify-content-end',
    'gap-2'
  )
  bookCardFooter.append(createDeleteButton(id))
  bookCardFooter.append(createEditButton(id))
  if (!isComplete) {
    bookCardFooter.append(createCompleteButton(id))
  } else {
    bookCardFooter.append(createUnCompleteButton(id))
  }
  bookCard.append(bookCardFooter)
  return bookCard
}

const createCompleteButton = (bookId) => {
  const completeButton = document.createElement('button')
  completeButton.classList.add('btn-icon', 'p-1', 'btn-double-checked')
  completeButton.innerHTML = '<i class="fa-solid fa-check-double"></i>'
  completeButton.addEventListener('click', () => moveBookToComplete(bookId))
  return completeButton
}
const createUnCompleteButton = (bookId) => {
  const unCompleteButton = document.createElement('button')
  unCompleteButton.classList.add('btn-icon', 'p-1', 'btn-checked')
  unCompleteButton.innerHTML = '<i class="fa-solid fa-check"></i>'
  unCompleteButton.addEventListener('click', () =>
    moveBookToUncomplete(bookId)
  )
  return unCompleteButton
}

const createDeleteButton = (bookId) => {
  const deleteButton = document.createElement('button')
  deleteButton.classList.add('btn-icon', 'p-1', 'btn-trash')
  deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>'
  deleteButton.addEventListener('click', () => deleteBook(bookId))
  return deleteButton
}

const createEditButton = (bookId) => {
  const editButton = document.createElement('button')
  editButton.classList.add('btn-icon', 'p-1', 'btn-edit')
  editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>'
  editButton.addEventListener('click', (e) => editBook(bookId))
  return editButton
}

const moveBookToComplete = (bookId) => {
  const bookTarget = findBook(bookId)
  bookTarget.isComplete = true
  document.dispatchEvent(new Event(config.RENDER_EVENT))
  saveBookData()
}
const moveBookToUncomplete = (bookId) => {
  const bookTarget = findBook(bookId)
  bookTarget.isComplete = false
  document.dispatchEvent(new Event(config.RENDER_EVENT))
  saveBookData()
}
const editBook = (bookId) => {
  const bookTarget = findBook(bookId)
  fieldTitle.value = bookTarget.title
  fieldAuthor.value = bookTarget.author
  fieldYear.value = bookTarget.year
  bookTarget.isComplete
    ? (fieldIsComplete.checked = true)
    : (fieldIsComplete.checked = false)
  changeMode(bookTarget.id)
}
const deleteBook = (bookId) => {
  let message = 'Buku Yang Telah Dihapus Tidak Dapat Dikembalikan'
  const bookIndex = findBookIndex(bookId)
  const isEditMode = !!inputBookButton.value
  const sameBook = findBook(bookId).id === parseInt(inputBookButton.value)
  if (isEditMode && sameBook) {
    message =
      'Buku Yang Anda Pilih Sedang Diedit Menghapus Buku Akan Membatalkan Edit'
  }
  if (bookIndex === -1) return
  // eslint-disable-next-line no-undef
  Swal.fire({
    title: 'Apakah Kamu Yakin Ingin Menghapus ?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#007bff',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak'
  }).then((result) => {
    if (result.isConfirmed) {
      books.splice(bookIndex, 1)
      document.dispatchEvent(new Event(config.RENDER_EVENT))
      saveBookData()
      if (isEditMode && sameBook) {
        const resetEvent = new Event('reset')
        insertBookForm.dispatchEvent(resetEvent)
      }
      // eslint-disable-next-line no-undef
      Swal.fire({
        title: 'Berhasil!',
        text: 'Buku Berhasil Dihapus',
        icon: 'success'
      })
    }
  })
}
const emptyBook = () => {
  const emptyBookContainer = document.createElement('div')
  emptyBookContainer.classList.add('text-center', 'mt-1')
  emptyBookContainer.innerHTML = '<h3>Tidak Ada Data</h3>'
  return emptyBookContainer
}

const updateBookLists = (searchValue = '') => {
  finishBookList.innerHTML = ''
  unfinishBookList.innerHTML = ''
  const foundBooks = searchBook(searchValue)

  if (foundBooks.length === 0) {
    unfinishBookList.append(emptyBook())
    finishBookList.append(emptyBook())
    return
  }

  for (const book of foundBooks) {
    const bookListTemplate = makeBook(book)
    if (!book.isComplete) {
      unfinishBookList.append(bookListTemplate)
    } else {
      finishBookList.append(bookListTemplate)
    }
  }
  if (unfinishBookList.childElementCount === 0) {
    unfinishBookList.append(emptyBook())
  }
  if (finishBookList.childElementCount === 0) {
    finishBookList.append(emptyBook())
  }
}

document.addEventListener(config.RENDER_EVENT, () => {
  updateBookLists()
})

document.addEventListener(config.SAVED_EVENT, () => {
  console.log('SAVED_EVENT')
})

searchBookForm.addEventListener('input', (event) => {
  const searchValue = event.target.value
  updateBookLists(searchValue)
})

insertBookForm.addEventListener('submit', (event) => {
  event.preventDefault()
  insertBook()
  event.target.reset()
  changeMode()
})
insertBookForm.addEventListener('reset', (event) => {
  event.target.reset()
  changeMode()
})
searchBookForm.addEventListener('submit', (event) => {
  event.preventDefault()
})
window.addEventListener('load', () => {
  loadDataFromStorage()
  updateBookLists()
  swRegister()
  DarkMode.init({
    darkModeToggle: document.querySelector('#darkmode-button'),
    currentMode: window.localStorage.getItem('darkMode')
  })
})
