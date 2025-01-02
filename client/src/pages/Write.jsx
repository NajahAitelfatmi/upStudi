import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const { state } = useLocation();
  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const navigate = useNavigate();

  const upload = async () => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("https://upstudi.onrender.com/api/upload", formData);
      return res.data;
    } catch (err) {
      console.error("Error uploading file:", err);
      return null;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      if (state) {
        await axios.put(`https://upstudi.onrender.com/api/posts/${state.id}`, {
          title,
          desc: value,
          cat,
          pdf: imgUrl || "",
        });
      } else {
        await axios.post("`https://upstudi.onrender.com/api/posts/", {
          title,
          desc: value,
          cat,
          pdf: imgUrl || "",
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      }
      navigate("/h");
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const styles = {
    container: { marginTop: "100px", display: "flex", gap: "20px" },
    section: {
      border: "1px solid #e2e2e2",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    input: {
      padding: "12px",
      border: "1px solid #ddd",
      fontSize: "16px",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    button: {
      cursor: "pointer",
      color: "white",
      backgroundColor: "#007bff",
      border: "1px solid #007bff",
      padding: "10px 20px",
      borderRadius: "5px",
      fontSize: "16px",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div className="add" style={styles.container}>
      <div className="content" style={{ ...styles.section, flex: "5", display: "flex", flexDirection: "column", gap: "20px" }}>
        <input
          style={styles.input}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer" style={{ height: "300px", overflow: "scroll", backgroundColor: "#fafafa", borderRadius: "5px" }}>
          <ReactQuill
            className="editor"
            style={{ height: "100%", border: "none", backgroundColor: "#ffffff" }}
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu" style={{ ...styles.section, flex: "2", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="item" style={{ ...styles.section, display: "flex", flexDirection: "column", fontSize: "14px", color: "#555" }}>
          <input style={{ display: "none" }} type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
          <label
            className="file"
            htmlFor="file"
            style={{ textDecoration: "underline", cursor: "pointer", color: "#007bff", fontSize: "16px" }}
          >
            Upload PDF
          </label>
          <div className="buttons" style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
            <button
              onClick={handleClick}
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Publish
            </button>
          </div>
        </div>
        <div className="item" style={{ ...styles.section, fontSize: "14px", color: "#555" }}>
          <h1 style={{ fontSize: "20px", marginBottom: "15px", fontWeight: "600" }}>Category</h1>
          {["art", "science", "technology", "cinema", "design", "food"].map((category) => (
            <div key={category} className="cat">
              <input
                type="radio"
                checked={cat === category}
                name="cat"
                value={category}
                id={category}
                onChange={(e) => setCat(e.target.value)}
              />
              <label htmlFor={category} style={{ fontSize: "16px", marginLeft: "8px" }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Write;
