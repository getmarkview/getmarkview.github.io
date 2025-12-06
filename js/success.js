/**
 * MarkView Success Page - JavaScript
 * Handles checkout callback, license key fetching, and page initialization
 */

/**
 * Parse URL parameters from callback URL
 * Sample URL: success.html?checkout_id=xxx&customer_session_token=yyy
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Extract checkout data from URL
 */
function extractCheckoutData() {
  const checkoutId = getUrlParam('checkout_id');
  const customerSessionToken = getUrlParam('customer_session_token');

  return {
    checkoutId,
    customerSessionToken,
    timestamp: new Date(),
  };
}

/**
 * Format date for display
 */
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Optional: Fetch license key from backend
 *
 * If you want to display the license key immediately on the success page,
 * implement a backend endpoint that:
 * 1. Receives customer_session_token
 * 2. Calls Polar Customer Portal API to get order details
 * 3. Returns the license key
 *
 * This requires a backend/serverless function to keep your Polar API key secure.
 *
 * @param {string} customerSessionToken - The customer session token from URL
 * @returns {Promise<string|null>} - The license key or null if unavailable
 */
async function fetchLicenseKey(customerSessionToken) {
  if (!customerSessionToken) {
    return null;
  }

  try {
    // TODO: Replace with your actual backend endpoint
    // Example endpoints:
    // - AWS Lambda: https://your-api.execute-api.region.amazonaws.com/prod/get-license
    // - Vercel Function: https://your-domain.vercel.app/api/get-license
    // - Netlify Function: https://your-site.netlify.app/.netlify/functions/get-license

    const BACKEND_ENDPOINT = null; // Set your endpoint URL here

    if (!BACKEND_ENDPOINT) {
      console.info('License key fetch disabled: No backend endpoint configured');
      return null;
    }

    const response = await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_session_token: customerSessionToken,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch license key:', response.status);
      return null;
    }

    const data = await response.json();
    return data.license_key || null;
  } catch (error) {
    console.error('Error fetching license key:', error);
    return null;
  }
}

/**
 * Display license key on the page
 *
 * @param {string} licenseKey - The license key to display
 */
function displayLicenseKey(licenseKey) {
  if (!licenseKey) return;

  // Create license key section
  const licenseSection = document.createElement('div');
  licenseSection.className = 'license-key-section';
  licenseSection.innerHTML = `
        <div style="background: #ede9fe; border: 1px solid #c4b5fd; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: left;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <div style="width: 32px; height: 32px; background: var(--gradient-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                    🔑
                </div>
                <h3 style="color: var(--text-primary); font-weight: 700; font-size: 16px; margin: 0;">Your License Key</h3>
            </div>
            <div style="background: white; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                <code style="font-family: 'Courier New', monospace; font-size: 13px; color: var(--primary); word-break: break-all; font-weight: 600;">${licenseKey}</code>
            </div>
            <button onclick="copyLicenseKey('${licenseKey}')" style="background: none; border: none; color: var(--primary); cursor: pointer; font-weight: 600; font-size: 13px; padding: 0; text-decoration: underline;">
                📋 Copy to clipboard
            </button>
        </div>
    `;

  // Insert before instructions section
  const instructionsSection = document.querySelector('.instructions-section');
  if (instructionsSection) {
    instructionsSection.parentNode.insertBefore(licenseSection, instructionsSection);
  }

  // Update info banner text
  const infoBannerText = document.querySelector('.info-banner-text');
  if (infoBannerText) {
    infoBannerText.innerHTML =
      '<strong>Your license key is ready!</strong> Copy it below and activate in the extension.';
  }
}

/**
 * Copy license key to clipboard
 */
window.copyLicenseKey = function (licenseKey) {
  navigator.clipboard
    .writeText(licenseKey)
    .then(() => {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = '✅ Copied!';
      btn.style.color = 'var(--success)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.color = 'var(--primary)';
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard. Please select and copy manually.');
    });
};

/**
 * Display error state when checkout data is missing
 */
function displayError() {
  const container = document.querySelector('.container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center;">
      <!-- Error Icon -->
      <div style="width: 96px; height: 96px; margin: 0 auto 24px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48px; animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);">
        ❌
      </div>

      <!-- Title & Subtitle -->
      <h1 style="font-size: 32px; color: var(--text-primary); margin-bottom: 12px; font-weight: 800; letter-spacing: -0.02em;">Something Went Wrong</h1>
      <p style="font-size: 17px; color: var(--text-secondary); margin-bottom: 32px; line-height: 1.6; max-width: 400px; margin-left: auto; margin-right: auto;">
        We encountered an error while processing your request. Please try again or contact our support team for assistance.
      </p>

      <!-- Error Banner -->
      <div style="background: #fee2e2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; display: flex; align-items: center; gap: 12px; text-align: left;">
        <div style="font-size: 24px; flex-shrink: 0;">⚠️</div>
        <div style="font-size: 14px; color: #991b1b; font-weight: 500; line-height: 1.5;">
          <strong>Unable to process:</strong> This page cannot be displayed at this time.
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
        <a href="https://getmarkview.github.io/" style="width: 100%; padding: 14px 24px; border: none; border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all var(--transition-base); text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; background: var(--gradient-primary); color: white; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to MarkView
        </a>
        <a href="https://getmarkview.github.io/support.html" style="width: 100%; padding: 14px 24px; border: none; border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all var(--transition-base); text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-primary);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Contact Support
        </a>
      </div>

      <!-- Footer -->
      <div style="font-size: 13px; color: var(--text-tertiary); margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-primary);">
        If you completed a purchase and are seeing this error, please <a href="https://getmarkview.github.io/support.html" style="color: var(--primary); text-decoration: none; font-weight: 600;">contact our support team</a> with your order details.
      </div>
    </div>
  `;
}

/**
 * Initialize success page
 */
async function init() {
  try {
    const { checkoutId, customerSessionToken, timestamp } = extractCheckoutData();

    // Check if checkout_id is present
    if (!checkoutId) {
      console.warn('Missing checkout_id parameter in URL');
      // Show loading briefly before displaying error
      await new Promise(resolve => setTimeout(resolve, 800));
      displayError();
      return;
    }

    // Log checkout data for debugging
    console.log('Checkout completed:', {
      checkoutId,
      hasToken: !!customerSessionToken,
      timestamp: timestamp.toISOString(),
    });

    // Optionally fetch license key from backend
    // This will only work if you've configured a backend endpoint
    const licenseKey = await fetchLicenseKey(customerSessionToken);

    // Show loading state briefly for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Hide loading, show success content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';

    // Display license key if available
    if (licenseKey) {
      displayLicenseKey(licenseKey);
    }

    // Update purchase date
    const purchaseDateEl = document.getElementById('purchase-date');
    if (purchaseDateEl) {
      purchaseDateEl.textContent = formatDate(timestamp);
    }

    // Track conversion (Google Analytics, Facebook Pixel, etc.)
    if (typeof gtag !== 'undefined' && checkoutId) {
      gtag('event', 'purchase', {
        transaction_id: checkoutId,
        value: 9.99,
        currency: 'USD',
        items: [
          {
            item_id: 'markview_pro_lifetime',
            item_name: 'MarkView PRO Lifetime License',
            price: 9.99,
            quantity: 1,
          },
        ],
      });
    }

    // Store checkout data for potential future use
    if (checkoutId) {
      sessionStorage.setItem('markview_checkout_id', checkoutId);
      sessionStorage.setItem('markview_purchase_date', timestamp.toISOString());
    }
  } catch (error) {
    console.error('Error initializing success page:', error);

    // Still show success content even if there's an error
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
