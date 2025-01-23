// Game State
let gameState = {
    rooms: [],
    currentRoom: null,
    currentPlayer: null,
    timer: null,
    startTime: null,
    predefinedChallenges: {
        html: [
            {
                title: 'Create a Navigation Menu',
                description: 'Create a horizontal navigation menu with 3 links (Home, About, Contact) using HTML and CSS. The menu should have a background color of #4f46e5 and white text.',
                expectedOutput: '<nav style="background:#4f46e5;padding:1rem"><a style="color:white;margin:0 1rem" href="#">Home</a><a style="color:white;margin:0 1rem" href="#">About</a><a style="color:white;margin:0 1rem" href="#">Contact</a></nav>',
                type: 'html',
                defaultTime: 300,
                testCases: [
                    {
                        input: null,
                        validate: (solution) => {
                            return solution.includes('<nav') && 
                                   solution.includes('Home') && 
                                   solution.includes('About') && 
                                   solution.includes('Contact');
                        }
                    }
                ]
            },
            {
                title: 'Create a Contact Form',
                description: 'Create a contact form with name, email, and message fields. Include a submit button.',
                expectedOutput: '<form><input type="text" placeholder="Name"><input type="email" placeholder="Email"><textarea placeholder="Message"></textarea><button type="submit">Send</button></form>',
                type: 'html',
                defaultTime: 420,
                testCases: [
                    {
                        input: null,
                        validate: (solution) => {
                            return solution.includes('<form') && 
                                   solution.includes('type="text"') && 
                                   solution.includes('type="email"') && 
                                   solution.includes('<textarea') &&
                                   solution.includes('type="submit"');
                        }
                    }
                ]
            }
        ],
        css: [
            {
                title: 'Style a Card Component',
                description: 'Create a CSS style for a card with padding of 1rem, rounded corners (8px), and a shadow. The card should have a white background.',
                expectedOutput: '.card { padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background: white; }',
                type: 'css',
                defaultTime: 300,
                testCases: [
                    {
                        input: null,
                        validate: (solution) => {
                            return solution.includes('padding') && 
                                   solution.includes('border-radius') && 
                                   solution.includes('box-shadow');
                        }
                    }
                ]
            },
            {
                title: 'Create a Button Hover Effect',
                description: 'Style a button that changes background color and adds a shadow on hover.',
                expectedOutput: '.button:hover { background-color: #4f46e5; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: translateY(-1px); }',
                type: 'css',
                defaultTime: 360,
                testCases: [
                    {
                        input: null,
                        validate: (solution) => {
                            return solution.includes(':hover') && 
                                   solution.includes('background-color') && 
                                   solution.includes('box-shadow');
                        }
                    }
                ]
            }
        ],
        javascript: [
            {
                title: 'Array Sum Function',
                description: 'Write a function that returns the sum of all numbers in an array.',
                expectedOutput: '10 (for input [1,2,3,4])',
                type: 'javascript',
                defaultTime: 300,
                testCases: [
                    { input: [1, 2, 3, 4], output: 10 },
                    { input: [5, 5], output: 10 },
                    { input: [0], output: 0 }
                ]
            },
            {
                title: 'String Reversal',
                description: 'Write a function that reverses a string.',
                expectedOutput: '"olleh" (for input "hello")',
                type: 'javascript',
                defaultTime: 300,
                testCases: [
                    { input: 'hello', output: 'olleh' },
                    { input: 'world', output: 'dlrow' },
                    { input: '', output: '' }
                ]
            },
            {
                title: 'Find Maximum Number',
                description: 'Write a function that finds the largest number in an array.',
                expectedOutput: '5 (for input [1,5,2,3,4])',
                type: 'javascript',
                defaultTime: 360,
                testCases: [
                    { input: [1, 5, 2, 3, 4], output: 5 },
                    { input: [-1, -5, -2], output: -1 },
                    { input: [0], output: 0 }
                ]
            }
        ]
    }
};

// Utility Functions
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    if (screenId === 'gameRoom' && gameState.currentRoom) {
        updateGameRoom();
    }
}

