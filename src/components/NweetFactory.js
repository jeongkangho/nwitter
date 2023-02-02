import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService, dbService } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet]  = useState('');
  const [attachment, setAttachment] = useState([]);
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

          console.log(attachment.length);
          console.log(attachmentRef);

          for(let i = 0; i < attachment.length; i++){

            console.log(i);
            console.log(attachment[i]);

            const response = await attachmentRef.putString(attachment[i], 'data_url');
            console.log(response);
            attachmentUrl = await response.ref.getDownloadURL();

            const nweetObj = {
              text: nweet,
              createdAt: Date.now(),
              creatorId: userObj.uid,
              attachmentUrl
            };
            await dbService.collection('nweets').add(nweetObj);
          }
        }
        
        setNweet('');
        setAttachment([]);
        
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
      // const theFile = files[0];
      const nowImageUrlList = [];

      if(files.length > 4){
        // Please choose either 1 GIF or up to 4 photos.
        return;
      }

      console.log(files);
      let fileURLs = [];
      let file;

      for(let i = 0; i < files.length; i += 1){
        file = files[i];
        // const nowImageUrl = URL.createObjectURL(files[i]);
        // console.log(nowImageUrl);
        // nowImageUrlList.push(nowImageUrl);
        const reader = new FileReader();

        reader.onloadend = () => {
          // const {
            // currentTarget: { fileURLs },
          // } = finishedEvent;
          fileURLs[i] = reader.result;
          setAttachment([...fileURLs]);
          // console.log(finishedEvent); 
        };
        reader.readAsDataURL(file);
      }

      // setAttachment(nowImageUrlList);
      
      // const reader = new FileReader();
      //   reader.onloadend = (finishedEvent) => {
      //     console.log(finishedEvent); 
      //     // const {
      //       // currentTarget: { result },
      //     // } = finishedEvent;
      //     setAttachment(nowImageUrlList);
      //   };
      
      // reader.readAsDataURL(files);
      
    };

    // const onClearAttachment = () => setAttachment("");
    const onClearAttachment = (id) => {
      console.log(id);
      setAttachment(attachment.filter((_, index) => index !== id));
    }

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
            <input type="submit" value="Tweet" className="factoryInput__arrow" />
            <label htmlFor="attach-file" className="factoryInput__label">
            {/* <span>Add photos</span> */}
            <FontAwesomeIcon icon={faImage} />
            </label>
            <input
            id="attach-file"
            type="file"
            accept="image/*"
            multiple={true} 
            onChange={onFileChange}
            style={{
              opacity: 0,
              display: "none"
            }}
          />
          </div>
          
          {attachment.map((image, id) => (
            <div className="factoryForm__attachment" key={id}>
              <img
                src={image}
                style={{
                  backgroundImage: image,
                }}
                art={`${image}-${id}`}
              />
              <div className="factoryForm__clear" onClick={() => onClearAttachment(id)}>
                <span>Remove</span>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          ))}
        </form>
    );
};

export default NweetFactory;
