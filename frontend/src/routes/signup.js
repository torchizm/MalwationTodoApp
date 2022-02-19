import '../theme.css';
import '../index.css';
import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../helpers/useAuth';
import { userContext } from '../helpers/userContext';


function Signup() {
  const formErrorElement = useRef(null);

  const [usernameErrorText, setUsernameErrorText] = useState('Kullanıcı adınızı girin');
  const [emailErrorText, setEmailErrorText] = useState('E-post adresinizi girin');
  const usernameErrorElement = useRef(null);
  const emailErrorElement = useRef(null);
  const passwordErrorElement = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const values = event.target.elements;

    if (!values.username.value) {
      setUsernameErrorText('Kullanıcı adınızı girin');
      usernameErrorElement.current.style.display = 'block';
      return;
    }

    if (!values.email.value || !validateEmail(values.email.value)) {
      setEmailErrorText('Geçersiz e-posta adresi');
      emailErrorElement.current.style.display = 'block';
      return;
    }
    emailErrorElement.current.style.display = 'none';

    if (!values.password.value || !values.confirmPassword.value || values.password.value !== values.confirmPassword.value) {
      passwordErrorElement.current.style.display = 'block';
    }
    passwordErrorElement.current.style.display = 'none';

    const { success, user, message } = await register(values.username.value, values.email.value, values.password.value);

    if (success === false) {
      if (message.includes('username')) {
        setUsernameErrorText('Kullanıcı zaten mevcut');
        usernameErrorElement.current.style.display = 'block';
      }
      if (message.includes('email')) {
        setEmailErrorText('Bu e-posta zaten mevcut');
        emailErrorElement.current.style.display = 'block';
      }

      return;
    }

    user.setUser = setUser;
    setUser(user);
    formErrorElement.current.style.display = 'none';
    navigate('/dashboard');
  }

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit} className="container input-container">
        <div className='input-area'>
          <span className='input-error-big' ref={formErrorElement}>Kullanıcı adı veya şifre yanlış</span>
        </div>

        <div className='input-area'>
          <label htmlFor="username">Kullanıcı Adınız</label>
          <input required name='username' type="text" placeholder='MuqemmelNick2023BorAdam'/>
          <span ref={usernameErrorElement} className='input-error'>{usernameErrorText}</span>
        </div>

        <div className='input-area'>
          <label htmlFor="email">E-Posta Adresi</label>
          <input required name='email' type="text" placeholder='example@gmail.com'/>
          <span ref={emailErrorElement} className='input-error'>{emailErrorText}</span>
        </div>

        <div className='input-area'>
          <label htmlFor="password">Şifre</label>
          <input required name='password' type="password" placeholder='Şifre'/>
          <span ref={passwordErrorElement} className='input-error'>Şifreler birbiriyle uyuşmuyor</span>
        </div>

        <div className='input-area'>
          <label htmlFor="confirmPassword">Şifrenizi Onaylayın</label>
          <input required name='confirmPassword' type="password" placeholder='Şifre'/>
        </div>

        <div style={{ justifyContent: 'unset', flexDirection: 'row', alignItems: 'center' }} className='input-area'>
          <div style={{ flexGrow: '1' }}>
            <label className='checkbox-container' htmlFor="privacyPolicy">
              <input required name='privacyPolicy' className='checkbox' type="checkbox"/>
              <a style={{ marginLeft: '8px', color: 'blue' }} href='/signup'>Şartları</a> ve <a style={{color: 'blue'}} href='/signup'>gizlilik politikasını</a> kabul ediyorum
            </label>
          </div>
          
          <input style={{ margin: '0' }} className='btn-primary' id='submit' type="submit" value='Kayıt Ol'/>
        </div>
      </form>
    </main>
  );
}

export default Signup;