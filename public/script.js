document.querySelector('.all').addEventListener('click', () => {
  fetch('/api/transaction')
  .then(response => response.json())
  .then(data => console.log(data));
});

document.querySelector('.new').addEventListener('click', () => {
  const data = {
    from: 'Ex',
    to: 'Me',
    amount: 400
  };

  fetch('/api/transaction', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log(data));
});

document.querySelector('.update').addEventListener('click', () => {
  const data = {
    from: 'UPD',
    to: 'UPD',
    amount: 200
  };

  fetch('/api/transaction/1', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log(data));
});

document.querySelector('.remove').addEventListener('click', () => {
  fetch('/api/transaction/0', {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => console.log(data));
});