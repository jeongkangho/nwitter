import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService, dbService } from 'fbase';

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet]  = useState('');
  const [attachment, setAttachment] = useState('');
  const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = '';
        if (attachment !== ''){
          const attachmentRef = storageService
          .ref()
          .child(`${userObj.uid}/${uuidv4()}`);
          const response = await attachmentRef.putString(attachment, 'data_url');
          attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        };
        await dbService.collection('nweets').add(nweetObj);
        setNweet('');
        setAttachment('');
        
        // console.log(await response.ref.getDownloadURL());
        // await dbService.collection('nweets').add({
        //     text: nweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid,
        // });
        // setNweet('');
    };

    const onChange = (evnet) => {
        const {
            target: {value},
        } = evnet;
        setNweet(value);
    };

    const onFileChange = (event) => {
      // console.log(event.target.files);
      const {
        target: {files},
      } = event;
      const theFile = files[0];
      console.log(theFile);
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
        // console.log(finishedEvent); 
      };
      reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null)

    return (
        <form onSubmit={onSubmit}>
          <input
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="Whats on your mind?"
            maxLength={120}
          />
          <input type="file" accept="image/*" onChange={onFileChange}/> 
          <input type="submit" value="Nweet" />
          {attachment &&(
            <div>
              <img src={attachment} width="50px" height="50px" />
              <button onClick={onClearAttachment}>Clear</button>
            </div>
          )}
        </form>
    )
};

export default NweetFactory;
