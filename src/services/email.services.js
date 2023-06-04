const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "medicalmanex@gmail.com",
    pass: "ssupizqshqqstyrs",
  },
});

transport
  .verify()
  .then(() => console.log("Connected to email server"))
  .catch((err) => console.log(err));

const sendMail = async (to, subject, text, html) => {
  const from = "medical-manex@gmail.com";
  const msg = { from, to, subject, text, html };
  await transport.sendMail(msg);
};

const sendUserRegistrationInfo = async (user) => {
  try {
    const subject = "Đăng kí tài khoản dịch vụ Medical-ManEx";
    const html = `<p>Xin chào <strong>${user.displayName}</strong>, chúng tôi đã phê duyệt yêu cầu đăng kí tài khoản của bạn</p><p>Dưới đây là thông tin tài khoản của bạn:</p>
    <span>Tài khoản: <strong>${user.username}</strong></span><br/><span>Mật khẩu: <strong>${user.password}</strong></span><br/>
    <p>Vui lòng bảo mật những thông tin trên đề phòng trường hợp kẻ xấu lợi dụng để làm những hành động phi pháp.</p>
    <p>Xin cảm ơn !</p>
    `;
    await sendMail(user.email, subject, "", html);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendUserRegistrationInfo,
};
