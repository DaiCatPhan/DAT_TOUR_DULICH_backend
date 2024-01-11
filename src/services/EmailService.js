const nodemailer = require("nodemailer");

const sendSimpleEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILER,
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: 'Hoi Dan IT , "<phandaicat12032002@gmail.com>"',
    to: "phancat12032002@gmail.com",
    subject: "Thông tin đặt tour du lịch", // tên của email

    html: "<b>Xin chào bạn</b>",
  });
};

export default { sendSimpleEmail };
