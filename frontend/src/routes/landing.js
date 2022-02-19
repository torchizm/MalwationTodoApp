import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mockup from '../assets/mockup.png';
import { userContext } from '../helpers/userContext';

function Landing() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);

    return (
        <main className='landing text-align-center'>
            <h1 className='container-header'>Notlarınızı ekibinizle veya tek başınıza en iyi şekilde yönetin!</h1>
            
            {!user.username &&
                <Link to='/signup'>
                    <button className='btn-primary'>Şimdi Kayıt Ol</button>
                </Link>
            }

            {user.username &&
                <Link to='/dashboard'>
                    <button className='btn-primary'>Kontrol Paneline Git</button>
                </Link>
            }

            <img src={mockup} alt='Mockup.png'></img>
        </main>
    );
}

export default Landing;