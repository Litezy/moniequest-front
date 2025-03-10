import React from "react";
import { GoogleLogin } from "@react-oauth/google";


const GoogleSignInButton = ({ onSuccess, onFailure }) => {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(response) => {
          if (response.credential) {
            onSuccess({ credential: response.credential });
          } else {
            console.error("Credential missing in response");
          }
        }}
        onError={onFailure}
        useOneTap
      />
    </div>
  );
};

export default GoogleSignInButton;
