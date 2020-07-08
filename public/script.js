document.querySelector('button').addEventListener('click', () => {
  fetch('/api/transaction')
  .then(response => response.json())
  .then(data => console.log(data));
});