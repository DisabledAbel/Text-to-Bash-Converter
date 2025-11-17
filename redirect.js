// redirect.js
(function() {
    const target = "https://preview--tech-to-bash.lovable.app";

    // Redirect after a short delay (optional: 0 for instant)
    setTimeout(() => {
        window.location.replace(target);
    }, 500); // 500ms delay for smooth UX

    // Fallback content if JS is disabled or redirect fails
    document.addEventListener("DOMContentLoaded", function() {
        const body = document.body;
        body.style.background = "#0d1117";
        body.style.color = "#c9d1d9";
        body.style.fontFamily = "Arial, sans-serif";
        body.style.display = "flex";
        body.style.flexDirection = "column";
        body.style.justifyContent = "center";
        body.style.alignItems = "center";
        body.style.height = "100vh";
        body.style.margin = "0";

        body.innerHTML = `
            <div style="text-align:center;">
                <h1 style="font-size:2rem; margin-bottom:1rem;">Redirecting…</h1>
                <p style="font-size:1rem; margin-bottom:1rem;">
                    You are being redirected to <a href="${target}" style="color:#58a6ff;">Tech-to-Bash Preview</a>
                </p>
                <div class="loader" style="border: 4px solid #f3f3f3; border-top: 4px solid #58a6ff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    });
})();
