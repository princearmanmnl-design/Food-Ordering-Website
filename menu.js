document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // CART & ORDER FUNCTIONS
    // ==========================
    const orderList = document.getElementById("viewOrder");
    const totalBox = document.getElementById("totalBox");
    const checkOutBtn = document.getElementById("checkoutBtn");
    const addButtons = document.querySelectorAll(".addorder");
    const searchInput = document.querySelector(".searchbar input");
    const searchButton = document.querySelector(".searchBtn");
    const menuItems = document.querySelectorAll(".menuItem");
    const paymentPopup = document.getElementById("placeOrderPopup");
    const confirmOrderBtn = document.getElementById("confirmOrderBtn");
    const cancelOrderBtn = document.getElementById("cancelOrderBtn");

    if (orderList && totalBox && checkOutBtn) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        function saveCart() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        function updateCartDisplay() {
            orderList.innerHTML = "";
            let total = 0;
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="itemBox">
                        <div class="itemName"><span>${item.name}</span></div>
                        <div class="quantityControls">
                            <button class="minus" data-index="${index}">–</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="plus" data-index="${index}">+</button>
                        </div>
                        <div class="itemPrice"><span>₱${itemTotal.toFixed(2)}</span></div>
                    </div>
                `;
                orderList.appendChild(li);
            });
            totalBox.innerText = `Total: ₱${total.toFixed(2)}`;
            saveCart();
        }

        addButtons.forEach(button => {
            button.addEventListener("click", () => {
                const name = button.dataset.name;
                const price = Number(button.dataset.price);
                const existing = cart.find(item => item.name === name);
                if (existing) existing.quantity += 1;
                else cart.push({ name, price, quantity: 1 });
                updateCartDisplay();
            });
        });

        orderList.addEventListener("click", e => {
            const index = e.target.dataset.index;
            if (index === undefined) return;
            if (e.target.classList.contains("plus")) cart[index].quantity += 1;
            if (e.target.classList.contains("minus")) {
                cart[index].quantity -= 1;
                if (cart[index].quantity <= 0) cart.splice(index, 1);
            }
            updateCartDisplay();
        });

        checkOutBtn.addEventListener("click", () => {
            if (cart.length === 0) return alert("Your cart is empty!");
            populatePopup();
            paymentPopup.classList.remove("hidden");
        });

        function populatePopup() {
            const tableBody = document.querySelector("#popupOrderTable tbody");
            const popupTotal = document.getElementById("popupTotal");
            tableBody.innerHTML = "";
            let total = 0;
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${item.quantity}</td>
                    <td>${item.name}</td>
                    <td>₱${itemTotal.toFixed(2)}</td>
                `;
                tableBody.appendChild(tr);
            });
            popupTotal.textContent = `Total: ₱${total.toFixed(2)}`;
        }

        confirmOrderBtn.addEventListener("click", () => {
            const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value;
            const address = document.getElementById("orderAddress").value.trim();
            const notes = document.getElementById("orderNotes").value.trim();

            if (!address) return alert("Please enter your delivery address!");
            if (!selectedPayment) return alert("Please select a payment method!");

            let orderDetails = `Order Confirmed!\nPayment Method: ${selectedPayment}\nAddress: ${address}\n`;
            if (notes) orderDetails += `Notes: ${notes}\n`;
            orderDetails += document.getElementById("popupTotal").textContent;

            alert(orderDetails);

            cart = [];
            updateCartDisplay();
            paymentPopup.classList.add("hidden");
            document.getElementById("orderAddress").value = "";
            document.getElementById("orderNotes").value = "";
        });

        cancelOrderBtn.addEventListener("click", () => {
            paymentPopup.classList.add("hidden");
        });

        // SEARCH
        function runSearch() {
            const text = searchInput.value.toLowerCase().trim();
            if (text === "") return menuItems.forEach(item => item.style.display = "flex");
            menuItems.forEach(item => {
                const foodDiv = item.querySelector("[data-name]");
                const name = foodDiv.dataset.name.toLowerCase();
                item.style.display = name.includes(text) ? "flex" : "none";
            });
        }

        if (searchInput && searchButton) {
            searchInput.addEventListener("input", runSearch);
            searchButton.addEventListener("click", runSearch);
            searchInput.addEventListener("keyup", e => { if (e.key === "Enter") runSearch(); });
        }
    }

