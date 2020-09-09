import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

import { checkToken } from "../hooks/APIhooks";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { Title, Icon, Container, Content } from "native-base";

const Login = ({ navigation }) => {
  // props is needed for navigation
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  // console.log('Login', isLoggedIn);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    console.log("token", userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        console.log("token valid", userData);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (e) {
        console.log("token check failed", e.message);
      }
      // navigation.navigate('Home');
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <Container>
      <Content padder>
        <Title>
          <Icon name="planet" style={{ fontSize: 200 }} />
        </Title>
        <LoginForm navigation={navigation} />
        <RegisterForm navigation={navigation} />
      </Content>
    </Container>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
