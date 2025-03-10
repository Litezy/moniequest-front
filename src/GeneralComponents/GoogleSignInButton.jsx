import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../utils/firebase';
import googleimg from '../assets/images/googleIcon.png';

const GoogleSignButton = ({ onSuccess, onError, text }) => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (user) {
                const userDetails = {
                    email: user.email || "",
                    first_name: user.displayName?.split(" ")[0] || "",
                    lastname: user.displayName?.split(" ")[1] || "",
                    image: user.photoURL || "",
                };
                onSuccess && onSuccess(userDetails);
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            onError && onError(error);
        }
    };

    return (
        <button type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center w-full justify-center px-4 text-white py-3 bg-primary  rounded-md shadow-sm hover:bg-ash"
        >
            <img
                src={googleimg}
                alt="Google Logo"
                className="w-5 h-5 mr-2"
            />
            {text}
        </button>
    );
};

export default GoogleSignButton;
