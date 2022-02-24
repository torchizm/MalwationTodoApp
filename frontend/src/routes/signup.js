import '../theme.css';
import '../index.css';
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerUser } from '../helpers/useAuth';
import { userContext } from '../helpers/userContext';
import { useForm } from 'react-hook-form';


function Signup() {
  const formErrorElement = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const onSubmit = async ({ username, email, password }) => {
    const { success, user } = await registerUser(username, email, password);

    if (success === false) {
      formErrorElement.current.style.display = 'block';
      return;
    }

    user.setUser = setUser;
    setUser(user);
    formErrorElement.current.style.display = 'none';
    navigate('/dashboard');
  }

  return (
    <main className='container' style={{ marginTop: '1rem' }}>
      <form onSubmit={handleSubmit(onSubmit)} className='container input-container'>
        <div className='input-area'>
          <span className='input-error-big' ref={formErrorElement}>Bu kullanıcı zaten var.</span>
        </div>

        <div className='input-area'>
          <label htmlFor='username'>Kullanıcı Adınız</label>

          <input 
            name='username'
            type='text'
            placeholder='MueqmmelNick2023BorAdam'
            {...register('username',
            { required: {
                value: true,
                message: 'Kullanıcı adı gerekli'
              },
              maxLength: {
                value: 255,
                message: 'Kullanıcı adı en fazla 255 karkater olabilir'
              },
              minLength: {
                value: 6,
                message: 'Kullanıcı adı en az 6 karakter olabilir'
              },
              validate: {
                hasSpecialChar: (value) => !/[^a-zA-Z0-9]/.test(value) || "Geçersiz kullanıcı adı"
              }
            })}
          />
          {errors.username?.message && <span className='input-error'>{errors.username?.message}</span>}        
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

        <div className='input-area'>
          <label htmlFor='confirmPassword'>Şifrenizi Onaylayın</label>
          <input 
            name='rePassword'
            type='password'
            placeholder='müqşifre2023'
            {...register('rePassword', {
              required: {
                value: true,
                message: "Şifrenizi yeniden yazın"
              },
              validate: {
                matchesPreviousPassword: (value) => {
                  const { password } = getValues();
                  return password === value || "Şifreler birbiriyle uyuşmuyor";
                }
              }
            })}
          />
          {errors.rePassword?.message && <span className='input-error'>{errors.rePassword?.message}</span>}
        </div>

        <div style={{ justifyContent: 'unset', flexDirection: 'row', alignItems: 'center' }} className='input-area'>
          <div style={{ flexGrow: '1' }}>
            <label className='checkbox-container' htmlFor='privacyPolicy'>
              <input 
                name='privacyPolicy'
                type='checkbox'
                className='checkbox'
                {...register('privacyPolicy', {
                  required: {
                    value: true,
                    message: 'Kayıt olmak için şartları ve gizlilik politikasını kabul etmelisiniz.'
                  }
                })}
                />
              <a style={{ marginLeft: '8px', color: 'blue' }} href='/signup'>Şartları</a> ve <a style={{color: 'blue'}} href='/signup'>gizlilik politikasını</a> kabul ediyorum
            </label>
            <br/>
            {errors.privacyPolicy?.message && <span className='input-error'>{errors.privacyPolicy?.message}</span>}
          </div>
          
          <input style={{ margin: '0' }} className='btn-primary' id='submit' type='submit' value='Kayıt Ol'/>
        </div>
      </form>
    </main>
  );
}

export default Signup;