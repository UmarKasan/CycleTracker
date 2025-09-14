var Version;
Version = 2.30;

// Detect the platform
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// Create the install button in the global scope
console.log('Creating install button...');
let btnAddToHomeScreen = document.getElementById('installButton');

if (!btnAddToHomeScreen) {
  console.log('Creating new install button...');
  btnAddToHomeScreen = document.createElement('button');
  btnAddToHomeScreen.id = 'installButton';
  
  // Set button text based on platform
  const buttonText = isIOS ? 'Add to Home Screen' : 'Install App';
  btnAddToHomeScreen.textContent = buttonText;
  
  // Style the button
  btnAddToHomeScreen.style.cssText = `
    position: fixed !important;
    bottom: 30px !important;
    left: 20px !important;
    right: 20px !important;
    width: auto !important;
    max-width: 300px !important;
    margin: 0 auto !important;
    padding: 15px 24px !important;
    background-color: #4CAF50 !important;
    color: white !important;
    border: none !important;
    border-radius: 30px !important;
    cursor: pointer !important;
    z-index: 9999 !important;
    display: block !important; /* Changed from none to block */
    font-size: 16px !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
    transition: all 0.3s ease !important;
    text-align: center !important;
  `;
  
  // Add hover effect for non-touch devices
  btnAddToHomeScreen.addEventListener('mouseenter', () => {
    if (!('ontouchstart' in window)) {
      btnAddToHomeScreen.style.transform = 'translateX(-50%) scale(1.05)';
      btnAddToHomeScreen.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    }
  });
  
  btnAddToHomeScreen.addEventListener('mouseleave', () => {
    if (!('ontouchstart' in window)) {
      btnAddToHomeScreen.style.transform = 'translateX(-50%)';
      btnAddToHomeScreen.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }
  });
  
  // Add active/press effect
  btnAddToHomeScreen.addEventListener('mousedown', () => {
    btnAddToHomeScreen.style.transform = 'translateX(-50%) scale(0.98)';
  });
  
  btnAddToHomeScreen.addEventListener('mouseup', () => {
    btnAddToHomeScreen.style.transform = 'translateX(-50%)';
  });
  
  // Prevent text selection on double click
  btnAddToHomeScreen.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });
  
  console.log('Button created for platform:', isIOS ? 'iOS' : 'Android');
} else {
  console.log('Using existing install button');
}

// Add the install button to the body and handle installation
function addButtonToBody() {
  if (!document.body || document.getElementById('installButton')) {
    return; // Already added or no body element
  }

  // Add the install button to the body
  document.body.appendChild(btnAddToHomeScreen);
  console.log('Install button added to body');
  
  // Show installation instructions for iOS when in standalone mode
  if (isIOS && !isStandalone) {
    // Show iOS installation instructions after a short delay
    setTimeout(() => {
      const iosInstructions = document.createElement('div');
      iosInstructions.id = 'ios-instructions';
      iosInstructions.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 14px;
        text-align: center;
        max-width: 90%;
        z-index: 10000;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.5s ease;
      `;
      
      // Add iOS-specific instructions
      iosInstructions.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: bold;">Install this app on your device</div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>Tap <svg style="width:16px;height:16px;vertical-align:middle;" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
          </svg> then "Add to Home Screen"</span>
        </div>
      `;
      
      // Add styles for the animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }
      `;
      document.head.appendChild(style);
      
      // Add the instructions to the body
      document.body.appendChild(iosInstructions);
      
      // Remove instructions after 10 seconds
      setTimeout(() => {
        if (iosInstructions.parentNode) {
          iosInstructions.style.transition = 'opacity 0.5s ease';
          iosInstructions.style.opacity = '0';
          setTimeout(() => iosInstructions.parentNode.removeChild(iosInstructions), 500);
        }
      }, 10000);
      
      // Make the install button more visible on iOS
      btnAddToHomeScreen.style.display = 'block';
      btnAddToHomeScreen.style.animation = 'bounce 2s infinite';
      
      // Add touch start to hide instructions when tapped
      document.addEventListener('touchstart', function hideInstructions() {
        if (iosInstructions.parentNode) {
          iosInstructions.style.transition = 'opacity 0.3s ease';
          iosInstructions.style.opacity = '0';
          setTimeout(() => {
            if (iosInstructions.parentNode) {
              iosInstructions.parentNode.removeChild(iosInstructions);
            }
          }, 300);
        }
        document.removeEventListener('touchstart', hideInstructions);
      }, { once: true });
    }, 1000);
  }
  
  // Handle Android installation
  if (!isIOS && !isStandalone) {
    // Show the button when the beforeinstallprompt event fires
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show the install button
      btnAddToHomeScreen.style.display = 'block';
      
      // Add click handler for the install button
      btnAddToHomeScreen.onclick = () => {
        if (deferredPrompt) {
          // Show the install prompt
          deferredPrompt.prompt();
          
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            } else {
              console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
          });
        }
      };
    });
  }
  
  // Hide the button if already installed
  if (isStandalone) {
    btnAddToHomeScreen.style.display = 'none';
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