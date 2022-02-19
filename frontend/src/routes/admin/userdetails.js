import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { FaUsers } from 'react-icons/fa';
import { MdChecklistRtl } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import Todo from '../../components/user/todo';
import { userContext } from '../../helpers/userContext';

const AdminWorkspaces = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [data, setData] = useState({});
    const { userId } = useParams();
    const [workspaceChartData, setWorkspaceChartData] = useState([]);

    const chartOptions = {  
        legend: { position: 'top' },
        colors: ["rgb(155, 51, 173)", "rgb(196, 58, 221)"],
        diff: {
            newData: {
                widthFactor: 1
            }
        }
    };

    useEffect(() => {
        if (user.jwt === undefined) return;

        api.get(`admin/users/${userId}`).then(res => {
            if (res.data !== undefined) {
                let response = res.data;

                if (response.message) {
                    if (response.message === "Not valid id.") {
                        navigate('/admin/users');
                    }

                    if (response.message === "Access denied.") {
                        navigate('/');
                    }
                }

                setData(response);
            }
        }).catch(err => {
            return;
        });
    }, [user]);

    useEffect(() => {
        if (data.workspaces === undefined) return;

        let workspaceTotalData = [
            ["Name", "Bitirilmesi gereken görevler"]
        ];
        let workspaceDoneData = [
            ["Name", "Bitirilen Görevler"]
        ]
        
        data.workspaces.forEach(workspace => {
            const total = [workspace.name, (workspace.todos.filter(todo => todo.author === user.id)).length];
            const checked = [workspace.name, (workspace.todos.filter(todo => todo.author === user.id && todo.checked === true)).length];
            workspaceTotalData.push(total);
            workspaceDoneData.push(checked);
        })

        setWorkspaceChartData({
            old: workspaceTotalData,
            new: workspaceDoneData
        });
    }, [data]);

    const todoDeleteHandler = (id) => {
        setData(({user, workspaces, todos}) => ({
            user: user,
            workspaces: workspaces,
            todos: todos.filter(todo => todo._id !== id)
        }));
    }

    const todoChangeStateHandler = (id) => {
        const newTodos = data.todos.map(todo => todo._id === id ? Object.assign({}, todo, {checked: !todo.checked}): todo);

        setData(({user, workspaces}) => ({
            user: user,
            workspaces: workspaces,
            todos: newTodos
        }));
    }

    return(
        <main className='content-container'>
            {data.user !== undefined && 
                <div className='workspace-wrapper'>
                    <p className='text-clamp' style={{ fontWeight: '500', flexGrow: '1' }}>
                        <Link className='breadcrumb' to="/admin/dashboard">Yönetici Paneli</Link> / <Link className='breadcrumb' to='/admin/users'>Kullanıcılar</Link> / {data.user.username}
                    </p>

                    { workspaceChartData.length !== 1 &&
                        <div className='workspace-chart-wrapper'>
                            <div style={{ width: '100%', borderRadius: '1rem', display: data.workspaces.length === 0 ? 'none' : 'block' }}>
                                <h2>Kullanıcının istatistikleri</h2>
                                <Chart
                                    chartType="BarChart"
                                    loader={<div style={{ textAlign: 'center' }}>Grafik yükleniyor...</div>}
                                    width={"100%"}
                                    height={"400px"}
                                    diffdata={workspaceChartData}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    }

                    {data.todos && <h2 style={{ margin: '1rem 0 0 0' }}>Kullanıcının Çalışma Alanı Listesi</h2>}
                    <div className='workspace-list-wrapper'>
                        {data.workspaces && data.workspaces.map(element => {
                            element.todos = data.todos.filter(todo => todo.workspace === element._id);
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

                    {data.todos && <h2 style={{ margin: '1rem 0 0 0' }}>Kullanıcının Yapılacaklar Listesi</h2>}
                    <div className='user-todo-list'>
                    {data.todos && data.todos.map(todo => {
                        const workspace = data.workspaces.filter(workspace => workspace._id === todo.workspace);
                        return <Todo key={todo._id} todoChangeStateHandler={todoChangeStateHandler} todoDeleteHandler={todoDeleteHandler} value={todo} author={workspace.length === 0 ? "Kullanıcı çalışma alanından değil" : workspace[0].name}></Todo>
                    })}
                    </div>
                </div>
            }
        </main>
    );
}

export default AdminWorkspaces;