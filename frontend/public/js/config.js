// Config for Manager Interface
// This allows the static HTML/JS to know which API to hit
// without a build step modifying the code.

(function() {
    // Default to local development
    let apiBase = "http://localhost:3000";

    // If running on Vercel (or any non-localhost production domain)
    // Point to the Railway production backend
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        apiBase = "https://afroawardsvote-production.up.railway.app";
    }

    // Expose globally
    window.API_BASE_URL = apiBase;
    console.log("API Configured:", window.API_BASE_URL);
})();
