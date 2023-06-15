//jwt 
const jwt = require('jsonwebtoken');

//express
const express = require('express');
const app = express();

//body-parser
app.use(express.json());

//cors
const cors = require('cors');
app.use(cors());

//mysql
const mysql = require('mysql');


// env
const dotenv = require('dotenv');
dotenv.config();

//bcrypt
const bcrypt = require("bcrypt")
const saltRounds = 10;

const nodemailer = require("nodemailer");

let secretKey = process.env.SECRET_KEY;

//connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

//connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('mysql connected');
});

//send mail

async function sendMail(email, subject, text, html) {
    return new Promise(async (resolve, reject) => {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });


        var mailOptions = {
            from: "gouthamk2212@gmail.com",
            to: `${email}`,
            subject: `${subject}`,
            text: `${text}`,
            html: `  ${html} `
        };


        await transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(false);
            }
            console.log("Message sent:", info.response);
            resolve(true);
        });
    })
}



//post method for signup
// app.post('/signUp', async (req, res) => {
//     let { name, email, password } = req.body;
//     let sql = 'select * from usertable where email = ?';
//     db.query(sql, [email], (err, result) => {
//         if (err) {
//             throw err;
//         }
//         else if (result.length) {
//             console.log("res length > 1");
//             if (result?.[0]?.isVerified == 0) {
//                 let token = jwt.sign({ name, email }, secretKey);
//                 console.log("verified =0");
//                 // sendMail(email, token)
//             } else {
//                 res.json("Something went wrong");
//             }
//         } else {
//             bcrypt.hash(password, saltRounds, async (err, hash) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     let resultForEmail = await sendEmail(email, token);
//                     // console.log(hash,"insert");
//                     if (resultForEmail) {
//                         let sql = "insert into usertable (username,email,password,token) values (?,?,?,?)";
//                         db.query(sql, [username, email, hash, token], (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 console.log(result);
//                                 res.json("User Verified");
//                             }
//                         })
//                     } else {
//                         res.json("Something went wrong");
//                     }
//                 }
//             })
//         }

//     });
// });


app.post('/signUp', (req, res) => {
    let { username, email } = req.body
    let text = "Please verify your email address."
    let subject = "Email Verification"

    db.query("select id,username,email,token,isVerified,isActive from usertable where email=?", [req.body.email], async (err, result) => {

        if (err) throw err;
        else if (result.length) {
            if (result?.[0].isVerified == 1) {
                return res.json({
                    message: "Something went wrong",
                    status: false
                })
            } else {
                let html = ` <h2>Email Verification</h2>
        <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the link below:</p>
        <a href="http://localhost:4200/verify/${result?.[0].token}" target="_blank">Verify Email</a>
        <p>If you didn't sign up for an account, you can safely ignore this email.</p>
        <p>Best regards,<br>Your Name</p>`
                const mailStatus = sendMail(result?.[0].email, subject, text, html);

                if (mailStatus) {
                    return res.json({
                        message: "Mail send successfuly",
                        status: mailStatus
                    });
                }
                return res.json({
                    message: "Mail not send",
                    status: mailStatus
                })
            }
        } else {
            let token = jwt.sign({ username, email }, secretKey);
            let html = ` <h2>Email Verification</h2>
        <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the link below:</p>
        <a href="http://localhost:4200/verify/${token}" target="_blank">Verify Email</a>
        <p>If you didn't sign up for an account, you can safely ignore this email.</p>
        <p>Best regards,<br>Your Name</p>`
            // let hash = await bcrypt.hash(password, saltRounds);
            const mailStatus = sendMail(email, subject, text, html)
            if (mailStatus) {
                db.query("insert into usertable (username,email,token) values (?,?,?)", [username, email, token], (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        return res.json({
                            message: "User added successfully",
                            status: true
                        });
                    }
                })
            }
        }
        return res.json({
            message: "Something went wrong",
            data: result
        });
    })

})

app.put('/verify/:token', (req, res) => {
    let token = req.params.token
    console.log(token, "token");
    if (token) {
        db.query("select email from usertable where token=?", [token], (err, result) => {
            if (err) throw err
            else if (result.length) {
                let email = result?.[0].email
                db.query("update usertable set isVerified=?,token=? where email=?", [1, null, email], (err, result) => {
                    if (err) throw err
                    else {
                        let token = jwt.sign({ email }, secretKey);
                        console.log(token, "token");
                        return res.status(200).json({
                            message: "User verified successfully",
                            data: token,
                            status: true
                        })
                    }
                })
            } else {
                return res.json({
                    message: "Something went wrong"
                })
            }
        })
    }
})

