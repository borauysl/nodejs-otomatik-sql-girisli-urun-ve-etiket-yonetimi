uygulamamızın kullandığı sql tablosu :
 CREATE TABLE etiket ( etiketID int NOT NULL AUTO_INCREMENT, urunBarkod varchar(45) DEFAULT NULL, urunIsim varchar(45) DEFAULT NULL, urunFiyat decimal(18,2) DEFAULT NULL, urunTur varchar(45) DEFAULT NULL, etiketIP varchar(45) DEFAULT NULL, PRIMARY KEY (etiketID) ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

uygulamamız algoritma içerisinde sql giriş bağlantısı belirtildiği için tek html sayfasından oluşuyor bu sayfa kullanıcıya apiconsumerdan veritabanımıza çektiğimiz verilerin görüntülenmesi ve CRUD işlemlerinin yapılmasını sağlanmaktadır.

dashboard çıktısı :

![image](https://github.com/user-attachments/assets/47bade19-3174-48c2-89dd-9ff559ca2b2f)


uygulamamızda değiştirebilen ve eklenen değerler arasında sadece urunBarkod, urunTur ve etiketIP değerleri vardır. bunun sebebi etiketID pk olduğu için auto increment olarak çalışmaktadır bu sayede otomatik şekilde eklenen etiketlere id değeri verilmektedir. urunFiyat ve urunIsim değerleri de urunBarkod değeri sayesinde api consumer tarafından atanmaktadır veya değiştirildi ise güncellenmesini sağlamaktadır.

localhost üzerinde çalıştırabilmek için vsc terminaline 
node app.js yazmanız yeterli olacaktır.
