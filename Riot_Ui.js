// --- DOM ELEMENTS ---
const hero = document.getElementById('mainHero');
const btns = [
    document.getElementById('homeBtn'), 
    document.getElementById('loreBtn'), 
    document.getElementById('aboutBtn'), 
    document.getElementById('clipsBtn')
];
const sections = [
    document.getElementById('homeSection'), 
    document.getElementById('loreSection'), 
    document.getElementById('aboutSection'), 
    document.getElementById('clipsSectionContent')
];

// --- SECTION DATA ---
const sectionsData = [
    { bg: "url('https://bloximages.newyork1.vip.townnews.com/dailynebraskan.com/content/tncms/assets/v3/editorial/0/da/0dad4366-4bf8-11ec-85aa-ebb17a277faf/619c3c366811f.image.jpg?crop=1920%2C1008%2C0%2C35&resize=1200%2C630&order=crop%2Cresize')", title: "Jinx & Vi" },
    { bg: "url('https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/ahri/skins/skin85/images/ahri_splash_centered_85.skins_ahri_hol.jpg')", title: "Champion Roster" },
    { bg: "url('https://static0.colliderimages.com/wordpress/wp-content/uploads/2024/09/copy-of-collider-template-17.jpg')", title: "Episode Archives" },
    { bg: "url('https://images2.alphacoders.com/139/thumb-1920-1395484.jpg')", title: "Clips Collection" }
];

let currentIndex = 0;

// --- SMOOTH FADE NAVIGATION (Restored) ---
function showSection(index) {
    currentIndex = index;

    // Toggle Content Sections
    sections.forEach((sec, i) => {
        sec.style.display = (i === index) ? 'block' : 'none';
    });

    // Update Sidebar
    btns.forEach((btn, i) => {
        if (btn) btn.classList.toggle('active', i === index);
    });

    // Update Title
    const titleEl = document.getElementById('heroTitle');
    if (titleEl) titleEl.textContent = sectionsData[index].title;

    // Fade Animation
    if (hero) {
        const newBg = sectionsData[index].bg;
        
        // Create a temporary overlay layer for the new image
        const fadeLayer = document.createElement('div');
        fadeLayer.className = 'hero-fade-layer'; // Uses the .hero-fade-layer CSS class
        fadeLayer.style.backgroundImage = newBg;
        
        // Start completely transparent
        fadeLayer.style.opacity = 0;

        hero.appendChild(fadeLayer);
        
        // Force Browser Reflow (ensures the transition triggers)
        void fadeLayer.offsetWidth; 

        // Fade In to 100%
        fadeLayer.style.opacity = 1;

        // Cleanup: Swap real background and remove overlay after animation (0.8s)
        setTimeout(() => {
            hero.style.backgroundImage = newBg;
            fadeLayer.remove();
        }, 800);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

btns.forEach((btn, i) => {
    if (btn) btn.addEventListener('click', () => showSection(i));
});

// --- SETTINGS LOGIC ---
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const themeToggle = document.getElementById('themeToggle');
const fontOptions = document.querySelectorAll('.font-option');

// Open/Close Settings
if (settingsBtn) {
    settingsBtn.onclick = () => {
        settingsModal.style.display = 'flex';
        setTimeout(() => settingsModal.classList.add('active'), 10);
    };
}

if (closeSettingsBtn) {
    closeSettingsBtn.onclick = () => {
        settingsModal.classList.remove('active');
        setTimeout(() => settingsModal.style.display = 'none', 300);
    };
}

// Light/Dark Mode Toggle
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('light-mode');
    });
}

// Font Switcher
fontOptions.forEach(option => {
    if (!option.classList.contains('disabled')) {
        option.addEventListener('click', () => {
            fontOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const selectedFont = option.getAttribute('data-font');
            document.body.style.fontFamily = selectedFont;
        });
    }
});

