import { Manager, Socket } from 'socket.io-client';

export enum Events {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CLIENTS_UPDATED = 'clients-updated',
  MESSAGE_FROM_CLIENT = 'message-from-client',
  MESSAGES_FROM_SERVER = 'messages-from-server',
}

export const $ = (selector: string) => document.querySelector(selector);

let socket: Socket | null = null;

export const connectToServer = (token: string) => {
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
      authentication: token,
    },
  });

  socket?.removeAllListeners();
  socket = manager.socket('/');

  addListeners();
};

const addListeners = () => {
  const clientsUl = $('#clients') as HTMLUListElement;
  const messageInput = $('#message-input') as HTMLInputElement;
  const messagesForm = $('#messages-form') as HTMLFormElement;
  const messagesUl = $('#messages') as HTMLUListElement;
  const serverStatusLabel = $('#server-status') as HTMLSpanElement;
  let canSendMessages: boolean = false;

  socket?.on(Events.CONNECT, () => {
    serverStatusLabel.innerHTML = `connected 🚀`;
    canSendMessages = true;
  });

  socket?.on(Events.DISCONNECT, () => {
    serverStatusLabel.innerHTML = `disconnected ❌`;
    messagesUl.innerHTML = '';
    clientsUl.innerHTML = '';
    canSendMessages = false;
  });

  socket?.on(Events.CLIENTS_UPDATED, (clients: string[]) => {
    let innerHTML: string = '';
    clients.forEach(
      (client: string): string => (innerHTML += `<li>${client}</li>`),
    );
    clientsUl.innerHTML = innerHTML;
  });

  socket?.on(
    Events.MESSAGES_FROM_SERVER,
    (payload: { fullName: string; message: string }) => {
      if (!canSendMessages) return;
      const { fullName, message } = payload;
      const newMessage: string = `
        <li>
          <strong>${fullName}: </strong>
          <span>${message}</span>
        </li>
      `;
      const li: HTMLLIElement = document.createElement('li');
      li.innerHTML = newMessage;
      messagesUl.append(li);
    },
  );

  messagesForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!messageInput.value.trim() || !canSendMessages) return;

    const { value: message } = messageInput;

    socket?.emit(Events.MESSAGE_FROM_CLIENT, { message });

    messageInput.value = '';
  });
};
