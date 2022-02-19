import React, { useContext, useEffect, useRef, useState } from 'react';
import api from "../api";
import Todo from '../components/user/todo';
import { MdDeleteForever } from 'react-icons/md';
import { AiFillCrown, AiOutlineUserDelete } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { userContext } from '../helpers/userContext';
import Chart from 'react-google-charts';


const Workspace = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const newItemInput = useRef(null);
    const authUser = useContext(userContext);
    const [workspace, setWorkspace] = useState([]);
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
        if (authUser.user.jwt === undefined) return;

        api.get('workspace/' + workspaceId)
        .then(async res => {
            if (res.data.message) {
                if (res.data.message[0] === "Workspace not found.") {
                    navigate('/dashboard');
                }

                if (res.data.message === "Not valid id.") {
                    navigate('/dashboard');
                }
                
                return;
            }
            
            setWorkspace(res.data);
        }).catch(() => {
            return;
        });
    }, [authUser]);

    useEffect(() => {
        if (workspace._id === undefined || workspace.participants === undefined) return;
        
        let totalData = [
            ["Name", "Görevler"]
        ];
        let doneData = [
            ["Name", "Bitirilen Görevler"]
        ]
        
        workspace.participants.forEach(user => {
            const total = [user.username, (workspace.todos.filter(todo => todo.author === user._id)).length];
            const done = [user.username, (workspace.todos.filter(todo => todo.checked && todo.author === user._id)).length];
            
            if (total[1] !== 0) {
                totalData.push(total);
                doneData.push(done);
            }
        })

        setChartData({
            old: totalData,
            new: doneData
        });
    }, [workspace]);

    const handleSubmit = (e) => {
        e.preventDefault();

        api.post('todo/' + workspaceId, {
            'description': newItemInput.current.value
        }).then(async res => {
            if (res.data && res.data._id) {
                await setWorkspace(({_id, name, author, participants, todos, createdAt, updatedAt, __v}) => ({
                    _id: _id,
                    name: name,
                    author: author,
                    participants: participants,
                    todos: [
                        res.data,
                        ...todos
                    ],
                    updatedAt: updatedAt,
                    createdAt: createdAt,
                    __v: __v
                }));

                newItemInput.current.value = '';
            }
        }).catch(() => {
            return;
        });
    }

    const handleDelete = (user) => {
        api.delete(`workspace/${workspaceId}`)
        .then(res => {
            if (res.data.message && res.data.message === "Workspace deleted.") {
                navigate('/dashboard');
            }
        }).catch(() => {
            return;
        });
    }

    const handleDeleteUser = (id) => {
        api.delete(`workspace/member/${workspaceId}/${id}`)
        .then(async res => {
            if (res.data.message && res.data.message === 'User deleted.') {
                await setWorkspace(({_id, name, author, participants, todos, createdAt, updatedAt, __v}) => ({
                    _id: _id,
                    name: name,
                    author: author,
                    participants: participants.filter(participant => participant._id !== id),
                    todos: todos,
                    updatedAt: updatedAt,
                    createdAt: createdAt,
                    __v: __v
                }));
            }
        }).catch(() => {
            return;
        })
    }

    const todoDeleteHandler = async (id) => {
        await setWorkspace(({_id, name, author, participants, todos, createdAt, updatedAt, __v}) => ({
            _id: _id,
            name: name,
            author: author,
            participants: participants,
            todos: todos.filter(todo => todo._id !== id),
            updatedAt: updatedAt,
            createdAt: createdAt,
            __v: __v
        }));
    }

    const todoChangeStateHandler = async (id) => {
        const newTodos = workspace.todos.map(todo => todo._id === id ? Object.assign({}, todo, {checked: !todo.checked}): todo);

        await setWorkspace(({_id, name, author, participants, createdAt, updatedAt, __v}) => ({
            _id: _id,
            name: name,
            author: author,
            participants: participants,
            todos: newTodos,
            updatedAt: updatedAt,
            createdAt: createdAt,
            __v: __v
        }));
    }

    return(
        <main style={{ flexDirection: 'column' }} className='content-container'>
            <div className='content-actions'>
                <p className='text-clamp' style={{ fontWeight: '500', flexGrow: '1' }}>
                    <Link className='breadcrumb' to="/dashboard">Kontrol Paneli</Link> / {workspace.name}
                </p>

                {(authUser.user.id !== undefined) && authUser.user.id === workspace.author ?
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>
                        <p className='text-clamp'>Çalışma alanı işlemleri</p>
                        <button onClick={handleDelete} className='btn-circle red btn-circle-big'><MdDeleteForever/></button>
                    </div>
                : ''}
            </div>

            <div className='content-wrapper'>
                {workspace.participants &&
                    <div className='workspace-user-list'>
                        <span className='count'><strong>{workspace.participants.length ?? 0}</strong> Kişi</span>

                        {workspace.participants.map(user => {
                            const showDelete = (authUser.user.id === workspace.author) && (user._id !== workspace.author);
                            const showCrown = user._id === workspace.author;

                            return <div key={user._id} className='workspace-userlist-item'>
                                <p>{user.username}</p>
                                {(showDelete) ? <AiOutlineUserDelete onClick={() => handleDeleteUser(user._id)}/> : ''}
                                {(showCrown) ? <AiFillCrown style={{ display: 'unset', color: 'var(--main-text)'}} /> : ''}
                            </div>
                        })}


                        {authUser.user.id !== undefined && authUser.user.id === workspace.author ?
                        <Link style={{ width: '100%', marginTop: '2rem' }} to={`/workspace/${workspace._id}/addmember`}>
                            <button style={{ width: '100%' }} className='btn-primary btn-center-child'><FaPlus /> Kişi Ekle</button>
                        </Link> : ''}

                        {workspace.todos !== undefined &&
                            <div style={{ width: '100%', borderRadius: '1rem', display: workspace.todos.length === 0 ? 'none' : 'block' }}>
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

                <div style={{ flexGrow: '1' }}>
                    <form className='new-form' onSubmit={handleSubmit}>
                        <input required className='half-radius' ref={newItemInput} type='text' placeholder='Yeni bir görev girin...'/>
                        <input className='half-radius btn-primary' type='submit' value='Ekle'/>
                    </form>

                    {workspace.todos && workspace.todos.map(todo => {
                        let author = '';
                        if (workspace.participants.length !== 0) {
                            author = workspace.participants.filter(user => user._id === todo.author);
                            author = (author.length !== 0) ? author[0].username : 'Silinmiş kullanıcı'; 
                        }
                        return <Todo key={todo._id} value={todo} author={author} todoChangeStateHandler={todoChangeStateHandler} todoDeleteHandler={todoDeleteHandler}></Todo>
                    })}
                </div>
            </div>
        </main>
    );
}

export default Workspace;