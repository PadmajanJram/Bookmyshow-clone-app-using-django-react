import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

function PostListItem({ post, refresh }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const user = useSelector((state) => state.auth.user);

  function deletePost() {
    axios
      .delete(`http://127.0.0.1:8000/movie/deletemovie/${post.id}`, {
        headers: { Authorization: "token " + user.token },
      })
      .then((response) => {
        console.log(response);
        alert("Deleted Successfully");
        refresh();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }

  function disableMovieShow() {
    axios
      .put(`http://127.0.0.1:8000/movie/disablemovie/${post.id}`, null, {
        headers: { Authorization: "token " + user.token },
      })
      .then((response) => {
        if (response.data.disabled === true) {
          alert(`${response.data.name} is cancelled`);
        } else {
          alert(`${response.data.name} is Now Running`);
        }
        refresh();
      })
      .catch((error) => {
        setErrorMessage("Failed to disable movie show. Please try again.");
        console.error("Error disabling movie show:", error);
      });
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="card" style={{ width: "300px" }}>
        <img
          className="card-img-top"
          src={post.image}
          alt={post.title}
          style={{ width: "100%", height: "auto" }}
        />
        <div className="card-body">
          <h5 className="card-title">{post.name}</h5>
          <Link to={`/editmovie/${post.id}`} className="btn btn-primary mr-2">
            Edit
          </Link>
          <button className="btn btn-danger mr-2" onClick={deletePost}>
            Delete
          </button>
          
          <button className="btn btn-info mr-2" onClick={disableMovieShow}>
            {post.disabled ? "ENABLE" : "DISABLE"}
          </button>
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default PostListItem;
