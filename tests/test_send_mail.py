import smtplib
from email.mime.text import MIMEText

def test_send_qq_mail():
    smtp_server = "smtp.qq.com"
    smtp_port = 465
    sender = "334752759@qq.com"
    password = "jreriuwboxmwbjff"

    msg = MIMEText("测试内容")
    msg["Subject"] = "测试"
    msg["From"] = sender
    msg["To"] = "jiandanhai@outlook.com"

    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(sender, password)
        server.sendmail(sender, [msg["To"]], msg.as_string())
        server.quit()
        print("邮件发送成功")
    except Exception as e:
        print("邮件发送失败：", e)
        assert False, f"邮件发送失败: {e}"