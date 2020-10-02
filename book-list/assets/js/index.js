;(document => {
  const $ = (v, s = true) => {
    return s ? document.querySelector(v) : [...document.querySelectorAll(v)]
  }

  const ce = ({
    type = 'div',
    innerHTML = null,
    classes = null,
    children = null,
  }) => {
    const el = document.createElement(type)
    if (innerHTML) el.innerHTML = innerHTML
    if (classes) el.classList.add(...classes)
    if (children) children.forEach(child => el.appendChild(child))
    return el
  }

  const ui = {
    modal: $('#book-form'),
    titleEl: $('#book-title'),
    authorEl: $('#book-author'),
    isbnEl: $('#book-isbn'),
    showModalBtn: $('#add-book-btn'),
    cancelBtn: $('#book-form-cancel'),
    bookList: $('#book-list'),
  }

  const store = {
    books: [],
    addBook(book) {
      this.books = this.books.concat(book)
      localStorage.setItem('books', JSON.stringify(this.books))
      return book
    },
    removeBook(id) {
      this.books = this.books.filter(book => book.id !== id)
      localStorage.setItem('books', JSON.stringify(this.books))
    },
    getBooks() {
      const books = localStorage.getItem('books')
      if (books) {
        this.books = JSON.parse(books)
        return this.books
      }
      return false
    },
  }

  const showModal = () => {
    ui.modal.style.display = 'grid'
    ui.showModalBtn.style.display = 'none'
    ui.titleEl.focus()
  }

  const hideModal = () => {
    ui.titleEl.value = ''
    ui.authorEl.value = ''
    ui.isbnEl.value = ''
    ui.modal.style.display = 'none'
    ui.showModalBtn.style.display = 'block'
  }

  const clearNotifications = () => {
    $('.notification', false).forEach(n => n.remove())
  }

  const makeNotification = ({ text, look, time }) => {
    clearNotifications()
    const div = ce({
      innerHTML: `<span>${text}</span>`,
      classes: ['notification', look],
    })
    $('#add-book').appendChild(div)
    setTimeout(() => clearNotifications(), time * 1000)
  }

  const deleteBook = ({ title, id }) => {
    store.removeBook(id)
    makeNotification({
      text: `Deleted ${title}`,
      look: 'red',
      time: 3,
    })
  }

  class Book {
    constructor({ title, author, isbn, parent, id }) {
      this.title = title
      this.author = author
      this.isbn = isbn
      this.parent = parent
      this.id = id
      this.delBtn = ce({
        type: 'button',
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        classes: ['btn-remove'],
      })
      this.btnContainer = ce({
        type: 'td',
        classes: ['btn-remove-container'],
        children: [this.delBtn],
      })
      this.me = ce({
        type: 'tr',
        innerHTML: `<td>${title}</td><td>${author}</td><td>${isbn}</td>`,
        children: [this.btnContainer],
      })
    }
    remove() {
      deleteBook({ title: this.title, id: this.id })
      this.me.remove()
    }
    render() {
      this.delBtn.addEventListener('click', () => this.remove())
      this.parent.appendChild(this.me)
    }
  }

  const addBook = e => {
    e.preventDefault()
    if (!ui.titleEl.value || !ui.authorEl.value || !ui.isbnEl.value)
      return makeNotification({
        text: 'Please fill out all the fields!',
        look: 'red',
        time: 3,
      })

    const book = {
      title: ui.titleEl.value,
      author: ui.authorEl.value,
      isbn: ui.isbnEl.value,
      id: new Date().getTime(),
    }
    store.addBook(book)
    const bookToRender = new Book({ ...book, parent: ui.bookList })
    bookToRender.render()
    makeNotification({ text: `Created ${book.title}!`, look: 'green', time: 3 })
  }

  const loadBooks = () => {
    const books = store.getBooks()
    books &&
      books.forEach(book => {
        const bookToRender = new Book({ ...book, parent: ui.bookList })
        bookToRender.render()
      })
  }

  document.onload = loadBooks()
  ui.showModalBtn.onclick = showModal
  ui.cancelBtn.onclick = hideModal
  ui.modal.onsubmit = addBook
})(document)
