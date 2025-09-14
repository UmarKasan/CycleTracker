// Create the install button in the global scope
console.log('Creating install button...');
const btnAddToHomeScreen = document.createElement('button');
btnAddToHomeScreen.id = 'installButton';
btnAddToHomeScreen.textContent = 'Install App';
btnAddToHomeScreen.style.cssText = `
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  padding: 10px 20px !important;
  background-color: #4CAF50 !important;
  color: white !important;
  border: none !important;
  border-radius: 5px !important;
  cursor: pointer !important;
  z-index: 1000 !important;
  display: none !important;
`;

// Add the button to the body
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(btnAddToHomeScreen);
    console.log('Button added to body after DOM loaded');
  });
} else {
  document.body.appendChild(btnAddToHomeScreen);
  console.log('Button added to body (DOM already loaded)');
}

console.log('Button created with ID:', btnAddToHomeScreen.id);

// Handle the beforeinstallprompt event
let deferredPrompt;

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