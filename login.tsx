import React, { useEffect, useState } from 'react';
import Bg1 from '../../assets/images/bg1.png';
import Bg2 from '../../assets/images/bg2.png';
import lines from '../../assets/images/lines.png';
import aurigeneLogo from '../../assets/images/companyLogo.svg';
import Banner from '../../assets/images/banner.png';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useMsal } from '@azure/msal-react';
import { AuthenticationResult, BrowserAuthError } from '@azure/msal-browser';
import axiosInstance from '../../utilities/interceptor';
import { apiUrls } from '../../utilities/urls';

const Login = () => {
  const { instance } = useMsal(); // Access MSAL instance

  const handleSweetAlert = (
    titleData: string,
    textData: string,
    iconData: string
  ) => {
    if (iconData === 'success') {
      Swal.fire({
        title: titleData,
        text: textData,
        icon: 'success',
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: titleData,
        text: textData,
        icon: 'error',
        showConfirmButton: false,
      });
    }
    setTimeout(() => {
      Swal.close();
    }, 1500);
  };

  const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];

  if (modalBackdrop) {
    modalBackdrop.remove();
  }

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const [state, setState] = useState({
    username: '',
    password: '',
    loginDisable: 'disabled',
    loadingClass: 'd-none',
  });

  const navigate = useNavigate();

  const handleChange = (name: string, value: string) => {
    setState((prev: any) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    let loginDisable = '';
    if (!state.username || !state.password) {
      loginDisable = 'disabled';
    }

    setState((prev: any) => {
      return {
        ...prev,
        loginDisable: loginDisable,
      };
    });
  }, [state.username, state.password]);

  const [tokenSet, setTokenSet] = useState(false);
  useEffect(() => {
    if (tokenSet) {
      navigate('/dashboard', { replace: true });
    }
  }, [tokenSet]);

  const setItemPromise = (key: any, value: any) => {
    return new Promise<void>((resolve, reject) => {
      try {
        sessionStorage.setItem(key, value);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const setTokenAndNavigate = (data: any) => {
    const usernamePromise = setItemPromise('username', data.username);
    const userrolePromise = setItemPromise('userrole', data.userrole);
    const departmentPromise = setItemPromise('department', data.department);
    const tokenPromise = setItemPromise('token', data.token);

    Promise.all([
      usernamePromise,
      userrolePromise,
      departmentPromise,
      tokenPromise,
    ])
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch((error) => {
        console.error('Error setting session storage:', error);
        // Handle error if needed
      });
  };

  const verifyUser = async () => {
    setState((prev: any) => {
      return {
        ...prev,
        loadingClass: 'page-loader',
      };
    });
    let payload = {
      username: state.username,
      password: state.password,
    };
    await axiosInstance
      .post(apiUrls.verifyUser, payload)
      .then((resp) => {
        if (resp.data) {
          sessionStorage.setItem('username', resp.data.username);
          sessionStorage.setItem('userrole', resp.data.userrole);
          sessionStorage.setItem('department', resp.data.department);
          sessionStorage.setItem('token', resp.data.token);
          localStorage.setItem('token', resp.data.token);
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((err: any) => {
        console.log(err);
        if (err.hasOwnProperty('response')) {
          setState((prev: any) => {
            return {
              ...prev,
              loadingClass: 'd-none',
            };
          });
          handleSweetAlert('', err.response.data?.error, 'error');
          return;
        } else {
          handleSweetAlert('', err.message, 'error');
          return;
        }
      });
  };

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const handleSignIn = async () => {
    if (isSigningIn) {
      console.log('Authentication interaction is already in progress.');
      return;
    }

    try {
      setIsSigningIn(true);



      const loginResponse = await instance.loginPopup(); // Initiates the sign-in proces

      console.log('loginResponse', loginResponse);

      //accessToken
      sessionStorage.setItem('ADtoken', loginResponse.accessToken);
      localStorage.setItem('ADtoken', loginResponse.accessToken);
      
      if (loginResponse) {
        const Uname = loginResponse.idTokenClaims;
        if (
          Uname &&
          typeof Uname === 'object' &&
          'preferred_username' in Uname
        ) {
          const username = Uname.preferred_username as string;
          sessionStorage.setItem('username', username);
          let payload = {
            username: username,
          };
          await axiosInstance
            .post(apiUrls.verifyUser, payload)
            .then((resp) => {
              console.log(resp);
              if (resp.data) {
                sessionStorage.setItem('username', resp.data.username);
                sessionStorage.setItem('userrole', resp.data.userrole);
                sessionStorage.setItem('department', resp.data.department);
                sessionStorage.setItem('token', resp.data.token);
                localStorage.setItem('token', resp.data.token);
                navigate('/dashboard', { replace: true });
              }
            })
            .catch((err: any) => {
              console.log(err);
              if (err.hasOwnProperty('response')) {
                setState((prev: any) => {
                  return {
                    ...prev,
                    loadingClass: 'd-none',
                  };
                });
                if (err.response.data?.error == 'User not found') {
                  Swal.fire({
                    text:
                      err.response.data?.error +
                      '' +
                      'Please contact Administrator',
                    icon: 'warning',
                  }).then((result) => {
                    if (result.value) {
                      instance.logout();
                    }
                  });
                } else {
                  handleSweetAlert('', err.response.data?.error, 'error');
                  return;
                }
              } else {
                handleSweetAlert('', err.message, 'error');
              }
            });
        }
      }
      setIsSigningIn(false);
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Unknown error occurred'));
      }
      setIsSigningIn(false);
    }
  };

  const PostTask = async (status: any) => {
    console.log('status', status);
  };

  return (
    <>
      <div className={state.loadingClass}>
        <div className="spinner"></div>
        <div className="txt">ProvenTech</div>
      </div>
      <section className="login">
        <div className="loginL">
          <div className="bg1">
            <img src={Bg1} alt="" />
          </div>
          <div className="bg2">
            <img src={Bg2} alt="" />
          </div>
          <div className="logotext">
            <h1>Tech Transfer Digitilization</h1>
          </div>
          <div className="lines">
            <img src={lines} alt="" />
          </div>
          <div className="banner">
            <img src={Banner} alt="" />
          </div>
        </div>

        <div className="loginR">
          <div className="f_m">
            <div className="client">
              <img src={aurigeneLogo} alt="" />
            </div>
            <h3>AURIGENE</h3>
            <p className="mb-4">PHARMACEUTICAL SERVICES</p>
            <div>
              <div className="mb-3">
                <button
                  onClick={handleSignIn}
                  className="btn btn-primary small"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg1">
          <img src="./img/bg1.png" alt="" />
        </div>
        <div className="bg2">
          <img src="./img/bg2.png" alt="" />
        </div>
      </section>
    </>
  );
};

export default Login;
