import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-community/async-storage";
import FormTextInput from "./FormTextInput";
import useSignUpForm from "../hooks/RegisterHooks";
import { postRegistration, postLogIn } from "../hooks/APIhooks";
import { Button, Text, Form } from "native-base";

const RegisterForm = ({ navigation }) => {
  const { setUser, setIsLoggedIn } = useContext(AuthContext);
  const {
    inputs,
    handleInputChange,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
  } = useSignUpForm();

  const doRegister = async () => {
    if (!validateOnSend()) {
      console.log("validate on send failed");
      return;
    }
    try {
      const result = await postRegistration(inputs);
      console.log("new user created:", result);
      const userData = await postLogIn(inputs);
      await AsyncStorage.setItem("userToken", userData.token);
      setIsLoggedIn(true);
      setUser(userData.user);
    } catch (e) {
      console.log("registeration error", e.message);
    }
  };

  return (
    <Form>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange("username", txt)}
        onEndEditing={checkUserAvailable}
        error={registerErrors.username}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onEndEditing={(txt) => handleInputChange("password", txt)}
        secureTextEntry={true}
        error={registerErrors.password}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="confirm password"
        onEndEditing={(txt) => handleInputChange("confirmPassword", txt)}
        secureTextEntry={true}
        error={registerErrors.confirmPassword}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange("email", txt)}
        error={registerErrors.email}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange("full_name", txt)}
        error={registerErrors.full_name}
      />
      <Button block onPress={doRegister}>
        <Text>Register!</Text>
      </Button>
    </Form>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
