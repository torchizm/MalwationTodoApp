import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { MdChecklistRtl } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { userContext } from '../helpers/userContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [workspaces, setWorkspaces] = useState([]);
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
        
        api.get('workspace').then(res => {
            if (res.data !== undefined) {
                let response = res.data;

                if (response.message && response.message === "Access denied") {
                    navigate('/');
                }

                if (res.data.length === 0) {
                    navigate('new');
                }

                setWorkspaces(response);
            }
        }).catch(err => {
            return;
        });
    }, [user]);

    useEffect(() => {
        if (workspaces.length === 0) return;

        let workspaceTotalData = [
            ["Name", "Bitirilmesi gereken görevler"]
        ];
        
        workspaces.forEach(workspace => {
            const unchecked = [workspace.name, (workspace.todos.filter(todo => todo.author === user.id && todo.checked === false)).length];
            if (unchecked[1] !== 0) workspaceTotalData.push(unchecked);
        })

        setWorkspaceChartData(workspaceTotalData);
    }, [workspaces]);

    return(
        <main className='dashboard-container'>
            {workspaces && 
                <div className='workspace-wrapper'>
                    <div className='workspace-wrapper-header'>
                        <span style={{ fontSize: '30px' }} className='count'>{workspaces.length} Çalışma Alanı</span>

                        <Link to='/dashboard/new'>
                            <button className='btn-primary btn-center-child'><FaPlus /> Oluştur</button>
                        </Link>
                    </div>

                    { workspaceChartData.length !== 1 &&
                        <div className='workspace-chart-wrapper'>
                            <div style={{ width: '100%', borderRadius: '1rem', display: workspaces.length === 0 ? 'none' : 'block' }}>
                                <h2>Bitirilmesi gereken görevlerim</h2>
                                <Chart
                                    chartType="PieChart"
                                    loader={<div style={{ textAlign: 'center' }}>Grafik yükleniyor...</div>}
                                    width={"100%"}
                                    height={"400px"}
                                    data={workspaceChartData}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    }

                    <div className='workspace-list-wrapper'>
                        {workspaces && workspaces.map(element => {
                            return <Link to={'/workspace/' + element._id} key={element._id}>
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

export default Dashboard;