import React from 'react';
import "./AddNewPage.css";

function AddNewPage() {
    return (
        <div class=".custom-container">
            <div class="header">
                <div class="header-content">
                    <img src="" alt="Logo" />
                    <div class="header-item">Student001</div>
                    <div class="header-item">Guidelines</div>
                    <div class="header-item">New articles</div>
                    <div class="header-item">My articles</div>
                </div>
            </div>

            {/*------------------------------------------------- */}
            <div class="main-title">Add new article for this year magazine (2023)</div>
            <div class="article-details">
                <div class="closure-date">Closure date: 12/27/2023</div>
                <div class="faculty">Faculty: faculty of science and engineering</div>
            </div>

            {/* ------------------------------------------------ */}
            <div class="customer-container">
                <div class="article-title">Article title</div>
                <div class="article-content">Article content</div>
                <div class="file-submissions">File submissions</div>
                {/* ------------------------------------------------ */}
                <div class="article-wrapper">
                    <div class="article-input">
                        <div class="input-placeholder">Enter your article title</div>
                    </div>
                </div>
                <div class="article-content-input">
                    <div class="content-placeholder">Enter your article content</div>
                </div>
                {/* ------------------------------------------------ */}

                <div class="custom-box">
                    <div class="header-container">
                        <div class="header-item name">Name</div>
                        <div class="header-item size">Size</div>
                        <div class="header-item type">Type</div>
                    </div>

                    <div class="file-info size-first">2 MB</div>
                    <div class="file-info size-second">2 MB</div>
                    <div class="file-info type-first">PDF File</div>
                    <div class="file-info type-second">png File</div>
                    <div class="icon-container">
                    </div>
                    <div class="file-entry first-entry">
                        <div class="file-name">Lorem ipsum dolor sit amet, consectetur adipiscing elit.pdf</div>
                    </div>
                    <div class="file-name second-name">Lorem ipsum dolor sit amet, consectetur adipiscing elit.png</div>
                </div>


                <div class="outer-container">
                    <div class="add-new-button">
                        <div class="add-new-text">ADD NEW</div>
                    </div>
                </div>


                <div class="file-type-container">
                    <div class="file-type-title">Accepted file types:</div>
                    <div class="document-files">Document files:</div>
                    <div class="image-files">Image files:</div>
                    <div class="document-formats">.doc .docx .epub .gdoc .odt .oth .ott .pdf .rtf</div>
                    <div class="image-formats">.jpg .jpeg .png</div>
                </div>


                <div class="button apply">
                    <span>Apply article</span>
                </div>
                <div class="button cancel">
                    <span>Cancel</span>
                </div>
            </div>


            <div class="footer-container">
                <div class="contact-info">Contact Information</div>
                <div class="additional-resources">Additional Resources</div>
                <div class="legal-compliance">Legal and Compliance</div>
                <div class="social-media">Social Media</div>
                <div class="support-email">Support email: abc@gmail.com</div>
                <div class="address">Address: 40 Cong Hoa st, Ho Chi Minh city, Viet Nam</div>
                <div class="about-magazine">About the magazine</div>
                <div class="terms-conditions">Terms and conditions</div>
                <div class="copyright">Copyright Notice: "© 2024 [University Name]. All Rights Reserved." Adjust the year and entity as appropriate.</div>
                <div class="social-icons">
                    <div class="icon"></div>
                    <div class="icon"></div>
                    <div class="icon"></div>
                    <div class="icon"></div>
                </div>
            </div>
        </div>
    );
}

export default AddNewPage;
