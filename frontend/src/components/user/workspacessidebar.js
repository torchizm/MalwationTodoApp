import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react/cjs/react.development';
import { FaPlus } from 'react-icons/fa';
import api from "../../api";

const WorkspacesSidebar = () => {
    const [workspaces, setWorkspaces] = useState([]);
    
    useEffect(() => {
        api.get('workspace').then(res => {
            if (res.data !== undefined) {
                setWorkspaces(res.data);
            }
        }).catch(error => {
            return;
        });
    }, []);

    return(
        <div className='workspaces'>
            <span className='count'><strong>{workspaces.length}</strong> Çalışma Alanı</span>

            {workspaces.map(element => {
                return <Link to={'/workspace/' + element._id} key={element._id}><p>{element.name}</p></Link>  
            })}

            <Link to='dashboard/new'>
                <span className='new-workspace'><FaPlus /> Oluştur</span>
            </Link>
        </div>
    );
}

export default WorkspacesSidebar;