import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService, dbService } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet]  = useState('');
  const [attachment, setAttachment] = useState('');
  const onSubmit = async (event) => {
        if (nweet === "") {
          return;
        }
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

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
          <div className="factoryInput__container">
            <input
              className="factoryInput__input"
              value={nweet}
              onChange={onChange}
              type="text"
              placeholder="Whats on your mind?"
              maxLength={120}
            />
            <input type="submit" value="&rarr;" className="factoryInput__arrow" />
          </div>
          <label htmlFor="attach-file" className="factoryInput__label">
            <span>Add photos</span>
            <FontAwesomeIcon icon={faPlus} />
          </label>
          <input
            id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{
              opacity: 0,
            }}
          />
          {attachment && (
            <div className="factoryForm__attachment">
              <img
                src={attachment}
                style={{
                  backgroundImage: attachment,
                }}
              />
              <div className="factoryForm__clear" onClick={onClearAttachment}>
                <span>Remove</span>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          )}
        </form>
    );
};

export default NweetFactory;
