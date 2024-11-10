let res, json;
// res = await fetch('http://localhost:3000/auth/signup', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         username: 'unauthorized',
//         password: 'unauthorized',
//     }),
// });

// json = await res.json();
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

if (!res.ok) {
  console.error('Sign-in failed:', await res.json());
}

const session = res.headers.get('set-cookie');
// console.log('Session:', session);

// Extract the session cookie value
const sessionCookie = session.split(',').map(cookie => cookie.split(';')[0]).join('; ');

// const deleteEventRes = await fetch('http://localhost:3000/events/2', {
//   method: 'DELETE',
//   headers: {
//     'Cookie': sessionCookie,
//   },
// });

// const deleteEventResBody = await deleteEventRes.json();

// if (!deleteEventRes.ok) {
//   console.error('Error:', deleteEventResBody);
// } else {
//   console.log('Succeed:\n', deleteEventResBody);
// }

// const events = await fetch('http://localhost:3000/events', {
//   headers: {
//     'Cookie': sessionCookie,
//   },
// });

// const eventsBody = await events.json();
// console.log('Events:', JSON.stringify(eventsBody, null, 2));

// const requestBody = {
//   name: 'Change back to initial name',
//   city: 'Change to another city',
// };

// // console.log('Request Body:', requestBody);

const eventRes = await fetch('http://localhost:3000/events/1/history', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': sessionCookie,
  },
});

const eventResBody = await eventRes.json();

if (!eventRes.ok) {
  console.error('Error:', eventResBody);
} else {
  console.log('Succeed:\n', JSON.stringify(eventResBody, null, 2));
}
