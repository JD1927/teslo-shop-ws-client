import { connectToServer, $ } from './socket.client';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Websocket - Client</h2>

    <div class="jwt-box">
      <input placeholder="Json Web Token" id="jwt-token"/>
      <button id="btn-connect">Connect</button>
    </div>
    
    <span id="server-status">offline</span>

    <ul id="clients"></ul>

    <form id="messages-form">
      <input placeholder="Send a message" id="message-input"/>
    </form>

    <h3>Messages: </h3>
    <ul id="messages"></ul>
  </div>
`;

const jwtToken = $('#jwt-token') as HTMLInputElement;
const btnConnect = $('#btn-connect') as HTMLButtonElement;

btnConnect.addEventListener('click', () => {
  const token = jwtToken.value.trim();
  if (!token) return alert('Enter a valid JWT value.');
  connectToServer(token);
});
// connectToServer();
