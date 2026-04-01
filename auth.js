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
    // Crée l'overlay
    const overlay = document.createElement("div");
    overlay.id = "login-overlay";
    overlay.style.cssText = `
        position: fixed; inset: 0;
        background: #1a1a2e;
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; font-family: sans-serif;
    `;
 
    overlay.innerHTML = `
        <div style="
            background: #faf9f7; padding: 44px 40px 36px;
            border-radius: 14px; text-align: center;
            width: 100%; max-width: 360px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        ">
            <div style="font-size:1.6em; font-weight:700; color:#1a1a2e; margin-bottom:6px;">Portfolio</div>
            <div style="color:#888; font-size:0.88em; margin-bottom:28px;">Alisa Kaliauchuk — BTS SIO SLAM</div>
            <div style="display:flex; gap:8px;">
                <input
                    id="pwd-input"
                    type="password"
                    placeholder="Mot de passe"
                    style="
                        flex:1; padding:11px 14px;
                        border:1.5px solid #ddd8d0; border-radius:8px;
                        font-size:0.95em; outline:none;
                    "
                />
                <button
                    id="pwd-btn"
                    style="
                        background:#1a1a2e; color:white; border:none;
                        padding:11px 18px; border-radius:8px; cursor:pointer;
                        font-weight:600; font-size:0.88em;
                    "
                >Accéder</button>
            </div>
            <div id="login-error" style="color:#e63946; font-size:0.82em; margin-top:12px; min-height:18px;"></div>
        </div>
    `;
 
    document.body.appendChild(overlay);
    document.getElementById("pwd-input").focus();
 
    async function tryLogin() {
        const input = document.getElementById("pwd-input").value;
        const hash  = await sha256(input);
 
        if (hash === PASSWORD_HASH) {
            sessionStorage.setItem(SESSION_KEY, PASSWORD_HASH);
            overlay.remove();
            document.body.style.visibility = "visible";
        } else {
            document.getElementById("login-error").textContent = "Mot de passe incorrect.";
            document.getElementById("pwd-input").value = "";
            document.getElementById("pwd-input").focus();
            setTimeout(() => {
                document.getElementById("login-error").textContent = "";
            }, 2500);
        }
    }
 
    document.getElementById("pwd-btn").addEventListener("click", tryLogin);
    document.getElementById("pwd-input").addEventListener("keydown", e => {
        if (e.key === "Enter") tryLogin();
    });
}
 
// ── Point d'entrée ──
window.addEventListener("load", () => {
    if (isAuthenticated()) {
        document.body.style.visibility = "visible";
    } else {
        document.body.style.visibility = "hidden";
        showLoginScreen();
    }
});
