const loginBtn = document.querySelector(".loginBtn");
const userInput = document.querySelector(".loginUser");
const passwordInput = document.querySelector(".loginPassword");
const errorMsg = document.getElementById("errorMsg");
const passwordIcon = document.getElementById("passwordIcon");
const rememberMe = document.getElementById("rememberMe");

// Password visibility toggle
function passwordBar() {
    if (passwordInput.value.length > 0) {
        passwordIcon.className = "bx bx-eye-slash";
        passwordIcon.style.cursor = "pointer";
    } else {
        passwordIcon.className = "bx bx-lock";
        passwordInput.type = "password";
        passwordIcon.style.cursor = "default"; 
    }
}

function showHideIcon() {
    if (passwordInput.value.length === 0) return;
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.className = "bx bx-eye";
    } else {
        passwordInput.type = "password";
        passwordIcon.className = "bx bx-eye-slash";
    }
}

passwordInput.addEventListener("input", passwordBar);
passwordIcon.addEventListener("click", showHideIcon);

if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
        event.preventDefault();

        const userValue = userInput.value.trim();
        const password = passwordInput.value.trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const matchedUser = users.find(u => (u.username === userValue || u.email === userValue) && u.password === password);

        if (matchedUser) {
            // Remember user if checkbox checked
            if (rememberMe.checked) {
                localStorage.setItem("rememberedUser", userValue);
            } else {
                localStorage.removeItem("rememberedUser");
            }

            // Save current logged in user for profile page
            localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));

            window.location.href = "menu.html";
        } else {
            errorMsg.textContent = "Incorrect username/email or password.";
            errorMsg.style.color = "red";
        }
    });
}

// Auto-fill remembered user
window.addEventListener("DOMContentLoaded", ()=>{
    const savedUser = localStorage.getItem("rememberedUser");
    if(savedUser){
        userInput.value= savedUser;
        rememberMe.checked = true;
    }
});
