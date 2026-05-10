import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  //   host: "smtp.example.com",
  //   port: 587,
  //   secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});


export const sendMail=async (to:string,subject:string,html:string)=>{
 await transporter.sendMail({
    from:`"GroceryGo" <${process.env.EMAIL}>`,
    to:to,
    subject:subject,
    html:html
 })
}
