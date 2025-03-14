import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import helpers from "../helpers/helpers";
import "../css/favoriteheart.css";

/**
 * @param {string} postId - The unique ID of the post
 * @param {boolean} initiallyFavorited - Whether this post is initially favorited
 * @returns A heart icon that toggles the favorite status of the given post.
 */
function FavoriteHeart({ postId, initiallyFavorited }) {
  const { user } = useContext(UserContext);
  const [favorited, setFavorited] = useState(initiallyFavorited);

  const toggleFavorite = async () => {
    // If user is not logged in, you could redirect or show a sign-in prompt
    if (!user) {
      alert("Please sign in to favorite this post.");
      return;
    }

    // Call your backend toggle function
    try {
      const result = await helpers.toggleFavs({
        username: user.username,
        postId: postId
      });
      if (result.statusCode === 200) {
        // Toggle local state
        setFavorited((prev) => !prev);
      } else {
        console.error("Error toggling favorite:", result);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <i
      className={
        favorited
          ? "fa-solid fa-heart heart-icon heart-favorited"
          : "fa-regular fa-heart heart-icon heart-not-favorited"
      }
      onClick={toggleFavorite}
    />
  );
}

export default FavoriteHeart;
