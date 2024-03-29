export default function (username: string, key: string) {
  const link = `${process.env.CLIENT_URL}/reset/${key}`;
  return `
    <html>
    <head>
      <title></title>
    </head>
    <body>
      <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
        
        Hi ${username}, You are recieving this email to reset your password on fasoner.party. 
        If you did not request this, please disregard this email.<br><br>
        
        Reset your account password by followin this link <a clicktracking="off" href=${link}>${link}</a>
        The link will expire in one hour.
      </div>
    </body>
  </html>
  `
}
