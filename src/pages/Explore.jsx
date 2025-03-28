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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/posts");
  
        // Sort posts by updatedAt in descending order
        const sortedPosts = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setPosts(sortedPosts);
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
  const badWords = [
    "asshole", "bitch", "bastard", "fuck", "shit", "damn", "hell", "slut", "whore", "dick", 
    "pussy", "cock", "cunt", "motherfucker", "faggot", "retard", "bastard", "sonofabitch", 
    "prick", "twat", "bimbo", "douchebag", "nigger", "chink", "spic", "gook", "kike", "jap", 
    "wetback", "nigga", "boob", "tits", "sex", "porn", "vagina", "penis", "cum", "bukkake", 
    "orgasm", "masturbation", "cocktail", "fisting", "banging", "blowjob", "twerking", "ass", 
    "dildo", "suck", "pussy", "clit", "nut", "ballsy", "bitchslap", "skank", "shag", "broad", 
    "tramp", "hoe", "stfu", "fml", "lmao", "lmfao", "wtf", "idiot", "retarded", "loser", 
    "fucking", "shithead", "prick", "jerk", "freak", "dumbass", "shitstain", "cockhead", "asshat", 
    "cockblock", "dickhead", "ballbag", "shitface", "whorebag", "slutbag", 
    "زوڤ", "زب", "نيك", "عرس", "حمار", "هبل", "غبي", "مغفل", "كوسة", "شاذ", "قمامة", "خايب", 
    "كشر", "خنزير", "سمسار", "مبزوط", "منافق", "مغشي", "لعنة", "تافه", "حشيش", "سكل", "قبيح",
    "زريبة", "حرام", "منبوذ", "بنت الحرام", "عاهرة", "ساقطة", "ديما تحت", "ذليل", "قرد", "طماع", 
    "قليل الأدب", "فاسق", "فضيحة", "شرموطة", "متخلف", "كذب", "عنيد", "مريض عقلي", "زنا", "تشيش", 
    "درويش", "شراب", "زهرية", "شريب ماء", "حيوانات", "مخنث", "مقعد", "مقرفة",
    "zoof", "zeb","zebi", "nik", "3ars", "hmar", "hbel", "ghabi", "maghfel", "koussa", "shadh", "qimama", "khayeb",
    "kashar", "khanzir", "samsar", "mabzout", "menafik", "magshi", "la3na", "tafeh", "hchich", "skel", "qbi7",
    "zreeba", "haram", "menboodh", "bint el haram", "3ahra", "sa9ta", "dima taht", "zleel", "9ard", "tama3",
    "qaleel el adab", "fassik", "fadhih", "sharmouta", "metkhlef", "khedh", "3aned", "merid aqli", "zina", "tshish", 
    "drouish", "sherab", "zahria", "chereeb ma2", "7ayawanat", "mekhneth", "me3ad", "mekhra"
  ];
  const censorText = (text) => {
    let censoredText = text;
    badWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      censoredText = censoredText.replace(regex, "*".repeat(word.length));
    });
    return censoredText;
  };
  const handleComment = async (postId) => {
    if (!user) return toast.error("Please login to comment");

    try {
      let commentText = newComment[postId];
      commentText = censorText(commentText);

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
    <div className="min-h-screen bg-background text-primary flex flex-col p-2 sm:p-4 md:p-10">
      <h1 className="text-xl sm:text-3xl mb-4 sm:mb-6 text-center font-goldman">
        Explore Others' Feelings Today
      </h1>
  
      {currentPosts.length === 0 && (
        <p className="text-center text-sm sm:text-lg">Be the first to share your feelings!</p>
      )}
  
      <div className="space-y-4 sm:space-y-6">
        {currentPosts.map((post) => (
          <div key={post._id} className="w-full max-w-lg sm:max-w-xl mx-auto bg-secondary p-3 sm:p-4 rounded-xl shadow-lg">
            
            <iframe
              style={{ borderRadius: "12px" }}
              src={post.songUri}
              width="100%"
              height="260" // Adjusted for smaller screens
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={post.caption}
            ></iframe>
  
            <p className="text-xs sm:text-sm text-primary mt-2">{post.caption}</p>
  
            <div className="mt-2">
              <a href={post.songLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs sm:text-sm">
                Listen on Spotify
              </a>
            </div>
  
            <p className="text-xs sm:text-sm text-primary mt-2">
              <span className="font-semibold">
                Posted by {post.user.username} at{" "}
                {new Date(post.updatedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>
            </p>
  
            {/* Buttons Section */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start mt-4 gap-2">
              <button
                onClick={() => handleLike(post._id)}
                className="flex items-center space-x-1 sm:space-x-2 bg-primary text-black py-1 px-2 sm:px-4 rounded-lg hover:opacity-80 transition text-xs sm:text-sm"
              >
                <FaRegThumbsUp className="text-sm sm:text-xl" />
                <span>{postReactions[post._id] ? postReactions[post._id].likes : 0} Likes</span>
              </button>
  
              <button
                onClick={() => handleComment(post._id)}
                className="flex items-center space-x-1 sm:space-x-2 bg-primary text-black py-1 px-2 sm:px-4 rounded-lg hover:opacity-80 transition text-xs sm:text-sm"
              >
                <FaRegCommentDots className="text-sm sm:text-xl" />
                <span>{postComments[post._id] ? postComments[post._id].length : 0} Comments</span>
              </button>
  
              {user && (
                <button
                  onClick={() => handleReport(post._id)}
                  className="flex items-center space-x-1 sm:space-x-2 bg-red-500 text-white py-1 px-2 sm:px-4 rounded-lg hover:opacity-80 transition text-xs sm:text-sm"
                >
                  <FaExclamationTriangle className="text-sm sm:text-xl" />
                  <span>Report</span>
                </button>
              )}
            </div>
  
            {/* Comments Section */}
            <div className="mt-3">
              <h3 className="text-sm sm:text-lg font-semibold">Comments</h3>
              <ul className="list-disc pl-3 sm:pl-5">
                {postComments[post._id] &&
                  postComments[post._id].map((comment, index) => (
                    <li key={index} className="text-xs sm:text-sm">
                      <span className="font-semibold">{comment.user.username}: </span>
                      {comment.text}
                      {comment.user._id === user?.userId && (
                        <button
                          onClick={() => handleDeleteComment(post._id, comment._id)}
                          className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
  
            {/* Add Comment */}
            <div className="mt-3">
              <textarea
                value={newComment[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-1 bg-gray-200 text-background rounded-lg text-xs sm:text-sm"
              ></textarea>
              <button
                onClick={() => handleComment(post._id)}
                className="mt-2 bg-primary text-black py-1 px-3 sm:px-4 rounded-lg hover:opacity-80 transition text-xs sm:text-sm"
              >
                Post Comment
              </button>
            </div>
          </div>
        ))}
      </div>
        {/* Pagination Section */}
      <div className="mt-6 text-center">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {currentPage > 1 && (
            <button
              onClick={() => paginate(currentPage - 1)}
              className="bg-primary text-black py-1 px-3 sm:px-6 rounded-lg hover:opacity-80 transition text-xs sm:text-sm"
            >
              Previous
            </button>
          )}

          {/* Mobile View: Show only current page */}
          <span className="bg-gray-800 text-white py-1 px-3 sm:px-6 rounded-lg text-xs sm:text-sm">
            {currentPage}
          </span>

          {currentPage < pageNumbers.length && (
            <button
              onClick={() => paginate(currentPage + 1)}
              className="bg-primary text-black py-1 px-3 sm:px-6 rounded-lg hover:opacity-80 transition text-xs sm:text-sm"
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
