import os
from email.message import EmailMessage
import ssl
import smtplib
from dotenv import load_dotenv
load_dotenv()

'''
This code sends an email using SMTP with SSL encryption. It uses the smtplib and ssl libraries to create a secure connection to the Gmail SMTP server. The email is constructed using the EmailMessage class, and the sender's email address and password are retrieved from environment variables. The email is then sent to the specified recipient.
'''

email_sender = "programmingrit0@gmail.com"
email_sender_password = os.getenv("EMAIL_PASSWORD")
email_receiver = "ritesh.231403108@vcet.edu.in"

subject = "Test Email"
body = """
This is a test email sent from Python.
"""

em = EmailMessage()
em["From"] = email_sender
em["To"] = email_receiver
em["Subject"] = subject
em.set_content(body)

context = ssl.create_default_context()

with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
    smtp.login(email_sender, email_sender_password)
    smtp.sendmail(email_sender, email_receiver, em.as_string())
 