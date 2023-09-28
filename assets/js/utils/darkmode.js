const DarkMode = {
  init ({ darkModeToggle, currentMode }) {
    this._checkDarkMode(currentMode, darkModeToggle)
    darkModeToggle.addEventListener('click', () => {
      this._changeMode(darkModeToggle)
    })
  },

  _toggleDarkMode (darkModeToggle, activate) {
    const sweatAlertDarkMode = document.getElementById('sweetalert-dark')
    if (activate) {
      document.body.classList.add('darkmode')
      sweatAlertDarkMode.removeAttribute('disabled')
      window.localStorage.setItem('darkMode', '1')
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    } else {
      document.body.classList.remove('darkmode')
      sweatAlertDarkMode.setAttribute('disabled', 'disabled')
      window.localStorage.setItem('darkMode', 'null')
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    }
  },

  _checkDarkMode (currentMode, darkModeToggle) {
    this._toggleDarkMode(darkModeToggle, currentMode === '1')
  },

  _changeMode (darkModeToggle) {
    const currentMode = window.localStorage.getItem('darkMode')
    this._toggleDarkMode(darkModeToggle, currentMode !== '1')
  }
}

export default DarkMode