// Room Management
function handleCreateRoom(event) {
    event.preventDefault();
    
    const room = {
        id: generateId(),
        name: document.getElementById('roomName').value,
        password: document.getElementById('roomPassword').value,
        mode: document.getElementById('gameMode').value,
        players: [{
            id: generateId(),
            name: document.getElementById('adminName').value,
            isAdmin: true,
            score: 0
        }],
        previews: [],
        status: 'waiting',
        challengeTimers: {}
    };

    gameState.rooms.push(room);
    gameState.currentRoom = room;
    gameState.currentPlayer = room.players[0];

    showScreen('gameRoom');
    updateGameRoom();
}

function handleJoinRoom(event) {
    event.preventDefault();

    const roomName = document.getElementById('joinRoomName').value;
    const password = document.getElementById('joinRoomPassword').value;
    const playerName = document.getElementById('playerName').value;

    console.log('Attempting to join room:', roomName, 'with password:', password);
    console.log('Current rooms:', gameState.rooms);

    const room = gameState.rooms.find(r => r.name === roomName && r.password === password);

    if (!room) {
        alert('Room not found or incorrect password');
        return;
    }

    if (room.players.length >= parseInt(room.mode)) {
        alert('Room is full');
        return;
    }

    const newPlayer = {
        id: generateId(),
        name: playerName,
        isAdmin: false,
        score: 0
    };

    room.players.push(newPlayer);
    gameState.currentRoom = room;
    gameState.currentPlayer = newPlayer;

    showScreen('gameRoom');
    updateGameRoom();
}

// Game Room Updates
function updateGameRoom() {
    const room = gameState.currentRoom;
    if (!room) return;

    document.getElementById('roomTitle').textContent = `Room: ${room.name}`;
    document.getElementById('playerCount').textContent = 
        `${room.players.length}/${room.mode.split('-')[0]} players`;

    const playersList = document.getElementById('playersList');
    playersList.innerHTML = room.players.map(player => `
        <div class="player-item">
            <div>
                <span>${player.name}</span>
                ${player.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
            </div>
            <div class="player-score">Score: ${player.score}</div>
        </div>
    `).join('');

    const adminControls = document.getElementById('adminControls');
    if (gameState.currentPlayer.isAdmin) {
        adminControls.classList.remove('hidden');
        const startGameBtn = document.getElementById('startGameBtn');
        startGameBtn.disabled = room.players.length !== parseInt(room.mode);
    } else {
        adminControls.classList.add('hidden');
    }

    const timerDisplay = document.getElementById('timerDisplay');
    if (room.status === 'in-progress' && gameState.startTime) {
        timerDisplay.classList.remove('hidden');
    } else {
        timerDisplay.classList.add('hidden');
    }

    updatePreviewsList();
    feather.replace();
}

function updatePreviewsList() {
    const room = gameState.currentRoom;
    const previewsList = document.getElementById('previewsList');
    
    if (room.status === 'waiting' && gameState.currentPlayer.isAdmin) {
        // Show challenge selection for admin
        previewsList.innerHTML = `
            <div class="challenge-categories">
                <h3>Select Challenge Type</h3>
                <div class="category-buttons">
                    <button onclick="showChallenges('html')" class="btn primary">HTML</button>
                    <button onclick="showChallenges('css')" class="btn primary">CSS</button>
                    <button onclick="showChallenges('javascript')" class="btn primary">JavaScript</button>
                </div>
                <div id="challengesList" class="challenges-list"></div>
            </div>
        `;
    } else {
        // Show added previews for all users
        previewsList.innerHTML = room.previews.map(preview => `
            <div class="preview-item">
                <h3>${preview.title}</h3>
                <p>${preview.description}</p>
                <div class="preview-meta">
                    <span class="preview-type">${preview.type.toUpperCase()}</span>
                    <span class="preview-time">Time: ${formatTime(room.challengeTimers[preview.id] * 1000)}</span>
                </div>
                ${room.status === 'in-progress' ? `
                    <button onclick="startChallenge('${preview.id}')" class="btn primary">
                        <i data-feather="play"></i>
                        Start Challenge
                    </button>
                ` : ''}
            </div>
        `).join('');
    }
}

function showChallenges(type) {
    const challengesList = document.getElementById('challengesList');
    const challenges = gameState.predefinedChallenges[type];
    
    challengesList.innerHTML = challenges.map(challenge => `
        <div class="challenge-item">
            <h4>${challenge.title}</h4>
            <p>${challenge.description}</p>
            <div class="challenge-config">
                <input type="number" 
                       id="timer-${challenge.title}" 
                       value="${challenge.defaultTime}"
                       min="60"
                       max="3600"
                       class="timer-input"
                       placeholder="Time in seconds">
                <button onclick="addChallenge('${type}', '${challenge.title}')" class="btn success">
                    Add Challenge
                </button>
            </div>
        </div>
    `).join('');
}

