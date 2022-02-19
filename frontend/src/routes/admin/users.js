import React, { useContext, useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { userContext } from '../../helpers/userContext';

const AdminWorkspaces = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (user.jwt === undefined) return;
        
        
        api.get('admin/users').then(res => {
            if (res.data !== undefined) {
                let response = res.data;

                if (response.message && response.message === "Access denied.") {
                    navigate('/');
                }

                setUsers(response);
                setFilteredUsers(response);
            }
        }).catch(() => {
            return;
        });
    }, [user]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();

        if (e === "") {
            setFilteredUsers(users);
            return;
        }

        setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(value)));
    }

    return(
        <main className='content-container'>
            {users && 
                <div className='workspace-wrapper'>
                    <p className='text-clamp' style={{ fontWeight: '500', flexGrow: '1' }}>
                        <Link className='breadcrumb' to="/admin/dashboard">Yönetici Paneli</Link> / Kullanıcılar
                    </p>

                    <div className='workspace-wrapper-header'>
                        <span style={{ fontSize: '30px' }} className='count'>{users.length} Kullanıcı</span>
                        <input onChange={handleSearch} style={{ fonSize: '20px', borderRadius: '4px 4px 0 0', width: 'var(--search-width, 300px)' }} type='text' placeholder='Ara...'/>
                    </div>

                    <div style={{ borderTop: '2px solid var(--main-lightgray)' }} className='workspace-list-wrapper'>
                        {filteredUsers.length === 0 && <h2 style={{ flexGrow: '1', textAlign: 'center' }}>Kimse yok :(</h2>} 

                        {filteredUsers.length !== 0 && filteredUsers.map(user => {
                            const isAdmin = user.role.name === 'admin';

                            return <Link to={'/admin/users/' + user._id} key={user._id}>
                                <div className='dashboard-workspace-item'>
                                    <p className='text-clamp useritem'><strong>{user.username}</strong>{isAdmin === true && <span>Admin <FaCrown></FaCrown></span>}</p>
                                    <span>{user.email}</span>
                                </div>
                            </Link> 
                        })}
                    </div>
                </div>
            }
        </main>
    );
}

export default AdminWorkspaces;