// ==========================
// USER PROFILE POPUP
// ==========================

// Elements
const userIcon = document.getElementById("userIcon");
const userToggleIcon = document.getElementById("userToggleIcon");
const userCard = document.getElementById("userCard");

// Get logged in user from localStorage
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    firstName: "Guest",
    lastName: "",
    gender: "N/A",
    birthday: "N/A",
    contact: "N/A",
    address: "N/A",
    email: "guest@example.com",
    username: "guest",
    profilePic: "Pictures/Profile/Default_pfp.jpg"
};

// Inject user info into popup
document.getElementById("fullName").textContent =
    `${loggedInUser.firstName} ${loggedInUser.lastName}`;
document.getElementById("username").textContent= loggedInUser.username;
document.getElementById("email").textContent = loggedInUser.email;
document.getElementById("phone").textContent = loggedInUser.contact;
document.getElementById("address").textContent = loggedInUser.address;
document.getElementById("gender").textContent = loggedInUser.gender;
document.getElementById("birthday").textContent = loggedInUser.birthday;
document.querySelector(".profilePic").src = loggedInUser.profilePic;

// Show/hide popup on click
userIcon.addEventListener("click", e => {
    e.stopPropagation();
    userCard.classList.toggle("active");
});

userToggleIcon.addEventListener("click", e => {
    e.stopPropagation();
    userCard.classList.toggle("active");
});

// Close when clicking outside
document.addEventListener("click", e => {
    if (!userCard.contains(e.target) && e.target !== userIcon) {
        userCard.classList.remove("active");
    }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("Logged out!");
    window.location.href = "login.html";
});

// ========== CATEGORY FILTERING ==========

// Get category buttons

const categoryButtons = document.querySelectorAll(".selectionBtn");
categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active from all buttons
        categoryButtons.forEach(b => b.classList.remove("active"));

        // Add active to clicked button
        btn.classList.add("active");

        const category = btn.dataset.category;
     // Show/hide menu items
        
    if (category === "" || category === "new") {
        menuItems.forEach(item => item.style.display = "flex");
        return;
    }   
        menuItems.forEach(item => {
            if (item.dataset.category === category) {
                item.style.display = "flex";   // show
            } else {
                item.style.display = "none";   // hide
            }
        });
    });
});

// =============== TOGGLE BUTTON FUNCTIONS ====================
// ELEMENTS
const sidebar = document.querySelector(".sidebar");
const cartBox = document.querySelector(".cart");
const sidebarBtn = document.querySelector(".sidebarToggleBtn");
const cartBtn = document.querySelector(".cartBtn");

// Create screen overlay
let overlay = document.createElement("div");
overlay.classList.add("drawer-overlay");
document.body.appendChild(overlay);

// Close all
function closeAll() {
    sidebar.classList.remove("active");
    cartBox.classList.remove("active");
    overlay.style.display = "none";
}

// ==========================
// SIDEBAR BUTTON
// ==========================
sidebarBtn.addEventListener("click", () => {
    const willOpen = !sidebar.classList.contains("active");

    closeAll(); // close others first
    if (willOpen) {
        sidebar.classList.add("active");
        overlay.style.display = "block";
    }
});

// ==========================
// CART BUTTON
// ==========================
cartBtn.addEventListener("click", () => {
    const willOpen = !cartBox.classList.contains("active");

    closeAll();
    if (willOpen) {
        document.querySelector(".cart").classList.add("active");
        overlay.style.display = "block";
    }
});

// ==========================
// OVERLAY CLICK
// ==========================
overlay.addEventListener("click", closeAll);

// Close on ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
});


});





