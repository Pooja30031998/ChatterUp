const socket = io.connect("http://localhost:3000");

//to get user details
const searchParams = new URLSearchParams(window.location.search);
const userName = searchParams.get("username");
const room = searchParams.get("room");

const appImages = [
  "images/itachi.jpg",
  "images/lee.png",
  "images/obito.png",
  "images/pain.png",
  "images/Kakashi.jpg",
  "images/naruto.jpg",
  "images/Sasuke.png",
];
//randomly assigning user images
let userImage = appImages[Math.floor(Math.random() * appImages.length)];

//assigning dom variables
const totalUser = document.getElementById("clients-total");
const roomClients = document.getElementById("room-clients");
const inviteUser = document.getElementById("welcome");

const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");
const messageList = document.getElementById("message-conatiner");
const feedback = document.getElementById("feedback");

//emitting user details
socket.emit("userDetails", { userName, room, userImage });

//welcoming joined user
inviteUser.textContent = `● welcome ${userName}`;

//listening to roomUsers event to add online users to dom
socket.on("roomUsers", ({ total, users }) => {
  totalUser.textContent = `Total online clients : ${total}`;
  roomClients.innerHTML = "";
  users.forEach((user) => {
    const element = `<li class="list-group-item room-online">● ${user.name}</li>`;
    roomClients.innerHTML += element;
  });
});

//function to go to bottom of messages
function scrollToBottom() {
  messageList.scrollTo(0, messageList.scrollHeight);
}

//function to add messages
function addMessage(ownMessage, data) {
  const dateTime = new Date(data.timestamp);

  //date and time
  const formattedTime = dateTime.toLocaleTimeString();
  const formattedDate = dateTime.toLocaleDateString();

  const messageElement = `<li class="${
    ownMessage ? "message-right" : "message-left"
  }">
        <img
          class="${ownMessage ? "imgOfRightUser" : "imgOfLeftUser"}"
          id="${ownMessage ? "imgOfRightUser" : "imgOfLeftUser"}"
          src="${data.userImage}"
        />
        <div class=${ownMessage ? "divOfRightUser" : "divOfLeftUser"}">
          <span id="username">${data.userName}</span>
          <p class="message">
            ${data.message}
          </p>
          <span id="time"> ● ${formattedDate}  ● ${formattedTime}</span>
        </div>
      </li>`;

  messageList.innerHTML += messageElement;
  scrollToBottom();
}

//adding eventlistener for message input
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const data = { userImage, userName, message, timestamp: new Date() };
  //emitting user messages
  socket.emit("sendMessage", data);
  //adding messages to dom
  addMessage(true, data);
  messageInput.value = "";
});

//loading previous messages
socket.on("roomUsersMessages", (previosMessages) => {
  previosMessages.forEach((message) => {
    const data = {
      userImage: message.userImage,
      userName: message.name,
      message: message.message,
      timestamp: message.dateTime,
    };
    if (message.name == userName) {
      userImage = message.userImage;
      addMessage(true, data);
    } else {
      addMessage(false, data);
    }
  });
});

//adding broadcast messages to dom
socket.on("broadcast-message", (data) => {
  const newData = {
    userImage: data.userImage,
    userName: data.userName,
    message: data.message,
    timestamp: new Date(),
  };
  addMessage(false, newData);
});

//emitting event when user is typing
messageInput.addEventListener("focus", () => {
  socket.emit("feedback", userName);
});
messageInput.addEventListener("keyup", () => {
  socket.emit("feedback", userName);
});
messageInput.addEventListener("keypress", () => {
  socket.emit("feedback", userName);
});

//listening to event to indicate when any user is typing
socket.on("feedback", (data) => {
  feedback.textContent = `${data} is typing...`;
  scrollToBottom();
});
