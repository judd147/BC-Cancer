let res, json;
// res = await fetch('http://localhost:3000/auth/signup', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         username: 'test66666',
//         password: 'test66666',
//     }),
// });

// let json = await res.json();
// console.log(json);

res = await fetch('http://localhost:3000/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'test66666',
    password: 'test66666',
  }),
});
const session = res.headers.get('set-cookie');
console.log(session);

res = await fetch('http://localhost:3000/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    cookie: session,
  },
  body: JSON.stringify({
    name: 'Event',
    date: new Date().toISOString(),
    addressLine1: 'test address',
    city: 'test city',
    donorsList: [1, 5, 6],
  }),
});

json = await res.json();
console.log(json);
