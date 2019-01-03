'use strict'

const Route = use('Route')

Route.post('/sessions', 'SessionController.store')

Route.get('/users', 'UserController.index')
Route.post('/users', 'UserController.store')
Route.put('/users/:id', 'UserController.update').middleware('auth')

Route.resource('/posts', 'PostController')
  .apiOnly()
  .middleware(['auth', 'is:moderator'])

Route.resource('/permissions', 'PermissionController')
  .apiOnly()
  .middleware('auth')

Route.resource('/roles', 'RoleController')
  .apiOnly()
  .middleware('auth')
