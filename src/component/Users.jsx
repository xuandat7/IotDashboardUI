import React from "react";
import "./Users.css";

import userPic from "../images/user_pic.jpg";
import baoCao from "../images/baocao.pdf";

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
    <main id="main" className="user-main">
      <section className="user-section-lg">
        <div className="user-card">
          <img src={user.imageUrl} alt={`${user.name}`} className="user-image" />
          <div className="user-info">
            <h2>{user.name}</h2>
            <hr className="separator" />
            <table className="user-details">
              <tbody>
                <tr>
                  <td>Email:</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>Lớp TC:</td>
                  <td>{user.classTC}</td>
                </tr>
                <tr>
                  <td>MSV:</td>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <td>Lớp MH:</td>
                  <td>{user.nhomMH}</td>
                </tr>
                <tr>
                  <td>GitHub UI:</td>
                  <td>
                    <a href={user.linkGitHubUI} target="_blank" rel="noopener noreferrer">
                      {user.linkGitHubUI}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>GitHub API:</td>
                  <td>
                    <a href={user.linkGitHubAPI} target="_blank" rel="noopener noreferrer">
                      {user.linkGitHubAPI}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Swagger:</td>
                  <td>
                    <a href={user.linkSwagger} target="_blank" rel="noopener noreferrer">
                      {user.linkSwagger}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>PDF:</td>
                  <td>
                    <a href={user.FilePDF} target="_blank" rel="noopener noreferrer">
                      Download PDF
                    </a>
                  </td>
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
