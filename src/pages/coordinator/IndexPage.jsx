import React, { useEffect, useState } from 'react';
import GeneralLayout from '../../components/general/GeneralLayout';
import placeholderImage from '/assets/placeholder.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    const [searchQuery, setSearchQuery] = useState('');
    const userFaculty = localStorage.getItem('facultyName');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(5);
    const fetchArticles = async () => {
        setIsLoading(true);
        try {

            const response = await axios.get(`https://localhost:7002/api/Contributions/faculty/${userFaculty}`);
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
        navigate(`/coordinator/articleDetails/${formattedTitle}`);
    };
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = pageNumber => setCurrentPage(pageNumber);

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

                        <select className="border-2 border-gray-300 bg-white h-10 rounded-lg text-sm focus:outline-none" onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option>All Statuses</option>
                            <option>Submitted</option>
                            <option>Refer</option>
                            <option>Selected</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white ">
                    <ul className="space-y-4 py-4">
                        {currentArticles.map((article) => (
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
                                    <p className="text-sm">Upload date: {article.submissionDate}</p>
                                    <p className="text-sm">Status: {article.status}</p>
                                    <p className="text-sm">Author: {article.firstName} {article.lastName}</p>
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

