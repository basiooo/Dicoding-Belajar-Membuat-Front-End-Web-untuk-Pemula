const swRegister = async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
      .then(function () {
        console.log('Service Worker registration success')
      })
      .catch(function (error) {
        console.error('Service Worker registration failed:', error)
      })
    return
  }
  console.log('Service Worker not supported in this browser')
}

export default swRegister
