import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import './ReadingPage.css'; // Assuming your CSS file is named ReadingPage.css
import GeneralLayout from '../../components/general/GeneralLayout';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useParams } from 'react-router-dom';
import "react-pdf/dist/esm/Page/TextLayer.css";
import { FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { IoMdDownload } from "react-icons/io";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReadingPage = () => {
    const [numPages, setNumPages] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [articleInfo, setArticleInfo] = useState({});
    const [containerWidth, setContainerWidth] = useState(null);
    const [articles, setArticles] = useState([]);
    const containerRef = useRef(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const { title } = useParams();
    useEffect(() => {
        const encodedTitle = encodeURIComponent(title);

        const fetchArticleDetails = async () => {
            try {
                // Fetch the current article information
                const articleResponse = await axios.get(`https://localhost:7002/api/Contributions/contribution/${encodedTitle}`);
                setArticleInfo(articleResponse.data);

                // Fetch the PDF file for the current article
                const pdfResponse = await axios.get(`https://localhost:7002/api/Contributions/DownloadFile?title=${encodedTitle}`, {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/pdf'
                    }
                });
                setPdfFile(URL.createObjectURL(pdfResponse.data));

                // Fetch related articles using the faculty name from the current article
                if (articleResponse.data && articleResponse.data.facultyName) {
                    const facultyName = articleResponse.data.facultyName;
                    const relatedArticlesResponse = await axios.get(`https://localhost:7002/api/Contributions/faculty/${facultyName}`);
                    const fetchedArticles = relatedArticlesResponse.data.filter(article => article.status === 'Selected');

                    const updatedArticles = await Promise.all(fetchedArticles.map(async (article) => {
                        try {
                            const imageUrl = `https://localhost:7002/api/Contributions/DownloadImageFile?title=${encodeURIComponent(article.title)}`;
                            return { ...article, imageUrl };
                        } catch (error) {
                            console.error('Error fetching image for article:', article.title, error);
                            return { ...article, imageUrl: null }; // or a placeholder image URL
                        }
                    }));

                    const filteredArticles = updatedArticles.filter(article => encodeURIComponent(article.title) !== encodedTitle);
                    setArticles(filteredArticles);
                }
            } catch (error) {
                console.error('Error fetching article details and related content:', error);
            }
        };

        fetchArticleDetails();
    }, [title]); 

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const downloadFile = async () => {
        try {
            const encodedTitle = encodeURIComponent(title);
            // Replace 'Test article' with the actual title or identifier for the article
            const response = await fetch(`https://localhost:7002/api/Contributions/DownloadFile?title=${encodedTitle}`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "downloaded-file"; // You can also get the filename from Content-Disposition header
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    return (
        <GeneralLayout>
            <div className="px-4 sm:px-6 lg:px-8 py-4 min-h-screen flex justify-between">
                <div className="fixed top-80 left-0 ml-[calc(50%-650px)] h-screen overflow-auto z-10"> {/* Adjust spacing and margin */}
                    {/* Replace these buttons with actual icons */}
                    <div className="mb-2 ml-1">
                        <FacebookShareButton url={shareUrl}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                    </div>
                    <div className="mb-2 ml-1">
                        <TwitterShareButton url={shareUrl}>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </div>
                    <div className="mb-2 ml-1">
                        <LinkedinShareButton url={shareUrl}>
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                    </div>
                    <button onClick={downloadFile} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg mb-2"><IoMdDownload /></button>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg mb-2">←</button>
                    {/* ... more buttons */}
                </div>
                <div className="flex-grow " ref={containerRef}>
                    <div className="articleInfo">
                        <h2 className='bg-gray-200 py-4 px-1 text-3xl font-bold font-serif mb-4 text-justify'>{articleInfo.title}</h2>
                        <p className='text-justify	italic mb-4'>{articleInfo.description}</p>
                        <p className='font-light py-2 font-sans text-sm'>By: {articleInfo.userName} • {new Date(articleInfo.submissionDate).toLocaleDateString()}</p>
                    </div>
                    <div className="pdfViewer">
                        {pdfFile && (
                            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} rerenderTextLayer={false} renderAnnotationLayer={false}>
                                {Array.from(new Array(numPages), (el, index) => (
                                    <Page key={`page_${index + 1}`} pageNumber={index + 1} width={containerWidth ? containerWidth : undefined} />
                                ))}
                            </Document>
                        )}
                    </div>
                </div>
                <div className="w-60 md:w-60 lg:w-60 flex-none overflow-auto px-1">
                    {/* Right sidebar content goes here */}
                    <div className='mx-4 pt-4 font-bold border-t-2 border-black'>
                        <p className='font-bold'>Related article</p>
                    </div>
                    {articles.slice(1, 5).map((article) => (
                        <div key={article.id} className="p-4 flex items-start space-x-4">
                            <div className="flex-shrink-0" style={{ width: '80px', height: '80px' }}> {/* Ensure the image container does not shrink */}
                                <img src={article.imageUrl} alt="Contribution" className="w-full h-full object-contain rounded-lg" />
                            </div>
                            <div className="flex-grow">
                                <a href={`/articles/${article.id}`} className="block">{article.title}</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </GeneralLayout>

    );
};

export default ReadingPage;
