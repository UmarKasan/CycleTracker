var Version;
Version = 2.29;

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
  
  // Install button click handler will be set in showInstallPromotion
} else {
  console.log('Using existing install button');
}

// Add the install button to the body
function addButtonToBody() {
  if (document.body && !document.getElementById('installButton')) {
    // Add the install button
    document.body.appendChild(btnAddToHomeScreen);
    console.log('Install button added to body');
    
    // Add a manual test button
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
      font-size: 14px;
    `;
    
    // Add test button click handler
    testBtn.onclick = () => {
      console.log('Test install button clicked');
      if (deferredPrompt) {
        console.log('Showing install prompt from test button');
        deferredPrompt.prompt().then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      } else {
        console.log('No deferredPrompt available. Showing install button instead.');
        btnAddToHomeScreen.style.display = 'block';
      }
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
  console.log('beforeinstallprompt event fired', e);
  
  // Prevent the default browser install prompt
  e.preventDefault();
  
  // Stash the event for later use
  deferredPrompt = e;
  console.log('deferredPrompt set:', !!deferredPrompt);
  
  // Log button state before showing
  const buttonState = {
    display: window.getComputedStyle(btnAddToHomeScreen).display,
    visibility: window.getComputedStyle(btnAddToHomeScreen).visibility,
    exists: document.body.contains(btnAddToHomeScreen),
    disabled: btnAddToHomeScreen.disabled
  };
  console.log('Button state before showInstallPromotion:', buttonState);
  
  // Show the install button
  showInstallPromotion();
  
  // Log button state after showing
  const newButtonState = {
    display: window.getComputedStyle(btnAddToHomeScreen).display,
    visibility: window.getComputedStyle(btnAddToHomeScreen).visibility,
    disabled: btnAddToHomeScreen.disabled
  };
  console.log('Button state after showInstallPromotion:', newButtonState);
  
  // Log if the button is in the DOM
  console.log('Button in DOM:', document.body.contains(btnAddToHomeScreen));
});

function showInstallPromotion() {
  console.log('showInstallPromotion called');
  
  // Show the button and set initial state
  btnAddToHomeScreen.style.display = 'block';
  btnAddToHomeScreen.disabled = false;
  btnAddToHomeScreen.textContent = 'Install App';
  
  console.log('Button display set to:', window.getComputedStyle(btnAddToHomeScreen).display);
  
  // Set the click handler
  btnAddToHomeScreen.onclick = async (e) => {
    e.preventDefault();
    console.log('Install button clicked, deferredPrompt:', !!deferredPrompt);
    
    if (!deferredPrompt) {
      console.log('No deferredPrompt available');
      return;
    }
    
    // Update button state
    btnAddToHomeScreen.disabled = true;
    btnAddToHomeScreen.textContent = 'Installing...';
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
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
      // Clear the deferredPrompt variable
      deferredPrompt = null;
      
      // Hide the button
      btnAddToHomeScreen.style.display = 'none';
    }
  };
}