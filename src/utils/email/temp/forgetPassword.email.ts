const forgotPasswordTemplate = (
    name: string,
    code: string,
    time: number
): string => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body{
            font-family: Arial, sans-serif;
            background:#f5f5f5;
            padding:40px;
        }

        .container{
            background:white;
            max-width:600px;
            margin:auto;
            border-radius:12px;
            padding:30px;
            box-shadow:0 2px 10px rgba(0,0,0,.1);
        }

        .code{
            font-size:32px;
            font-weight:bold;
            color:#2563eb;
            text-align:center;
            letter-spacing:6px;
            margin:30px 0;
        }

        h1{
            color:#333;
        }

        p{
            color:#666;
            line-height:1.6;
        }

        .warning{
            margin-top:25px;
            padding:15px;
            background:#fff8e1;
            border-left:4px solid #f59e0b;
            color:#92400e;
            border-radius:6px;
        }

        .footer{
            margin-top:30px;
            font-size:13px;
            color:#999;
            text-align:center;
        }
    </style>
</head>

<body>

<div class="container">

<h1>Hello, ${name} 👋</h1>

<p>
We received a request to reset your password.
</p>

<p>
Use the verification code below to continue resetting your password:
</p>

<div class="code">
${code}
</div>

<p>
This verification code will expire in <strong>${time} minutes</strong>.
</p>

<div class="warning">
If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
</div>

<div class="footer">
© ${new Date().getFullYear()} EduLearn. All rights reserved.
</div>

</div>

</body>

</html>
`;

export default forgotPasswordTemplate;