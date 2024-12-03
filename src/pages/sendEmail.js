import emailjs from 'emailjs-com';

const sendEmail = (toEmail, subject, message) => {
    const serviceID = 'service_zjdjfrq';
    const templateID = 'template_fwxvixa';
    const userID = 'eh_NplI0ENAoGfbzG';

    const templateParams = {
        to_email: toEmail,
        subject: subject,
        message: message,
    };

    return emailjs.send(serviceID, templateID, templateParams, userID)
        .then(response => {
            console.log('Email sent successfully!', response.status, response.text);
        })
        .catch(error => {
            console.error('Failed to send email:', error);
        });
};

export default sendEmail;