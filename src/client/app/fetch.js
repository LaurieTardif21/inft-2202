const serverUrl = 'https://inft2202-server.onrender.com';
const dcUrl = 'https://inft2202.opentech.durhamcollege.org';
const localUrl = 'http://localhost:3091';


const _url = dcUrl;
function list(){

  const url = new URL('/api/animals', _url);
  const options = {
    method: 'GET', // or 'POST', 'PUT', etc.
    headers: {
      //'Content-Type': 'application/json',
      //'User': 'studentId',
      'apiKey': '06ecdba4-4ac1-40bd-83a8-b74a04430a49'
    }
  };

  fetch(url, options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // Process the data here
  })
  .catch(err=>{
    console.error('Error fetching data:', err);
  });
}

async function load(){
  const url = new URL('/api/animals', _url);
  const options = {
    method: 'GET', // or 'POST', 'PUT', etc.
    headers: {
      //'Content-Type': 'application/json',
      //'User': 'studentId',
      'apiKey': '7bfa2060-9d12-42fe-8549-cf9205d269a0'
    }
  };
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
/*
async function add(){
  const url = new URL('/api/animals', _url);
  const options = {
    method: 'POST', // or 'POST', 'PUT', etc.
    headers: {
      'Content-Type': 'application/json',
      'user': 'studentId'
    },
    body: JSON.stringify([{
      "name": "Gorge1",
      "breed": "Grizzly Bear",
      "legs": 4,
      "eyes": 4,
      "sound": "Moo"        
    }])
  };
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}*/

//await add();
await load();
//list();