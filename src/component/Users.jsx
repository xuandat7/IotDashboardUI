import React from "react";
import "./Users.css";

import userPic from "../images/user_pic.jpg";

function Users() {
  // Sample user data
  const user = {
    name: "Trần Xuân Đạt",
    email: "xuandattran2003@gmail.com",
    classTC: "D21CNPM04",
    id: "B21DCCN223",
    nhomMH: "Lớp IoT và Ứng dụng - Nhóm 5",
    imageUrl: userPic, // Placeholder image, replace with actual 4x6 image
    linkGitHub: "https://github.com/xuandat7/IotDashboardUI"
    
  };

  return (
    <main id="main" className="main">
      <section className="user-section">
        <div className="user-card">
          <img src={user.imageUrl} alt={`${user.name}`} className="user-image" />
          <div className="user-info">
            <h2>{user.name}</h2>
            <hr className="separator" /> {/* Separating line */}
            <table className="user-details">
              <tbody>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td><strong>Lớp tín chỉ:</strong></td>
                  <td>{user.classTC}</td>
                </tr>
                <tr>
                  <td><strong>Mã sinh viên:</strong></td>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <td><strong>Nhóm môn học:</strong></td>
                  <td>{user.nhomMH}</td>
                </tr>
                <tr>
                  <td><strong>Link GitHub:</strong></td>
                  <td> <a href='https://github.com/xuandat7/IotDashboardUI'>{user.linkGitHub}</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Users;
