import React, {useState, useEffect} from 'react';
import {
  FlatList,
} from 'react-native';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const url = 'http://media.mw.metropolia.fi/wbma/';

const List = ({navigation}) => {
  const [mediaArray, setMediaArray] = useState([]);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await fetch(url + 'media');
        const json = await response.json();
        const media = await Promise.all(json.map(async (item) => {
          const resp2 = await fetch(url + 'media/' + item.file_id);
          const json2 = await resp2.json();
          return json2;
        }));
        console.log('loadMedia', media);
        setMediaArray(media);
      } catch (e) {
        console.error(e);
      }
    };

    loadMedia();
  }, []);

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) =>
        <ListItem singleMedia={item} navigation={navigation} />
      }
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
