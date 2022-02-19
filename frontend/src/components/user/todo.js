import React, { useState } from 'react';
import api from '../../api';
import { MdDeleteForever } from 'react-icons/md';

function Todo({ value, author, todoChangeStateHandler, todoDeleteHandler }) {
    const [item, setItem] = useState(value);

    const getDateString = () => {
        let str = '';
        const date = new Date(item.updatedAt);

        if (item.updatedAt !== item.createdAt) str += 'Güncelleme: ';

        if (isLastOneHour(date)) {
            const minuteDiff = getMinuteDiff(new Date(), date);
            
            if (minuteDiff === 0) {
                str += 'şimdi';
            } else {
                str += minuteDiff + ' dakika önce';
            }
        } else {
            str += date.toLocaleString();
        }

        return str;
    }

    const isLastOneHour = (date) => {
        const today = new Date();

        return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear() &&
                date.getHours() === today.getHours();
    }

    const getMinuteDiff = (today, endDate) => parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60) % 60);
    
    const handleChange = (e) => {
        todoChangeStateHandler(item._id);

        api.patch('todo/' + item._id, {
            'todo': item._id,
            'description': item.description,
            'checked': !item.checked,
            'workspace': item.workspace
        }).then(res => {
            setItem(res.data);
        }).catch(err => {
            return;
        });
    }

    const handleDelete = (e) => {
        api.delete(`todo/${item.workspace}/${item._id}`)
        .then(res => {
            if (res.data && res.data.message === "Todo deleted.") {
                todoDeleteHandler(item._id);
            }
        }).catch(() => {
            return;
        });
    }

    return (
        <div className='todo'>
            <div className='todo-content-wrapper'>
                <input id={item._id} name={item._id} defaultChecked={item.checked} onChange={handleChange} type='checkbox'></input>
                <label htmlFor={item._id}>{item.description}</label>
                <button onClick={handleDelete} className='btn-circle red'><MdDeleteForever/></button>
            </div>
            <span className='todo-details'><strong>{author}</strong> • {getDateString()}</span>
        </div>
    );
}

export default Todo;