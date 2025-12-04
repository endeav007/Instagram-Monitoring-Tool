import React, { useEffect, useState } from 'react';
import { compareDate } from'./helperfunctions';
import axios from 'axios';
function WeeklyData(){

    const [data, setData] = useState(null);
    const [date, setDate] = useState("");
    
    function handleDateInput(newDate){
        setDate(newDate.target.value);
    }
    const handleClick = async () => {
        try{
            const _data = await (await fetch('/success')).json();
            setData(_data.instagram.media.data);
            
        } catch (err) {
            console.log(err.message)
        }   
    }

    function checkResponse(data) {
        let weekly = [];
        if (data) {

            data.forEach(element => {

                /*
                if(compareDate(element.timestamp)){
                    weekly.push(element);
                }
                */
               if(element.timestamp > date){
                    weekly.push(element);
               }
            });
            console.log(weekly)
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
                <label for="post-date" > Show Data From Posts After: </label>
                <input type="date" value={date} id="post-date" name="post-date" onChange={handleDateInput} /> 
            </form>
            <p> {date} </p>
            <button onClick={handleClick}> Show Data </button>
            {checkResponse(data)}
        </div>
    );
}

export default WeeklyData;