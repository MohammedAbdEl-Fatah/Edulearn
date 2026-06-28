const verifyEmailTemplate = (name: string, code: string, time: number): string => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body{
            font-family:Arial;
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
        }
    </style>
</head>

<body>

<div class="container">

<h1>Hello, ${name} 👋</h1>

<p>
Thank you for registering.
</p>

<p>
Use the following verification code:
</p>

<div class="code">
${code}
</div>

<p>
This code expires in ${time} minutes.
</p>

</div>

</body>

</html>
`;

export default verifyEmailTemplate;