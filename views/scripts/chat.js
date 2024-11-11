window.addEventListener('scroll', function () {
  let textarea = document.querySelector('textarea');
  let connectedUsers = document.querySelector('.connectedUsers');

  if (window.scrollY === 0) {
    connectedUsers.style.borderRadius = '25px';
  } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    textarea.style.borderRadius = '25px';
  } else {
    textarea.style.borderRadius = '25px 25px 0 0';
    connectedUsers.style.borderRadius = '0 0 25px 25px';
  }
});

function detectDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'computer';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  socket.emit('connection', chatId, username);
  if (detectDevice() == 'computer') {
    document.getElementById('inputMsg').focus();
  }
});

function printMsg(data) {
  const chatBox = document.getElementById('chat-box');
  const newMessage = document.createElement('div');
  newMessage.classList.add('message');
  newMessage.innerHTML = data;
  chatBox.appendChild(newMessage);
  window.scrollTo(0, document.body.scrollHeight);
}