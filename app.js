const http = require('http');
const fs = require('fs');
const mysql = require('mysql2'); // mysql modülü
const url = require('url');
const path = require('path');
const querystring = require('querystring'); 

const connection = mysql.createConnection({  // sql bağlantısı
    host: 'localhost', // sunucu adresi
    user: 'root',   // kullanıcı adı
    password: '1234', // şifre
    database: 'rafetiket' // şema  adı
});

// sunucu oluşturma
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // dashboard sayfası
    if (pathname === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'dashboard.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Sunucu hatası: ' + err.message);
            } else {
                // SQL verilerini tabloya ekleyelim
                connection.query('SELECT * FROM etiket', (err, results) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Veri alınamadı: ' + err.message);
                    } else {
                        let rows = '';
                        results.forEach(row => {
                            rows += `<tr data-id="${row.etiketID}">
                                <td>${row.etiketID}</td>
                                <td>${row.urunBarkod}</td>
                                <td>${row.urunIsim}</td>
                                <td>${row.urunFiyat}</td>
                                <td>${row.urunTur}</td>
                                <td>${row.etiketIP}</td>
                                <td>
                                    <button onclick="edit(${row.etiketID})">Düzenle</button>
                                    <button onclick="deleteRow(${row.etiketID})">Sil</button>
                                </td>
                            </tr>`;
                        });
                        const page = data.toString().replace('{tableRows}', rows);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(page);
                    }
                });
            }
        });
    }
    
    // yeni veri ekleme işlemi
    else if (pathname === '/add' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { urunBarkod, urunTur, etiketIP } = querystring.parse(body);
            connection.query(
                'INSERT INTO etiket (urunBarkod, urunTur, etiketIP) VALUES (?, ?, ?)',
                [urunBarkod, urunTur, etiketIP],
                (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Veri eklenemedi: ' + err.message);
                    } else {
                        res.writeHead(302, { 'Location': '/' });
                        res.end();
                    }
                }
            );
        });
    }
    
    // veri güncelleme işlemi
    else if (pathname === '/edit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { etiketID, urunBarkod, urunTur, etiketIP } = querystring.parse(body);
            connection.query(
                'UPDATE etiket SET urunBarkod = ?, urunTur = ?, etiketIP = ? WHERE etiketID = ?',
                [urunBarkod, urunTur, etiketIP, etiketID],
                (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Veri güncellenemedi: ' + err.message);
                    } else {
                        res.writeHead(302, { 'Location': '/' });
                        res.end();
                    }
                }
            );
        });
    }
    
    // veri silme işlemi
    else if (pathname === '/delete' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { etiketID } = querystring.parse(body);
            connection.query(
                'DELETE FROM etiket WHERE etiketID = ?',
                [etiketID],
                (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Veri silinemedi: ' + err.message);
                    } else {
                        res.writeHead(302, { 'Location': '/' });
                        res.end();
                    }
                }
            );
        });
    }
    
    // statik dosyaları sunma
    else if (pathname.endsWith('.css') || pathname.endsWith('.js')) {
        fs.readFile(path.join(__dirname, pathname), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Dosya bulunamadı: ' + err.message);
            } else {
                const ext = path.extname(pathname).substring(1);
                const mimeTypes = {
                    'css': 'text/css',
                    'js': 'application/javascript',
                };
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
                res.end(data);
            }
        });
    }
    
    // bilinmeyen yollar için 404
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// sunucu portu
server.listen(3000, () => {
    console.log('Sunucu çalışıyor: http://localhost:3000');
});
