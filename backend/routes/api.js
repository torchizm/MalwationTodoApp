const express = require('express');
const router = express.Router();
const Auth = require('../app/middlewares/Auth');
const Admin = require('../app/middlewares/Admin');

const AuthController = require('../app/controllers/AuthController');

const WorkspaceController = require('../app/controllers/WorkspaceController');
const TodoController = require('../app/controllers/TodoController');

const AdminDashboardController = require('../app/controllers/admin/AdminDashboardController');
const AdminWorkspaceController = require('../app/controllers/admin/AdminWorkspaceController');
const AdminUsersController = require('../app/controllers/admin/AdminUsersController');
const AdminTodosController = require('../app/controllers/admin/AdminTodosController');

/**
 * Auth routes
 */
router.post('/login', AuthController.login);
router.post('/register', AuthController.signUp);
router.post('/logout', Auth, AuthController.logout);
router.get('/user/isAdmin', Auth, AuthController.isAdmin);

/**
 * User workspace routes
 */
router.get('/workspace', Auth, WorkspaceController.index);
router.get('/workspace/:id', Auth, WorkspaceController.get);
router.post('/workspace', Auth, WorkspaceController.add);
router.get('/workspace/:id/member', Auth, WorkspaceController.getMembers);
router.post('/workspace/member', Auth, WorkspaceController.addMember);
router.delete('/workspace/member/:workspace/:member', Auth, WorkspaceController.removeMember);
router.patch('/workspace', Auth, WorkspaceController.edit);
router.delete('/workspace/:id', Auth, WorkspaceController.delete);

/**
 * User todo routes
 */
router.get('/todo/:id', Auth, TodoController.index);
router.post('/todo/:id', Auth, TodoController.add);
router.patch('/todo/:id', Auth, TodoController.edit);
router.delete('/todo/:workspace/:todo', Auth, TodoController.delete);

/**
 * Admin dahsboard routes
 */
router.get('/admin/dashboard', Admin, AdminDashboardController.index);

/**
 * Admin workspace routes
 */
router.get('/admin/workspaces', Admin, AdminWorkspaceController.index);
router.get('/admin/workspaces/:id', Admin, AdminWorkspaceController.get);
router.get('/admin/workspace/:id/member', Auth, WorkspaceController.getMembers);
router.post('/admin/workspace/member', Admin, AdminWorkspaceController.addMember);
router.delete('/admin/workspace/member/:workspace/:member', Admin, AdminWorkspaceController.removeMember);
router.patch('/admin/workspace', Admin, AdminWorkspaceController.edit);
router.delete('/admin/workspace/:id', Admin, AdminWorkspaceController.delete);

/**
 * Admin user routes
 */
router.get('/admin/users', Admin, AdminUsersController.index);
router.get('/admin/users/:id', Admin, AdminUsersController.get);

/**
 * Admin todo routes
 */
router.get('/admin/todos', Admin, AdminTodosController.index);

module.exports = router;