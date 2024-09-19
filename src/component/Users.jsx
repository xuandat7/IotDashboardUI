import React from "react";
import "./Users.css";

import userPic from "../images/user_pic.jpg";
import baoCao from "../images/baocao.pdf"

function Users() {
  // Sample user data
  const user = {
    name: "Trần Xuân Đạt",
    email: "xuandattran2003@gmail.com",
    classTC: "D21CNPM04",
    id: "B21DCCN223",
    nhomMH: "Lớp IoT và Ứng dụng - Nhóm 5",
    imageUrl: userPic, // Placeholder image, replace with actual 4x6 image
    linkSwagger: "http://localhost:3001/api",
    linkGitHubUI: "https://github.com/xuandat7/IotDashboardUI",
    linkGitHubAPI: "https://github.com/xuandat7/IotDashboardAPI",
    FilePDF: baoCao,
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
                  <td><strong>Link GitHub UI:</strong></td>
                  <td> <a href='https://github.com/xuandat7/IotDashboardUI'>{user.linkGitHubUI}</a></td>
                </tr>
                <tr>
                  <td><strong>Link GitHub API:</strong></td>
                  <td> <a href='https://github.com/xuandat7/IotDashboardAPI'>{user.linkGitHubAPI}</a></td>
                </tr>
                <tr>
                  <td><strong>Link Swagger:</strong></td>
                  <td><a href='http://localhost:3001/api'>{user.linkSwagger}</a></td>
                </tr>
                <tr>
                  <td><strong>Link PDF:</strong></td>
                  <td> <a href='https://docs.google.com/document/d/1UgOaSPJ6i5U0EmzR9gTwwyEIhSOVqWBNZPdmj2soUdc/edit'>link pdf</a></td>
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
