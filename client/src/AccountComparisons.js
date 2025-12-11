import React, { useEffect, useState } from 'react';
import {compareDate} from './helperfunctions';

function AccountComparisons(){
    const [allPosts, setAllPosts] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchAllWeeklyPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/account/weekly/all");
        const data = await response.json();
        // data.data is an object { accountName1: [...posts], accountName2: [...posts], ... }
        console.log(data.data);
        setAllPosts(data.data);
      } catch (err) {
        console.error("Error fetching weekly posts for all accounts:", err.message);
      } finally {
        setLoading(false);
      }
    };

    console.log(allPosts);
    
   return(
    <>
      <div>
      <button onClick={fetchAllWeeklyPosts} disabled={loading}>
        {loading ? "Loading..." : "Load Weekly Posts for All Accounts"}
      </button>

      {Object.entries(allPosts).map(([accountName, posts]) => (
        <div key={accountName}>
          <h2>{accountName}</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <p>{post.caption}</p>
                <p>Likes: {post.insights?.likes || 0}</p>
                <p>Comments: {post.insights?.comments || 0}</p>
                <p>Timestamp: {post.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
      
    </>
   );

}

export default AccountComparisons;