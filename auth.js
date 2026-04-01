const PASSWORD_HASH = "c0073cb620c0322d00e0b42b09a0275dc624c928964a85c89bf62245fdd947e5";
const SESSION_KEY   = "portfolio_auth";
 
function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === PASSWORD_HASH;
}
 
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
 
function showLoginScreen() {
    document.body.style.visibility = "hidden";
 
    const overlay = document.createElement("div");
    overlay.id = "login-overlay";
    overlay.innerHTML = `
        <div id="login-box">
            <h2>Portfolio</h2>
            <p>Alisa Kaliauchuk — BTS SIO SLAM</p>
            <div id="login-field">
                <input type="password" id="pwd-input" placeholder="Mot de passe" autocomplete="current-password" />
                <button id="pwd-btn">Accéder</button>
            </div>
            <span id="login-error"></span>
        </div>
    `;
 
    overlay.style.cssText = `
        position: fixed; inset: 0;
        background: #1a1a2e;
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; font-family: 'DM Sans', sans-serif;
        opacity: 0; transition: opacity 0.3s;
    `;
 
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = 1);
 
    overlay.querySelector("#login-box").style.cssText = `
        background: #faf9f7; padding: 44px 40px 36px;
        border-radius: 14px; text-align: center;
        width: 100%; max-width: 360px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    `;
    overlay.querySelector("h2").style.cssText = `
        font-family: 'Syne', sans-serif; font-size: 1.6em;
        color: #1a1a2e; margin-bottom: 6px;
    `;
    overlay.querySelector("p").style.cssText = `
        color: #888; font-size: 0.88em; margin-bottom: 28px;
    `;
    overlay.querySelector("#login-field").style.cssText = `
        display: flex; gap: 8px;
    `;
    overlay.querySelector("#pwd-input").style.cssText = `
        flex: 1; padding: 11px 14px;
        border: 1.5px solid #ddd8d0; border-radius: 8px;
        font-size: 0.95em; outline: none; font-family: inherit;
    `;
    overlay.querySelector("#pwd-btn").style.cssText = `
        background: #1a1a2e; color: white; border: none;
        padding: 11px 18px; border-radius: 8px; cursor: pointer;
        font-family: 'Syne', sans-serif; font-weight: 600;
        font-size: 0.88em; transition: background 0.2s;
    `;
    overlay.querySelector("#login-error").style.cssText = `
        display: block; color: #e63946; font-size: 0.82em;
        margin-top: 12px; min-height: 18px;
    `;
 
    setTimeout(() => overlay.querySelector("#pwd-input").focus(), 100);
 
    async function tryLogin() {
        const input = overlay.querySelector("#pwd-input").value;
        const hash  = await sha256(input);
        if (hash === PASSWORD_HASH) {
            sessionStorage.setItem(SESSION_KEY, PASSWORD_HASH);
            overlay.style.opacity = 0;
            setTimeout(() => {
                overlay.remove();
                document.body.style.visibility = "visible";
            }, 300);
        } else {
            const err = overlay.querySelector("#login-error");
            const inp = overlay.querySelector("#pwd-input");
            err.textContent = "Mot de passe incorrect.";
            inp.style.borderColor = "#e63946";
            inp.value = "";
            inp.focus();
            setTimeout(() => {
                err.textContent = "";
                inp.style.borderColor = "#ddd8d0";
            }, 2500);
        }
    }
 
    overlay.querySelector("#pwd-btn").addEventListener("click", tryLogin);
    overlay.querySelector("#pwd-input").addEventListener("keydown", e => {
        if (e.key === "Enter") tryLogin();
    });
    overlay.querySelector("#pwd-btn").addEventListener("mouseenter", function() { this.style.background = "#e63946"; });
    overlay.querySelector("#pwd-btn").addEventListener("mouseleave", function() { this.style.background = "#1a1a2e"; });
}
 
// Point d'entrée
if (isAuthenticated()) {
    document.body.style.visibility = "visible";
} else {
    document.body.style.visibility = "hidden";
    document.addEventListener("DOMContentLoaded", showLoginScreen);
}