app.put('/addPassword', (req, res) => {
    console.log(req.body, "body");
    let { password, token } = req.body
    if(token){
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            return res.json({
                message: "Something went wrong"
            })
        } else {
            console.log(token, "token");
            jwt.verify(token, secretKey, async (err, decode) => {
                if (err) {
                    return res.json({
                        message: "Token expired"
                    })
                }
                else {
                    let email = decode.email
                    console.log(email, "email");
                    db.query("update usertable set password=? where email=? and isVerified=?", [hash, email, 1], (err, result) => {
                        if (err) throw err
                        else {
                            return res.status(200).json({
                                message: "Account created successfully",
                                status: true
                            })
                        }
                    })
                }
            })
        }
    })
}
})

app.get('/login', (req, res) => {
    let { email, password } = req.body
    db.query("select password from usertable where email=? and isVerified=1", [email], (err, result) => {
        if (err) throw err
        else if (result.length) {
            bcrypt.compare(password, result?.[0]?.password, (err, result) => {
                if (err) {
                    console.log(err);
                } else if (result) {
                    res.status(200).json({
                        message: "Login successfully",
                        status: true
                    })
                } else {
                    res.status(200).json({
                        message: "Something went wrong",
                        status: false
                    })
                }
            })
        } else {
            res.status(200).json({
                message: "Something went wrong",
                status: false
            })
        }
    })
})


// var mailOptions = {
//     from: "Your Name <your-email@example.com>",
//     to: email,
//     subject: "Password Reset",
//     html: `
//       <h2>Forgot Password</h2>
//       <p>Hello,</p>
//       <p>We received a request to reset your password. If you did not initiate this request, please ignore this email.</p>
//       <p>To reset your password, click on the link below:</p>
//       <p><a href="https://yourwebsite.com/reset-password?token=reset_token" target="_blank">Reset Password</a></p>
//       <p>If you're having trouble clicking the link, you can copy and paste the following URL into your browser:</p>
//       <p>https://yourwebsite.com/reset-password?token=reset_token</p>
//       <p>This password reset link will expire in 24 hours for security reasons.</p>
//       <p>Thank you,</p>
//       <p>Your Company Name</p>
//     `
//   };


app.post('/forgotPassword', (req, res) => {
    let { email } = req.body;
    let subject = "Password Reset"
    let text = "Please click on the link to reset your password"
    db.query("select id,email,token,isVerified from usertable where email=? and isVerified=?", [email, 1], (err, result) => {
        if (err) throw err
        else if (result.length) {
            let token = jwt.sign({ email }, secretKey);
            console.log(token, "token");
            let html = `
            <h2>Forgot Password</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. If you did not initiate this request, please ignore this email.</p>
            <p>To reset your password, click on the link below:</p>
            <p><a href="https://localhost:4200/reset-password?token=${token}" target="_blank">Reset Password</a></p>
            <p>If you're having trouble clicking the link, you can copy and paste the following URL into your browser:</p>
            <p>https://yourwebsite.com/reset-password?token=reset_token</p>
            <p>This password reset link will expire in 24 hours for security reasons.</p>
            <p>Thank you,</p>
            <p>Your Company Name</p>
          `
            db.query("insert into forgotpassword (email,token) values (?,?)", [email, token], (err, result) => {

                if (err) throw err
                else {
                    const mailStatus = sendMail(email, subject, text, html);
                    if (mailStatus) return res.json({
                        message: "Mail send successfuly",
                    });
                    return res.json({
                        message: "something went wrong",
                        status: mailStatus
                    })
                }
            })
        }
        else {
            return res.json({
                message: "Something went wrong",
                status: false
            })
        }
    })


})

app.get('/verifyPassToken/:token', (req, res) => {
    let token = req.params.token
    db.query("select email,isVerified from forgotpassword where token=?", [token], (err, result) => {
        if (err) throw err
        else if (result.length) {
            let email = result?.[0].email
            db.query("update forgotpassword set isVerified=?,token=? where email=?", [1, null, email], (err, result) => {

                if (err) throw err
                else {
                    jwt.sign({ email }, secretKey, (err, token) => {
                        if (err) throw err
                        else {

                            return res.json({
                                message: "User verified successfully",
                                status: true,
                                data: token
                            })
                        }
                    });
                }
            })

        } else {
            return res.json({
                message: "Something went wrongs"
            })
        }
    })
})

app.put('/resetPassword', (req, res) => {
    let { password, token } = req.body
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        console.log(hash, "hash");
        if (err) {
            console.log(err);
        } else {
            let email = jwt.verify(token, secretKey, (err, decode) => {
                if (err) throw err
                else {
                    console.log(decode, "email");
                    db.query("update usertable set password=? where email=? and isVerified=?", [hash, email, 1], (err, result) => {
                        if (err) throw err
                        else if (result.affectedRows) {
                            res.status(200).json({
                                message: "Password reset successfully",
                                status: true
                            })
                        } else {
                            res.status(200).json({
                                message: "Something went wrong",
                                status: false
                            })
                        }
                    })
                }

            })

        }
    })
})










//listen
app.listen(process.env.PORT, () => console.log("listening", process.env.PORT));