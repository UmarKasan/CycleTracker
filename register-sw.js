// Service Worker Registration (register as early as possible)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(registration => {
      console.log('ServiceWorker registration successful with scope:', registration.scope);
      // Ensure the SW is active/ready asap for installability checks
      navigator.serviceWorker.ready.then(() => {
        console.log('ServiceWorker is ready');
        // Check if the app is already installed
        checkIfAppIsInstalled();
      });
    })
    .catch(err => {
      console.error('ServiceWorker registration failed:', err);
    });
}

// PWA Install Button Handling
let deferredPrompt;
const installButton = document.getElementById('installButton');

// Check if the app is already installed
function checkIfAppIsInstalled() {
  // For iOS
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  // For standalone mode (already installed)
  const isInStandaloneMode = () => 
    (window.matchMedia('(display-mode: standalone)').matches) || 
    (window.navigator.standalone) ||
    document.referrer.includes('android-app://');

  // Hide install button if already installed
  if (isInStandaloneMode()) {
    console.log('App is already installed');
    installButton.style.display = 'none';
    return true;
  }
  
  // Special handling for iOS
  if (isIos()) {
    console.log('iOS device detected - showing custom install instructions');
    // Show iOS specific install instructions
    showIosInstallInstructions();
    return false;
  }
  
  return false;
}

// Show iOS specific install instructions
function showIosInstallInstructions() {
  // You can customize this to show a modal or instructions for iOS users
  console.log('Show iOS PWA installation instructions');
  // For now, we'll just show the install button
  installButton.style.display = 'block';
  installButton.textContent = 'Install App';
  installButton.onclick = () => {
    // Show iOS installation instructions
    alert('To install this app on your iOS device:\n\n' +
          '1. Tap the Share button (box with an up arrow)\n' +
          '2. Tap "Add to Home Screen"\n' +
          '3. Tap "Add" in the top-right corner');
  };
}

// Handle the beforeinstallprompt event for Android/desktop
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Only show the install button if the app isn't already installed
  if (!checkIfAppIsInstalled()) {
    // Show the install button
    installButton.style.display = 'block';
    installButton.textContent = 'Install App';
    installButton.onclick = handleInstallClick;
    
    // Log that the PWA can be installed
    console.log('PWA installation available');
  }
});

// Handle install button click
async function handleInstallClick() {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    return;
  }
  
  try {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // The prompt can only be used once, so clear it
    deferredPrompt = null;
    
    // Hide the install button after installation
    installButton.style.display = 'none';
  } catch (error) {
    console.error('Error during installation:', error);
  }
}

// Listen for app installation
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  installButton.style.display = 'none';
  deferredPrompt = null;
});

// Check if the app is running in standalone mode (already installed)
window.addEventListener('load', () => {
  checkIfAppIsInstalled();
});

// Hide install button by default
if (installButton) {
  installButton.style.display = 'none';
}
