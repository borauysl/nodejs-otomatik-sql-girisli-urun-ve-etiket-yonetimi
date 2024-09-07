let originalRowHtml = {}; // Düzenleme moduna geçmeden önce satır HTML'ini saklamak için

function addRow(event) {
    event.preventDefault();
    const form = document.getElementById('addForm');
    const formData = new FormData(form);

    fetch('/add', {
        method: 'POST',
        body: new URLSearchParams(formData).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(error => console.error('Hata:', error));
}

function edit(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        // Mevcut satır HTML'ini kaydet
        originalRowHtml[id] = row.innerHTML;

        // Satırda düzenleme için bir form oluştur
        const urunBarkod = row.querySelector('td:nth-child(2)').textContent;
        const urunTur = row.querySelector('td:nth-child(5)').textContent;
        const etiketIP = row.querySelector('td:nth-child(6)').textContent;

        const urunIsim = row.querySelector('td:nth-child(3)').textContent;
        const urunFiyat = row.querySelector('td:nth-child(4)').textContent;

        // Düzenleme moduna geç
        row.innerHTML = `
            <td>${id}</td>
            <td><input type="text" value="${urunBarkod}" id="editUrunBarkod-${id}"></td>
            <td>${urunIsim}</td> <!-- İsim statik olarak kalır -->
            <td>${urunFiyat}</td> <!-- Fiyat statik olarak kalır -->
            <td><input type="text" value="${urunTur}" id="editUrunTur-${id}"></td>
            <td><input type="text" value="${etiketIP}" id="editEtiketIP-${id}"></td>
            <td>
                <button onclick="saveEdit(${id})">Kaydet</button>
                <button onclick="cancelEdit(${id})">İptal</button>
            </td>
        `;
    }
}

function saveEdit(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        const urunBarkod = document.getElementById(`editUrunBarkod-${id}`).value;
        const urunTur = document.getElementById(`editUrunTur-${id}`).value;
        const etiketIP = document.getElementById(`editEtiketIP-${id}`).value;

        fetch('/edit', {
            method: 'POST',
            body: new URLSearchParams({
                etiketID: id,
                urunBarkod: urunBarkod,
                urunTur: urunTur,
                etiketIP: etiketIP
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => console.error('Hata:', error));
    }
}

function cancelEdit(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        // Düzenleme sırasında kaydedilen orijinal HTML'i geri yükle
        if (originalRowHtml[id]) {
            row.innerHTML = originalRowHtml[id];
            delete originalRowHtml[id]; // Kullanımdan sonra sil
        } else {
            console.error('Orijinal satır verisi bulunamadı.');
        }
    } else {
        console.error('Satır bulunamadı.');
    }
}

function deleteRow(id) {
    if (confirm('Bu veriyi silmek istediğinizden emin misiniz?')) {
        fetch('/delete', {
            method: 'POST',
            body: new URLSearchParams({ etiketID: id }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => console.error('Hata:', error));
    }
}

// Formlar için olay dinleyicilerini ekleyin
document.getElementById('addForm').addEventListener('submit', addRow);
