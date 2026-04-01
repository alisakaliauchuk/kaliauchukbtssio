(function () {
    const netlifyIdentity = window.netlifyIdentity;
 
    // Initialisation du widget
    netlifyIdentity.init();
 
    // Vérifie si l'utilisateur est connecté
    function checkAuth() {
        const user = netlifyIdentity.currentUser();
 
        if (!user) {
            // Pas connecté → cache la page et affiche le login
            document.body.style.visibility = "hidden";
            netlifyIdentity.open("login");
        } else {
            // Connecté → affiche la page
            document.body.style.visibility = "visible";
        }
    }
 
    // Quand le widget est prêt
    netlifyIdentity.on("init", () => {
        checkAuth();
    });
 
    // Après connexion réussie → affiche la page
    netlifyIdentity.on("login", () => {
        netlifyIdentity.close();
        document.body.style.visibility = "visible";
    });
 
    // Après déconnexion → cache la page et réaffiche le login
    netlifyIdentity.on("logout", () => {
        document.body.style.visibility = "hidden";
        netlifyIdentity.open("login");
    });
})();
