document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const messageEl = document.getElementById("message");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      // Lấy dữ liệu từ form
      const data = {
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        full_name: document.getElementById("full_name").value.trim(),
        avatar: document.getElementById("avatar").value.trim() || "https://example.com/avatar.jpg"
      };
  
      try {
        // Gọi API đăng ký
        const response = await fetch("https://banhngot.fitlhu.com/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
  
        if (result.success) {
          messageEl.style.color = "green";
          messageEl.textContent = result.message || "Đăng ký thành công!";
  
          // Lưu token và chuyển hướng sang dashboard
          localStorage.setItem("token", result.data.token);
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1500);
        } else {
          messageEl.style.color = "red";
          messageEl.textContent = result.message || "Đăng ký thất bại!";
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        messageEl.style.color = "red";
        messageEl.textContent = "Lỗi kết nối đến máy chủ.";
      }
    });
  });
  