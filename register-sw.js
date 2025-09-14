// Create the install button in the global scope
const btnAddToHomeScreen = document.createElement('button');
btnAddToHomeScreen.textContent = 'Install App';
btnAddToHomeScreen.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
  display: none; // Start hidden
`;

// Add the button to the body
document.body.appendChild(btnAddToHomeScreen);

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

// Handle the beforeinstallprompt event
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button
  showInstallPromotion();
});

function showInstallPromotion() {
  // Show the button
  btnAddToHomeScreen.style.display = 'block';
  
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