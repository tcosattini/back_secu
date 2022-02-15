# mspr_infra-secu_server


Node server for MSPR ESPI test.

DB : Moogoose (Check logins on db.congif.js)

Methods : 
```
createUser (username, email, password)
```



1 => Users's login compare.
 
2 => Send Double auth e-mail with random string

3 => Check if the user is on the directory list

4 => Success login

Start server with (On App directory)
```
node app.js
```





