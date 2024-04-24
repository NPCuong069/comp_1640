import React, { useState, useEffect } from 'react';
import GeneralLayout from '../../components/general/GeneralLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
function GuestHome() {
    const { faculty } = useParams();
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const formatTimeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
    const articlesPerPage = 10; // Number of articles per page
    const facultyName = localStorage.getItem('facultyName');
    const truncateDescription = (text, maxLength) => {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}..`;
        } else {
            return text;
        }
    };

    const handleArticleClick = (title) => {
        navigate(`/guest/readingPage/${encodeURIComponent(title)}`); // Navigate to reading page with the title as a parameter
    };
    useEffect(() => {
        fetch(`https://localhost:7002/api/Contributions/faculty/${facultyName}`, {
            headers: {
                'accept': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                // Filter articles by status "Selected" right after fetching them
                const selectedArticles = data.filter(article => article.status === 'Selected');
                setArticles(selectedArticles.reverse());
            })
            .catch(error => console.error('Error fetching articles:', error));
    }, [faculty]);

    // Filter articles based on search term
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current articles for the current page
    const indexOfLastArticle = (currentPage + 1) * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const changePage = (page) => {
        setCurrentPage(page);
    };

    return (
        <GeneralLayout>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-6">{facultyName} faculty articles</h2>
                <input
                    type="text"
                    placeholder="Search articles"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border rounded"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentArticles.map((article, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden" >
                            <img
                                src={`https://localhost:7002/api/Contributions/DownloadImageFile?title=${encodeURIComponent(article.title)}`}
                                alt={article.title}
                                className="w-full h-48 object-cover object-center"
                                loading="lazy"
                                onClick={() => handleArticleClick(article.title)}
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold truncate">{article.title}</h3>
                                <p className="text-sm text-gray-600 overflow-ellipsis overflow-hidden h-12">{truncateDescription(article.description, 70)}</p>
                                <div className=" pt-4 pb-2">
                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{formatTimeAgo(article.submissionDate)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pagination flex justify-center mt-6">
                    {Array.from({ length: Math.ceil(filteredArticles.length / articlesPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => changePage(i)}
                            className={`px-4 py-2 m-1 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </GeneralLayout>
    );
}

export default GuestHome;
