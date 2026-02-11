export function initCopyEmail(): void {
  const emailBtns = document.querySelectorAll<HTMLButtonElement>('[data-copy-email]');

  emailBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-copy-email');
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        btn.classList.add('copied');

        setTimeout(() => {
          btn.classList.remove('copied');
        }, 1500);
      } catch (err) {
        console.warn('Clipboard API failed, using fallback');
      }
    });
  });
}
