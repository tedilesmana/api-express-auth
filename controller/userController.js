const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bycrypt = require("bcryptjs");
const passport = require("passport");

exports.listUser = async (req, res) => {
    let data = await User.find()
    res.send(JSON.stringify({ "status": 200, "error": null, "response": data }))
}

exports.detailUser = async (req, res) => {
    const data = await User.findOne({ email: req.params.email });
    res.send(JSON.stringify({ "status": 200, "error": null, "response": data }))
}

exports.tambahUser = async (req, res) => {
    const { username, password, email, alamat, noTelp } = req.body;

    let errors = [];

    if (!username || !password || !email || !alamat || !noTelp) {
        errors.push({
            msg: "Sorry Fill all the input"
        });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            username,
            password,
            email,
            alamat,
            noTelp
        });
    } else {
        User.findOne({ email }).then(user => {
            if (user) {
                res.send('User sudah ada')
            } else {
                const newUser = new User({
                    username,
                    password,
                    email,
                    alamat,
                    noTelp
                });

                bycrypt.genSalt(10, (err, salt) => {
                    bycrypt.hash(newUser.password, salt, async (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;

                        const status = await newUser.save()
                        res.send(JSON.stringify({ "status": 200, "error": null, "response": status }))
                    });
                });
            }
        });
    }
}

exports.ubahUser = async (req, res) => {
    const { id } = req.params
    const status = await User.update({ _id: id }, req.body)
    res.send(JSON.stringify({ "status": 200, "error": null, "response": status }))
}

exports.hapusUser = async (req, res) => {
    let { id } = req.params
    const status = await User.remove({ _id: id })
    res.send(JSON.stringify({ "status": 200, "error": null, "response": status }))
}

exports.getToken = async (req, res) => {
    let { username, password } = req.body
    console.log('get token');
    const cek = await User.findOne({ username: username, password: password })
    if (cek != null) {
        const user = {
            username: cek.username,
            password: cek.password
        }
        jwt.sign({ user }, 'secretkey', (err, token) => {
            res.send(JSON.stringify({ "status": 200, "error": null, "token": token }))
        })
    } else {
        res.sendStatus(403)
    }
}

exports.send_email = async (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'tedi.lesmana0123@gmail.com', // generated ethereal user
            pass: '2bINTANG' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"tedilesmana" <tedi.lesmana0123@gmail.com>', // sender address
        to: '12174839@bsi.ac.id', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });
    });
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email || !password) {
        res.send('Sorry fill all credentials');
    }

    if (errors.length > 0) {
        res.send(errors);
    } else {
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/users/login",
            failureFlash: true
        })(req, res, next);
    }

    console.log(req);
};

exports.logout = async (req, res) => {
    req.logout();
    res.send("We will miss you");
};