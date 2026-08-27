import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { firebaseApp } from './firebase-config.js';

const auth = getAuth(firebaseApp);
const tableBody = document.getElementById('user-profile-table');
const signOutButton = document.getElementById('sign-out');

function cell(value) {
  const element = document.createElement('td');
  element.textContent = value;
  return element;
}

function showSignedOutState() {
  const row = document.createElement('tr');
  const message = document.createElement('td');
  const link = document.createElement('a');
  message.colSpan = 3;
  message.append('You are not signed in. ');
  link.href = '/login.html';
  link.textContent = 'Open the sign-in page';
  message.append(link);
  row.append(message);
  tableBody.replaceChildren(row);
  signOutButton.hidden = true;
}

function showUser(user) {
  const row = document.createElement('tr');
  const imageCell = document.createElement('td');
  const image = document.createElement('img');
  image.src = user.photoURL || 'https://avatars.githubusercontent.com/u/78682787?v=4';
  image.alt = '';
  image.width = 50;
  image.height = 50;
  image.style.borderRadius = '50%';
  imageCell.append(image);
  row.append(imageCell, cell(user.displayName || 'Anonymous'), cell(user.email || 'Not provided'));
  tableBody.replaceChildren(row);
  signOutButton.hidden = false;
}

onAuthStateChanged(auth, (user) => {
  if (user) showUser(user);
  else showSignedOutState();
});

signOutButton.addEventListener('click', async () => {
  await signOut(auth);
  showSignedOutState();
});
