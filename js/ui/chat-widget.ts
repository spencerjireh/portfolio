/**
 * Chat Widget
 * Floating AI chat panel connecting to Folionaut backend.
 * Fully dynamic DOM -- no HTML markup needed in index.html.
 */

import { renderMarkdown } from '../chat/markdown';

const API_BASE = import.meta.env.DEV
  ? '/api/v1'
  : 'https://folionaut.spencerjireh.com/api/v1';

const STORAGE_KEY = 'chat-state';
const MAX_MESSAGES = 100;
const GREETING =
  "Hello! I'm Folionaut, Spencer's AI assistant. I can tell you about his experience, projects, tech stack, and more. What would you like to know?";

const MOBILE_BREAKPOINT = 640;
const SWIPE_THRESHOLD = 80;

function isMobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PersistedState {
  visitorId: string;
  sessionId: string | null;
  messages: ChatMessage[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateVisitorId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.visitorId && Array.isArray(parsed.messages)) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  return { visitorId: generateVisitorId(), sessionId: null, messages: [] };
}

function savePersistedState(state: PersistedState): void {
  try {
    const toSave: PersistedState = {
      ...state,
      messages: state.messages.slice(-MAX_MESSAGES),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

const ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const ICON_SEND = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

// ---------------------------------------------------------------------------
// Main module
// ---------------------------------------------------------------------------

export function initChatWidget(): () => void {
  // State
  const persisted = loadPersistedState();
  let messages: ChatMessage[] = persisted.messages;
  let visitorId = persisted.visitorId;
  let sessionId = persisted.sessionId;
  let isOpen = false;
  let isLoading = false;
  let rateLimitedUntil = 0;
  let rateLimitTimer: ReturnType<typeof setInterval> | null = null;
  let hasGreeted = messages.length > 0;
  let vpResizeHandler: (() => void) | null = null;
  let touchStartY = 0;
  let wasMobile = isMobile();

  // ---- DOM creation ----
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', 'Open chat');
  fab.innerHTML =
    `<svg class="chat-fab-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` +
    '<span class="chat-fab-line"></span><span class="chat-fab-line"></span>';

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat with Folionaut');
  panel.setAttribute('aria-hidden', 'true');

  // Header
  const header = document.createElement('div');
  header.className = 'chat-header';
  header.innerHTML = `<h2 class="chat-header-title">Folionaut</h2>`;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'chat-close-btn';
  closeBtn.setAttribute('aria-label', 'Close chat');
  closeBtn.innerHTML = ICON_CLOSE;
  header.appendChild(closeBtn);

  // Messages
  const messagesEl = document.createElement('div');
  messagesEl.className = 'chat-messages';
  messagesEl.setAttribute('role', 'log');
  messagesEl.setAttribute('aria-live', 'polite');

  // Input area
  const inputArea = document.createElement('div');
  inputArea.className = 'chat-input-area';
  const textarea = document.createElement('textarea');
  textarea.className = 'chat-input';
  textarea.setAttribute('aria-label', 'Type your message');
  textarea.setAttribute('placeholder', 'Ask about Spencer...');
  textarea.rows = 1;
  const sendBtn = document.createElement('button');
  sendBtn.className = 'chat-send-btn';
  sendBtn.setAttribute('aria-label', 'Send message');
  sendBtn.innerHTML = ICON_SEND;
  inputArea.appendChild(textarea);
  inputArea.appendChild(sendBtn);

  panel.appendChild(header);
  panel.appendChild(messagesEl);
  panel.appendChild(inputArea);

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  // ---- Rendering helpers ----

  function renderMessages(): void {
    messagesEl.innerHTML = '';
    for (const msg of messages) {
      appendMessageEl(msg);
    }
    scrollToBottom();
  }

  function appendMessageEl(msg: ChatMessage): void {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message chat-message--${msg.role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-message-bubble';
    bubble.innerHTML =
      msg.role === 'assistant'
        ? renderMarkdown(msg.content)
        : escapeForDisplay(msg.content);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
  }

  function escapeForDisplay(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showTyping(): void {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    el.id = 'chat-typing';
    el.innerHTML =
      '<span class="chat-typing-dot"></span><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span>';
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function hideTyping(): void {
    document.getElementById('chat-typing')?.remove();
  }

  function showStatus(text: string, type: 'error' | 'rate-limit'): void {
    removeStatus();
    const el = document.createElement('div');
    el.className = `chat-status chat-status--${type}`;
    el.id = 'chat-status';
    el.textContent = text;
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function removeStatus(): void {
    document.getElementById('chat-status')?.remove();
  }

  function scrollToBottom(): void {
    requestAnimationFrame(() => {
      messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
    });
  }

  function setInputDisabled(disabled: boolean): void {
    textarea.disabled = disabled;
    sendBtn.disabled = disabled;
  }

  // ---- Auto-resize textarea ----

  function autoResize(): void {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  // ---- Open / Close ----

  function openPanel(): void {
    isOpen = true;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-label', 'Close chat');

    fab.classList.add('active');

    if (isMobile()) {
      fab.classList.add('is-hidden');
      document.body.style.overflow = 'hidden';
      bindVisualViewport();
    }

    // Greeting on first open
    if (!hasGreeted) {
      hasGreeted = true;
      messages.push({ role: 'assistant', content: GREETING });
      savePersistedState({ visitorId, sessionId, messages });
    }

    renderMessages();
    textarea.focus();
  }

  function bindVisualViewport(): void {
    const vv = window.visualViewport;
    if (!vv) return;
    vpResizeHandler = () => {
      panel.style.height = `${vv.height}px`;
      panel.style.top = `${vv.offsetTop}px`;
    };
    vv.addEventListener('resize', vpResizeHandler);
    vv.addEventListener('scroll', vpResizeHandler);
    vpResizeHandler();
  }

  function unbindVisualViewport(): void {
    const vv = window.visualViewport;
    if (!vv || !vpResizeHandler) return;
    vv.removeEventListener('resize', vpResizeHandler);
    vv.removeEventListener('scroll', vpResizeHandler);
    vpResizeHandler = null;
    panel.style.height = '';
    panel.style.top = '';
  }

  function closePanel(): void {
    isOpen = false;
    panel.style.transform = '';
    panel.classList.remove('is-open', 'is-dragging');
    panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-label', 'Open chat');
    fab.classList.remove('is-hidden');
    fab.classList.remove('active');
    unbindVisualViewport();
    document.body.style.overflow = '';
  }

  function togglePanel(): void {
    if (isOpen) closePanel();
    else openPanel();
  }

  // ---- API ----

  async function sendMessage(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Check rate limit
    if (Date.now() < rateLimitedUntil) return;

    removeStatus();

    // Optimistic UI
    messages.push({ role: 'user', content: trimmed });
    appendMessageEl(messages[messages.length - 1]);
    textarea.value = '';
    autoResize();
    scrollToBottom();

    isLoading = true;
    setInputDisabled(true);
    showTyping();

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          visitorId,
          ...(sessionId ? { sessionId } : {}),
        }),
      });

      hideTyping();

      if (res.status === 429) {
        messages.pop();
        renderMessages();
        const retryAfter = parseInt(res.headers.get('Retry-After') || '60', 10);
        startRateLimitCountdown(retryAfter);
        return;
      }

      if (!res.ok) {
        showStatus('Something went wrong. Please try again.', 'error');
        savePersistedState({ visitorId, sessionId, messages });
        return;
      }

      const data = await res.json();
      if (data.sessionId) sessionId = data.sessionId;

      const reply: string = data.message?.content ?? '';
      if (!reply) {
        console.warn('[chat] Unexpected response shape:', data);
      }

      if (reply) {
        messages.push({ role: 'assistant', content: reply });
        appendMessageEl(messages[messages.length - 1]);
        scrollToBottom();
      }

      savePersistedState({ visitorId, sessionId, messages });
    } catch {
      hideTyping();
      showStatus('Network error. Check your connection and try again.', 'error');
    } finally {
      isLoading = false;
      if (Date.now() >= rateLimitedUntil) {
        setInputDisabled(false);
      }
      textarea.focus();
    }
  }

  function startRateLimitCountdown(seconds: number): void {
    rateLimitedUntil = Date.now() + seconds * 1000;
    setInputDisabled(true);

    const update = () => {
      const remaining = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearRateLimitTimer();
        removeStatus();
        setInputDisabled(false);
        textarea.focus();
        return;
      }
      showStatus(`Rate limited. Try again in ${remaining}s`, 'rate-limit');
    };

    update();
    rateLimitTimer = setInterval(update, 1000);
  }

  function clearRateLimitTimer(): void {
    if (rateLimitTimer !== null) {
      clearInterval(rateLimitTimer);
      rateLimitTimer = null;
    }
  }

  // ---- Event handlers ----

  function onFabClick(): void {
    togglePanel();
  }

  function onCloseClick(): void {
    closePanel();
  }

  function onSendClick(): void {
    sendMessage(textarea.value);
  }

  function onTextareaKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
      e.preventDefault();
      sendMessage(textarea.value);
    }
  }

  function onTextareaInput(): void {
    autoResize();
  }

  function onGlobalKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isOpen) {
      closePanel();
    }
  }

  function onDocumentClick(e: MouseEvent): void {
    if (!isOpen) return;
    if (isMobile()) return;
    const target = e.target as Node;
    if (!panel.contains(target) && !fab.contains(target)) {
      closePanel();
    }
  }

  // ---- Swipe-to-dismiss ----

  function onTouchStart(e: TouchEvent): void {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e: TouchEvent): void {
    const dy = e.touches[0].clientY - touchStartY;
    if (dy <= 0) return;
    e.preventDefault();
    panel.classList.add('is-dragging');
    panel.style.transform = `translateY(${dy}px)`;
  }

  function onTouchEnd(e: TouchEvent): void {
    const dy = Math.max(0, e.changedTouches[0].clientY - touchStartY);
    panel.classList.remove('is-dragging');
    if (dy > SWIPE_THRESHOLD) {
      closePanel();
    } else {
      panel.style.transform = '';
    }
  }

  // ---- Viewport resize handler ----

  function onWindowResize(): void {
    const nowMobile = isMobile();
    if (wasMobile === nowMobile) return;
    wasMobile = nowMobile;

    if (!isOpen) return;

    if (nowMobile) {
      fab.classList.add('is-hidden');
      document.body.style.overflow = 'hidden';
      bindVisualViewport();
    } else {
      fab.classList.remove('is-hidden');
      document.body.style.overflow = '';
      unbindVisualViewport();
    }
  }

  // ---- Bind events ----

  fab.addEventListener('click', onFabClick);
  closeBtn.addEventListener('click', onCloseClick);
  sendBtn.addEventListener('click', onSendClick);
  textarea.addEventListener('keydown', onTextareaKeydown);
  textarea.addEventListener('input', onTextareaInput);
  document.addEventListener('keydown', onGlobalKeydown);
  document.addEventListener('click', onDocumentClick);
  header.addEventListener('touchstart', onTouchStart, { passive: true });
  header.addEventListener('touchmove', onTouchMove, { passive: false });
  header.addEventListener('touchend', onTouchEnd);
  window.addEventListener('resize', onWindowResize);

  // ---- Dispose ----

  return () => {
    fab.removeEventListener('click', onFabClick);
    closeBtn.removeEventListener('click', onCloseClick);
    sendBtn.removeEventListener('click', onSendClick);
    textarea.removeEventListener('keydown', onTextareaKeydown);
    textarea.removeEventListener('input', onTextareaInput);
    document.removeEventListener('keydown', onGlobalKeydown);
    document.removeEventListener('click', onDocumentClick);
    header.removeEventListener('touchstart', onTouchStart);
    header.removeEventListener('touchmove', onTouchMove);
    header.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('resize', onWindowResize);
    unbindVisualViewport();
    clearRateLimitTimer();
    document.body.style.overflow = '';
    fab.remove();
    panel.remove();
  };
}
