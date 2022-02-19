import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { userContext } from '../helpers/userContext';

const NewWorkspace = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState('');
    const workspaceNameInput = useRef(null);
    
    useEffect(() => {
        if (user.jwt === undefined) return;

        api.get('workspace').then(res => {
            if (res.data !== undefined) {
                let response = res.data;
                
                if (response.message && response.message === "Access denied.") {
                    navigate('/');
                }
                
                setWorkspaces(response);
            }
        }).catch(err => {
            return;
        });
    }, [user]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        api.post('/workspace', {
            'name': workspaceNameInput.current.value
        }).then(res => {
            if (res.data.message && res.data.message === "This workspace already exists.") {
                setError('Bu çalışma alanı zaten mevcut.');
                return;
            }

            navigate('/workspace/' + res.data._id);
        }).catch(err => {
            return;
        });
    }

    return(
        <main style={{ flexDirection: 'column' }} className='content-container'>
            <div className='content-actions'>
                <p className='text-clamp' style={{ fontWeight: '500', flexGrow: '1' }}>
                    <Link className='breadcrumb' to="/dashboard">Kontrol Paneli</Link> / Yeni Çalışma Alanı
                </p>
            </div>

            <div className='content-wrapper'>
                <div className='workspaces'>
                    <span className='count'><strong>{workspaces.length ?? 0}</strong> Çalışma Alanı</span>

                    {workspaces && workspaces.map(workspace => {
                        return <Link to={'/workspace/' + workspace._id} key={workspace._id}><p>{workspace.name}</p></Link>  
                    })}
                </div>

                <div style={{ gap: '0' }} className='content-container'>
                    {error !== '' &&
                        <div className='input-area'>
                            <span className='input-error-big'>{error}</span>
                        </div>
                    }

                    <h2 style={{ margin: '0 0 1rem 0' }}>Yeni bir çalışma alanı ismi girerek başlayalım.</h2>

                    <form className='new-form' onSubmit={handleSubmit}>
                        <input className='half-radius' ref={workspaceNameInput} type='text' placeholder='Çalışma alanı ismi girin...'/>
                        <input className='half-radius btn-primary' type='submit' value='Ekle'/>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default NewWorkspace;