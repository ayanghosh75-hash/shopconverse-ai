document.addEventListener('DOMContentLoaded', () => {
  const storeNameInput = document.getElementById('storeNameInput');
  const currencyInput = document.getElementById('currencyInput');
  const colorInput = document.getElementById('colorInput');
  const colorHexText = document.getElementById('colorHexText');
  const discountInput = document.getElementById('discountInput');
  const greetingInput = document.getElementById('greetingInput');
  
  const embedCode = document.getElementById('embedCode');
  const copyEmbedBtn = document.getElementById('copyEmbedBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const saveStatus = document.getElementById('saveStatus');

  // Simulator Elements
  const simHeader = document.getElementById('simHeader');
  const simStoreTitle = document.getElementById('simStoreTitle');
  const simGreetingBubble = document.getElementById('simGreetingBubble');
  const simPromoCode = document.getElementById('simPromoCode');

  function updateEmbedSnippet() {
    const store = storeNameInput.value.trim() || 'My Store';
    const curr = currencyInput.value.trim() || '$';
    embedCode.textContent = `<script src="https://cdn.shopconverse.ai/v1/widget.js" data-store-name="${store}" data-currency="${curr}" defer></script>`;
  }

  function updateSimulator() {
    const store = storeNameInput.value.trim() || 'Store';
    const color = colorInput.value;
    const discount = discountInput.value.trim() || 'SALE10';
    const greeting = greetingInput.value.trim() || 'How can I assist your shopping today?';

    simStoreTitle.textContent = `${store} Concierge`;
    simGreetingBubble.textContent = greeting;
    simPromoCode.textContent = discount;
    simHeader.style.background = `linear-gradient(135deg, ${color} 0%, #8b5cf6 100%)`;
    colorHexText.textContent = color.toUpperCase();
  }

  storeNameInput.addEventListener('input', () => {
    updateEmbedSnippet();
    updateSimulator();
  });

  currencyInput.addEventListener('input', updateEmbedSnippet);

  colorInput.addEventListener('input', updateSimulator);

  discountInput.addEventListener('input', updateSimulator);

  greetingInput.addEventListener('input', updateSimulator);

  copyEmbedBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(embedCode.textContent);
      copyEmbedBtn.textContent = '✓ Copied to Clipboard!';
      copyEmbedBtn.classList.add('copied');
      setTimeout(() => {
        copyEmbedBtn.textContent = '📋 Copy Script Tag';
        copyEmbedBtn.classList.remove('copied');
      }, 2200);
    } catch (e) {
      copyEmbedBtn.textContent = '✓ Selected!';
    }
  });

  saveSettingsBtn.addEventListener('click', () => {
    saveSettingsBtn.textContent = '⏳ Saving...';
    setTimeout(() => {
      saveSettingsBtn.textContent = '✓ Save & Apply Changes';
      saveStatus.textContent = '✦ Assistant synchronized successfully!';
      setTimeout(() => {
        saveStatus.textContent = '';
      }, 3000);
    }, 400);
  });

  // Initial Sync
  updateEmbedSnippet();
  updateSimulator();
});
