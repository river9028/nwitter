import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import Nweet from 'components/Nweet';
import NweetFactory from 'components/NweetFactory';
const Home = ({ userObj }) => {
  // console.log('userObj', userObj);
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

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
