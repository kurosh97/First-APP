import {useState} from 'react';
import {validator} from '../utils/validator';
import {checkAvailable} from './APIhooks';

const constraints = {
  username: {
    presence: {
      message: 'Cannot be empty.',
    },
    length: {
      minimum: 3,
      message: 'needs to be at least 3 characters.',
    },
  },
  password: {
    presence: {
      message: 'Cannot be empty.',
    },
    length: {
      minimum: 5,
      message: 'needs to be at least 5 characters.',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'address is not valid',
    },
  },
  full_name: {
    length: {
      minimum: 3,
      message: 'enter you full name',
    },
  },
};

const useSignUpForm = (callback) => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    full_name: '',
  });
  const [registerErrors, setRegisterErrors] = useState({});


  const handleInputChange = (name, text) => {
    // console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    let error;
    if (name === 'confirmPassword') {
      error = validator(name, {
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
      }, constraints);
    } else {
      error = validator(name, text, constraints);
    }

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        [name]: error,
      };
    });
  };

  const validateOnSend = () => {
    const confirmError = validator('confirmPassword', {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
    }, constraints);
    console.log('confirm pw error', confirmError);
    setRegisterErrors((registerErrors) => ({
      ...registerErrors,
      confirmPassword: confirmError,
    }));

    for (const val of Object.values(registerErrors)) {
      console.log('validation error: ', val);
      if (val !== null) {
        return false;
      }
    }
    return true;
  };

  const checkUserAvailable = async (event) => {
    const username = event.nativeEvent.text;
    try {
      const result = await checkAvailable(username);
      setRegisterErrors((registerErrors) => ({
        ...registerErrors,
        username: result,
      }));
    } catch (error) {
      console.log('checkUserAvailable error', error.message);
    }
  };

  return {
    handleInputChange,
    validateOnSend,
    checkUserAvailable,
    inputs,
    registerErrors,
  };
};

export default useSignUpForm;
