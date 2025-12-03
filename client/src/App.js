import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/success')
      .then(response => response.json())
      .then(data => setPosts(data.instagram.media.data));
  }, []);

  console.log(posts);
  return (
    <div className ="App">
        <h1> Recent Post Data </h1>
        <ul>
        {posts.map(post => (
          <li>{post.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
