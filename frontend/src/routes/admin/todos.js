import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import Todo from '../../components/user/todo';
import { userContext } from '../../helpers/userContext';

const Todos = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [data, setData] = useState([]);
    const [todos, setTodos] = useState([]);

    const [chartData, setChartData] = useState([]);

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
        
        api.get('admin/todos').then(res => {
            if (res.data !== undefined) {
                if (res.data.message && res.data.message === "Access denied") {
                    navigate('/');
                }

                setData(res.data);
                setTodos(res.data.todos);
            }
        }).catch(err => {
            return;
        });
    }, [user]);

    useEffect(() => {
        if (data.todos === undefined) return;
        
        let totalData = [
            ["Name", "Görevler"]
        ];
        let doneData = [
            ["Name", "Bitirilen Görevler"]
        ]
        
        data.workspaces.forEach(workspace => {
            const todos = data.todos.filter(todo => todo.workspace === workspace._id);
            const total = [workspace.name, (todos.filter(todo => todo.workspace === workspace._id)).length];
            const done = [workspace.name, (todos.filter(todo => todo.workspace === workspace._id && todo.checked)).length];
            
            if (total[1] !== 0) {
                totalData.push(total);
                doneData.push(done);
            }
        })

        setChartData({
            old: totalData,
            new: doneData
        });
    }, [data]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();

        if (e === "") {
            setTodos(data.todos);
            return;
        }

        setTodos(data.todos.filter(todo => todo.description.toLowerCase().includes(value)));
    }

    const todoDeleteHandler = (id) => {
        const newTodos = data.todos.filter(todo => todo._id !== id);
        
        setData(({workspaces}) => ({
            workspaces: workspaces,
            todos: newTodos
        }));

        setTodos(newTodos);
    }

    const todoChangeStateHandler = (id) => {
        const newTodos = data.todos.map(todo => todo._id === id ? Object.assign({}, todo, {checked: !todo.checked}): todo);

        setData(({workspaces}) => ({
            workspaces: workspaces,
            todos: newTodos
        }));
    }

    return(
        <main className='content-container'>
            <p className='text-clamp' style={{ fontWeight: '500', flexGrow: '1' }}>
                <Link className='breadcrumb' to="/admin/dashboard">Yönetici Paneli</Link> / Yapılacaklar Listesi
            </p>

            <div className='content-wrapper'>
                {data.workspaces !== undefined &&
                    <div className='workspace-user-list'>
                        <span className='count'><strong>{data.workspaces.length}</strong> Çalışma Alanı</span>

                        {data.workspaces.map(workspace => {
                            return <Link key={workspace._id} to={`/admin/workspace/${workspace._id}`} className='workspace-userlist-item'>
                                <p>{workspace.name}</p>
                            </Link>
                        })}

                        {data.workspaces !== undefined &&
                            <div style={{ width: '100%', borderRadius: '1rem', display: todos.length === 0 ? 'none' : 'block' }}>
                                <Chart
                                    chartType="BarChart"
                                    loader={<div style={{ textAlign: 'center' }}>Grafik yükleniyor...</div>}
                                    width={"100%"}
                                    height={"400px"}
                                    diffdata={chartData}
                                    options={chartOptions}
                                />
                            </div>
                        }
                    </div>
                }

                {data.todos !== undefined && 
                    <div style={{ flexGrow: '1' }}>

                        <div className='workspace-wrapper-header'>
                            <span style={{ fontSize: '30px' }} className='count'>{data.todos.length} Todo</span>
                            <input onChange={handleSearch} style={{ fonSize: '20px', borderRadius: '4px 4px 0 0', width: 'var(--search-width, 300px)' }} type='text' placeholder='Ara...'/>
                        </div>

                        {todos && todos.map(todo => {
                            let author = todo.author.username;
                            const workspace = data.workspaces.filter(workspace => workspace._id === todo.workspace);
                            if (workspace.length !== 0) author += ` - ${workspace[0].name}`;

                            return <Todo key={todo._id} todoChangeStateHandler={todoChangeStateHandler} todoDeleteHandler={todoDeleteHandler} value={todo} author={author}></Todo>
                        })}
                    </div>
                }
            </div>
        </main>
    );
}

export default Todos;