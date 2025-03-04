
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
});



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

    const userInput = document.getElementById('user-input').value.trim();
    const websiteUrl = document.getElementById('website-url').value.trim();
    const fileInput = document.getElementById('file-upload');

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

    // Prepare request payload
    const formData = new FormData();
    formData.append('prompt', userInput);
    formData.append('mood',moodValue);

    if (websiteUrl) {
        // If a website URL is provided, send it as context
        formData.append('context', websiteUrl);
    } else if (fileInput.files.length > 0) {
        // If a file is uploaded, send it to the backend
        formData.append('file', fileInput.files[0]);
    } else {
        formData.append('context', ''); // Default to no context
    }

    try {
        // Send to backend
        const response = await fetch('/process', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        // Append AI response
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('message', 'ai');
        aiMessage.innerHTML = data.response;
        chatMessages.appendChild(aiMessage);

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    } finally {
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
        scrollToBottom();
    }
}

// Toggle Chat Area
document.querySelector('.new-chat-button').addEventListener('click', () => {
    document.querySelector('.top-section').classList.add('hidden');
    document.querySelector('.bottom-section').classList.add('hidden');
    document.getElementById('chat-area').classList.remove('hidden');

    // Give a welcome message
    const chatMessages = document.getElementById('chat-messages');
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
