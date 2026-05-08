const listSkin = [
  {
    image: "https://ik.imagekit.io/SchwanzML13/20260507_221604.jpg",
    date: "08 Mei 2026",
    title: "Akai Luckybox Revamp",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=abc123",
    replaceItems: [
      { name: "Default", desc: "", downloadUrl: "https://sfl.gl/w6LWKW" },
      { name: "Elite", desc: "", downloadUrl: "https://sfl.gl/36TXawVI" }
    ]
  },
  {
    image: "https://picsum.photos/id/155/200/100",
    date: "18 Apr 2026",
    title: "Tes",
    videoUrl: "https://www.youtube.com/embed/6EiR_XF7Gqw?si=def456",
    replaceItems: [
      { name: "Default", desc: "", downloadUrl: "#" },
      { name: "Basic", desc: "", downloadUrl: "#" },
      { name: "Elite", desc: "", downloadUrl: "#" }
    ]
  },
  {
  image: "https://ik.imagekit.io/SchwanzML13/maxresdefault.jpg",
  date: "29 Apr 2026",
  title: "Aulus Special Revamp",
  videoUrl: "https://www.youtube.com/embed/cr7k4YBK_PQ",  // ← ubah ini
  replaceItems: [
    { name: "Default", desc: "", downloadUrl: "https://sfl.gl/z7Nu" },
    { name: "Basic", desc: "", downloadUrl: "https://sfl.gl/W0nC35" }
  ]
},
  {
    image: "https://picsum.photos/id/210/200/100",
    date: "26 Apr 2026",
    title: "Tes",
    videoUrl: "https://www.youtube.com/embed/4kM7iDOVtNI?si=jkl012",
    replaceItems: [
      { name: "Default", desc: "", downloadUrl: "#" },
      { name: "Basic", desc: "", downloadUrl: "#" },
      { name: "Epic", desc: "", downloadUrl: "#" },
      { name: "Legend", desc: "", downloadUrl: "#" }
    ]
  }
];

// Fungsi untuk parsing tanggal (format: "DD Mmm YYYY")
function parseDate(dateStr) {
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
    Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11
  };

  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const [day, monthStr, year] = parts;
    return new Date(year, months[monthStr], day);
  }
  return new Date(0);
}

// Fungsi escape HTML (didefinisikan di awal)
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Fungsi untuk generate tabel replace & download (Tanpa ikon dan kolom deskripsi)
function generateReplaceTable(replaceItems) {
  if (!replaceItems || replaceItems.length === 0) {
    return `
      <div style="margin-top: 1.8rem; text-align: center; padding: 1rem; background: rgba(0,0,0,0.03); border-radius: 1rem;">
        <i class="fas fa-info-circle"></i> Tidak ada opsi replace untuk skin ini.
      </div>
    `;
  }

  let tableRows = '';
  for (let i = 0; i < replaceItems.length; i++) {
    const item = replaceItems[i];
    tableRows += `
      <tr>
        <th>${escapeHtml(item.name)}</th>
        <td style="text-align: right;">
          <button class="btn-download-skin" data-skin-type="${escapeHtml(item.name)}" data-download-url="${escapeHtml(item.downloadUrl)}">
            <i class="fas fa-download"></i> Download
          </button>
        </td>
      </tr>
    `;
  }

  return `
    <div style="margin-top: 1.8rem; background: rgba(0,0,0,0.02); border-radius: 1.2rem; padding: 0.8rem 0.2rem;">
      <table class="replace-table">
        ${tableRows}
      </table>
    </div>
  `;
}

// Fungsi setup tombol download
function setupDownloadButtons() {
  const btns = document.querySelectorAll('.btn-download-skin');
  btns.forEach(btn => {
    // Hapus event listener lama untuk menghindari duplikasi
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const type = this.getAttribute('data-skin-type');
      const downloadUrl = this.getAttribute('data-download-url');
      
      if (downloadUrl && downloadUrl !== '#') {
        window.open(downloadUrl, '_blank');
      } else {
        alert(`🚀 Fitur download untuk skin tipe "${type}" akan segera hadir!`);
      }
    });
  });
}

// Fungsi untuk mendapatkan skin berdasarkan ID
function getSkinById(id) {
  const idx = parseInt(id);
  if (!isNaN(idx) && listSkin[idx]) {
    return listSkin[idx];
  }
  return null;
}

