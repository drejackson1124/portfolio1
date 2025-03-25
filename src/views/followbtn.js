import React, { useState, useContext, useEffect } from "react";
import helpers from "../helpers/helpers"; // Ensure this has both follow and checkFollowStatus functions.
import "../css/followbtn.css"; // Custom CSS for the button and spinner
import { UserContext } from "../UserContext";

const FollowButton = ({ currentUser, clickedUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useContext(UserContext);

  // On component mount, check if the current user is already following the clicked user.
  useEffect(() => {
    const checkStatus = async () => {
        setIsLoading(true);
      try {
        // Assume helpers.checkFollowStatus makes a call to our Lambda function.
        const response = await helpers.checkfollowstatus({ currentUser, clickedUser });
        if (response.statusCode === 200) {
          setIsFollowing(response.isFollowing);
        } else {
          console.error("Error checking follow status:", response);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && clickedUser) {
      checkStatus();
    }
  }, [currentUser, clickedUser]);

  const handleFollow = async () => {
    // Basic validation
    if (!currentUser || !clickedUser) {
      alert("Sign in to follow others.");
      return;
    }

    setIsLoading(true);
    try {
      // Call your backend follow logic.
      // The helpers.follow() function is expected to return an object 
      // with a 'statusCode' property (e.g., { statusCode: 200 } on success).
      const response = await helpers.follow({ currentUser, clickedUser });

      if (response.statusCode === 200) {
        // Toggle the follow state based on the current state.
        // (This works whether the action was follow or unfollow.)
        setIsFollowing(!isFollowing);
      } else {
        console.error("Follow action failed with status:", response.statusCode);
      }
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Decide the button content:
  // 1) If loading, show a spinner and "Loading..."
  // 2) Else if following, show "Following"
  // 3) Otherwise, show "Follow"
  let buttonContent;
  if (isLoading) {
    buttonContent = (
      <>
        <div className="follow-spinner" />
      </>
    );
  } else if (isFollowing) {
    buttonContent = "Following";
  } else {
    buttonContent = "Follow";
  }

  return (
    <button
      type="button"
      onClick={handleFollow}
      className="btn btn-md follow-button"
    >
      {buttonContent}
    </button>
  );
};

export default FollowButton;
