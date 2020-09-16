import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Container, Content, Form, Text} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import {Image} from 'react-native';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
// import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';


const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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
    uploadErrors,
  } = useUploadForm();


  return (
    <Container>
      <Content padder>
        <Image />
        <Form>
          <FormTextInput
            autoCapitalize="none"
            placeholder="title"
            onChangeText={(txt) => handleInputChange('title', txt)}
            error={uploadErrors.title}
          />
          <FormTextInput
            autoCapitalize="none"
            placeholder="description"
            onChangeText={(txt) => handleInputChange('description', txt)}
            error={uploadErrors.description}
          />
        </Form>
        <Button block>
          <Text>Choose file</Text>
        </Button>
        <Button block>
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
