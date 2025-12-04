import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  const update = () => {
    fetch('/success')
      .then(response => response.json())
      .then(data => setPosts(data.instagram.media.data));
  };

  useEffect(update, []);

  /* Correct Working UseEffect
  useEffect(() => {
    fetch('/success')
      .then(response => response.json())
      .then(data => setPosts(data.instagram.media.data));
  }, []);
  */ 

  console.log(posts);
  return (
    <div className ="App">
        <h1> Recent Post Data </h1>
        <button onClick={update}> </button>
        <ul>
        {posts.map(post => (
          <li key={post.id}> Post Likes: {post.like_count}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