// Fungsi untuk menampilkan detail skin (khusus halaman detail-skin.html)
function displaySkinDetailFromGlobal() {
  // Cek apakah kita berada di halaman detail-skin.html
  if (!window.location.pathname.includes('detail-skin.html')) {
    return;
  }

  const dynamicContainer = document.getElementById('dynamicDetailContent');
  if (!dynamicContainer) {
    // Jika container belum ada, tunggu sebentar
    setTimeout(displaySkinDetailFromGlobal, 100);
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  let title = urlParams.get('title');
  let date = urlParams.get('date');
  let videoUrl = urlParams.get('video');
  let id = urlParams.get('id');
  let replaceItemsParam = urlParams.get('replace');

  let replaceItems = [];

  // Parse replaceItems dari URL jika ada
  if (replaceItemsParam && replaceItemsParam !== '[]' && replaceItemsParam !== '%5B%5D') {
    try {
      const decoded = decodeURIComponent(replaceItemsParam);
      replaceItems = JSON.parse(decoded);
      console.log('Replace items from URL:', replaceItems);
    } catch(e) {
      console.error('Error parsing replaceItems from URL:', e);
      replaceItems = [];
    }
  }

  // Jika tidak ada parameter URL, coba ambil dari sessionStorage
  if (!title && !id) {
    try {
      const storedSkin = sessionStorage.getItem('selectedSkin');
      if (storedSkin) {
        const skinObj = JSON.parse(storedSkin);
        title = skinObj.title;
        date = skinObj.date;
        videoUrl = skinObj.videoUrl;
        replaceItems = skinObj.replaceItems || [];
        console.log('Data from sessionStorage:', skinObj);
      }
    } catch(e) {
      console.error('Error reading sessionStorage:', e);
    }
  }

  // Jika masih tidak ada, coba cari dari listSkin berdasarkan ID
  if ((!title || !date) && id !== null) {
    const skin = getSkinById(id);
    if (skin) {
      title = title || skin.title;
      date = date || skin.date;
      videoUrl = videoUrl || skin.videoUrl;
      if (replaceItems.length === 0) {
        replaceItems = skin.replaceItems || [];
      }
      console.log('Data from listSkin by ID:', skin);
    }
  }

  // Tampilkan konten
  if (!title) {
    dynamicContainer.innerHTML = `
      <div class="detail-card">
        <div class="no-data">
          <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
          <strong>Tidak ada data skin yang dipilih</strong><br>
          <span style="font-size: 0.8rem;">Silakan klik kartu skin dari halaman utama.</span>
        </div>
      </div>
    `;
    return;
  }

  // Pastikan videoUrl ada
  if (!videoUrl) {
    videoUrl = 'https://www.youtube.com/embed/0tOXxuLfT5I';
  }

  // Pastikan date ada
  if (!date) {
    date = 'Tanggal tidak tersedia';
  }

  // Pastikan replaceItems adalah array
  if (!replaceItems || !Array.isArray(replaceItems)) {
    replaceItems = [];
  }

  console.log('Rendering detail with:', { title, date, videoUrl, replaceItems });

  const youtubeEmbed = `
    <div class="youtube-wrapper">
      <iframe src="${videoUrl}" title="YouTube video player - ${escapeHtml(title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
  `;

  const downloadTable = generateReplaceTable(replaceItems);

  const htmlContent = `
    <div class="detail-card">
      <h1 class="detail-title">${escapeHtml(title)}</h1>
      <div class="detail-date">
        <i class="far fa-calendar-alt"></i> <span>${escapeHtml(date)}</span>
      </div>
      ${youtubeEmbed}
      ${downloadTable}
      <div style="margin-top: 1rem; text-align: center; font-size: 0.75rem; color: #6f86a3;">
        <i class="fas fa-tag"></i> Koleksi eksklusif Schwans ML
      </div>
    </div>
  `;
  
  dynamicContainer.innerHTML = htmlContent;
  
  // Pasang event listener untuk tombol download setelah konten dimuat
  setupDownloadButtons();
}

// Fungsi untuk render mini card di halaman utama (index.html) - HANYA SEBAGAI CADANGAN
function renderMiniCard() {
  const container = document.querySelector(".dual-box-container");
  if (!container) return;

  // Sorting terbaru dan ambil 10 teratas
  const latest10 = [...listSkin]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 10);

  container.innerHTML = latest10.map((item, index) => {
    const replaceItemsStr = JSON.stringify(item.replaceItems || []);
    return `
    <div class="mini-card" data-id="${index}" data-title="${escapeHtml(item.title)}" data-date="${escapeHtml(item.date)}" data-video="${escapeHtml(item.videoUrl)}" data-replace='${replaceItemsStr}'>
      <img class="mini-card-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
      <div class="mini-card-content">
        <div class="mini-card-date">
          <i class="far fa-calendar-alt"></i> ${escapeHtml(item.date)}
        </div>
        <h4 class="mini-card-title">${escapeHtml(item.title)}</h4>
      </div>
    </div>
  `;
  }).join("");

  // Tambahkan event listener ke setiap mini-card
  document.querySelectorAll('.mini-card').forEach(card => {
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    
    newCard.addEventListener('click', (e) => {
      if (e.target.closest('.mini-card')) {
        const id = newCard.getAttribute('data-id');
        const title = newCard.getAttribute('data-title');
        const date = newCard.getAttribute('data-date');
        const video = newCard.getAttribute('data-video');
        const replaceItemsStr = newCard.getAttribute('data-replace') || '[]';
        
        let replaceItems = [];
        try {
          replaceItems = JSON.parse(replaceItemsStr);
        } catch(e) {
          console.error('Error parsing replaceItems:', e);
          replaceItems = [];
        }
        
        sessionStorage.setItem('selectedSkin', JSON.stringify({
          id: id,
          title: title,
          date: date,
          videoUrl: video,
          replaceItems: replaceItems
        }));
        
        const replaceParam = encodeURIComponent(JSON.stringify(replaceItems));
        window.location.href = `detail-skin.html?title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}&video=${encodeURIComponent(video)}&id=${id}&replace=${replaceParam}`;
      }
    });
  });
}

// Jalankan sesuai halaman
document.addEventListener("DOMContentLoaded", function() {
  console.log('DOM loaded, current path:', window.location.pathname);
  // Cek halaman saat ini
  if (window.location.pathname.includes('detail-skin.html')) {
    console.log('Running displaySkinDetailFromGlobal');
    displaySkinDetailFromGlobal();
  } else if (document.querySelector(".dual-box-container")) {
    console.log('Running renderMiniCard as fallback');
    // Hanya jalankan jika index.html tidak memiliki logika sendiri
    // renderMiniCard(); 
  }
});