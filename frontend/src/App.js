import { Navigate, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import './theme.css';
import './index.css';

import Landing from './routes/landing';
import Footer from './components/footer';
import Header from './components/header';
import Login from './routes/login';
import Signup from './routes/signup';

import { userContext } from './helpers/userContext';
import { getUser } from './helpers/storage';
import { RequireAuth, RequireAdmin } from './helpers/requireauth';

/**
 * User Components
 */
import {default as UserDashboard} from './routes/dashboard';
import NewWorkspace from './routes/newworkspace';
import AddUser from './routes/adduser';
import Workspace from './routes/workspace';

/**
 * Admin Components
 */

import {default as AdminDashboard} from './routes/admin/dashboard';
import {default as AdminWorkspaces} from './routes/admin/workspaces';
import {default as AdminWorkspace} from './routes/admin/workspace';
import {default as AdminAddUser} from './routes/admin/adduser';
import {default as AdminUsers} from './routes/admin/users';
import {default as AdminUserDetails} from './routes/admin/userdetails';
import {default as AdminTodos} from './routes/admin/todos';

export var userValue = {};

const App = () => {
  const [user, setUser] = useState([]);
  userValue = { user, setUser };

  useEffect(() => {
    if (!localStorage.getItem('theme') || localStorage.getItem('theme') === null) {
      localStorage.setItem('theme', 'dark');
      setBodyTheme('dark');
    }

    const user = getUser();
    user.setUser = setUser;
    setUser(user);
  }, []);

  const setBodyTheme = (val) => {
    document.body.setAttribute('theme', val);
  }

  return(
    <userContext.Provider value={userValue}>
      <main className='container padding'>
          <Header setTheme={setBodyTheme}/>

          <Routes>
            <Route path="/" element={<Landing/>}/>

            <Route path="/dashboard" element={
              <RequireAuth>
                <UserDashboard/>
              </RequireAuth>
            }/>
            <Route path="/dashboard/new" element={
              <RequireAuth>
                <NewWorkspace/>
              </RequireAuth>
            }/>
            <Route path="/workspace/:workspaceId" element={
              <RequireAuth>
                <Workspace/>
              </RequireAuth>
            }/>
            <Route path="/workspace/:workspaceId/addmember" element={
              <RequireAuth>
                <AddUser/>
              </RequireAuth>
            }/>
            <Route path="/admin/dashboard/" element={
              <RequireAdmin>
                <AdminDashboard/>
              </RequireAdmin>
            }/>
            <Route path="/admin/workspaces" element={
              <RequireAdmin>
                <AdminWorkspaces/>
              </RequireAdmin>
            }/>
            <Route path="/admin/workspace/:workspaceId" element={
              <RequireAdmin>
                <AdminWorkspace/>
              </RequireAdmin>
            }/>
            <Route path="/admin/workspace/:workspaceId/addmember" element={
              <RequireAuth>
                <AdminAddUser/>
              </RequireAuth>
            }/>
            <Route path="/admin/users" element={
              <RequireAdmin>
                <AdminUsers/>
              </RequireAdmin>
            }/>
            <Route path="/admin/users/:userId" element={
              <RequireAdmin>
                <AdminUserDetails/>
              </RequireAdmin>
            }/>
            <Route path="/admin/todos" element={
              <RequireAdmin>
                <AdminTodos/>
              </RequireAdmin>
            }/>

            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>

          <Footer/>
      </main>
    </userContext.Provider>
  )
}

export default App;
