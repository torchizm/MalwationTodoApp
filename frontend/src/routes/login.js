import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../helpers/useAuth';
import { userContext } from '../helpers/userContext';
import { useForm } from 'react-hook-form';


function Login() {
  const formErrorElement = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password, rememberMe}) => {
    const { success, user } = await login(email, password, rememberMe);

    if (!success) {
      formErrorElement.current.style.display = 'block';
      return;
    }

    user.setUser = setUser;
    setUser(user);
    formErrorElement.current.style.display = 'none';
    navigate('/dashboard');
  };

  return (
    <main style={{ marginTop: '1rem' }} className='container'>
      <form onSubmit={handleSubmit(onSubmit)} className='container input-container'>
        <div className='input-area'>
          <span className='input-error-big' ref={formErrorElement}>Kullanıcı adı veya şifre yanlış</span>
        </div>

        <div className='input-area'>
          <label htmlFor='email'>E-Posta Adresi</label>
          
          <input 
            name='email'
            type='text'
            placeholder='example@gmail.com'
            {...register('email',
            { required: {
                value: true,
                message: 'E-posta alanı gerekli'
              },
              maxLength: {
                value: 255,
                message: 'E-posta en fazla 255 karakter olabilir'
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Geçersiz e-posta adresi'
              }
            })}
          />
          {errors.email?.message && <span className='input-error'>{errors.email?.message}</span>}
        </div>

        <div className='input-area'>
          <label htmlFor='password'>Şifre</label>

          <input 
            name='password'
            type='password'
            placeholder='müqşifre2023'
            {...register('password',
            { required: {
              value: true,
              message: 'Şifre alanı gerekli'
            },
            minLength: {
              value: 6,
              message: 'Şifre en az 6 karakter olmalı'
            },
            maxLength: {
              value: 255,
              message: 'Şifre en fazla 255 karakter olmalı'
            },
            validate: {
              hasLowerLetter: (value) => /[a-z]/.test(value) || "Şifreniz en az bir küçük karakter içermelidir",
              hasUpperLetter: (value) => /[A-Z]/.test(value) || "Şifreniz en az bir büyük karakter içermelidir",
              hasNumber: (value) => /[0-9]/.test(value) || "Şifreniz en az bir sayı içermelidir",
              hasSpecialChar: (value) => /[!@#$%^&*]/.test(value) || "Şifreniz !@#$%^&* özel karakterlerinden en az birini içermelidir"
            }
            })}
          />
          {errors.password?.message && <span className='input-error'>{errors.password?.message}</span>}
        </div>

        <div style={{ justifyContent: 'unset', flexDirection: 'row', alignItems: 'center' }} className='input-area'>
          <div style={{ flexGrow: '1' }}>
            <input 
              name='rememberme'
              type='checkbox'
              className='checkbox'
              {...register('rememberMe')}
            />

            <label htmlFor='rememberme'>Beni hatırla</label>
          </div>
          
          <input style={{ margin: '0' }} className='btn-primary' id='submit' type='submit' value='Giriş Yap'/>
        </div>
      </form>
    </main>
  );
}

export default Login;