import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import "../style.scss";
import Comments from "../components/Comments";

const Single = () => {
  const [post, setPost] = useState({});
  const [file, setFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/h");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedPost = { ...post, pdf: res.data };
      setPost(updatedPost);
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="single" style={{ marginTop: "140px", display: "flex", gap: "50px", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="content" style={{ flex: "5", display: "flex", flexDirection: "column", gap: "40px" }}>
        
        {/* PDF Embed */}
        {post.pdf && (
          <iframe 
            src={`../upload/${post.pdf}`} 
            title="Course PDF" 
            style={{
              width: "100%",
              height: "500px",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
        
        {/* File Download Section */}
        {post.pdf && (
          <a 
            href={`../upload/${post.pdf}`} 
            download={`${post.title}.pdf`}  // Use the title of the post as the download filename
            style={{
              display: "inline-block",
              padding: "12px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "20px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#007BFF"}
          >
            Télécharger le fichier
          </a>
        )}

        {/* Title Section */}
        <div className="title" style={{ display: "flex", flexDirection: "column", gap: "15px", borderBottom: "2px solid #f1f1f1", paddingBottom: "15px" }}>
          <h3 style={{ fontSize: "26px", color: "#333", margin: "0", fontWeight: "600", letterSpacing: "0.5px" }}>
            {post.title}
          </h3>
          
          {/* Post Description */}
          <p 
            style={{
              textAlign: "justify",
              lineHeight: "1.8",
              color: "#555",
              fontSize: "16px",
              marginBottom: "20px",
              letterSpacing: "0.5px",
              fontFamily: "'Roboto', sans-serif",
              backgroundColor: "#f9f9f9",
              padding: "15px",
              borderRadius: "10px",
            }} 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.desc) }} 
          ></p>
        </div>

        {/* User Info Section */}
        <div className="user-info" style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "14px", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {post.userImg && (
              <img 
                style={{
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "50%", 
                  objectFit: "cover", 
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }} 
                src={post.userImg} 
                alt="user" 
              />
            )}
            <div className="info" style={{ display: "flex", flexDirection: "column", fontSize: "14px" }}>
              <span style={{ fontWeight: "600", color: "#333" }}>Auteur: {post.username}</span>
              <p style={{ margin: "5px 0", fontSize: "12px", color: "#777", fontStyle: "italic" }}>
                Publié {moment(post.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          {(currentUser.username === post.username || currentUser.userType === "Admin") && (
            <div className="edit" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <Link to={`/write?edit=2`} state={post}>
                <img 
                  src={Edit} 
                  alt="Edit" 
                  style={{
                    cursor: "pointer", 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "5px", 
                    transition: "transform 0.3s ease",
                  }} 
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
              </Link>
              <img 
                onClick={handleDelete} 
                src={Delete} 
                alt="Delete" 
                style={{
                  cursor: "pointer", 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "5px", 
                  transition: "transform 0.3s ease",
                }} 
                onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
            </div>
          )}
        </div>

        {/* Comments Section */}
        <Comments postId={postId} currentUser={currentUser} />
      </div>

      {/* Menu */}
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
