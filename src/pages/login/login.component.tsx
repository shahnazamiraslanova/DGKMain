import React, { useState, useEffect } from 'react';
import { Button, Form } from 'antd';
import { useLoginStyles } from './login.style';
import logoMain from '../../assets/images/statics/LogoMain.png';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername, setPassword, setToken } from 'store/store.reducer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUsername, isTokenValid } from '../../core/helpers/get-token'; // Import the function to check token validity
import { Routes } from 'router/routes';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const OTP_URL = 'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Account/get-otp';
  const LOGIN_URL = 'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Account/sign-in';
  const navigate = useNavigate();
  const { panel, loginMain, logoImg, input, inputContainer, button, showPasswordButton, loginTitle, sendAgain, sendAgainText } = useLoginStyles();

  const [showPassword, setShowPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const username = useSelector((state: any) => state.username);
  const password = useSelector((state: any) => state.password);
  const dispatch = useDispatch();

  const [usernameIsOk, setUsernameIsOk] = useState(true);
  const [passwordIsOk, setPasswordIsOk] = useState(true);
  const [number, setNumber] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenValid(storedToken)) {
      navigate(Routes.home); 
    }
  }, [navigate]);

  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setShowOtpForm(true);
    }
  }, []);

  const loginFun = async () => {
    const usernameValid = username.trim() !== '';
    const passwordValid = password.trim() !== '';

    setUsernameIsOk(usernameValid);
    setPasswordIsOk(passwordValid);

    if (usernameValid && passwordValid) {
      try {
        const response = await axios.post(OTP_URL, { username, password });

        if (response.data) {
          localStorage.setItem('username', username);
          setShowOtpForm(true);
          setNumber(response.data.data); 
        } else {
       console.log("salam");
       
        }
      } catch (error) {
        console.log("salam");
        
      }
    }
  };

  const handleOtpChange = (index: number, value: any) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      try {
        const response = await axios.post(LOGIN_URL, { username, password, otpCode });

        if (response.data) {
          localStorage.setItem('token', response.data.data);
          dispatch(setToken(response.data.data));
     
          navigate(Routes.home); 
        } 
      } catch (error) {
        console.log(error);
        
      }
    }
  };

  if (showOtpForm) {
    return (
      <div className={loginMain}>
        <img className={logoImg} src={logoMain} alt='Logo' />
        <div className={panel}>
          <p className={loginTitle}> OTP-ni daxil edin</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className={input}
                style={{ width: '40px', textAlign: 'center' }}
              />
            ))}
          </div>
          <Button onClick={handleOtpSubmit} className={button}>
            Təsdiq Et
          </Button>
          {number && <p className={sendAgainText}>******{number.slice(6)} nömrəsinə kod göndərildi</p>}
          <p className={sendAgainText}>
            Kodu əldə etmədim, <button onClick={loginFun} className={sendAgain}> yenidən göndər</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={loginMain}>
      <img className={logoImg} src={logoMain} alt='Logo' />
      <div className={panel}>
        <Form
          name='login'
          initialValues={{ username: '', password: '' }}
          layout='vertical'
        >
          <p className={loginTitle}>Daxil olun</p>
          <div className={inputContainer}>
            <input
              type='text'
              name='username'
              placeholder='Username'
              className={input}
              value={username}
              onChange={(e) => dispatch(setUsername(e.target.value))}
            />
            {!usernameIsOk && <span className="warn">Username is required</span>}
          </div>
          <div className={inputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Password'
              className={input}
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
            />
            {!passwordIsOk && <span className="warn">Password is required</span>}
            <button
              type='button'
              className={showPasswordButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <Button onClick={loginFun} className={button} htmlType='submit'>
            Daxil ol
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginComponent;
