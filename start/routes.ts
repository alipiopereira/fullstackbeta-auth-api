import Route from "@ioc:Adonis/Core/Route";

Route.post('/login',  'AuthController.login')
Route.post('/logout',  'AuthController.logout')
Route.post('/register', 'AuthController.register')
Route.get('/:profile', 'AuthController.profile') //.middleware('auth')
