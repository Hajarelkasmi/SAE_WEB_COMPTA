import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
 }
});

export default transporter;