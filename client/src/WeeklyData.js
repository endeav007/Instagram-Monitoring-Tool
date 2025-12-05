import React, { useEffect, useState } from 'react';
import { compareDate } from'./helperfunctions';
import axios from 'axios';
function WeeklyData(game){

    
    const [data, setData] = useState(null);
    const [before, setBefore] = useState("");
    const [after, setAfter] = useState("");
    
    function handleBefore(newdate){
        setBefore(newdate.target.value);
    }

    function handleAfter(newdate){
        setAfter(newdate.target.value);
    }
    const handleClick = async () => {
        try{
            const response = await fetch(game.game);
            const _data = await response.json();
            setData(_data.instagram.media.data);
            
        } catch (err) {
            console.log(err.message)
        }   
    }

    function checkResponse(data) {
        let weekly = [];
        if (data) {

            data.forEach(element => {
               if(element.timestamp > after && element.timestamp < before){
                    weekly.push(element);
               }
            });
            return( 
                <div>
                    <ul>
                        {weekly.map(post => (
                        <li key={post.id}> Caption: {post.caption} Post Likes: {post.like_count}</li>
                    ))}
                    </ul>
                </div>
            );
        } else {
            return null;
        }
    }
    return(
        <div>
            <form>
                <label for="before-date" > Show Data From Posts Before: </label>
                <input type="date" value={before} id="before-date" name="before-date" onChange={handleBefore} /> <br></br>
                <label for="after-date" > Show Data From Posts After: </label>
                <input type="date" value={after} id="after-date" name="after-date" onChange={handleAfter} />
            </form>
            
            <button onClick={handleClick}> Show Data </button>
            {checkResponse(data)}
        </div>
    );
}

export default WeeklyData;