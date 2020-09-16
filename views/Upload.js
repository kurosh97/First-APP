import React from 'react';
import PropTypes from 'prop-types';
import {Button, Container, Content, Form, Text} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import {Image} from 'react-native';
import useUploadForm from '../hooks/UploadHooks';


const Upload = ({navigation}) => {
  const {
    handleInputChange, uploadErrors} = useUploadForm();


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
