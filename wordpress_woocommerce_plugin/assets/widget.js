/**
 * ShopConverse AI - Luxury Universal Storefront Shopping Assistant Widget
 * High-conversion Conversational Sales Closer for modern eCommerce.
 */

(function () {
  'use strict';

  const DEFAULT_CATALOG = [
    {
      id: 'prod_1',
      title: 'Aura Wireless ANC Headphones',
      category: 'Electronics / Audio',
      price: 79.99,
      rating: 4.9,
      reviews: 142,
      stock: 'In Stock',
      tags: ['audio', 'music', 'headphones', 'travel', 'gift', 'tech', 'gadget'],
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: 'Ultra-crisp studio acoustics with 40-hour battery and hybrid active noise cancellation.'
    },
    {
      id: 'prod_2',
      title: 'Artisan Ceramic Pour-Over Coffee Kit',
      category: 'Home & Kitchen / Coffee',
      price: 34.50,
      rating: 4.8,
      reviews: 89,
      stock: 'Selling Fast',
      tags: ['coffee', 'kitchen', 'gift', 'morning', 'brewing', 'aesthetic'],
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      description: 'Handcrafted stoneware dripper with walnut stand. Engineered for clean, aromatic extractions.'
    },
    {
      id: 'prod_3',
      title: 'Minimalist Weatherproof Commuter Backpack',
      category: 'Bags & Accessories',
      price: 49.00,
      rating: 4.9,
      reviews: 215,
      stock: 'Only 4 Left',
      tags: ['bag', 'backpack', 'travel', 'commute', 'laptop', 'college', 'waterproof'],
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      description: 'Ultra-lightweight weatherproof ballistic canvas with magnetic closures and 16" padded laptop vault.'
    },
    {
      id: 'prod_4',
      title: 'Organic Lavender & Bergamot Soy Candle',
      category: 'Home Fragrance / Wellness',
      price: 18.00,
      rating: 4.7,
      reviews: 64,
      stock: 'In Stock',
      tags: ['candle', 'gift', 'relax', 'sleep', 'wellness', 'fragrance', 'cheap', 'budget'],
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
      description: 'Hand-poured 100% natural botanical soy wax with pure aromatherapy essential oils.'
    },
    {
      id: 'prod_5',
      title: 'Ergonomic Memory Foam Lumbar Support',
      category: 'Office / Ergonomics',
      price: 28.99,
      rating: 4.8,
      reviews: 110,
      stock: 'In Stock',
      tags: ['office', 'chair', 'back pain', 'ergonomic', 'desk', 'work from home'],
      image: 'https://images.unsplash.com/photo-1580481077195-c2f82d164d12?w=600&auto=format&fit=crop&q=80',
      description: 'Therapeutic contoured memory foam with 3D breathable airflow mesh for posture alignment.'
    }
  ];

  class ShopConverseWidget {
    constructor() {
      this.catalog = window.ShopConverseProducts || DEFAULT_CATALOG;
      this.storeName = document.currentScript?.getAttribute('data-store-name') || 'Lumina';
      this.currency = document.currentScript?.getAttribute('data-currency') || '$';
      this.isOpen = false;
      this.init();
    }

    init() {
      this.createDOM();
      this.bindEvents();

      // Greeting
      setTimeout(() => {
        this.sendBotMessage(
          `Hello! ✨ I'm your personal shopping concierge for **${this.storeName}**.\n\nWhether you're hunting for a thoughtful gift, matching a budget, or need shipping details—just ask!`,
          [
            '🎁 Curated gifts under $35',
            '🎧 Best tech for travel',
            '🚚 Shipping & Return policy',
            '🎟️ Special discount code'
          ]
        );
      }, 400);
    }

    createDOM() {
      const container = document.createElement('div');
      container.className = 'sc-widget-container';
      container.innerHTML = `
        <!-- Floating Teaser -->
        <div class="sc-teaser-bubble" id="sc-teaser">
          <span>✨ Need help picking a gift? Ask me!</span>
        </div>

        <!-- Floating Launcher -->
        <button class="sc-launcher-btn" id="sc-launcher">
          <span class="sc-sparkle-icon">✨</span>
          <span>Shopping Concierge</span>
        </button>

        <!-- Glassmorphism Chat Window -->
        <div class="sc-chat-window" id="sc-window">
          <div class="sc-header">
            <div class="sc-header-info">
              <div class="sc-avatar">✨</div>
              <div>
                <h3 class="sc-title">${this.storeName} AI Concierge</h3>
                <p class="sc-status"><span class="sc-status-dot"></span> Active & Ready to Assist</p>
              </div>
            </div>
            <button class="sc-close-btn" id="sc-close">✕</button>
          </div>

          <div class="sc-messages" id="sc-messages"></div>

          <form class="sc-input-area" id="sc-form">
            <div class="sc-input-wrap">
              <input type="text" class="sc-input" id="sc-input" placeholder="Type a request: 'gift for traveler', 'candle'..." autocomplete="off">
            </div>
            <button type="submit" class="sc-send-btn" id="sc-send">➤</button>
          </form>
        </div>
      `;

      document.body.appendChild(container);
      this.elements = {
        container,
        teaser: container.querySelector('#sc-teaser'),
        launcher: container.querySelector('#sc-launcher'),
        window: container.querySelector('#sc-window'),
        close: container.querySelector('#sc-close'),
        messages: container.querySelector('#sc-messages'),
        form: container.querySelector('#sc-form'),
        input: container.querySelector('#sc-input')
      };
    }

    bindEvents() {
      const openHandler = () => {
        this.elements.teaser.style.display = 'none';
        this.toggleChat();
      };

      this.elements.launcher.addEventListener('click', openHandler);
      this.elements.teaser.addEventListener('click', openHandler);
      this.elements.close.addEventListener('click', () => this.toggleChat(false));

      this.elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.elements.input.value.trim();
        if (!text) return;
        this.elements.input.value = '';
        this.handleUserMessage(text);
      });
    }

    toggleChat(forceState) {
      this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;
      if (this.isOpen) {
        this.elements.window.classList.add('sc-open');
        this.elements.input.focus();
      } else {
        this.elements.window.classList.remove('sc-open');
      }
    }

    addUserMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'sc-msg sc-msg-user';
      msg.innerHTML = `<div class="sc-bubble">${this.escapeHtml(text)}</div>`;
      this.elements.messages.appendChild(msg);
      this.scrollToBottom();
    }

    sendBotMessage(text, quickPills = [], productCard = null) {
      const msg = document.createElement('div');
      msg.className = 'sc-msg sc-msg-bot';

      let pillsHtml = '';
      if (quickPills && quickPills.length > 0) {
        pillsHtml = `<div class="sc-quick-pills">
          ${quickPills.map(p => `<button class="sc-pill" type="button" data-text="${this.escapeHtml(p)}">${this.escapeHtml(p)}</button>`).join('')}
        </div>`;
      }

      let cardHtml = '';
      if (productCard) {
        cardHtml = `
          <div class="sc-product-card">
            <div class="sc-product-img-wrap">
              <img class="sc-product-img" src="${productCard.image}" alt="${this.escapeHtml(productCard.title)}">
              <span class="sc-badge-rating">★ ${productCard.rating} (${productCard.reviews})</span>
              <span class="sc-badge-stock">${productCard.stock}</span>
            </div>
            <div class="sc-product-details">
              <h4 class="sc-product-title">${this.escapeHtml(productCard.title)}</h4>
              <p class="sc-product-desc">${this.escapeHtml(productCard.description)}</p>
              <div class="sc-product-footer">
                <span class="sc-product-price">${this.currency}${productCard.price.toFixed(2)}</span>
                <button class="sc-add-btn" type="button" data-id="${productCard.id}">
                  <span>🛒</span> <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      msg.innerHTML = `
        <div class="sc-bubble">${this.formatMarkdown(text)}</div>
        ${cardHtml}
        ${pillsHtml}
      `;

      // Event handlers
      msg.querySelectorAll('.sc-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this.handleUserMessage(btn.dataset.text);
        });
      });

      const addBtn = msg.querySelector('.sc-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.handleAddToCart(productCard, addBtn);
        });
      }

      this.elements.messages.appendChild(msg);
      this.scrollToBottom();
    }

    handleAddToCart(product, btnElement) {
      btnElement.innerHTML = `<span>✓</span> <span>Added to Cart!</span>`;
      btnElement.style.background = '#10b981';
      btnElement.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';

      // Trigger custom storefront event
      const event = new CustomEvent('shopconverse:add_to_cart', { detail: product });
      window.dispatchEvent(event);

      setTimeout(() => {
        btnElement.innerHTML = `<span>🛒</span> <span>Add to Cart</span>`;
        btnElement.style.background = '';
        btnElement.style.boxShadow = '';
      }, 2400);

      setTimeout(() => {
        this.sendBotMessage(
          `✨ Excellent choice! **${product.title}** has been added to your shopping bag.\n\nReady to complete checkout, or can I recommend a matching accessory?`,
          ['💳 Proceed to Checkout', '🎟️ Apply Discount Code', '🔍 Show Other Favorites']
        );
      }, 600);
    }

    handleUserMessage(text) {
      this.addUserMessage(text);

      // Typing animation
      const typing = document.createElement('div');
      typing.className = 'sc-msg sc-msg-bot sc-typing';
      typing.innerHTML = `
        <div class="sc-bubble">
          <div class="sc-typing-dots">
            <span class="sc-dot"></span>
            <span class="sc-dot"></span>
            <span class="sc-dot"></span>
          </div>
        </div>
      `;
      this.elements.messages.appendChild(typing);
      this.scrollToBottom();

      setTimeout(() => {
        typing.remove();
        this.generateResponse(text);
      }, 800);
    }

    generateResponse(query) {
      const q = query.toLowerCase();

      // Shipping & Returns
      if (q.includes('shipping') || q.includes('delivery') || q.includes('track') || q.includes('time')) {
        this.sendBotMessage(
          `🚚 **Complimentary Worldwide Shipping:**\n\n• **Standard:** Delivered within **3–5 business days** (Free on orders over $40).\n• **Express 2-Day:** Available at checkout for urgent orders.\n• Real-time courier tracking sent via SMS & email.`,
          ['🎁 Gift recommendations', '🔥 Trending items']
        );
        return;
      }

      if (q.includes('return') || q.includes('refund') || q.includes('exchange')) {
        this.sendBotMessage(
          `🛡️ **30-Day Guarantee:**\n\nWe want you to adore your purchase. If anything isn't 100% perfect, return it within **30 days** for a full refund or exchange. Prepaid return labels included with every order!`,
          ['🔍 Browse popular essentials', '🚚 Shipping times']
        );
        return;
      }

      if (q.includes('discount') || q.includes('coupon') || q.includes('code') || q.includes('offer') || q.includes('promo')) {
        this.sendBotMessage(
          `🎟️ **VIP Concierge Privilege:**\n\nUse code **CONCIERGE10** at checkout for an instant **10% OFF** your order today!`,
          ['🎧 View Headphones', '☕ View Coffee Dripper', '🎒 View Backpack']
        );
        return;
      }

      if (q.includes('checkout') || q.includes('pay') || q.includes('buy')) {
        this.sendBotMessage(
          `🛍️ You can complete checkout anytime by clicking the **Cart** bag at the top right of the page. Don't forget code **CONCIERGE10** for 10% off!`,
          ['🎟️ Apply Discount Code', '🔍 Keep Browsing']
        );
        return;
      }

      // Intelligent Semantic Product Recommendation
      const priceMatch = q.match(/under\s*\$?(\d+)/) || q.match(/less\s*than\s*\$?(\d+)/);
      const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : (q.includes('budget') || q.includes('cheap') ? 35 : null);

      let matchedProduct = null;
      let rationale = '';

      for (const prod of this.catalog) {
        if (maxPrice && prod.price > maxPrice) continue;

        const hasTag = prod.tags.some(t => q.includes(t));
        const hasTitle = q.includes(prod.title.toLowerCase());
        const hasCategory = q.includes(prod.category.toLowerCase());

        if (hasTitle || hasTag || hasCategory) {
          matchedProduct = prod;
          rationale = `Based on your request, this is one of our highest-rated recommendations:`;
          break;
        }
      }

      if (!matchedProduct) {
        if (maxPrice) {
          matchedProduct = this.catalog.find(p => p.price <= maxPrice) || this.catalog[3];
          rationale = `Here is our best-selling curated piece under ${this.currency}${maxPrice}:`;
        } else if (q.includes('coffee') || q.includes('tea') || q.includes('morning')) {
          matchedProduct = this.catalog[1];
          rationale = `For coffee enthusiasts, our **Artisan Pour-Over Kit** delivers unparalleled clarity and aroma:`;
        } else if (q.includes('work') || q.includes('office') || q.includes('back')) {
          matchedProduct = this.catalog[4];
          rationale = `For ergonomic comfort during work, the **Memory Foam Cushion** is an absolute lifesaver:`;
        } else if (q.includes('travel') || q.includes('bag') || q.includes('laptop')) {
          matchedProduct = this.catalog[2];
          rationale = `Our **Everyday Commuter Backpack** is engineered for seamless travel and daily transit:`;
        } else {
          matchedProduct = this.catalog[0];
          rationale = `Our #1 most popular luxury essential right now is the **Aura Wireless Headphones**:`;
        }
      }

      this.sendBotMessage(
        `${rationale}\n\n**${matchedProduct.title}** features premium build quality and stellar customer reviews.`,
        ['🎁 Other gift options', '🎟️ Check for coupon', '🚚 Shipping info'],
        matchedProduct
      );
    }

    formatMarkdown(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    }

    escapeHtml(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    scrollToBottom() {
      requestAnimationFrame(() => {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ShopConverseWidget());
  } else {
    new ShopConverseWidget();
  }
})();
