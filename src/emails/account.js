const sgmail = require('@sendgrid/mail')
// const sendgridAPIkey = 'SG.bBO3BvrBQc2zFzzDV8nrQA.CBGKogOzGSjgNO6dnUGdgBHpHGUNcq0NsUEFdLHPnFc'

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

// send Welcome mail to user
const sendWelcomeMail = (email, name) => {
    sgmail.send({
        to : email,
        from : 'abhishah0196@gmail.com',
        subject : 'Thank you for Joining in!',
        text : `Welcome to my Task App ${name}.`
    })
}
// send Cancelation mail to user
const sendDeleteMail = (email, name) => {
    sgmail.send({
        to : email,
        from : 'abhishah0196@gmail.com',
        subject : 'You Deleted Your Account!!',
        text : `Hello ${name}!. You recently deleted your account. I hope you like my Task App and Thank you for using it. Have a nice day ${name}!! `
    })
}
module.exports = {
    sendWelcomeMail,
    sendDeleteMail
}
// sgmail.send({
//     to:'shahpramit25@gmail.com',
//     from:'abhishah0196@gmail.com',
//     subject:'First Sendgrid mail',
//     text:'Hii! My name is Ansh Shah'
// })