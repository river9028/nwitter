import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import Nweet from 'components/Nweet';
const Home = ({ userObj }) => {
  // console.log('userObj', userObj);
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    dbService.collection('nweets').onSnapshot((snapshot) => {
      // 실시간 db변화를 감지. read, delete, update 모두 포함
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();

    await dbService.collection('nweets').add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet('');
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
