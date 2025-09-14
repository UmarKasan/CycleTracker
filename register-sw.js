var Version;
Version = 2.28;

// Create the install button in the global scope
console.log('Creating install button...');
let btnAddToHomeScreen = document.getElementById('installButton');

if (!btnAddToHomeScreen) {
  console.log('Creating new install button...');
  btnAddToHomeScreen = document.createElement('button');
  btnAddToHomeScreen.id = 'installButton';
  btnAddToHomeScreen.textContent = 'Install App';
  btnAddToHomeScreen.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    padding: 10px 20px !important;
    background-color: #ff0000 !important; /* Red color for better visibility */
    color: white !important;
    border: 2px solid white !important;
    border-radius: 5px !important;
    cursor: pointer !important;
    z-index: 9999 !important; /* Very high z-index */
    display: none !important;
    font-size: 16px !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
  `;
  
  // Add a test click handler for debugging
  btnAddToHomeScreen.onclick = function() {
    console.log('Install button clicked!');
    alert('Install button clicked!');
  };
} else {
  console.log('Using existing install button');
}

// Add the install button to the body
function addButtonToBody() {
  if (document.body && !document.getElementById('installButton')) {
    document.body.appendChild(btnAddToHomeScreen);
    console.log('Button added to body');
    
    // Add a manual trigger button for testing
    const testBtn = document.createElement('button');
    testBtn.id = 'testInstallBtn';
    testBtn.textContent = 'Test Install';
    testBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      z-index: 9999;
    `;
    testBtn.onclick = () => {
      console.log('Manual install trigger clicked');
      showInstallPromotion();
    };
    document.body.appendChild(testBtn);
  }
}

// Try to add the button immediately
addButtonToBody();

// Also try when DOM is loaded if not already
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addButtonToBody);
}

console.log('Button created with ID:', btnAddToHomeScreen.id);

// Handle the beforeinstallprompt event
if (typeof deferredPrompt === 'undefined') {
  var deferredPrompt;
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Check if the service worker is controlling the page
      if (navigator.serviceWorker.controller) {
        console.log('Service worker is controlling the page');
      } else {
        console.log('Service worker is registered but not controlling the page');
      }
      
    } catch (error) {
      console.error('ServiceWorker registration failed: ', error);
    }
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  console.log('Button state before showInstallPromotion:', {
    display: window.getComputedStyle(btnAddToHomeScreen).display,
    visibility: window.getComputedStyle(btnAddToHomeScreen).visibility,
    exists: document.body.contains(btnAddToHomeScreen)
  });
  // Show the install button
  showInstallPromotion();
  console.log('Button state after showInstallPromotion:', {
    display: window.getComputedStyle(btnAddToHomeScreen).display,
    visibility: window.getComputedStyle(btnAddToHomeScreen).visibility
  });
});

function showInstallPromotion() {
  console.log('showInstallPromotion called');
  // Show the button
  btnAddToHomeScreen.style.display = 'block';
  console.log('Button display set to:', window.getComputedStyle(btnAddToHomeScreen).display);
  
  // Add click event listener
  btnAddToHomeScreen.onclick = async () => {
    if (!deferredPrompt) return;
    
    btnAddToHomeScreen.disabled = true;
    btnAddToHomeScreen.textContent = 'Installing...';
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      // Hide the button after installation attempt
      btnAddToHomeScreen.style.display = 'none';
      deferredPrompt = null;
    }
  };
}