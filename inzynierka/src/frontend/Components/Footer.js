import React from 'react';
import '../../css/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 . All Rights Reserved.</p>
        <div className="footer-links">
          <a href="./" className="footer-link">Terms of Service</a>
          <a href="./" className="footer-link">Privacy Policy</a>
          <a href="./" className="footer-link">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