// --- LOGO HOME RESET ---
const appLogo = document.getElementById('appLogo');
if (appLogo) {
    appLogo.addEventListener('click', () => {
        showSection(0); // Navigate to Home
    });
}

// --- SWIPE LOGIC ---
let startX = 0;
let isDown = false;

const handleStart = (x) => { startX = x; isDown = true; };
const handleEnd = (x) => {
    if (!isDown) return;
    isDown = false;
    const diff = x - startX;
    
    if (Math.abs(diff) > 50) {
        let newIndex = currentIndex;
        if (diff > 0) {
            newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = sections.length - 1;
        } else {
            newIndex = currentIndex + 1;
            if (newIndex >= sections.length) newIndex = 0;
        }
        showSection(newIndex);
    }
};

document.addEventListener('touchstart', e => handleStart(e.changedTouches[0].screenX));
document.addEventListener('touchend', e => handleEnd(e.changedTouches[0].screenX));
document.addEventListener('mousedown', e => handleStart(e.clientX));
document.addEventListener('mouseup', e => handleEnd(e.clientX));

// --- OTHER MODALS ---
const uploadModal = document.getElementById('uploadModal');
const openUploadBtn = document.getElementById('openUploadBtn');
const closeUploadBtn = document.getElementById('closeUploadBtn');
const cancelUploadBtn = document.getElementById('cancelUploadBtn');

if (openUploadBtn) openUploadBtn.onclick = () => uploadModal.style.display = 'flex';
if (closeUploadBtn) closeUploadBtn.onclick = () => uploadModal.style.display = 'none';
if (cancelUploadBtn) cancelUploadBtn.onclick = () => uploadModal.style.display = 'none';

const loginModal = document.getElementById('loginModal');
const loginNavBtn = document.getElementById('loginNavBtn');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const toggleSignUp = document.getElementById('toggleSignUp');
const loginTitle = document.getElementById('loginTitle');

if (loginNavBtn) loginNavBtn.onclick = () => loginModal.style.display = 'flex';
if (closeLoginBtn) closeLoginBtn.onclick = () => loginModal.style.display = 'none';

if (toggleSignUp) {
    toggleSignUp.onclick = () => {
        const isLogin = loginTitle.innerText.includes('ACCESS');
        loginTitle.innerText = isLogin ? 'NEW AGENT REGISTRATION' : 'AGENT ACCESS';
        toggleSignUp.innerText = isLogin ? 'Back to Login' : 'Create New Profile';
    }
}

// --- LIGHTBOX ---
const lightbox = document.getElementById('lightboxOverlay');
const lbImg = document.getElementById('lightboxImg');
const triggers = document.querySelectorAll('.preview-trigger');
const lbPrev = document.getElementById('lightboxPrev');
const lbNext = document.getElementById('lightboxNext');
let lbIndex = 0;

if (triggers.length > 0) {
    triggers.forEach((img, i) => {
        img.onclick = (e) => {
            e.stopPropagation();
            lbIndex = i;
            updateLightbox();
            lightbox.style.display = 'flex';
        }
    });
}

function updateLightbox() {
    if (triggers[lbIndex]) {
        lbImg.src = triggers[lbIndex].src;
    }
}

lbPrev.onclick = (e) => { e.stopPropagation(); lbIndex = (lbIndex - 1 + triggers.length) % triggers.length; updateLightbox(); };
lbNext.onclick = (e) => { e.stopPropagation(); lbIndex = (lbIndex + 1) % triggers.length; updateLightbox(); };
lbImg.onclick = (e) => { e.stopPropagation(); lbIndex = (lbIndex + 1) % triggers.length; updateLightbox(); };

document.getElementById('lightboxClose').onclick = () => lightbox.style.display = 'none';

window.onclick = (e) => {
    if (e.target === uploadModal) uploadModal.style.display = 'none';
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === lightbox) lightbox.style.display = 'none';
    if (e.target === settingsModal) closeSettingsBtn.click();
};