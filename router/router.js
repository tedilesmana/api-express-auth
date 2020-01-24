const courseController = require('../controller/courseController')
const userController = require('../controller/userController')
const auth = require('../middleware/auth.js')

/* Session middleware */
const { isLoggedIn, LoggedIn } = require("../auth/forceinout");

module.exports = app => {

    //api course
    app.get('/course', courseController.listCourse)
    app.get('/course/:id', courseController.detailCourse)
    app.post('/course/', courseController.tambahCourse)
    app.put('/course/:id', courseController.ubahCourse)
    app.delete('/course/:id', courseController.hapusCourse)

    //api users
    // app.get('/user',  auth.verifyToken , userController.listUser)
    // app.get('/user/:id',  auth.verifyToken , userController.detailUser)
    // app.post('/user/',  userController.tambahUser)
    // app.put('/user/:id',  auth.verifyToken , userController.ubahUser)
    // app.delete('/user/:id',  auth.verifyToken , userController.hapusUser)

    app.get('/user', userController.listUser)
    app.get('/user/:email', userController.detailUser)
    app.post('/user/', userController.tambahUser)
    app.put('/user/:id', userController.ubahUser)
    app.delete('/user/:id', userController.hapusUser)

    //get token
    app.post('/gettoken', userController.getToken)

    //send email
    app.post('/send_email', userController.send_email)

    // login
    app.post('/login', userController.login)

    // logout
    app.get('/logout', LoggedIn, userController.logout)

}