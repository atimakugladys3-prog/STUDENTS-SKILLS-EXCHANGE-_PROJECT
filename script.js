// Global variables
let currentUser = null;
let skillsData = [];
let usersData = [];
let messagesData = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

// Initialize the application
function initializeApp() {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    const savedSkills = localStorage.getItem('skillsData');
    const savedUsers = localStorage.getItem('usersData');
    const savedMessages = localStorage.getItem('messagesData');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showLoginModal();
    }
    
    if (savedSkills) {
        skillsData = JSON.parse(savedSkills);
    }
    
    if (savedUsers) {
        usersData = JSON.parse(savedUsers);
    }
    
    if (savedMessages) {
        messagesData = JSON.parse(savedMessages);
    }
    
    // Update profile preview if user is logged in
    if (currentUser) {
        updateProfileForm();
        updateProfilePreview();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login/Register forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('showRegister').addEventListener('click', showRegisterForm);
    document.getElementById('showLogin').addEventListener('click', showLoginForm);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', updateUserProfile);
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', filterSkills);
    document.getElementById('typeFilter').addEventListener('change', filterSkills);
    document.getElementById('searchInput').addEventListener('input', filterSkills);
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', sendMessage);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

// Load sample data
function loadSampleData() {
    // Sample users
    if (usersData.length === 0) {
        usersData = [
            {
                id: 1,
                name: "John Ocen",
                email: "john@muni.ac.ug",
                course: "Bachelor of Information Technology",
                phone: "+256 772 123 456",
                offeredSkills: [
                    { skill: "Web Development", category: "tech" },
                    { skill: "Python Programming", category: "tech" }
                ],
                requestedSkills: [
                    { skill: "Graphic Design", category: "design" }
                ]
            },
            {
                id: 2,
                name: "Sarah Drateru",
                email: "sarah@muni.ac.ug",
                course: "Bachelor of Business Administration",
                phone: "+256 772 654 321",
                offeredSkills: [
                    { skill: "Accounting Tutoring", category: "tutoring" },
                    { skill: "French Language", category: "language" }
                ],
                requestedSkills: [
                    { skill: "Data Analysis", category: "tech" }
                ]
            },
            {
                id: 3,
                name: "Michael Andrua",
                email: "michael@muni.ac.ug",
                course: "Bachelor of Education",
                phone: "+256 772 987 654",
                offeredSkills: [
                    { skill: "Mathematics Tutoring", category: "tutoring" },
                    { skill: "Basketball Coaching", category: "sports" }
                ],
                requestedSkills: [
                    { skill: "Public Speaking", category: "other" }
                ]
            }
        ];
        localStorage.setItem('usersData', JSON.stringify(usersData));
    }
    
    // Sample skills listings
    if (skillsData.length === 0) {
        skillsData = [
            {
                id: 1,
                userId: 1,
                type: "offer",
                category: "tech",
                skill: "Web Development",
                description: "I can help with HTML, CSS, JavaScript and basic web development projects.",
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                userId: 1,
                type: "request",
                category: "design",
                skill: "Graphic Design",
                description: "Looking for someone to help me learn Adobe Photoshop and basic design principles.",
                timestamp: new Date().toISOString()
            },
            {
                id: 3,
                userId: 2,
                type: "offer",
                category: "tutoring",
                skill: "Accounting Tutoring",
                description: "I can help with basic accounting principles and bookkeeping.",
                timestamp: new Date().toISOString()
            },
            {
                id: 4,
                userId: 2,
                type: "offer",
                category: "language",
                skill: "French Language",
                description: "Native French speaker available for language practice and tutoring.",
                timestamp: new Date().toISOString()
            },
            {
                id: 5,
                userId: 3,
                type: "offer",
                category: "tutoring",
                skill: "Mathematics Tutoring",
                description: "Available to help with mathematics up to calculus level.",
                timestamp: new Date().toISOString()
            }
        ];
        localStorage.setItem('skillsData', JSON.stringify(skillsData));
    }
    
    // Sample messages
    if (messagesData.length === 0) {
        messagesData = [
            {
                id: 1,
                senderId: 1,
                recipientId: 2,
                content: "Hi Sarah, I saw you're offering Accounting Tutoring. I could use some help with my financial accounting course. Are you available this week?",
                timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                read: true
            },
            {
                id: 2,
                senderId: 2,
                recipientId: 1,
                content: "Hi John, yes I'd be happy to help! I'm free on Tuesday and Thursday afternoons. What time works for you?",
                timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
                read: true
            },
            {
                id: 3,
                senderId: 3,
                recipientId: 1,
                content: "Hello John, I noticed you're looking for help with Graphic Design. I have some experience with Photoshop and would be happy to show you the basics.",
                timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                read: false
            }
        ];
        localStorage.setItem('messagesData', JSON.stringify(messagesData));
    }
    
    // Display skills
    displaySkills();
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, this would check against a database)
    if (email && password) {
        // Check if user exists in sample data
        let user = usersData.find(u => u.email === email);
        
        if (!user) {
            // Create a temporary user for demo
            user = {
                id: usersData.length + 1,
                name: email.split('@')[0],
                email: email,
                course: "Undergraduate Student",
                phone: "",
                offeredSkills: [],
                requestedSkills: []
            };
            usersData.push(user);
            localStorage.setItem('usersData', JSON.stringify(usersData));
        }
        
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMainApp();
        closeModal();
        
        // Show welcome message
        showNotification(`Welcome back, ${user.name}!`, 'success');
    }
}

