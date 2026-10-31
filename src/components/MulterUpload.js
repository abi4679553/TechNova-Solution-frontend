
import React, { useEffect, useRef, useState } from "react";

const API_URL = "https://technova-backend-hv79.onrender.com";;
const MAX_SIZE = 5 * 1024 * 1024;

const MulterUpload = () => {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const uploadInputRef = useRef(null);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/images`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch images");
      }

      setImages(result.data);
    } catch (error) {
      setMessage(error.message || "Failed to load images");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const validateImage = (file) => {
    if (!file) {
      setMessage("Please select an image first.");
      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only JPG, PNG and WEBP images allowed.");
      return false;
    }

    if (file.size > MAX_SIZE) {
      setMessage("Image must be 5 MB or less.");
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!validateImage(image)) return;

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${API_URL}/image`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }

      setMessage("Image uploaded successfully!");
      setImage(null);

      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }

      await fetchImages();
    } catch (error) {
      setMessage(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!validateImage(newImage)) return;

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("image", newImage);

      const response = await fetch(
        `${API_URL}/image/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Update failed");
      }

      setMessage("Image updated successfully!");
      setEditingId(null);
      setNewImage(null);

      await fetchImages();
    } catch (error) {
      setMessage(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/image/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      setMessage("Image deleted successfully!");
      await fetchImages();
    } catch (error) {
      setMessage(error.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: "10px 18px",
    border: "none",
    borderRadius: "7px",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        AWS S3 Image Gallery
      </h2>

      {/* UPLOAD SECTION */}
      <div
        style={{
          padding: "25px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h3>Upload New Image</h3>

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={loading}
          onChange={(e) => {
            setImage(e.target.files?.[0] || null);
            setMessage("");
          }}
        />

        {image && (
          <div style={{ marginTop: "15px" }}>
            <p>{image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Selected preview"
              style={{
                width: "200px",
                maxWidth: "100%",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleUpload}
            disabled={loading || !image}
            style={{
              ...buttonStyle,
              backgroundColor: "#2563eb",
            }}
          >
            {loading ? "Please wait..." : "Upload to AWS S3"}
          </button>
        </div>
      </div>

      {message && (
        <p
          role="status"
          style={{
            textAlign: "center",
            color: message.includes("successfully")
              ? "green"
              : "red",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      {/* GALLERY SECTION */}
      <h3>Uploaded Images ({images.length})</h3>

      {fetching ? (
        <p>Loading images...</p>
      ) : images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "20px",
          }}
        >
          {images.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.imageName}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <p
                style={{
                  overflowWrap: "anywhere",
                  fontSize: "14px",
                }}
              >
                {item.imageName}
              </p>

              {editingId === item._id ? (
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setNewImage(e.target.files?.[0] || null)
                    }
                    style={{ width: "100%" }}
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      onClick={() => handleUpdate(item._id)}
                      disabled={loading || !newImage}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#16a34a",
                      }}
                    >
                      Save Update
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setNewImage(null);
                      }}
                      disabled={loading}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#6b7280",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => {
                      setEditingId(item._id);
                      setNewImage(null);
                    }}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#2563eb",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#dc2626",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MulterUpload;
