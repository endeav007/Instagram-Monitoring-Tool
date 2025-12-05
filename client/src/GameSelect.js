/*
    GameSelect.js
    *** Decription ***
    Game Select will handle showing us information per account using a drop down menu
    We'll reference other functions here that require specfic account metrics

    *** Functions Used ***
    WeeklyData - used to display information about a specfic account based on the user's input. 
*/
import React, { useState } from 'react';
import WeeklyData from './WeeklyData';

function GameSelect(){
    const [game, setGame] = useState("");
   
    function handleSwap(newGame){
        setGame(newGame.target.value);
    }
    return(
        <div>
            <form id="game-select">
                <select value={game} onChange={handleSwap} name="games" id="games">
                    <option value='/counterstrike2'> Counter-Strike 2 </option>
                    <option value='/fortnite'> Fortnite </option>
                    <option value='/leagueoflegends'> League of Legends </option>
                    <option value='/marvelrivals'> Marvel Rivals </option>
                    <option value='/overwatch2'> Overwatch 2 </option>
                    <option value='/rainbowsixsiege'> Rainbow Six Siege </option>
                    <option value='/rocketleague'> Rocket League </option>
                    <option value='/smashultimate'> Smash Ultimate </option>
                    <option value='/splatoon3'> Splatoon 3 </option>
                    <option value='/streetfighter'> Street Fighter </option>
                    <option value='/tekken'> Tekken </option>
                    <option value='/valorant'> Valorant </option>
                    <option value='/success'> Main Account </option>   
                </select>
            </form>
            <WeeklyData game={game} />
        </div>
    );
}

export default GameSelect;