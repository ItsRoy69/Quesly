import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyC_K2aPzKJHDXyLKJYrCNAJ7Spo8fuy5T4",
  authDomain: "quesly-auth.firebaseapp.com",
  projectId: "quesly-auth",
  storageBucket: "quesly-auth.appspot.com",
  messagingSenderId: "1031424340631",
  appId: "1:1031424340631:web:0bcce8d94aa836b78defd2",
};

const credCheck = async function (res) {
  const result = await axios
    .post("https://quesly-backend.herokuapp.com/login-with-google", {
      email: res.user.email,
    })
    .catch((e) => {
      alert("Please Register.");
    });
  if (result) {
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("user_info", JSON.stringify(result.data.user));
    alert("Logged In Successfully!");
    window.open("/", "_self");
    console.log(result);
  } else {
    window.open("/register", "_self");
  }
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage();

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((res) => {
      credCheck(res);
      console.log(res.user.email);
    })
    .catch((e) => {
      console.log(e);
    });
};
