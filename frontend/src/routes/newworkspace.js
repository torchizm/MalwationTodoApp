import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { userContext } from '../helpers/userContext';

const NewWorkspace = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    useEffect(() => {
        if (user.jwt === undefined) return;

        api.get('workspace').then(res => {
            if (res.data !== undefined) {
                let response = res.data;
                
                if (response.message && response.message === "Access denied") {
                    navigate('/');
                }
                
                setWorkspaces(response);
            }
        }).catch(err => {
            return;
        });
    }, [user]);
    
    const onSubmit = async ({ workspace }) => {
        api.post('/workspace', {
            'name': workspace
        }).then(res => {
            if (res.data.message && res.data.message === "This workspace already exists") {
                setError('Bu çalışma alanı zaten mevcut');
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
                    <span className='count'><strong>{workspaces.length}</strong> Çalışma Alanı</span>

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

                    <form className='new-form' onSubmit={handleSubmit(onSubmit)}>
                        <input 
                            name='workspace'
                            type='text'
                            placeholder='Çalışma alanı ismi girin...'
                            {...register('workspace',
                            { required: {
                                value: true,
                                message: 'Çalışma alanı ismi'
                            },
                            maxLength: {
                                value: 128,
                                message: 'Çalışma alanı ismi en fazla 128 karkater olabilir'
                            }
                            })}
                        />
                        <input className='half-radius btn-primary' type='submit' value='Ekle'/>
                    </form>
                </div>
                {errors.workspace?.message && <span className='input-error'>{errors.workspace?.message}</span>}
            </div>
        </main>
    );
}

export default NewWorkspace;