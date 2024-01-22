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
    window.location = "login"
})

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isPasswordValid(password) {
    return password.length > 6
}

document.getElementById('emailLogin').addEventListener('click', async () => {
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;
    let accType = document.getElementById('selAccType').value;

    if (isEmailValid(email) && isPasswordValid(password)) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await firebase.database().ref('users/' + user.uid).set({
                email: email,
                password: password,
                accType: accType
            });

            alert('User Registered Successfully ✅');
            window.location.href = 'login';
        } catch (error) {
            console.error(error);
        }
    } else {
        if (!isEmailValid(email)) {
            alert('Kindly Enter Valid Email Id ⚠️');
        } else {
            alert('Password Length Should be more than 6 ⚠️');
        }
    }
});


document.getElementById('googleLogin').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;
    let accType = document.getElementById('selAccType').value;

    if (isEmailValid(email) && isPasswordValid(password)) {

        try {
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;

            alert('User Signed up Successfully ✅');

            await firebase.database().ref('users/' + user.uid).set({
                email: email,
                password: password,
                accType: accType
            });

            window.location.href = 'login';
        } catch (error) {
            console.error(error);

            // Handle specific errors if needed
            if (error.code === 'auth/popup-closed-by-user') {
                // User closed the Google sign-in popup
                console.log('Google sign-in popup closed by user.');
            }
        }
    } else {
        if (!isEmailValid(email)) {
            alert('Kindly Enter Valid Email Id you are signing with Google ⚠️');
        } else {
            alert('Password Length Should be more than 6 ⚠️');
        }
    }
});





