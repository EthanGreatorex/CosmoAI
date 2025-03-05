
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    console.log('toggled')
    sidebar.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.sidebar-icon-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main');

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-visible');
        mainContent.classList.toggle('main-expanded');
    });

    async function clearCache() {
        const response = await fetch('/process', {
            method: 'POST',
        });
    }


});


const chatMessage = document.getElementById('chat-messages')

chatMessage.addEventListener('click', function() {
    toggleSidebar();
})


function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function copyEmail() {
    navigator.clipboard.writeText('eggGreatorex@gmail.com')
    const mail = document.getElementById('copy-mail')
    mail.innerText = 'Copied!'

    setTimeout(() => {
        mail.innerText = 'Mail'
    }, 1000);
}

async function requestAI() {
    // Show loading spinner
    document.getElementById('loading').style.display = 'flex';

    var userInput = document.getElementById('user-input').value.trim();
    var userName = document.getElementById('user-name').value.trim();
    var websiteUrl = document.getElementById('website-url').value.trim();
    var fileInput = document.getElementById('file-upload');

    const selectedMood = document.querySelector('.mood-inputs input[name="mood"]:checked');

    if (!userInput) return;

    const moodValue = selectedMood.value;

    // Clear input
    document.getElementById('user-input').value = '';

    // Append user message
    const chatMessages = document.getElementById('chat-messages');
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user');
    userMessage.textContent = userInput;
    chatMessages.appendChild(userMessage);

    const formData = new FormData();
    formData.append('prompt', userInput);
    formData.append('mood', moodValue);
    console.log(userName);
    formData.append('name', userName);

    if (websiteUrl) {
        formData.append('context', websiteUrl);
    } else if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    } else {
        formData.append('context', '');
    }

    try {
        // Send to backend
        const response = await fetch('/process', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        // Process the AI response and add one line at a time
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('message', 'ai');
        chatMessages.appendChild(aiMessage);

        const lines = data.response.split('\n');
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < lines.length) {
                aiMessage.innerHTML += lines[currentIndex];
                currentIndex++;
            } else {
                clearInterval(interval);
            }
            scrollToBottom();
        }, 100);

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    } finally {
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
    }
}



// Toggle Chat Area
document.querySelector('.new-chat-button').addEventListener('click', () => {
    document.querySelector('.top-section').classList.add('hidden');
    document.querySelector('.bottom-section').classList.add('hidden');
    document.getElementById('chat-area').classList.remove('hidden');

    // Clear old chat messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''

    // Clear the cached chat history
    async function clearCache() {
        const response = await fetch('/process', {
            method: 'POST',
        });
    }

    // Give a welcome message
    const aiMessage = document.createElement('div');
    aiMessage.classList.add('message', 'ai');
    aiMessage.innerText = "Hello there! I'm Cosmo, how can I help you today?";
    chatMessages.appendChild(aiMessage);    
});

// Handle Sending and Receiving Chat Messages
document.getElementById('send-btn').addEventListener('click', async () => {
    requestAI();
});

document.getElementById('user-input').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        requestAI();
    }
});
