import React, { useEffect, useState } from 'react';
import GeneralLayout from '../../components/general/GeneralLayout';
import placeholderImage from '/assets/placeholder.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const handleDownloadAllSelected = async () => {
    try {
        const response = await fetch('https://localhost:7002/api/Contributions/download-all-selected');

        if (!response.ok) {
            // Handle HTTP errors
            throw new Error('Network response was not ok.');
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        if (response.status === 200 && contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
            // Assume it's a file to download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = contentDisposition.split('filename=')[1] || 'download.zip';
            a.setAttribute('download', filename.replace(/['"]/g, ''));
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            // If it's not an attachment or file, handle other responses
            const errorData = await response.text();  // Assuming error data might be in plain text
            alert(`Server responded with an error: ${errorData}`);
        }
    } catch (error) {
        console.error('Failed to download file:', error);
        alert('Failed to download file.');
    }
};


function formatDateOnly(dateStr) {
    return new Date(dateStr).toLocaleDateString();
}
const DownloadLink = ({ title, children }) => {
    const url = `https://localhost:7002/api/Contributions/DownloadFile?title=${encodeURIComponent(title)}`;
    const handleClick = (event) => {
        event.stopPropagation(); // This stops the event from propagating to parent elements
    };
    return (
        <a
            href={url}
            download
            className=""
            style={{ textDecoration: 'none', color: 'gray' }}
            onClick={handleClick}
        >
            {children}
        </a>
    );
};
function truncateTextByCharacters(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
}
const IndexPage = () => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(5);
    const downloadUrl = 'https://localhost:7002/api/Contributions/download-all-selected';
    const [termEnded, setTermEnded] = useState(false);


    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://localhost:7002/api/Contributions/get-all-selected-contributions');
            const fetchedArticles = response.data.filter(article =>
                selectedStatus === 'All Statuses' || article.status === selectedStatus || selectedStatus === '' &&
                article.title.toLowerCase().includes(searchQuery.toLowerCase()));
            // Fetch image URLs for each article and update the article objects
            const updatedArticles = await Promise.all(
                fetchedArticles.map(async (article) => {
                    try {
                        const imageResponse = await axios.get(`https://localhost:7002/api/Contributions/DownloadImageFile?title=${encodeURIComponent(article.title)}`, { responseType: 'blob' });
                        const imageUrl = URL.createObjectURL(imageResponse.data);
                        console.log(imageUrl);
                        return { ...article, imageUrl };
                    } catch (error) {
                        console.error('Error fetching image for article:', article.title, error);
                        return { ...article, imageUrl: null }; // or a placeholder image URL
                    }
                })
            );
            setArticles(updatedArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {

        const fetchAcademicTerms = async () => {
            const response = await axios.get('https://localhost:7002/api/AcademicTerms');
            const terms = response.data;
            const today = new Date();
            // Check if any academic term has ended
            const hasEndedTerm = terms.some(term => new Date(term.finalClosure) < today);
            setTermEnded(hasEndedTerm);
        };

        fetchAcademicTerms();
        fetchArticles();
    }, [selectedStatus, searchQuery]);

    const handleArticleClick = (title) => {
        const formattedTitle = encodeURIComponent(title);
        navigate(`/manager/articleDetails/${formattedTitle}`);
    };


    const paginate = pageNumber => setCurrentPage(pageNumber);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(articles.length / articlesPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <GeneralLayout>
            <div className="bg-white p-4 shadow-md rounded-lg">

                <div className="flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-auto mb-2 md:mb-0">

                        <select className="border-2 border-gray-300 bg-white h-10 rounded-lg px-2 text-sm focus:outline-none">
                            <option>Title</option>

                        </select>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
                            className="border-2 border-gray-300 bg-white h-10 flex-grow px-44 rounded-lg text-sm focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                    {termEnded ? (
                            <a href={downloadUrl} download="SelectedContributions.zip" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                                Download All Published Articles
                            </a>
                        ) : (
                            <span>Currently, there are no ended academic terms.</span>
                        )}
                    </div>
                </div>
                <div className="bg-white ">
                    <ul className="space-y-4 py-4">
                        {currentArticles.reverse().map((article) => (
                            <li key={article.id} className="border-2 p-4 flex justify-between items-start space-x-4" onClick={() => handleArticleClick(article.title)}>
                                <img src={article.imageUrl || placeholderImage} alt="Contribution" className="w-20 h-20 object-cover rounded-lg" style={{ maxHeight: '100px' }} />
                                <div className="flex-grow" >
                                    <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                                    <div className="description" >
                                        {/* Use the truncateTextByCharacters function here */}
                                        <p>{truncateTextByCharacters(article.description, 200)}</p>
                                    </div>
                                    <DownloadLink title={article.title}>Download</DownloadLink>
                                </div>
                                <div className="text-right self-start">
                                    <p className="text-sm">Upload date: {formatDateOnly(article.submissionDate)}</p>
                                    <p className="text-sm">Author: {article.userName}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-end">
                    <div className="flex rounded-md">
                        {pageNumbers.map(number => (
                            <a key={number} onClick={() => paginate(number)} className={`py-2 px-4 leading-tight border ${currentPage === number ? 'bg-black text-white' : 'border-gray-400 hover:bg-gray-100'}`}>
                                {number}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </GeneralLayout>
    );
};

export default IndexPage;

