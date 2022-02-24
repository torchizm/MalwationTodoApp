import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { userContext } from '../../helpers/userContext';

const AddUser = () => {
    const { workspaceId } = useParams();
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState([]);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    useEffect(() => {
        if (user.jwt === undefined) return;

        api.get(`admin/workspace/${workspaceId}/member`).then(res => {
            if (res.data !== undefined) {
                let response = res.data;
                
                if (response.message && response.message === "Access denied") {
                    navigate('/');
                }
                
                setWorkspace(response);
            }
        }).catch(err => {
            return;
        });

    }, [user]);
    
    const onSubmit = async ({ username }) => {
        api.post('admin/workspace/member', {
            'workspace': workspace._id,
            'member': username
        }).then(res => {
            if (res.data.message) { 
                switch (res.data.message) {
                    case "This member is already in workspace":
                        setError('Bu kişi zaten çalışma alanında var');
                        break;
                    case "Workspace not found":
                        setError('Çalışma alanı bulunamadı');
                        break;
                    case "User not found":
                        setError('Kullanıcı bulunamadı');
                        break;
                    case "Access denied":
                        setError('Bu çalışma alanı için yetkiniz yok');
                        break;
                    default:
                        break;
                }

                return;
            }

            navigate('/admin/workspace/' + workspace._id);
        }).catch(err => {
            return;
        });
    }

    return(
        <main style={{ flexDirection: 'column' }} className='content-container'>
            <div className='content-actions'>
                {workspace.name !== undefined &&
                    <p className='text-clamp' style={{ fontWeight: '500', flexGrow: '1' }}>
                        <Link className='breadcrumb' to="/dashboard">Yönetici Paneli</Link> / <Link className='breadcrumb' to="/admin/workspaces">Çalışma Alanları</Link> / <Link className='breadcrumb' to={`/admin/workspace/${workspaceId}`}>{workspace.name}</Link> / Kullanıcı Ekle
                    </p>
                }
            </div>

            <div className='content-wrapper' action='newmember'>
                <div className='workspace-user-list'>
                    {workspace.users !== undefined &&
                        <span className='count'><strong>{workspace.participants.length}</strong> Kişi</span>
                    }

                    {workspace.participants !== undefined &&
                        workspace.participants.map(user => {
                            return <p key={user._id}>{user.username}</p> 
                    })}
                </div>

                <div className='workspace-add-user-form content-container'>
                    {error !== '' &&
                        <div className='input-area'>
                            <span style={{display: 'block'}} className='input-error-big'>{error}</span>
                        </div>
                    }

                    <h2 style={{ margin: '0 0 1rem 0' }}>Yeni çalışma arkadaşınızın kullanıcı adını girin.</h2>

                    <form className='new-form' onSubmit={handleSubmit(onSubmit)}>
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
                            }
                            })}
                        />
                        <input className='half-radius btn-primary' type='submit' value='Ekle'/>
                    </form>
   
                    {errors.username?.message && <span className='input-error'>{errors.username?.message}</span>}
                </div>
            </div>
        </main>
    );
}

export default AddUser;