document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
  
    message.textContent = "⏳ Đang đăng nhập...";
    message.style.color = "gray";
  
    try {
      const response = await fetch("https://banhngot.fitlhu.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
  
      const result = await response.json();
  
      if (result.success && result.data && result.data.token) {
        // ✅ Lưu token
        localStorage.setItem("token", result.data.token);
  
        message.textContent = "✅ Đăng nhập thành công! Đang chuyển hướng...";
        message.style.color = "green";
  
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        message.textContent = result.message || "❌ Đăng nhập thất bại!";
        message.style.color = "red";
      }
    } catch (err) {
      console.error("Lỗi:", err);
      message.textContent = "Không thể kết nối đến server!";
      message.style.color = "red";
    }
  });
  // Code cũ giữ nguyên ở trên...

// ✅ Thêm sự kiện chuyển trang đăng ký
document.getElementById("registerBtn").addEventListener("click", () => {
    window.location.href = "register.html";
  });
  
  