// Register handler
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const course = document.getElementById('regCourse').value;
    
    if (name && email && password && course) {
        // Check if email already exists
        if (usersData.find(u => u.email === email)) {
            showNotification('Email already registered!', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: usersData.length + 1,
            name: name,
            email: email,
            course: course,
            phone: "",
            offeredSkills: [],
            requestedSkills: []
        };
        
        usersData.push(newUser);
        currentUser = newUser;
        
        localStorage.setItem('usersData', JSON.stringify(usersData));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMainApp();
        closeModal();
        
        showNotification(`Account created successfully! Welcome, ${name}!`, 'success');
    }
}

// Show main application
function showMainApp() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update profile information
    updateProfileForm();
    updateProfilePreview();
    displaySkills();
    displayMessages('received');
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('mainApp').classList.add('hidden');
    showLoginForm();
}

// Show login form
function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

// Show register form
function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('contactModal').style.display = 'none';
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href').substring(1);
    showSection(target);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
}

// Show section
function showSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Show section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // If profile section is shown, update messages
    if (sectionId === 'profile') {
        displayMessages('received');
    }
}

// Logout handler
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginModal();
    showNotification('You have been logged out successfully.', 'info');
}

// Update profile form with current user data
function updateProfileForm() {
    if (!currentUser) return;
    
    document.getElementById('userName').value = currentUser.name || '';
    document.getElementById('userCourse').value = currentUser.course || '';
    document.getElementById('userEmail').value = currentUser.email || '';
    document.getElementById('userPhone').value = currentUser.phone || '';
    
    // Update skills lists
    updateSkillsLists();
}

// Update skills lists in profile form
function updateSkillsLists() {
    const offeredSkillsList = document.getElementById('offeredSkills');
    const requestedSkillsList = document.getElementById('requestedSkills');
    
    offeredSkillsList.innerHTML = '';
    requestedSkillsList.innerHTML = '';
    
    if (currentUser.offeredSkills) {
        currentUser.offeredSkills.forEach((skill, index) => {
            const skillItem = createSkillItem(skill, 'offer', index);
            offeredSkillsList.appendChild(skillItem);
        });
    }
    
    if (currentUser.requestedSkills) {
        currentUser.requestedSkills.forEach((skill, index) => {
            const skillItem = createSkillItem(skill, 'request', index);
            requestedSkillsList.appendChild(skillItem);
        });
    }
}

