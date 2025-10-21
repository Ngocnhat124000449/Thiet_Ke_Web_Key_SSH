// dashboard.js
window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const messageEl = document.getElementById("message");
  
    if (!token) {
      // Không có token -> quay về login
      messageEl.textContent = "Bạn chưa đăng nhập. Chuyển hướng về trang đăng nhập...";
      setTimeout(() => window.location.href = "login.html", 800);
      return;
    }
  
    // Hàm tiện ích để lấy phần tử an toàn
    function el(id) {
      const node = document.getElementById(id);
      if (!node) {
        console.error(`Element with id="${id}" not found in DOM.`);
      }
      return node;
    }
  
    try {
      messageEl.textContent = "⏳ Đang tải thông tin người dùng...";
  
      const resp = await fetch("https://banhngot.fitlhu.com/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
  
      // Kiểm tra status trước khi parse JSON
      if (!resp.ok) {
        // thử parse result để lấy message nếu có
        let errText = `${resp.status} ${resp.statusText}`;
        try {
          const errJson = await resp.json();
          if (errJson && errJson.message) errText = errJson.message;
        } catch (e) { /* ignore */ }
  
        messageEl.textContent = `❌ Lỗi từ server: ${errText}`;
        // Nếu 401 => token sai/hết hạn, remove token
        if (resp.status === 401) {
          localStorage.removeItem("token");
          setTimeout(() => window.location.href = "login.html", 1000);
        }
        return;
      }
  
      const result = await resp.json();
      console.log("Profile API result:", result);
  
      if (!result || !result.success || !result.data) {
        messageEl.textContent = "❌ API trả về dữ liệu không hợp lệ.";
        console.error("Invalid profile payload:", result);
        return;
      }
  
      const user = result.data;
  
      // Gán vào DOM — chỉ gán nếu phần tử tồn tại
      const usernameEl = el("username");
      if (usernameEl) usernameEl.textContent = user.username || "—";
  
      const emailEl = el("email");
      if (emailEl) emailEl.textContent = user.email || "—";
  
      const fullNameEl = el("fullName");
      if (fullNameEl) fullNameEl.textContent = user.full_name || user.fullName || "—";
  
      const createdAtEl = el("createdAt");
      // API có thể trả created_at (snake_case) — cố gắng dùng cả hai
      const createdAtRaw = user.created_at || user.createdAt || null;
      if (createdAtEl) createdAtEl.textContent = createdAtRaw ? new Date(createdAtRaw).toLocaleString("vi-VN") : "—";
  
      const avatarEl = el("avatar");
      if (avatarEl) {
        if (user.avatar) {
          avatarEl.src = user.avatar;
          avatarEl.style.display = "block";
        } else {
          avatarEl.style.display = "none";
        }
      }
  
      messageEl.style.color = "green";
      messageEl.textContent = "✅ Tải thông tin thành công.";
  
    } catch (err) {
      console.error("Lỗi khi gọi API profile:", err);
      messageEl.textContent = "⚠️ Lỗi kết nối tới server hoặc lỗi JS. Kiểm tra console.";
    }
  });
  
  // Đăng xuất
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  } else {
    console.error('Logout button not found (id="logout").');
  }
  