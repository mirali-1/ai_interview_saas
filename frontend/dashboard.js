const API_BASE = "";

/* =========================
   AUTH CHECK ON LOAD
========================= */

window.onload = async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Invalid token");
        }

        const user = await response.json();
        document.getElementById("user-name").innerText = user.name;

    } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "/";
    }
};


/* =========================
   GENERATE INTERVIEW
========================= */

async function generateInterview() {

    const role = document.getElementById("role").value;
    const experience = document.getElementById("experience").value;
    const tech_stack = document.getElementById("tech_stack").value;

    const token = localStorage.getItem("token");

    const btn = document.getElementById("generate-btn");
    const btnText = document.getElementById("btn-text");
    const loader = document.getElementById("loader");

    // Start loading state
    btn.disabled = true;
    btnText.innerText = "Generating...";
    loader.classList.remove("hidden");

    try {

        const response = await fetch(`${API_BASE}/interview/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                role,
                experience,
                tech_stack
            })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("result-box").innerHTML =
                formatMarkdown(data.interview_content);
        } else {
            document.getElementById("result-box").innerText =
                "Error generating interview.";
        }

    } catch (error) {
        document.getElementById("result-box").innerText =
            "Server error.";
    }

    // End loading state
    btn.disabled = false;
    btnText.innerText = "Generate Interview";
    loader.classList.add("hidden");
}


/* =========================
   LIGHTWEIGHT MARKDOWN ENGINE
========================= */

function formatMarkdown(text) {

    if (!text) return "";

    // Escape HTML (security)
    text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Code blocks ```
    text = text.replace(/```([\s\S]*?)```/g, function (match, code) {
        return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
    });

    // Headings
    text = text.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    text = text.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    text = text.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Inline code
    text = text.replace(/`(.*?)`/g, "<code class='inline-code'>$1</code>");

    // Bullet points
    text = text.replace(/^\- (.*$)/gim, "<li>$1</li>");

    // Numbered lists
    text = text.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");

    // Wrap list items into <ul>
    text = text.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>");

    // Line breaks
    text = text.replace(/\n/g, "<br>");

    return text;
}


/* =========================
   LOGOUT
========================= */

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}