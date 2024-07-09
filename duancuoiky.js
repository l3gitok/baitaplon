// Điều hướng mượt mà
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hiệu ứng gõ chữ
function typingEffect(element, speed) {
    let text = element.innerHTML;
    element.innerHTML = "";
    
    let i = 0;
    let timer = setInterval(function() {
        if (i < text.length) {
            element.append(text.charAt(i));
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

const h1 = document.querySelector('h1');
if (h1) typingEffect(h1, 100);

// Quản lý dropdown menu trong navigation
document.querySelectorAll('header nav ul li').forEach(item => {
    item.addEventListener('mouseenter', function() {
        setTimeout(() => {
            const dropdown = this.querySelector('.dropdown-menu');
            if (dropdown) {
                dropdown.style.display = 'block';
            }
        }, 300); // 0.3s delay
    });
    item.addEventListener('mouseleave', function() {
        const dropdown = this.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    });
});

// Chatbot
document.addEventListener('DOMContentLoaded', function () {
    const toggleChatbot = document.getElementById('toggleChatbot');
    const chatContainer = document.getElementById('chatContainer');

    toggleChatbot.addEventListener('click', function () {
        chatContainer.classList.toggle('open');
    });
});

function sendMessage() {
    var userInput = document.getElementById('userInput').value;
    var chatBox = document.getElementById('chatBox');

    // Clear user input
    document.getElementById('userInput').value = '';

    // Create user message element
    var userMessageElement = document.createElement('div');
    userMessageElement.classList.add('chat-message', 'user');
    userMessageElement.innerHTML = '<p>' + userInput + '</p>';
    chatBox.appendChild(userMessageElement);

    // Scroll chat box to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Send message to API
    fetch('http://127.0.0.1:8000/chatbot/', { // Điều chỉnh URL nếu cần
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        // Process API response
        var botMessageElement = document.createElement('div');
        botMessageElement.classList.add('chat-message', 'bot');
        botMessageElement.innerHTML = '<p>' + data.response + '</p>';
        chatBox.appendChild(botMessageElement);

        // Scroll chat box to bottom after receiving response
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error('Error sending message:', error);
        // Handle error if needed
    });
}
// Lấy thông tin từ localStorage
let singleRoomStatus = localStorage.getItem('singleRoomStatus');
let doubleRoomStatus = localStorage.getItem('doubleRoomStatus');
let suiteRoomStatus = localStorage.getItem('suiteRoomStatus');

// Kiểm tra và hiển thị tình trạng phòng
if (singleRoomStatus === 'Còn Phòng') {
    document.getElementById('single-room-status-display').textContent = 'Còn Phòng';
    document.getElementById('single-room-status-display').classList.add('room-status available block');
} else {
    document.getElementById('single-room-status-display').textContent = 'Đã Đầy';
    document.getElementById('single-room-status-display').classList.add('room-status unavailable block');
}
// Kiểm tra và hiển thị tình trạng phòng
if (doubleRoomStatusRoomStatus === 'Còn Phòng') {
    document.getElementById('double-room-status-display').textContent = 'Còn Phòng';
    document.getElementById('double-room-status-display').classList.add('room-status available block');
} else {
    document.getElementById('double-room-status-display').textContent = 'Đã Đầy';
    document.getElementById('double-room-status-display').classList.add('room-status unavailable block');
}
// Kiểm tra và hiển thị tình trạng phòng
if (suiteRoomStatus === 'Còn Phòng') {
    document.getElementById('suite-room-status-display').textContent = 'Còn Phòng';
    document.getElementById('suite-room-status-display').classList.add('room-status available block');
} else {
    document.getElementById('suite-room-status-display').textContent = 'Đã Đầy';
    document.getElementById('suite-room-status-display').classList.add('room-status unavailable block');
}

// Tương tự cho các loại phòng khác
