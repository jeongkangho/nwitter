import React, { useEffect, useState } from 'react';
import { dbService, storageService } from 'fbase';
import Nweet from 'components/Nweet';
import NweetFactory from 'components/NweetFactory';

const Home = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);
    
    // const getNweets = async() => {
    //     const dbNweets = await dbService.collection('nweets').get();
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id, 
    //         }
    //         setNweets((prev) => [document.data(), ...prev]);
    //     });
    // }
    useEffect(() => {
       // getNweets();
        dbService.collection('nweets').onSnapshot((snapshot) => {
            // console.log('something happend');
            // console.log(snapshot.docs.map);
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
            // console.log(nweetArray);
        });
    }, []);
    
    

    return (
      <div>
        <NweetFactory userObj={userObj} />
        <div>
          {nweets.map((nweet) => (
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              isOwner={nweet.creatorId === userObj.uid}
            />
            // <div key={nweet.id}>
            //     <h4>{nweet.text}</h4>
            // </div>
          ))}
          ;
        </div>
      </div>
    );
}

export default Home;
