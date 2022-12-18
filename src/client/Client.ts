import './css/main.css';

import * as Networking from './Networking';
import SocketProfile from '../shared/SocketProfile';

const pingField: HTMLElement = getElement('ping-counter');
const startPanel: HTMLElement = getElement('start-panel');
const startButton: HTMLButtonElement = getElement('start');
const nicknameInput: HTMLInputElement = getElement('player-name');

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

function setPingText(value: string) {
    pingField.textContent = `Ping: ${value}`;
}

function detectKeyEvent(key: KeyboardEvent) {
    if (key.code === 'Escape') {
        Networking.disconnect();
    }
}

function getElement<T>(id: string): T {
    return document.getElementById(id) as T;
}

function getValidNickname(): string {
    if (nicknameInput.value.length < 3) {
        nicknameInput.value = `Anon #${Math.floor(Math.random() * 1000)}`;
    }

    nicknameInput.value = nicknameInput.value.trim();
    return nicknameInput.value;
}
