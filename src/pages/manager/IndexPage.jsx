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
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'SelectedContributions.zip'); // Ensure this name makes sense
        document.body.appendChild(link);
        console.log("Attempting to download file");
        console.log("Response status:", response.status);
        console.log("Blob URL:", url);
        link.click();
        link.remove(); // Clean up the DOM
        window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
        console.error('Failed to download all selected articles:', error);
        alert('There was an error downloading the articles. Please try again.');
    }
};
const downloadUrl = 'https://localhost:7002/api/Contributions/download-all-selected';

const DownloadLink = ({ url, children }) => {
    return (
        <a
            href={url}
            download
            className=""
            style={{ textDecoration: 'none', color: 'gray' }}
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
    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://localhost:7002/api/Contributions/get-all-selected-contributions');
            const fetchedArticles = response.data.filter(article =>
                selectedStatus === '' || article.status === selectedStatus);
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
    }, [selectedStatus]);
    const handleArticleClick = (title) => {
        const formattedTitle = encodeURIComponent(title);
        navigate(`/manager/articleDetails/${formattedTitle}`);
    };
    return (
        <GeneralLayout>
            <div className="bg-white p-4 shadow-md rounded-lg">
                <div className="flex justify-end mb-4">
                    <select className="border-2 border-gray-300 bg-white h-10 rounded-lg text-sm focus:outline-none mr-2">
                        <option>Current year</option>
                    </select>
                    <a href={downloadUrl} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" download="SelectedContributions.zip">
                        Get All Selected Articles
                    </a>
                </div>
                <div className="flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-auto mb-2 md:mb-0">

                        <select className="border-2 border-gray-300 bg-white h-10 rounded-lg px-2 text-sm focus:outline-none">
                            <option>Title</option>

                        </select>
                        <input
                            type="text"
                            placeholder="Search"
                            className="border-2 border-gray-300 bg-white h-10 flex-grow px-44 rounded-lg text-sm focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                        <select className="border-2 border-gray-300 bg-white h-10 rounded-lg text-sm focus:outline-none">
                            <option>Faculty</option>

                        </select>
                        <select className="border-2 border-gray-300 bg-white h-10 rounded-lg text-sm focus:outline-none">
                            <option>Sort by</option>

                        </select>
                        <select className="border-2 border-gray-300 bg-white h-10 rounded-lg text-sm focus:outline-none" onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option>Status</option>
                            <option>Submitted</option>
                            <option>Refer</option>
                            <option>Selected</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white ">
                    <ul className="space-y-4 py-4">
                        {articles.map((article) => (
                            <li key={article.id} className="border-2 p-4 flex justify-between items-start space-x-4" onClick={() => handleArticleClick(article.title)}>
                                <img src={article.imageUrl || placeholderImage} alt="Contribution" className="w-20 h-20 object-cover rounded-lg" style={{ maxHeight: '100px' }} />
                                <div className="flex-grow" >
                                    <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                                    <div className="description" >
                                        {/* Use the truncateTextByCharacters function here */}
                                        <p>{truncateTextByCharacters(article.description, 200)}</p>
                                    </div>
                                    <DownloadLink url="/path-to-your-file">Download</DownloadLink>
                                </div>
                                <div className="text-right self-start">
                                    <p className="text-sm">Upload date: {article.submissionDate}</p>
                                    <p className="text-sm">Status: {article.status}</p>
                                    <p className="text-sm">Author: {article.userName}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-end">
                    <div className="flex rounded-md">
                        <a href="#"
                            className="py-2 px-4 leading-tight bg-black text-white border border-r-0 border-gray-400 rounded-l-md hover:bg-gray-700"
                            aria-label="Previous">
                            1
                        </a>
                        <a href="#" className="py-2 px-4 leading-tight border border-r-0 border-gray-400 hover:bg-gray-100">2</a>
                        <a href="#" className="py-2 px-4 leading-tight border border-r-0 border-gray-400 hover:bg-gray-100">3</a>
                        <a href="#" className="py-2 px-4 leading-tight border border-r-0 border-gray-400 hover:bg-gray-100">4</a>
                        <a href="#" className="py-2 px-4 leading-tight border border-r-0 border-gray-400 hover:bg-gray-100">5</a>
                        <a href="#" className="py-2 px-4 leading-tight border border-gray-400 hover:bg-gray-100">6</a>
                        <span className="py-2 px-4 leading-tight border border-r-0 border-gray-400">...</span>
                        <a href="#"
                            className="py-2 px-4 leading-tight border border-gray-400 rounded-r-md hover:bg-gray-100"
                            aria-label="Next">
                            Next &gt;
                        </a>
                    </div>
                </div>
            </div>
        </GeneralLayout>
    );
};

export default IndexPage;

