import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { MdChecklistRtl } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { userContext } from '../../helpers/userContext';

const AdminWorkspaces = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [workspaces, setWorkspaces] = useState([]);
    const [usersChartData, setUsersChartData] = useState([]);
    const [workspaceChartData, setWorkspaceChartData] = useState([]);

    const chartOptions = {
        legend: { position: 'top' },
        colors: [
            "rgb(155, 51, 173)",
            "rgb(143, 63, 80)",
            "rgb(78, 102, 141)",
            "rgb(97, 71, 102)",
            "rgb(58, 120, 221)",
            "rgb(63, 116, 202)",
            "rgb(11, 118, 168)",
            "rgb(163, 130, 224)"
        ],
        diff: {
            oldData: {
                opacity: 1,
                inCenter: false
            },
            newData: {
                opacity: 0.8
            }
        }
    };

    useEffect(() => {
        if (user.jwt === undefined) return;
        
        api.get('admin/workspaces').then(res => {
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

    useEffect(() => {
        if (workspaces.length === 0) return;
        
        let userTotalData = [
            ["Name", "Görevler"]
        ];
        let userDoneData = [
            ["Name", "Bitirilen Görevler"]
        ]
        let workspaceTotalData = [
            ["Name", "Görevler"]
        ];
        let workspaceDoneData = [
            ["Name", "Bitirilen Görevler"]
        ]
        
        workspaces.forEach(workspace => {
            workspace.participants.forEach(user => {
                const total = [`${user.username} (${workspace.name})`, (workspace.todos.filter(todo => todo.author === user._id)).length];
                const done = [`${user.username} (${workspace.name})`, (workspace.todos.filter(todo => todo.checked && todo.author === user._id)).length];
                
                if (total[1] !== 0) {
                    userTotalData.push(total);
                    userDoneData.push(done);
                }
            })

            const total = [workspace.name, workspace.todos.length];
            const done = [workspace.name, (workspace.todos.filter(todo => todo.checked)).length];
            workspaceTotalData.push(total);
            workspaceDoneData.push(done);
        })

        setUsersChartData({
            old: userTotalData,
            new: userDoneData
        });
        setWorkspaceChartData({
            old: workspaceTotalData,
            new: workspaceDoneData
        })
    }, [workspaces]);

    return(
        <main className='content-container'>
            {workspaces && 
                <div className='workspace-wrapper'>
                    <p className='text-clamp' style={{ fontWeight: '500', flexGrow: '1' }}>
                        <Link className='breadcrumb' to="/admin/dashboard">Yönetici Paneli</Link> / Çalışma Alanları
                    </p>

                    <div className='workspace-wrapper-header'>
                        <span style={{ fontSize: '30px' }} className='count'>{workspaces.length ?? 0} Çalışma Alanı</span>
                    </div>

                    <div className='workspace-chart-wrapper'>
                        <div style={{ width: '100%', borderRadius: '1rem', display: workspaces.length === 0 ? 'none' : 'block' }}>
                            <Chart
                                chartType="PieChart"
                                loader={<div style={{ textAlign: 'center' }}>Grafik yükleniyor...</div>}
                                width={"100%"}
                                height={"400px"}
                                diffdata={workspaceChartData}
                                options={chartOptions}
                            />
                        </div>
                        <div style={{ width: '100%', borderRadius: '1rem', display: workspaces.length === 0 ? 'none' : 'block' }}>
                            <Chart
                                chartType="PieChart"
                                loader={<div style={{ textAlign: 'center' }}>Grafik yükleniyor...</div>}
                                width={"100%"}
                                height={"400px"}
                                diffdata={usersChartData}
                                options={chartOptions}
                            />
                        </div>
                    </div>

                    <div className='workspace-list-wrapper'>
                        {workspaces && workspaces.map(element => {
                            return <Link to={'/admin/workspace/' + element._id} key={element._id}>
                                <div className='dashboard-workspace-item'>
                                    <div>
                                        <p className='text-clamp'><strong>{element.name}</strong></p>
                                        <span><strong>{element.todos.filter(todo => todo.checked === true).length} / {element.todos.length}</strong> <MdChecklistRtl className='icon-w'/></span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--main-whitegray)' }}>{element.author.username}</span>
                                        <span><strong>{element.participants.length}</strong> <FaUsers className='icon-w'/></span>
                                    </div>
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