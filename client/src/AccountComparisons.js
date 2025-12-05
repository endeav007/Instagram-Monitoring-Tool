import React, { useEffect, useState } from 'react';
import {compareDate} from './helperfunctions';

function AccountComparisons(){
    const [accountsData, setAccountsData] = useState([]);
    const accounts = ['/success', '/counterstrike2'];

    const fetchAllAccounts = async () => {
  try {
    console.log("Starting fetch for all accounts...");

    // Fetch all accounts in parallel
    const results = await Promise.all(
      accounts.map(async (account) => {
        try {
          const res = await fetch(account);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();

          // Keep the media array (or empty if missing)
          const mediaArray = data.instagram?.media?.data || [];
          //console.log(`Fetched data for ${account}:`, mediaArray);

          const filteredMedia = mediaArray.filter(media => {
            return compareDate(media.timestamp); //will return posts from the last week
          });

          return { account, media: filteredMedia }; // nested structure
        } catch (err) {
          console.error(`Error fetching ${account}:`, err);
          return { account, media: [] }; // return empty array if fetch fails
        }
      })
    );

    // Update state once
    setAccountsData(results);

    console.log("All accounts data updated:", results);

  } catch (err) {
    console.error("Unexpected error in fetchAllAccounts:", err);
  }
};

// Call the function on mount
useEffect(() => {
  fetchAllAccounts();
}, []);


   return(
    <>
    
    </>
   );

}

export default AccountComparisons;