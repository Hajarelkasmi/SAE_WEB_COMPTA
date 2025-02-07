import transporter from './mailSender.js';
import jwt from 'jsonwebtoken';

const mailOptions = {
    from: transporter.options.auth.user,
};

const secretKey = 'secret';

const PasswordToken = []

const create_email_token = function (id) {
    const token = jwt.sign({ id: id }, secretKey, { expiresIn: '1d' });
    PasswordToken.push(token);
    return token;
}

const send_email = function (email, object, message) {
    if (mailOptions.subject !== undefined) {
        mailOptions.subject = undefined;
    }
    if (mailOptions.to !== undefined) {
        mailOptions.to = undefined;
    }
    if (mailOptions.text !== undefined) {
        mailOptions.text = undefined;
    }
    mailOptions.subject = object;
    mailOptions.to = email;
    mailOptions.text = message;
    console.log(PasswordToken);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return 'Erreur lors de l\'envoi de l\'email : ' + error;
        } else {
            return 'Email envoyé : ' + info.response;
        }
    });
}

export { create_email_token, send_email, PasswordToken };