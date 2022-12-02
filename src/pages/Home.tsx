import { useEffect, useState } from "react";

type PostType = {
  _id: string;
  name: string;
  description: string;
};

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:4000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        setPosts(json);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home">
      <div className="posts">{posts && posts.map((post) => <p key={post._id}>{post.name}</p>)}</div>
    </div>
  );
};

export default Home;
