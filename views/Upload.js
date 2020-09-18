import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Container, Content, Form, Text} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import {Image, Platform} from 'react-native';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
// eslint-disable-next-line no-unused-vars
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {upload, postTag, appIdentifier} from '../hooks/APIhooks';
import AsyncStorage from '@react-native-community/async-storage';


const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);

  const doUpload = async () => {
    try {
      const formData = new FormData();
      // lisätään tekstikentät formDataan
      formData.append('title', inputs.title);
      formData.append('description', inputs.description);

      // lisätään tiedosto formDataan
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      if (type === 'image/jpg') type = 'image/jpeg';
      formData.append('file', {uri: image, name: filename, type});
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, userToken);
      console.log('File uploaded: ', resp);

      const postTagResponse = await postTag({
        file_id: resp.file_id,
        tag: appIdentifier,
      }, userToken);
      console.log('posting tag:', postTagResponse);

      // wait for 2 secs
      setTimeout(() => {
        doReset();
        navigation.push('Home');
      }, 2000);
    }
    catch (e) {
      console.log('upload error:', e.message);
    }
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
    if (Platform.OS !== 'web') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      console.log('status', status);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);


  const {
    handleInputChange,
    reset,
    uploadErrors,
    inputs,
  } = useUploadForm();

  const doReset = () => {
    reset();
    setImage(null);
    // console.log(inputs);
  };

  return (
    <Container>
      <Content padder>
        {image &&
          <Image
            source={{uri: image}}
            style={{height: 400, width: null, flex: 1}}
          />
        }
        <Form>
          <FormTextInput
            autoCapitalize="none"
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            error={uploadErrors.title}
          />
          <FormTextInput
            autoCapitalize="none"
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            error={uploadErrors.description}
          />
        </Form>
        <Button block onPress={pickImage}>
          <Text>Choose file</Text>
        </Button>
        <Button block
          disabled={(uploadErrors.title !== null ||
            uploadErrors.description !== null || image === null)}
          onPress={doUpload}>
          <Text>Upload</Text>
        </Button>
        <Button block onPress={doReset}>
          <Text>Reset</Text>
        </Button>
      </Content>
    </Container>
  );
};


Upload.propTypes = {
  navigation: PropTypes.object,
};


export default Upload;