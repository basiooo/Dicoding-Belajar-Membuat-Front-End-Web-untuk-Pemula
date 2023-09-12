import DarkMode from "./utils/darkmode.js"
import {
    loadDataFromStorage,
    books,
    saveBookData,
    findBookIndex,
    findBook,
    searchBook
} from './data/storage.js'


const unfinishBookList = document.getElementById('unfinish-book-list')
const finishBookList = document.getElementById('finish-book-list')

const generateBookObject = (title, author, year, isComplete) => {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    }
}

const addBook = () => {
    const titleElement = document.getElementById('title').value
    const authorElement = document.getElementById('author').value
    const yearElement = document.getElementById('year').value
    const isCompleteElement = document.getElementById('is_complete').checked
    const bookObject = generateBookObject(titleElement, authorElement, yearElement, isCompleteElement)
    // eslint-disable-next-line no-undef
    // Swal.fire({
    //     title: 'Berhasil!',
    //     text: 'Berhasil Menambahkan Buku!',
    //     icon: 'success'
    // })
    books.push(bookObject)

    document.dispatchEvent(new Event('renderdata'))
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
    bookCardFooter.classList.add('card-footer', 'd-flex', 'justify-content-end', 'gap-2')
    if (!isComplete) {
        bookCardFooter.append(createCompleteButton(id))
    } else {
        bookCardFooter.append(createUnCompleteButton(id))
    }
    bookCardFooter.append(createDeleteButton(id))
    bookCard.append(bookCardFooter)
    return bookCard
}

const createCompleteButton = (bookId) => {
    const completeButton = document.createElement('button')
    completeButton.classList.add('btn-icon', 'p-1', 'btn-checked')
    completeButton.innerHTML = '<i class="fa-solid fa-check-double"></i>'
    completeButton.addEventListener('click', () => moveBookToComplete(bookId))
    return completeButton
}
const createUnCompleteButton = (bookId) => {
    const unCompleteButton = document.createElement('button')
    unCompleteButton.classList.add('btn-icon', 'p-1', 'btn-cross')
    unCompleteButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>'
    unCompleteButton.addEventListener('click', () => moveBookToUncomplete(bookId))
    return unCompleteButton
}

const createDeleteButton = (bookId) => {
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn-icon', 'p-1', 'btn-cross')
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>'
    deleteButton.addEventListener('click', () => deleteBook(bookId))
    return deleteButton
}

const moveBookToComplete = (bookId) => {
    const bookTarget = findBook(bookId)
    bookTarget.isComplete = true
    console.log(bookTarget)
    document.dispatchEvent(new Event('renderdata'))
    saveBookData()
}
const moveBookToUncomplete = (bookId) => {
    const bookTarget = findBook(bookId)
    bookTarget.isComplete = false
    console.log(bookTarget.isComplete)
    document.dispatchEvent(new Event('renderdata'))
    saveBookData()
}
const deleteBook = (bookId) => {
    const bookTarget = findBookIndex(bookId)
    if (bookTarget === -1) return
    // eslint-disable-next-line no-undef
    // Swal.fire({
    //     title: 'Apakah Kamu Yakin Ingin Menghapus ?',
    //     text: 'Buku Yang Telah Dihapus Tidak Dapat Dikembalikan',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#d33',
    //     cancelButtonColor: '#3085d6',
    //     confirmButtonText: 'Ya',
    //     cancelButtonText: 'Tidak'
    // }).then((result) => {
    //     if (result.isConfirmed) {
    //         books.splice(bookTarget, 1)
    //         document.dispatchEvent(new Event('renderdata'))
    //         saveBookData()
    //         // eslint-disable-next-line no-undef
    //         Swal.fire({
    //             title: 'Berhasil!',
    //             text: 'Buku Berhasil Dihapus',
    //             icon: 'success'
    //         }
    //         )
    //     }
    // })
    books.splice(bookTarget, 1)
            document.dispatchEvent(new Event('renderdata'))
            saveBookData()
}

document.addEventListener('renderdata', function () {
    finishBookList.innerHTML = ''
    unfinishBookList.innerHTML = ''
    for (const book of books) {
        const bookListTemplate = makeBook(book)
        if (!book.isComplete) {
            unfinishBookList.append(bookListTemplate)
        } else {
            finishBookList.append(bookListTemplate)
        }
    }
})
document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('add-book-form')
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault()
        addBook()
        console.log(event.target)
        event.target.reset()
    })
    loadDataFromStorage()
})

document.getElementById('search-book-form').addEventListener('input', (event) => {
    finishBookList.innerHTML = ''
    unfinishBookList.innerHTML = ''
    console.log(searchBook(event.target.value))
    searchBook(event.target.value).forEach((book) => {
        const bookListTemplate = makeBook(book)
        if (!book.isComplete) {
            unfinishBookList.append(bookListTemplate)
        } else {
            finishBookList.append(bookListTemplate)
        }
    })
})
window.addEventListener('load', () => {
    DarkMode.init({
        darkModeToggle: document.querySelector('#darkmode-button'),
        currentMode: window.localStorage.getItem('darkMode')
    })
})
