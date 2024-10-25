import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, message } from 'antd';
import { useLoginStyles } from './login.style';
import logoMain from '../../assets/images/statics/LogoMain.png';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername, setPassword, setToken } from 'store/store.reducer';
import axios from 'axios';
import { getUsername, isTokenValid } from '../../core/helpers/get-token';
import { Routes } from 'router/routes';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from 'baseInfos';

interface RootState {
  username: string;
  password: string;
}

const LoginComponent = () => {
  const OTP_URL = 'https://tc2c-fvaisoutbusiness.customs.gov.az:3535';
  const LOGIN_URL = 'https://tc2c-fvaisoutbusiness.customs.gov.az:3535';
  const navigate = useNavigate(); 
  const {
    panel,
    loginMain,
    logoImg,
    input,
    inputContainer,
    button,
    showPasswordButton,
    loginTitle,
    sendAgain,
    sendAgainText,
    warnMessages,
  } = useLoginStyles();

  const [showPassword, setShowPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const username = useSelector((state: RootState) => state.username);
  const password = useSelector((state: RootState) => state.password);
  const dispatch = useDispatch();

  const [usernameIsOk, setUsernameIsOk] = useState(true);
  const [passwordIsOk, setPasswordIsOk] = useState(true);
  const [number, setNumber] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenValid(storedToken)) {
      navigate(Routes.home);
    }
  }, [navigate]);

  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      dispatch(setUsername(storedUsername));
      setShowOtpForm(true);
    }
  }, [dispatch]);

  const readCardData = async () => {
    setCardLoading(true);
    try {
      const cardInfo = await getCardDataFromReader();
      console.log(cardInfo);
      
      if (cardInfo?.username) {
        dispatch(setUsername(cardInfo.username));
        setShowOtpForm(true);
      } else {
        message.error('Card does not contain valid user information');
      }
    } catch (error) {
      console.error('Card reading error:', error);
      message.error('Failed to read card. Please ensure the card is inserted and accessible.');
    } finally {
      setCardLoading(false);
    }
  };
  
  
// Modified getCardDataFromReader function
const getCardDataFromReader = async () => {
  try {
    console.log('Requesting USB device...');

    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x0bda, productId: 0x0165 }],
    });

    if (!device) {
      console.error('No USB devices found.');
      message.error('No USB devices found. Please check your connection.');
      return;
    }

    console.log('Device selected: ', device);

    try {
      await device.open();
      console.log('Device opened successfully');
      
      await device.selectConfiguration(1);
      console.log('Configuration selected');
      
      await device.claimInterface(0);
      console.log('Interface claimed');

      const cardInfo = await readDataFromCard(device);

      await device.close();
      console.log('Device closed');

      console.log('Card data: ', cardInfo);
      return cardInfo;
    } catch (securityError) {
      console.error('Error details:', securityError);
      if (securityError instanceof DOMException && securityError.name === 'SecurityError') {
        console.error('Failed to open the device: Access denied.');
        message.error('Access denied. Please ensure the device is properly connected and allowed in your browser settings.');
      } else {
        console.error('Unexpected error:', securityError);
        message.error('Unexpected error occurred. Please try again.');
      }
    }
  } catch (error) {
    console.error('Failed to read card data:', error);
    message.error('Failed to communicate with the card reader. Please check your device and browser permissions.');
  }
};

  const readDataFromCard = async (device: any) => {
    try {
      const result = await device.transferIn(1, 64);

      console.log('Received data:', result.data);

      const textDecoder = new TextDecoder();
      const decodedData = textDecoder.decode(result.data);

      return {
        username: decodedData,
        certificate: 'cardCert456',
      };
    } catch (error) {
      console.error('Error reading data from card:', error);
      throw new Error('Failed to read card data');
    }
  };

  const loginFun = async () => {
    const usernameValid = username.trim() !== '';
    const passwordValid = password.trim() !== '';

    setUsernameIsOk(usernameValid);
    setPasswordIsOk(passwordValid);

    if (usernameValid && passwordValid) {
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/api/Account/get-otp`, { username, password });

        if (response.data) {
          localStorage.setItem('username', username);
          setShowOtpForm(true);
          setNumber(response.data.data);
        }
      } catch (error) {
        message.error('İstifadəçi adı və ya şifrə yanlışdır');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
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
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/api/Account/sign-in`, { username, password, otpCode });

        if (response.data) {
          localStorage.setItem('token', response.data.data);
          dispatch(setToken(response.data.data));
          navigate(Routes.home);
        }
      } catch (error) {
        message.error('OTP doğrulama uğursuz oldu');
      } finally {
        setLoading(false);
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
                type='text'
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOtpChange(index, e.target.value)}
                className={input}
                style={{ width: '40px', textAlign: 'center' }}
                maxLength={1}
              />
            ))}
          </div>
          <Button onClick={handleOtpSubmit} className={button} loading={loading} disabled={loading}>
            Təsdiq Et
          </Button>
          {number && <p className={sendAgainText}>******{number.slice(6)} nömrəsinə kod göndərildi</p>}
          <p className={sendAgainText}>
            Kodu əldə etmədim,{' '}
            <button onClick={loginFun} className={sendAgain}>
              yenidən göndər
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={loginMain}>
      <img className={logoImg} src={logoMain} alt='Logo' />
      <div className={panel}>
        <Form name='login' initialValues={{ username: '', password: '' }} layout='vertical'>
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
            {!usernameIsOk && <span className={warnMessages}>Username is required</span>}
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
            {!passwordIsOk && <span className={warnMessages}>Password is required</span>}
            <button
              type='button'
              className={showPasswordButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <Button onClick={loginFun} className={button} loading={loading} disabled={loading}>
            Daxil ol
          </Button>
          <Button onClick={readCardData} className={button} loading={cardLoading} disabled={cardLoading} style={{marginTop:'10px'}}>
            Kartla daxil ol
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginComponent;