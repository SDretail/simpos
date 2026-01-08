import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Heading,
  Image,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/auth';
import { useAuth } from '../../contexts/AuthProvider';
import { usePreference } from '../../contexts/PreferenceProvider';
import { getBaseUrl } from '../../services/clients/api';

const SignInSchema = Yup.object().shape({
  login: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuth();
  const { updateOdooUrl } = usePreference();
  const [showServerConfig, setShowServerConfig] = React.useState(false);
  const [serverUrl, setServerUrl] = React.useState(getBaseUrl() || '');

  const handleUpdateServer = async () => {
    try {
      await updateOdooUrl(serverUrl);
      toast({
        title: 'Server URL updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setShowServerConfig(false);
    } catch (error) {
       toast({
        title: 'Failed to update server URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/');
    }
  }, [auth.isLoggedIn, navigate]);
  return (
    <Box backgroundColor="gray.50" position="fixed" w="full" h="full">
      <Box
        w="375px"
        margin="2rem auto 0 auto"
        p={4}
        rounded="lg"
        backgroundColor="white"
        shadow="md"
      >
        <Flex alignItems="center" mb={8}>
          <Image width="50px" height="50px" borderRadius="md" src="/logo.svg" />
          <Box ml={3}>
            <Heading color="brand.100" fontSize="2xl" fontWeight="medium">
              Simpos
            </Heading>
            <Heading color="brand.100" fontSize="sm" fontWeight="medium">
              A comprehensive point of sale system
            </Heading>
          </Box>
        </Flex>
        <Formik
          initialValues={{ login: 'jun@fibotree.com', password: '12345678' }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { data } = await authService.login(values);
              auth.signIn(data);
            } catch (e) {
              toast({
                title: 'Sign in failed',
                description: 'Wrong email or password. Please try again.',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="login">
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="login"
                    autoComplete="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.login}
                    isInvalid={
                      !!(errors.login && touched.login && errors.login)
                    }
                    backgroundColor="white"
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    isInvalid={
                      !!(errors.password && touched.password && errors.password)
                    }
                    backgroundColor="white"
                  />
                </FormControl>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  isLoading={isSubmitting}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Box>
      <Box
        position="fixed"
        bottom="4"
        right="4"
        cursor="pointer"
        onClick={() => setShowServerConfig(!showServerConfig)}
      >
        <Heading size="xs" color="gray.500">
          {getBaseUrl()}
        </Heading>
      </Box>

      {showServerConfig && (
        <Box
          position="fixed"
          bottom="12"
          right="4"
          bg="white"
          p={4}
          rounded="md"
          shadow="lg"
          border="1px solid"
          borderColor="gray.200"
          zIndex={10}
        >
           <FormControl id="server-url" mb={2}>
              <FormLabel>Odoo Server URL</FormLabel>
              <Input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="https://odoo.example.com"
              />
            </FormControl>
            <Button size="sm" onClick={handleUpdateServer} colorScheme="blue">
              Save
            </Button>
        </Box>
      )}
    </Box>
  );
};

export default Login;
