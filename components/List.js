import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import ListItem from "./ListItem";
const url = "http://media.mw.metropolia.fi/wbma/";

const List = () => {
  const [mediaArray, setMediaArray] = useState([]);

  const loadMedia = async (limit) => {
    try {
      const response = await fetch(url + "media?limit=" + limit);
      const json = await response.json();

      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(url + "media/" + item.file_id);
          const json = await response.json();
          return json;
        })
      );

      console.log("mediaArray: ", mediaArray);
    } catch (error) {
      console.error("loadMedia Error", error);
    }
    console.log("mediaArray: ", mediaArray);
  };

  useEffect(() => {
    loadMedia(5);
  }, []);

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <ListItem singleMedia={item} />}
    />
  );
};

export default List;
