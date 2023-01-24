// import React from 'react';
import React, { useState } from 'react';
import { authService } from 'fbase';
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.puh('/');
    }

    // const getMyNweets = async() => {
    //     const nweets = await dbService
    //     .collection('nweets')
    //     .where('creatorId', '==', userObj.uid)
    //     .orderBy('createdAt')
    //     .get();
    //     console.log(nweets.docs.map(doc => doc.data()));
    // };

    // useEffect(() => {
    //     getMyNweets();
    // });

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            // console.log(userObj.updateProfile);
            await userObj.updateProfile({
                displayName: newDisplayName, 
            });
            refreshUser();
        }
    };
    return(
    <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type='text' placeholder='display name' value={newDisplayName}/>
            <input type='submit' value='Update Profile' />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
    </>
    );
}