import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../helpers/useAuth';
import { userContext } from '../helpers/userContext';


function Login() {
  const formErrorElement = useRef(null);
  const emailErrorElement = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const values = event.target.elements;

    if (!validateEmail(values.email.value)) {
      emailErrorElement.current.style.display = 'block';
      return;
    }

    emailErrorElement.current.style.display = 'none';

    const { success, user } = await login(values.email.value, values.password.value, values.rememberme.checked);

    if (!success) {
      formErrorElement.current.style.display = 'block';
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
          <label htmlFor="email">E-Posta Adresi</label>
          <input name='email' type="text" placeholder='example@gmail.com'/>
          <span ref={emailErrorElement} className='input-error'>Geçersiz e-posta adresi!</span>
        </div>

        <div className='input-area'>
          <label htmlFor="password">Şifre</label>
          <input name='password' type="password" placeholder='Şifre'/>
        </div>

        <div style={{ justifyContent: 'unset', flexDirection: 'row', alignItems: 'center' }} className='input-area'>
          <div style={{ flexGrow: '1' }}>
            <input name='rememberme' className='checkbox' type="checkbox"/>
            <label htmlFor="rememberme">Beni hatırla</label>
          </div>
          
          <input style={{ margin: '0' }} className='btn-primary' id='submit' type="submit" value='Giriş Yap'/>
        </div>
      </form>
    </main>
  );
}

export default Login;