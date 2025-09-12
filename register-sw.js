// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.error('ServiceWorker registration failed: ', err);
      });
  });
}

// PWA Install Button Handling
let deferredPrompt;
const installButton = document.getElementById('installButton');

// Only show the install button if the app isn't already installed
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button
  installButton.style.display = 'block';
  
  // Log that the PWA can be installed
  console.log('PWA installation available');
});

// Handle install button click
installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);
  
  // Clear the deferredPrompt variable
  deferredPrompt = null;
  
  // Hide the install button after installation
  installButton.style.display = 'none';
});

// Hide the install button if the app is already installed
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  installButton.style.display = 'none';
  deferredPrompt = null;
});

// Hide install button by default
installButton.style.display = 'none';
