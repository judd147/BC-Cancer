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

// const requestBodyForCreateEvent = {
//   name: 'Test after adding tags',
//   addressLine1: 'Test Address 1',
//   city: 'Vancouver',
//   date: '2024-11-15',
//   donorIds: [1, 2, 3],
//   tags: ['Test Tag'],
// };

// console.log('Request Body:', requestBodyForCreateEvent);

// const createEventRes = await fetch('http://localhost:3000/events', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Cookie': sessionCookie,
//   },
//   body: JSON.stringify(requestBodyForCreateEvent),
// });

// const createEventResBody = await createEventRes.json();

// if (!createEventRes.ok) {
//   console.error('Error when creating an event:', createEventResBody);
// } else {
//   console.log('Succeed in creating an event:\n', createEventResBody);
// }

// const deleteEventRes = await fetch('http://localhost:3000/events/8', {
//   method: 'DELETE',
//   headers: {
//     'Cookie': sessionCookie,
//   },
// });

// const deleteEventResBody = await deleteEventRes.json();

// if (!deleteEventRes.ok) {
//   console.error('Error when deleting events:', deleteEventResBody);
// } else {
//   console.log('Succeed in deleting events:\n', deleteEventResBody);
// }

// const events = await fetch('http://localhost:3000/events/9/donors', {
//   headers: {
//     'Cookie': sessionCookie,
//   },
// });

// const eventsBody = await events.json();
// console.log('Events:', JSON.stringify(eventsBody, null, 2));

const requestBody = {
  tags: ['Test Tag2222'],
};

console.log('Request Body:', requestBody);

const eventRes = await fetch('http://localhost:3000/events/16', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': sessionCookie,
  },
  body: JSON.stringify(requestBody),
});

const eventResBody = await eventRes.json();

if (!eventRes.ok) {
  console.error('Error when updating events\' donors:', eventResBody);
} else {
  console.log('Succeed in updating events\' donors::\n', JSON.stringify(eventResBody, null, 2));
}


// const requestBody = {
//   donorIds: [1],
//   newStatus: 'invited',

//   donorIds: [2, 3],
//   newStatus: 'excluded',
// };

// console.log('Request Body:', requestBody);

// const eventRes = await fetch('http://localhost:3000/events/9/donors', {
//   method: 'PATCH',
//   headers: {
//     'Content-Type': 'application/json',
//     'Cookie': sessionCookie,
//   },
//   body: JSON.stringify(requestBody),
// });

// const eventResBody = await eventRes.json();

// if (!eventRes.ok) {
//   console.error('Error when updating events\' donors:', eventResBody);
// } else {
//   console.log('Succeed in updating events\' donors::\n', JSON.stringify(eventResBody, null, 2));
// }

// const tags = await fetch('http://localhost:3000/tags', {
//   headers: {
//     'Cookie': sessionCookie,
//   },
// });

// const tagsBody = await tags.json();
// console.log('Tags:', JSON.stringify(tagsBody, null, 2));

// const requestBodyForCreateTag = {
//   name: 'Test Tag',
// };

// console.log('Request Body:', requestBodyForCreateTag);

// const createTagRes = await fetch('http://localhost:3000/tags', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Cookie': sessionCookie,
//   },
//   body: JSON.stringify(requestBodyForCreateTag),
// });

// const createTagResBody = await createTagRes.json();

// if (!createTagResBody.ok) {
//   console.error('Error when creating an event:', createTagResBody);
// } else {
//   console.log('Succeed in creating an event:\n', createTagResBody);
// }
