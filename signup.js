const signupBtn = document.querySelector(".signupSubmitBtn");
const usernameInput = document.querySelector(".signupUser");
const passwordInput = document.querySelector(".signupPass");
const confirmInput = document.querySelector(".signupConfirmPass");
const signupMsg = document.getElementById("signupMsg");
const strengthMsg = document.getElementById("strengthMsg");
const matchMsg = document.getElementById("matchMsg");
const emailInput = document.querySelector(".signupEmailInput");
const passwordIcon = document.getElementById("signupPasswordIcon");
const confirmPasswordIcon = document.getElementById("signupConfirmIcon");
const firstNameInput = document.querySelector(".signupFirstName");
const lastNameInput = document.querySelector(".signupLastName");
const genderInput = document.querySelector(".signupGender");
const birthdayInput = document.querySelector(".signupBirthday");
const phoneInput = document.querySelector(".signupPhone");
const addressInput = document.querySelector(".signupAddress");



// Password visibility toggle
function passwordBar() {
    if(passwordInput.value.length > 0){
        passwordIcon.className = "bx bx-eye-slash";
        passwordIcon.style.cursor = "pointer";
    } else {
        passwordIcon.className = "bx bx-lock";
        passwordInput.type = "password";
        passwordIcon.style.cursor= "default";
    }
}

function showHideIcon() {
    if(passwordInput.value.length === 0) return;
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        passwordIcon.className = "bx bx-eye";
    } else {
        passwordInput.type = "password";
        passwordIcon.className = "bx bx-eye-slash";
    }
}

// Confirm password toggle
function passwordConfirmation(){
    if(confirmInput.value.length === 0){
        confirmPasswordIcon.style.display = "none";
        confirmInput.type = "password";
        return;
    }
    confirmPasswordIcon.style.display = "block";
    confirmPasswordIcon.className = "bx bx-eye-slash";
}

function toggleConfirmPassword(){
    if(confirmInput.type === "password"){
        confirmInput.type = "text";
        confirmPasswordIcon.className = "bx bx-eye";
    } else {
        confirmInput.type = "password";
        confirmPasswordIcon.className = "bx bx-eye-slash";
    }
}

passwordInput.addEventListener("input", passwordBar);
passwordIcon.addEventListener("click", showHideIcon);
confirmInput.addEventListener("input", passwordConfirmation);
confirmPasswordIcon.addEventListener("click", toggleConfirmPassword);

// Password strength & match
function updatePasswordStatus() {
    const pass = passwordInput.value;
    const confirm = confirmInput.value;

    if(pass.length === 0){
        strengthMsg.textContent = "";
        matchMsg.textContent = "";
    } else {
        let strength = 0;
        if(pass.length >= 6) strength++;
        if(/[A-Z]/.test(pass)) strength++;
        if(/[0-9]/.test(pass)) strength++;
        if(/[^A-Za-z0-9]/.test(pass)) strength++;

        if(strength <= 1){
            strengthMsg.textContent = "Weak password";
            strengthMsg.style.color = "red";
        } else if(strength === 2){
            strengthMsg.textContent = "Medium password";
            strengthMsg.style.color = "#EB442C";
        } else {
            strengthMsg.textContent = "Strong password";
            strengthMsg.style.color = "green";
        }
    }

    if(confirm.length === 0 && pass.length === 0){
        matchMsg.textContent = "";
    } else if(confirm === pass){
        matchMsg.textContent = "✓ Passwords match";
        matchMsg.style.color = "green";
    } else {
        matchMsg.textContent = "✗ Passwords do not match";
        matchMsg.style.color = "red";
    }
}

passwordInput.addEventListener("input", updatePasswordStatus);
confirmInput.addEventListener("input", updatePasswordStatus);

// Profile picture
const profileInput = document.getElementById("signupProfilePic");
const profilePreview = document.getElementById("signupPreview");
const profileBoxText = document.querySelector(".profile-text");
const profileBox = document.querySelector(".profile-pic-box");

profileInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePreview.src = e.target.result;
            profileBoxText.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

// Signup button click
signupBtn.addEventListener("click", (event)=>{
    event.preventDefault();
    
    // Personal info
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const gender = genderInput.value;
    const birthday = birthdayInput.value;

    // Account info
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();
    const profilePic = profilePreview.src || "Pictures/Profile/Default_pfp.jpg";
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    // Validate all fields
    if(!firstName || !lastName || !gender || !birthday || !phone || !address || !username || !email || !password || !confirm){
    signupMsg.textContent = "Please fill in all fields.";
    signupMsg.style.color = "red";
    return;
}


    if(password !== confirm){
        signupMsg.textContent = "Passwords do not match.";
        signupMsg.style.color = "red";
        return;
    }

    // Get existing users or empty array
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if username or email already exists
    const exists = users.some(u => u.username === username || u.email === email);
    if(exists){
        signupMsg.textContent = "Username or email already exists.";
        signupMsg.style.color = "red";
        return;
    }

    // Add new user
   const newUser = {
    firstName,
    lastName,
    gender,
    birthday,
    username,
    email,
    password,
    contact: phone,
    address: address,
    profilePic
};

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    signupMsg.textContent = "Account created successfully!";
    signupMsg.style.color = "green";

    setTimeout(()=>{
        window.location.href = "login.html";
    }, 800);
});

// Multi-step signup navigation
const nextBtns = document.querySelectorAll(".signupNextBtn");
const backBtns = document.querySelectorAll(".signupBackBtn");
const steps = document.querySelectorAll(".signup-step");

nextBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const nextStep = btn.getAttribute("data-next");
        steps.forEach(s => s.classList.remove("active"));
        document.getElementById("signup-step-" + nextStep).classList.add("active");
    });
});

backBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const backStep = btn.getAttribute("data-back");
        steps.forEach(s => s.classList.remove("active"));
        document.getElementById("signup-step-" + backStep).classList.add("active");
    });
});
