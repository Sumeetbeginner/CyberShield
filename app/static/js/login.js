

function changeTheme() {
    if (localStorage.getItem("ModeColor") == "dark") {
        document.documentElement.style.setProperty('--light', "#2f3046")
        document.documentElement.style.setProperty('--dark', "#14152a")
        document.documentElement.style.setProperty('--material', "#3a3fc5")
        document.documentElement.style.setProperty('--text', "#ffffff")
        document.documentElement.style.setProperty('--lightText', "#ffffff")

    }
    else {
        document.documentElement.style.setProperty('--light', "#DCF2F1")
        document.documentElement.style.setProperty('--dark', "#7FC7D9")
        document.documentElement.style.setProperty('--material', "#0F1035")
        document.documentElement.style.setProperty('--text', "black")
        document.documentElement.style.setProperty('--lightText', "#ffffff")

    }

}

changeTheme()

const firebaseConfig = {
    apiKey: "AIzaSyClhtxF2WQiAGTEvsHc_LaasxcyGt7DGkw",
    authDomain: "cybershield-d77a1.firebaseapp.com",
    projectId: "cybershield-d77a1",
    storageBucket: "cybershield-d77a1.appspot.com",
    messagingSenderId: "341725693744",
    appId: "1:341725693744:web:abc81f4ab18f39fd2b2af5",
    measurementId: "G-TC1V0R7JH5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById("resetP2").addEventListener('click', function () {
    window.location = "signup"
})

document.getElementById('emailLogin').addEventListener('click', async () => {

    let email = document.getElementById('userEmail').value
    let password = document.getElementById('userPassword').value

    try {

        var userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)

        let userId = userCredential.user.uid

        localStorage.setItem('currentUserId', userId)

        alert('User Signed in Successfully ✅')

        window.location.href = '/';
    }
    catch (error) {
        console.log(error);
    }
})

document.getElementById('googleLogin').addEventListener('click', async () => {
    try {
        var provider = new firebase.auth.GoogleAuthProvider();
        var result = await firebase.auth().signInWithPopup(provider);

        // Get the user's UID (User ID)
        let userId = result.user.uid;

        // Store the user ID in local storage
        localStorage.setItem('currentUserId', userId);

        alert('Google Sign-in Successful ✅');

        window.location.href = '/';
    } catch (error) {
        console.error('Google Sign-in error:', error.message);
    }
});

