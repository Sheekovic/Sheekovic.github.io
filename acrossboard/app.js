import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { firebaseApp } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

// Handle Donate button click
const donateBtn = document.querySelector(".donate-btn");
const donationModal = document.getElementById("donation-modal");
const closeBtn = document.querySelector(".close-btn");

// Show the modal when Donate is clicked
donateBtn.addEventListener("click", () => {
    donationModal.style.display = "block";
});

// Close the modal when the close button is clicked
closeBtn.addEventListener("click", () => {
    donationModal.style.display = "none";
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === donationModal) {
        donationModal.style.display = "none";
    }
});


// 🔹 Show User Info in Navbar
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("user-pic").src = user.photoURL || "default-avatar.png";
        document.getElementById("user-name").textContent = user.displayName || "User";

        // 🔹 Load all clipboard items from `users/{user.uid}/clipboard`
        loadClipboardItems(user.uid);
    } else {
        window.location.href = "index.html"; // Redirect if not logged in
    }
});

// 🔹 Add Clipboard Item
document.getElementById("add-to-clipboard").addEventListener("click", () => {
    const text = document.getElementById("clipboard-input").value;
    if (text.trim() === "") return;

    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in to add items.");
        return;
    }

    // Save new clipboard item as plain value under `users/{user.uid}/clipboard/`
    push(ref(db, `users/${user.uid}/clipboard`), text)
        .then(() => {
            document.getElementById("clipboard-input").value = ""; // Clear input
        })
        .catch((error) => alert(error.message));
});

// 🔹 Logout Function
document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location.href = "index.html"; // Redirect to sign-in page
        })
        .catch((error) => {
            alert("Error logging out: " + error.message);
        });
});


// 🔹 Load Clipboard Items with Menu
function loadClipboardItems(userId) {
    const clipboardRef = ref(db, `users/${userId}/clipboard`);
    onValue(clipboardRef, (snapshot) => {
        const container = document.getElementById("clipboard-items");
        container.innerHTML = ""; // Clear previous items

        if (!snapshot.exists()) {
            container.innerHTML = "<p>No clipboard items found.</p>";
            return;
        }

        // Display each clipboard item
        snapshot.forEach((childSnapshot) => {
            const itemId = childSnapshot.key;
            const data = childSnapshot.val();

            const div = document.createElement("div");
            div.classList.add("clipboard-item");

            // Clipboard text
            const textSpan = document.createElement("span");
            textSpan.textContent = data;

            // Three dots menu
            const menuContainer = document.createElement("div");
            menuContainer.classList.add("menu-container");
            const dots = document.createElement("span");
            dots.classList.add("three-dots-menu");
            dots.textContent = "⋮";

            // Dropdown menu
            const menu = document.createElement("div");
            menu.classList.add("menu-options");
            menu.innerHTML = `
                <button class="share-btn">Share</button>
                <button class="copy-btn">Copy</button>
                <button class="delete-btn">Delete</button>
            `;

            // Append everything
            menuContainer.appendChild(dots);
            menuContainer.appendChild(menu);
            div.appendChild(textSpan);
            div.appendChild(menuContainer);
            container.appendChild(div);

            // Add event listeners for menu actions
            menu.querySelector(".share-btn").addEventListener("click", () => shareClipboardItem(itemId, data));
            menu.querySelector(".copy-btn").addEventListener("click", () => copyToClipboard(data));
            menu.querySelector(".delete-btn").addEventListener("click", () => deleteClipboardItem(userId, itemId));

            // Toggle menu visibility when clicking on the three dots
            dots.addEventListener("click", (event) => {
                // Toggle the menu's display
                menu.style.display = menu.style.display === "block" ? "none" : "block";
                // Stop the click from bubbling up to the document
                event.stopPropagation();
            });

            // Close the menu when clicking outside
            document.addEventListener("click", () => {
                menu.style.display = "none";
            });
        });
    }, (error) => {
        console.error("Error loading clipboard items:", error);
    });
}


// 🔹 Share Function
function shareClipboardItem(itemId, data) {
    const userId = auth.currentUser.uid; // Ensure current user is authenticated
    const sharedClipboardsRef = ref(db, `users/${userId}/shared_clipboards`);

    // Check if the item already exists
    onValue(sharedClipboardsRef, (snapshot) => {
        let existingShareId = null;

        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (childData === data) {
                existingShareId = childSnapshot.key; // Get the existing share ID
            }
        });

        if (existingShareId) {
            // If the item is already shared, provide the existing share ID
            alert(`Item is already shared! Share ID: ${existingShareId}`);
        } else {
            // If not shared, generate a new share ID and add it to the database
            const shareId = crypto.randomUUID(); // Generate a unique ID
            const newSharedRef = ref(db, `users/${userId}/shared_clipboards/${shareId}`);
            set(newSharedRef, data)
                .then(() => {
                    // Alert the share link or ID
                    alert(`Item shared! Share ID: ${shareId}`);
                })
                .catch((error) => {
                    alert("Error sharing item: " + error.message);
                });
        }
    }, {
        onlyOnce: true // Ensure we only check the database once to avoid unnecessary reads
    });
}


// 🔹 Copy to Clipboard Function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    }).catch((err) => {
        alert("Failed to copy: " + err);
    });
}

// 🔹 Delete Function
function deleteClipboardItem(userId, itemId) {
    const itemRef = ref(db, `users/${userId}/clipboard/${itemId}`);
    
    remove(itemRef)
        .then(() => {
            alert("Item deleted.");
        })
        .catch((error) => {
            alert("Error deleting item: " + error.message);
        });
}

// handle android-download-btn click event
document.getElementById("android-download-btn").addEventListener("click", () => {
    window.location.href = "/acrossboard/releases/index.html";
});