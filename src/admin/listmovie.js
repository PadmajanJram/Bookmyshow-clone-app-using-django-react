import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostListItem from "./Postlistitem";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function List() {
  const user = useSelector((store) => store.auth.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user && user.token) {
      fetchPosts();
    } else {
      console.error("User is not logged in.");
    }
  }, [user]);

  function fetchPosts() {
    axios
      .get("http://127.0.0.1:8000/movie/listmovie", {
        headers: { Authorization: "token " + user.token },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }

  return (
    <div className="list Movie">
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="text-center mt-2 text-primary text-bold">SHOWMAN</h1>
            <hr></hr>
          </div>
          <div className="text-center">
            <Link to="/addmovie" className="btn btn-info mb-4">
              Add Movie
            </Link>
          </div>
        </div>
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-6 mb-4">
              <PostListItem post={post} refresh={fetchPosts} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default checkAuth(List);
