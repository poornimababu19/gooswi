// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChlsGPAGNp3-jaGsZDV2iohggriwbHYIo",
  authDomain: "my-ex-pro.firebaseapp.com",
  projectId: "my-ex-pro",
  storageBucket: "my-ex-pro.firebasestorage.app",
  messagingSenderId: "765527049953",
  appId: "1:765527049953:web:14bab70039a20590de19a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Initialize Realtime Database

// Google Sign-In Function
const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save the user's session to Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      email: user.email,
      displayName: user.displayName,
      loginTime: new Date().toISOString(),
    });

    // Display success message and user details
    document.getElementById("message").innerHTML = `Hello, ${user.displayName}! You are now signed in with Google.`;
    document.getElementById("userInfo").innerHTML = `
      <p>Email: ${user.email}</p>
    `;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    document.getElementById("message").innerHTML = `Error: ${error.message}`;
  }
};

// Check if user is logged in when the page loads
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("message").innerHTML = `Welcome back, ${user.displayName}!`;
    document.getElementById("userInfo").innerHTML = `
      <p>Email: ${user.email}</p>
    `;
  } else {
    document.getElementById("message").innerHTML = `You are not logged in.`;
  }
});

// Expose the googleSignIn function to the global window object for HTML
window.googleSignIn = googleSignIn;
