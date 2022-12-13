import './css/main.css';

import * as Networking from './networking';

const pingField = getElement('ping-counter');
const startPanel = getElement('start-panel');
const startButton = getElement('start');

initializeClient();

function initializeClient() {
    temporarilyDisableNickname();
    startButton.addEventListener('click', () => start());
    document.addEventListener('keyup', (e) => detectKeyEvent(e));
}

function start() {
    Networking.connect(onConnect, onDisconnect);
}

function onConnect() {
    showStartPanel(false);
}

function onDisconnect() {
    showStartPanel(true);
}

function showStartPanel(visible = true) {
    if (visible) {
        startPanel.classList.remove('hidden');
        Networking.stopPingCounter();
        setPingText('DISC');
    } else {
        startPanel.classList.add('hidden');
        setPingText('');
        Networking.startPingCounter(ping => setPingText(`${ping}ms`));
    }
}

function setPingText(value) {
    pingField.textContent = `Ping: ${value}`;
}

function detectKeyEvent(key) {
    if (key.code === 'Escape') {
        Networking.disconnect();
    }
}

function getElement(id) {
    return document.getElementById(id);
}

function temporarilyDisableNickname() {
    let nicknameInput = document.getElementById('player-name');
    nicknameInput.value = 'undefined';
    nicknameInput.style.cursor = 'not-allowed';
    nicknameInput.toggleAttribute('readonly', true);
}
