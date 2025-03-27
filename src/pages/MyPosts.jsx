import React, { useState, useEffect } from "react";
import { FaRegThumbsUp, FaRegCommentDots, FaPen, FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedCaption, setEditedCaption] = useState("");
  const [postReactions, setPostReactions] = useState({});
  const [postComments, setPostComments] = useState({});

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axiosInstance.get(`/posts/user/${user.userId}`);
        console.log("My posts:", response.data);
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
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
      console.log("comment", response.data);
      setPostComments((prev) => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error("Error getting comments:", error);
    }
  };

  // Handle delete post
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));

      // Show success toast
      toast.success("Post deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post!", { position: "top-right" });
    }
  };

  // Handle edit post
  const handleEdit = async (id) => {
    try {
      const response = await axiosInstance.put(`/posts/${id}`, { caption: editedCaption });
      const updatedPosts = posts.map((post) =>
        post._id === id ? { ...post, caption: response.data.caption } : post
      );
      setPosts(updatedPosts);
      setEditingPostId(null);
      setEditedCaption("");

      // Show success toast
      toast.success("Post updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error editing post:", err);
      toast.error("Failed to update post!", { position: "top-right" });
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
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col p-4 sm:p-10">
      <h1 className="text-3xl sm:text-4xl mb-6 sm:mb-8 text-center font-goldman">My Posts</h1>
      {
        posts.length === 0 && <p className="text-lg text-center">You haven't posted anything yet.</p>
      }
      <div className="space-y-6">
        {loading ? (
          <p></p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="w-full max-w-xl mx-auto bg-secondary p-4 sm:p-6 rounded-2xl shadow-lg">
              <div>
                {/* Spotify Song Cover Embed */}
                <div className="mb-4">
                  <iframe
                    style={{ borderRadius: "12px" }}
                    src={post.songUri}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={post.song}
                  ></iframe>
                </div>

                {/* Post Caption */}
                {editingPostId === post._id ? (
                  <div>
                    <textarea
                      className="w-full p-2 mt-4 border rounded-lg"
                      value={editedCaption}
                      onChange={(e) => setEditedCaption(e.target.value)}
                    />
                    <button
                      onClick={() => handleEdit(post._id)}
                      className="bg-primary text-black py-2 px-4 rounded-lg mt-4 hover:opacity-80 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPostId(null)}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg mt-4 ml-4 hover:opacity-80 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm sm:text-lg text-primary mt-2">{post.caption}</p>
                )}

                {/* User and Post Info */}
                <p className="text-sm sm:text-base text-primary mt-2">
                  Posted by: <span className="font-semibold">{post.user.username}</span>
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => {
                      setEditingPostId(post._id);
                      setEditedCaption(post.caption);
                    }}
                    className="bg-primary text-black py-1 px-4 rounded-lg hover:opacity-80 transition"
                  >
                    <FaPen className="text-xl" /> 
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:opacity-80 transition"
                  >
                    <FaTrashAlt className="text-xl" /> 
                  </button>
                    
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-green-500 text-white py-1 px-4 rounded-lg hover:opacity-80 transition"
                  >
                    <FaRegThumbsUp className="text-xl" /> {postReactions[post._id]?.likes || 0}
                  </button>


                  
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
                          {comment.user._id === user.userId && (
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
                </div>

              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPosts;
