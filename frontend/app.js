const API_BASE = window.location.origin;
async function register() {
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage("Registration successful ✅", true);
        } else {
            showMessage(data.detail || "Registration failed ❌", false);
        }
    } catch (error) {
        showMessage("Server error ❌", false);
    }
}

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.access_token);
            showMessage("Login successful ✅", true);

            // Example redirect (you can change later)
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);

        } else {
            showMessage("Invalid credentials ❌", false);
        }
    } catch (error) {
        showMessage("Server error ❌", false);
    }
}

function showMessage(text, success) {
    const message = document.getElementById("message");
    message.style.color = success ? "#00ffcc" : "#ff4d4d";
    message.innerText = text;
}