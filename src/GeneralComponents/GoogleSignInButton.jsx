import React from "react";
import { auth, provider, signInWithPopup } from "../utils/firebase";
import googleLogo from '../assets/images/googleIcon.png';

const GoogleSignInButton = ({ onSuccess, onFailure,text }) => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDetails ={
        email: user.email,
        first_name: user.displayName.split(' ')[0],
        last_name: user.displayName.split(' ')[1],
        image: user.photoURL,
      }
      onSuccess({
        email: userDetails.email,
        first_name: userDetails.first_name,
        lastname: userDetails.last_name,
        image: userDetails.image,
      });
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      onFailure(error);
    }
  };

  return (
    <button type="button"
      onClick={handleGoogleSignIn}
      className="flex lowercase  items-center justify-center w-full p-3 bg-primary text-white rounded-lg shadow-md hover:bg-ash"
    >
      <img src={googleLogo} alt="Google Icon" className="w-5 h-5 mr-2" />
      {text}
    </button>
  );
};

export default GoogleSignInButton;