function addChallenge(type, title) {
    const room = gameState.currentRoom;
    const challenge = gameState.predefinedChallenges[type].find(c => c.title === title);
    if (!challenge) return;

    const timerInput = document.getElementById(`timer-${title}`);
    const timeLimit = parseInt(timerInput.value);
    
    if (isNaN(timeLimit) || timeLimit < 60 || timeLimit > 3600) {
        alert('Please set a valid time limit between 1 and 60 minutes');
        return;
    }

    const preview = {
        ...challenge,
        id: generateId()
    };

    room.challengeTimers[preview.id] = timeLimit;
    room.previews.push(preview);
    updatePreviewsList();
}

function startChallenge(previewId) {
    const room = gameState.currentRoom;
    const preview = room.previews.find(p => p.id === previewId);
    if (!preview) return;

    room.currentPreview = preview;
    document.getElementById('previewsList').classList.add('hidden');
    document.getElementById('challengeArea').classList.remove('hidden');
    
    document.getElementById('challengeTitle').textContent = preview.title;
    document.getElementById('challengeDescription').textContent = preview.description;
    document.getElementById('expectedOutput').textContent = preview.expectedOutput;
    document.getElementById('solution').value = '';
    document.getElementById('liveOutput').textContent = '';

    // Start challenge timer
    gameState.startTime = Date.now();
    const timeLimit = room.challengeTimers[preview.id];
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }

    gameState.timer = setInterval(() => {
        const elapsed = Date.now() - gameState.startTime;
        const remaining = (timeLimit * 1000) - elapsed;
        
        if (remaining <= 0) {
            clearInterval(gameState.timer);
            alert('Time is up!');
            document.getElementById('challengeArea').classList.add('hidden');
            document.getElementById('previewsList').classList.remove('hidden');
            return;
        }
        
        document.getElementById('timerDisplay').textContent = `Time: ${formatTime(remaining)}`;
    }, 1000);
}

function updateLiveOutput() {
    const solution = document.getElementById('solution').value;
    const liveOutput = document.getElementById('liveOutput');
    const preview = gameState.currentRoom.currentPreview;

    try {
        if (preview.type === 'javascript') {
            const userFunction = new Function('input', solution);
            const result = userFunction(preview.testCases[0].input);
            liveOutput.textContent = `Output: ${result}`;
            liveOutput.className = 'live-output';
        } else {
            liveOutput.textContent = solution;
            liveOutput.className = 'live-output';
        }
    } catch (error) {
        liveOutput.textContent = `Error: ${error.message}`;
        liveOutput.className = 'live-output error';
    }
}

function submitSolution() {
    const solution = document.getElementById('solution').value;
    if (!solution.trim()) {
        alert('Please enter a solution');
        return;
    }

    const room = gameState.currentRoom;
    const preview = room.currentPreview;
    let passed = false;

    try {
        if (preview.type === 'javascript') {
            const userFunction = new Function('input', solution);
            passed = preview.testCases.every(test => 
                userFunction(test.input) === test.output
            );
        } else {
            passed = preview.testCases.every(test => 
                test.validate(solution)
            );
        }

        if (passed) {
            gameState.currentPlayer.score += 1;
            alert('Congratulations! All test cases passed!');
        } else {
            alert('Solution failed. Please try again.');
        }
    } catch (error) {
        alert(`Error in your code: ${error.message}`);
        return;
    }
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    document.getElementById('challengeArea').classList.add('hidden');
    document.getElementById('previewsList').classList.remove('hidden');
    updateGameRoom();
}

function startGame() {
    if (!gameState.currentRoom || !gameState.currentPlayer.isAdmin) return;
    
    const room = gameState.currentRoom;
    if (room.players.length !== parseInt(room.mode)) {
        alert('Cannot start game until all players have joined');
        return;
    }

    if (room.previews.length === 0) {
        alert('Please add at least one challenge before starting the game');
        return;
    }

    room.status = 'in-progress';
    updateGameRoom();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    const solutionTextarea = document.getElementById('solution');
    solutionTextarea.addEventListener('input', updateLiveOutput);
});