// Create skill item for display in lists
function createSkillItem(skill, type, index) {
    const skillItem = document.createElement('div');
    skillItem.className = `skill-item ${type}`;
    
    const categoryNames = {
        'tutoring': 'Tutoring',
        'tech': 'Tech Support',
        'design': 'Design',
        'language': 'Language',
        'music': 'Music',
        'sports': 'Sports',
        'practical': 'Practical Skills',
        'writing': 'Writing/Editing',
        'community': 'Community Skills',
        'creative': 'Creative Skills',
        'business': 'Business',
        'digital': 'Digital Tools',
        'other': 'Other'
    };
    
    skillItem.innerHTML = `
        <div class="skill-text">
            <strong>${skill.skill}</strong>
            <span class="skill-cat">${categoryNames[skill.category]}</span>
        </div>
        <button type="button" class="remove-skill" onclick="removeSkill('${type}', ${index})">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return skillItem;
}

// Add offered skill
function addOfferedSkill() {
    const skillInput = document.getElementById('newOfferSkill');
    const categorySelect = document.getElementById('newOfferCategory');
    
    const skill = skillInput.value.trim();
    const category = categorySelect.value;
    
    if (skill) {
        if (!currentUser.offeredSkills) {
            currentUser.offeredSkills = [];
        }
        
        currentUser.offeredSkills.push({
            skill: skill,
            category: category
        });
        
        // Update skills data
        updateSkillsListing('offer', skill, category);
        
        updateSkillsLists();
        updateProfilePreview();
        updateUserInStorage();
        
        skillInput.value = '';
        showNotification('Skill added successfully!', 'success');
    }
}

// Add requested skill
function addRequestedSkill() {
    const skillInput = document.getElementById('newRequestSkill');
    const categorySelect = document.getElementById('newRequestCategory');
    
    const skill = skillInput.value.trim();
    const category = categorySelect.value;
    
    if (skill) {
        if (!currentUser.requestedSkills) {
            currentUser.requestedSkills = [];
        }
        
        currentUser.requestedSkills.push({
            skill: skill,
            category: category
        });
        
        // Update skills data
        updateSkillsListing('request', skill, category);
        
        updateSkillsLists();
        updateProfilePreview();
        updateUserInStorage();
        
        skillInput.value = '';
        showNotification('Skill request added successfully!', 'success');
    }
}

// Update skills listing in the main data
function updateSkillsListing(type, skill, category) {
    // Remove existing listings of the same type for this user
    skillsData = skillsData.filter(s => !(s.userId === currentUser.id && s.type === type));
    
    // Add new listing
    const newListing = {
        id: skillsData.length + 1,
        userId: currentUser.id,
        type: type,
        category: category,
        skill: skill,
        description: `${type === 'offer' ? 'I can help with' : 'I need help with'} ${skill.toLowerCase()}.`,
        timestamp: new Date().toISOString()
    };
    
    skillsData.push(newListing);
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    
    // Refresh skills display
    displaySkills();
}

// Remove skill from user profile
function removeSkill(type, index) {
    if (type === 'offer') {
        currentUser.offeredSkills.splice(index, 1);
        // Remove from skills data
        skillsData = skillsData.filter(s => !(s.userId === currentUser.id && s.type === 'offer'));
    } else {
        currentUser.requestedSkills.splice(index, 1);
        // Remove from skills data
        skillsData = skillsData.filter(s => !(s.userId === currentUser.id && s.type === 'request'));
    }
    
    updateSkillsLists();
    updateProfilePreview();
    updateUserInStorage();
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    displaySkills();
    
    showNotification('Skill removed successfully!', 'info');
}

// Update user profile
function updateUserProfile(e) {
    e.preventDefault();
    
    currentUser.name = document.getElementById('userName').value;
    currentUser.course = document.getElementById('userCourse').value;
    currentUser.email = document.getElementById('userEmail').value;
    currentUser.phone = document.getElementById('userPhone').value;
    
    updateUserInStorage();
    updateProfilePreview();
    
    showNotification('Profile updated successfully!', 'success');
}

// Update user in localStorage
function updateUserInStorage() {
    // Update in usersData
    const userIndex = usersData.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        usersData[userIndex] = currentUser;
        localStorage.setItem('usersData', JSON.stringify(usersData));
    }
    
    // Update currentUser
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Update profile preview
function updateProfilePreview() {
    const profileCard = document.getElementById('profileCard');
    
    if (!currentUser) return;
    
    let skillsHTML = '';
    
    if (currentUser.offeredSkills && currentUser.offeredSkills.length > 0) {
        skillsHTML += '<h5>Skills I Offer:</h5>';
        currentUser.offeredSkills.forEach(skill => {
            skillsHTML += `<span class="skill-badge offer">${skill.skill}</span>`;
        });
    }
    
    if (currentUser.requestedSkills && currentUser.requestedSkills.length > 0) {
        skillsHTML += '<h5>Skills I Need:</h5>';
        currentUser.requestedSkills.forEach(skill => {
            skillsHTML += `<span class="skill-badge request">${skill.skill}</span>`;
        });
    }
    
    profileCard.innerHTML = `
        <h4>${currentUser.name}</h4>
        <p class="course">${currentUser.course}</p>
        <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
        ${currentUser.phone ? `<p><i class="fas fa-phone"></i> ${currentUser.phone}</p>` : ''}
        <div class="profile-skills">
            ${skillsHTML || '<p>No skills added yet.</p>'}
        </div>
    `;
}

// Display skills in browse section
function displaySkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    
    if (skillsData.length === 0) {
        skillsGrid.innerHTML = '<p>No skills listed yet. Be the first to add your skills!</p>';
        return;
    }
    
    skillsGrid.innerHTML = '';
    
    skillsData.forEach(skill => {
        const user = usersData.find(u => u.id === skill.userId);
        if (!user) return;
        
        const skillCard = document.createElement('div');
        skillCard.className = `skill-card ${skill.type}`;
        
        const categoryNames = {
            'tutoring': 'Tutoring',
            'tech': 'Tech Support',
            'design': 'Design',
            'language': 'Language and Communication Skills',
            'music': 'Music',
            'sports': 'Sports',
            'practical': 'Practical Skills',
            'writing': 'Writing/Editing',
            'community': 'Community and social impact skills',
            'creative': 'Creative and Media Skills',
            'business': 'Business and Entrepreneurship',
            'digital': 'Digital and Productivity Tools',
            'other': 'Other'
        };
        
        skillCard.innerHTML = `
            <div class="skill-type ${skill.type}">
                ${skill.type === 'offer' ? 'Offering Help' : 'Requesting Help'}
            </div>
            <div class="skill-category">${categoryNames[skill.category]}</div>
            <h3 class="skill-description">${skill.skill}</h3>
            <p>${skill.description}</p>
            <div class="skill-user">
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>${user.course}</p>
                </div>
                <button class="btn-primary" onclick="showContactModal(${skill.userId})">
                    Contact
                </button>
            </div>
        `;
        
        skillsGrid.appendChild(skillCard);
    });
}

// Filter skills based on selections
function filterSkills() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const category = card.querySelector('.skill-category').textContent.toLowerCase();
        const type = card.classList.contains('offer') ? 'offer' : 'request';
        const skillText = card.querySelector('.skill-description').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        const categoryMatch = !categoryFilter || 
            (categoryFilter === 'tutoring' && category.includes('tutoring')) ||
            (categoryFilter === 'tech' && category.includes('tech')) ||
            (categoryFilter === 'design' && category.includes('design')) ||
            (categoryFilter === 'language' && category.includes('language')) ||
            (categoryFilter === 'music' && category.includes('music')) ||
            (categoryFilter === 'sports' && category.includes('sports')) ||
            (categoryFilter === 'practical' && category.includes('practical')) ||
            (categoryFilter === 'writing' && category.includes('writing')) ||
            (categoryFilter === 'community' && category.includes('community')) ||
            (categoryFilter === 'creative' && category.includes('creative')) ||
            (categoryFilter === 'business' && category.includes('business')) ||
            (categoryFilter === 'digital' && category.includes('digital')) ||
            (categoryFilter === 'other' && category.includes('other'));
            
        const typeMatch = !typeFilter || type === typeFilter;
        const searchMatch = !searchTerm || 
            skillText.includes(searchTerm) || 
            description.includes(searchTerm);
        
        if (categoryMatch && typeMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Show contact modal
function showContactModal(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    const contactInfo = document.getElementById('contactInfo');
    contactInfo.innerHTML = `
        <p><strong>Contact:</strong> ${user.name}</p>
        <p><strong>Course:</strong> ${user.course}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        ${user.phone ? `<p><strong>Phone:</strong> ${user.phone}</p>` : ''}
    `;
    
    document.getElementById('contactUserId').value = userId;
    document.getElementById('contactModal').style.display = 'flex';
}

// Send message
function sendMessage(e) {
    e.preventDefault();
    const messageContent = document.getElementById('message').value;
    const recipientId = parseInt(document.getElementById('contactUserId').value);
    
    if (!messageContent || !recipientId) return;
    
    // Create message object
    const newMessage = {
        id: messagesData.length + 1,
        senderId: currentUser.id,
        recipientId: recipientId,
        content: messageContent,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messagesData.push(newMessage);
    localStorage.setItem('messagesData', JSON.stringify(messagesData));
    
    showNotification('Message sent successfully!', 'success');
    closeModal();
    document.getElementById('message').value = '';
    
    // Update messages display if on profile page
    if (document.getElementById('profile').classList.contains('active')) {
        displayMessages('sent');
    }
}

// Show messages in profile section
function showMessages(type) {
    // Update active tab
    document.querySelectorAll('.messages-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show the correct messages
    displayMessages(type);
}

// Display messages
function displayMessages(type) {
    const receivedContainer = document.getElementById('receivedMessages');
    const sentContainer = document.getElementById('sentMessages');
    
    if (type === 'received') {
        receivedContainer.classList.remove('hidden');
        sentContainer.classList.add('hidden');
        displayReceivedMessages();
    } else {
        receivedContainer.classList.add('hidden');
        sentContainer.classList.remove('hidden');
        displaySentMessages();
    }
}

// Display received messages
function displayReceivedMessages() {
    const container = document.getElementById('receivedMessages');
    
    // Filter messages for current user as recipient
    const receivedMessages = messagesData.filter(m => m.recipientId === currentUser.id);
    
    if (receivedMessages.length === 0) {
        container.innerHTML = '<div class="no-messages">No messages received yet.</div>';
        return;
    }
    
    // Sort by timestamp (newest first)
    receivedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    container.innerHTML = '';
    
    receivedMessages.forEach(message => {
        const sender = usersData.find(u => u.id === message.senderId);
        if (!sender) return;
        
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        const timeAgo = getTimeAgo(new Date(message.timestamp));
        
        messageItem.innerHTML = `
            <div class="message-header">
                <div class="message-sender">From: ${sender.name}</div>
                <div class="message-time">${timeAgo}</div>
            </div>
            <div class="message-content">${message.content}</div>
        `;
        
        container.appendChild(messageItem);
    });
}

// Display sent messages
function displaySentMessages() {
    const container = document.getElementById('sentMessages');
    
    // Filter messages for current user as sender
    const sentMessages = messagesData.filter(m => m.senderId === currentUser.id);
    
    if (sentMessages.length === 0) {
        container.innerHTML = '<div class="no-messages">No messages sent yet.</div>';
        return;
    }
    
    // Sort by timestamp (newest first)
    sentMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    container.innerHTML = '';
    
    sentMessages.forEach(message => {
        const recipient = usersData.find(u => u.id === message.recipientId);
        if (!recipient) return;
        
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        const timeAgo = getTimeAgo(new Date(message.timestamp));
        
        messageItem.innerHTML = `
            <div class="message-header">
                <div class="message-sender">To: ${recipient.name}</div>
                <div class="message-time">${timeAgo}</div>
            </div>
            <div class="message-content">${message.content}</div>
        `;
        
        container.appendChild(messageItem);
    });
}

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.background = '#8aae27e8';
    } else if (type === 'error') {
        notification.style.background = '#4e0d06ff';
    } else {
        notification.style.background = '#05273dff';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);