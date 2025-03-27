import React, { useState, useEffect } from "react";
import { FaRegThumbsUp, FaRegCommentDots, FaExclamationTriangle, FaRegThumbsDown } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance"; // Import your axios instance
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import { toast } from 'react-toastify'; // Import toast for notifications

const Explore = () => {
  const { user } = useAuth(); // Destructure user from useAuth
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 2;
  const [postReactions, setPostReactions] = useState({});
  const [postComments, setPostComments] = useState({});
  const [newComment, setNewComment] = useState({}); // Track new comments for each post

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/posts");


        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Fetch reactions for a post
  const getReactions = async (postId) => {
    try {
      const response = await axiosInstance.get(`/reactions/${postId}`);
      setPostReactions((prev) => ({
        ...prev,
        [postId]: response.data, // Store the likes and dislikes object
      }));
    } catch (error) {
      console.error("Error getting reactions:", error);
    }
  };

  // Fetch comments for a post
  const getComments = async (postId) => {
    try {
      const response = await axiosInstance.get(`/comments/${postId}`);
      setPostComments((prev) => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error("Error getting comments:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return toast.error("You need to login!");

    try {
      await axiosInstance.post(`/reactions/${postId}`, { userId: user.userId, type: "like" }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Re-fetch reactions
      getReactions(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentChange = (postId, text) => {
    setNewComment((prev) => ({ ...prev, [postId]: text }));
  };

  const handleComment = async (postId) => {
    if (!user) return toast.error("Please login to comment");

    try {
      const commentText = newComment[postId];
      await axiosInstance.post(
        `/comments/${postId}`,
        { userId: user.userId, text: commentText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Re-fetch comments
      getComments(postId);
      setNewComment((prev) => ({ ...prev, [postId]: "" })); // Clear the input field
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  // Report a post
  const handleReport = async (postId) => {
    if (!user) return alert("Please log in to report this post");

    try {
      // Report post API logic here
      alert("Post reported!");
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };

  useEffect(() => {
    posts.forEach((post) => {
      getReactions(post._id);
      getComments(post._id);
    });
  }, [posts]);

  const handleDeleteComment = async (postId, commentId) => {
    if (!user) return alert("Please log in to delete this comment");

    try {
      await axiosInstance.delete(`/comments/${commentId}`, {
        data: { userId: user.userId },
      });
      getComments(postId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Pagination and rendering posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col p-4 sm:p-10">
      <h1 className="text-3xl sm:text-4xl mb-6 sm:mb-8 text-center font-goldman">
        Explore Others' Feelings Today
      </h1>
      { currentPosts.length === 0 && <p className="text-center text-lg">Be the first to share your feelings!</p> 
   

      }
      <div className="space-y-6">
        {currentPosts.map((post) => (
          <div key={post._id} className="w-full max-w-xl mx-auto bg-secondary p-4 sm:p-6 rounded-2xl shadow-lg">

        
            <div>
              <iframe
                style={{ borderRadius: "12px" }}
                src={post.songUri}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={post.caption}
              ></iframe>
              <p className="text-sm sm:text-lg text-primary mt-2">{post.caption}</p>
              <div className="mt-4">
                <a href={post.songLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm sm:text-base">
                  Listen on Spotify
                </a>
              </div>

              <p className="text-sm sm:text-base text-primary mt-2">
              <span className="font-semibold">
                Posted By {" "}
  {post.user.username} at{" "}
  
  {new Date(post.updatedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Ensures AM/PM is displayed
  })}
</span>

        
              </p>

              {/* Action Buttons Section */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mt-4 space-y-2 sm:space-y-0">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center space-x-2 bg-primary text-black py-1 px-4 rounded-lg hover:opacity-80 transition text-sm sm:text-base w-full sm:w-auto"
                >
                  <FaRegThumbsUp className="text-xl" />
                  <span>{postReactions[post._id] ? postReactions[post._id].likes : 0} Likes</span>
                </button>

                <button
                  onClick={() => handleComment(post._id)}
                  className="flex items-center space-x-2 bg-primary text-black py-1 px-4 rounded-lg hover:opacity-80 transition text-sm sm:text-base w-full sm:w-auto"
                >
                  <FaRegCommentDots className="text-xl" />
                  <span>{postComments[post._id] ? postComments[post._id].length : 0} Comments</span>
                </button>
                {user && (
                  <button
                    onClick={() => handleReport(post._id)}
                    className="flex items-center space-x-2 bg-red-500 text-white py-1 px-4 rounded-lg hover:opacity-80 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    <FaExclamationTriangle className="text-xl" />
                    <span>Report</span>
                  </button>
                )}
              </div>

              {/* Display comment input field and current comments */}
              <div className="mt-4">
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Comments</h3>
                  <ul className="list-disc pl-5">
                    {postComments[post._id] &&
                      postComments[post._id].map((comment, index) => (
                        <li key={index} className="mb-2">
                          <span className="font-semibold">{comment.user.username}: </span>
                          {comment.text}
                          {comment.user._id === user?.userId && (
                            <button
                              onClick={() => handleDeleteComment(post._id, comment._id)}
                              className="ml-4 text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Input for adding a new comment */}
                <div className="mt-4">
                  <textarea
                    value={newComment[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-1 bg-gray-200 text-background rounded-lg"
                  ></textarea>
                  <button
                    onClick={() => handleComment(post._id)}
                    className="mt-2 bg-primary text-black py-1 px-4 rounded-lg hover:opacity-80 transition"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 text-center">
        <div className="flex justify-center items-center space-x-4">
          {currentPage > 1 && (
            <button
              onClick={() => paginate(currentPage - 1)}
              className="bg-primary text-black py-2 px-6 rounded-lg hover:opacity-80 transition"
            >
              Previous
            </button>
          )}
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`${
                currentPage === number
                  ? "bg-black text-white"
                  : "bg-gray-300 text-black"
              } py-2 px-4 rounded-lg`}
            >
              {number}
            </button>
          ))}
          {currentPage < pageNumbers.length && (
            <button
              onClick={() => paginate(currentPage + 1)}
              className="bg-primary text-black py-2 px-6 rounded-lg hover:opacity-80 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
