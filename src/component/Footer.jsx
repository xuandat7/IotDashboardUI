import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.copyright}>
          <span style={styles.icon}></span>
          © 2024 Tran Xuan Dat. All rights reserved.
        </div>
        <div style={styles.socialIcons}>
          <a href="https://www.instagram.com/sprindat"><FaInstagram style={styles.icon}  /></a>
          <a href="https://www.facebook.com/xdTran1106"><FaFacebook style={styles.icon} /></a>
          
          
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e7e7e7',
    padding: '10px 0',
    fontSize: '10px',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,  // Đảm bảo footer luôn ở trên cùng
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  copyright: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  socialIcons: {
    display: 'flex',
  },
};

export default Footer;