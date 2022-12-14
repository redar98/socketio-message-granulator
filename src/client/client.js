import './css/main.css';

import * as Networking from './networking';
import SocketProfile from '../shared/SocketProfile';

const pingField = getElement('ping-counter');
const startPanel = getElement('start-panel');
const startButton = getElement('start');
const nicknameInput = getElement('player-name');

initializeClient();

function initializeClient() {
    startButton.addEventListener('click', () => attemptStart());
    document.addEventListener('keyup', (e) => detectKeyEvent(e));
}

function attemptStart() {
    let nickname = getValidNickname();

    let profile = new SocketProfile(nickname);

    Networking.connect(profile, onConnect, onDisconnect);
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

function getValidNickname() {
    if (nicknameInput.value.length < 3) {
        nicknameInput.value = `Anon #${Math.floor(Math.random() * 1000)}`;
    }

    nicknameInput.value = nicknameInput.value.trim();
    return nicknameInput.value;
}
