/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Container, Content, Form, Text } from "native-base";
import FormTextInput from "../components/FormTextInput";
import { Image, Platform } from "react-native";
import useUploadForm from "../hooks/UploadHooks";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-community/async-storage";

const Upload = ({ navigation }) => {
  const [image, setImage] = useState(null);

  const doUpload = async () => {
    const formData = new FormData();
    // lisätään tekstikentät formDataan
    formData.append("title", inputs.title);
    formData.append("description", inputs.description);

    // lisätään tiedosto formDataan
    const filename = image.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    if (type === "image/jpg") type = "image/jpeg";
    formData.append("file", { uri: image, name: filename, type });
    const resp = await AsyncStorage.getItem("userToken");
    console.log("Upload", formData);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      console.log("status", status);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const { handleInputChange, uploadErrors, inputs } = useUploadForm();

  return (
    <Container>
      <Content padder>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ height: 400, width: null, flex: 1 }}
          />
        )}
        <Form>
          <FormTextInput
            autoCapitalize="none"
            placeholder="title"
            onChangeText={(txt) => handleInputChange("title", txt)}
            error={uploadErrors.title}
          />
          <FormTextInput
            autoCapitalize="none"
            placeholder="description"
            onChangeText={(txt) => handleInputChange("description", txt)}
            error={uploadErrors.description}
          />
        </Form>
        <Button block onPress={pickImage}>
          <Text>Choose file</Text>
        </Button>
        <Button block onPress={doUpload}>
          <Text>Upload</Text>
        </Button>
      </Content>
    </Container>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
