import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faYoutube, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import "./IndexPage.css";

function StudentIndex() {
    return (
        <div class="page-container">
            {/* -------------------------------------------HEADER------------------------------------------------------------ */}

            <div class="header">
                <div class="header-content">
                    <img src="" alt="Logo" />
                    <div class="header-item">Student001</div>
                    <div class="header-item">Guidelines</div>
                    <div class="header-item">New articles</div>
                    <div class="header-item">My articles</div>
                </div>
            </div>
            <div class="account-menu">
                <div class="menu-item">Account information</div>
                <div class="menu-item">Log out</div>
            </div>
            {/* ------------------------------------------END-HEADER------------------------------------------------------ */}

            {/* ------------------------------------------------------------------------------------------------------- */}
            <div class="article-title">Your articles</div>
            <div class="sorting-container">
                <div class="sorting-label">Sort by</div>
                <div class="sorting-options">
                    <div class="option">Default</div>
                </div>
            </div>
            <div class="status-container">
                <div class="status-option">Status</div>
            </div>
            {/* ------------------------------------------------------------------------------------------------------- */}

            {/* ------------------------------------------------------------------------------------------------------- */}
            <div class="article-container">
                <div class="article">
                    <div class="article-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ligula nibh, blandit a pellentesque et, egestas quis nisi.</div>
                    <div class="article-meta">Upload date:</div>
                    <div class="article-status">Status:</div>
                </div>
                <div class="article">
                    <div class="article-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ligula nibh, blandit a pellentesque et, egestas quis nisi.</div>
                    <div class="article-meta">Upload date:</div>
                    <div class="article-status">Status:</div>
                </div>
                <div class="article">
                    <div class="article-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ligula nibh, blandit a pellentesque et, egestas quis nisi.</div>
                    <div class="article-meta">Upload date:</div>
                    <div class="article-status">Status:</div>
                </div>
            </div>
            {/* ------------------------------------------------------------------------------------------------------- */}

            {/* ---------------------------------------PAGE---------------------------------------------------------------- */}
            <div class="pagination-container">
                <div class="page-number active">1</div>
                <div class="page-number">2</div>
                <div class="page-number">3</div>
                <div class="page-number">4</div>
                <div class="page-number">5</div>
                <div class="page-number">6</div>
                <div class="dots">...</div>
                <div class="next">Next</div>
            </div>
            {/* ---------------------------------------END-PAGE------------------------------------------------------------ */}

            {/* ------------------------------------------FOOTTER------------------------------------------------------------- */}
            <div class="info-section">
                <div class="contact-info">Contact Information</div>
                <div class="additional-resources">Additional Resources</div>
                <div class="legal-compliance">Legal and Compliance</div>
                <div class="social-media">Social Media</div>
                <div class="support-email">Support email: abc@gmail.com</div>
                <div class="address">Address: 40 Cong Hoa st, Ho Chi Minh city, Viet Nam</div>
                <div class="about-the-magazine">About the magazine</div>
                <div class="terms-and-conditions">Terms and conditions</div>
                <div class="copyright-notice">Copyright Notice: "© 2024 [University Name]. All Rights Reserved."</div>
                <div class="social-icons">
                    <div class="icon">
                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faYoutube} />
                        <FontAwesomeIcon icon={faTwitter} />
                        <FontAwesomeIcon icon={faInstagram} />
                    </div>
                </div>
            </div>
            {/* ------------------------------------------END-FOOTER----------------------------------------------------- */}
        </div>
    );
}

export default StudentIndex