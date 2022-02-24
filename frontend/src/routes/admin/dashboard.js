import React, { useContext, useEffect, useState } from 'react';
import {  FaTable, FaUsers } from 'react-icons/fa';
import { MdChecklistRtl } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { userContext } from '../../helpers/userContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        if (user.jwt === undefined) return;

        api.get('admin/dashboard')
        .then(res => {
            if (res.data && res.data.message === 'Access denied') {
                navigate('/dashboard');
            }

            setWorkspaces(res.data);
        }).catch(() => {
            return;
        });
    }, [user]);

    return(
        <main className='dashboard-container'>
            <div className='workspace-wrapper'>
                <div view="admin" className='workspace-list-wrapper'>
                    {workspaces.workspaces !== undefined &&
                        <Link to='/admin/workspaces'>
                            <div className='dashboard-workspace-item'>
                                <p><strong>{workspaces.workspaces} Toplam Çalışma Alanı</strong></p>
                                <span className='icon-w'><FaTable className='icon-w'/></span>
                            </div>
                        </Link>
                    }
                    {workspaces.users !== undefined &&
                        <Link to='/admin/users'>
                            <div className='dashboard-workspace-item'>
                                <p><strong>{workspaces.users} Toplam Kullanıcı</strong></p>
                                <span className='icon-w'><FaUsers className='icon-w'/></span>
                            </div>
                        </Link>
                    }
                    {workspaces.todos !== undefined &&
                        <Link to='/admin/todos'>
                            <div className='dashboard-workspace-item'>
                                
                                <p><strong>{workspaces.todos.finished} / {workspaces.todos.total} Toplam Todo</strong></p>
                                <span className='icon-w'><MdChecklistRtl className='icon-w'/></span>
                            </div>
                        </Link>
                    }
                </div>
            </div>
        </main>
    );
}

export default Dashboard;