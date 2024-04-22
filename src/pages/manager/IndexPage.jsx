import React, { useEffect, useState } from 'react';
import GeneralLayout from '../../components/general/GeneralLayout';
import placeholderImage from '/assets/placeholder.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const handleDownloadAllSelected = async () => {
    try {
        const response = await axios.get('https://localhost:7002/api/Contributions/download-all-selected', {
            responseType: 'blob', // Ensure that the backend sends a blob
        });
        // Check if the response is a blob and not a JSON (which would not have a type like 'application/json')
        if (response.data.type && response.data.type !== 'application/json') {
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'SelectedContributions.zip');
            document.body.appendChild(link);
            console.log("Attempting to download file");
            console.log("Response status:", response.status);
            console.log("Blob URL:", url);
            link.click();
            link.remove(); // Clean up the DOM
            window.URL.revokeObjectURL(url); // Free up memory
        } else {
            // If the response is not a file, assume it's an error in JSON format
            console.error('No file to download, received JSON instead.');
            alert('No recently ended academic terms found.');
        }
    } catch (error) {
        console.error('Failed to download all selected articles:', error);
        alert('No recently ended academic terms found.');
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
                        <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDownloadAllSelected()}>
                            Get All Selected Articles
                        </button>
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

