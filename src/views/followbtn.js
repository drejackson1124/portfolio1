import React from "react";
import helpers from "../helpers/helpers"; // Adjust the import path as needed
import '../css/followbtn.css';

const FollowButton = ({ currentUser, clickedUser }) => {
  const handleFollow = async () => {
    if(currentUser.length === 0 || !currentUser || !clickedUser){
        alert("Something went wrong");
    } else {
        try {
            // TODO: Implement your backend follow logic here.
            // The helpers.follow() function is expected to accept an object with currentUser and clickedUser.
            await helpers.follow({ currentUser, clickedUser });
            // Add any additional logic after a successful follow action if needed.
          } catch (error) {
            console.error("Error following user:", error);
            // Optionally, add error handling or user notifications here.
          }
    }
  };

  return (
    <button
      type="button"
      onClick={handleFollow}
      style={{
        backgroundColor: "white",
        color: "black",
        border: "1px solid #ccc",
        padding: "8px 16px",
        fontSize: "16px",
        cursor: "pointer",
      }}
      className="btn btn-md"
    >
      Follow
    </button>
  );
};

export default FollowButton;
