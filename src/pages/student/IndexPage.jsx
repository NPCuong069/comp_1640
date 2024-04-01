import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GeneralLayout from '../../components/general/GeneralLayout';
import { IoIosArrowDown } from "react-icons/io";
function App() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const filteredArticles = articles
    .filter(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(article => statusFilter ? article.status === statusFilter : true);
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get('https://localhost:7002/api/Contributions/get-all-contributions');
        setArticles(response.data);
      } catch (error) {
        console.error('Failed to fetch contributions:', error);
      }
    };

    fetchContributions();
  }, []);
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  }
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <GeneralLayout>
      <h1 className="text-2xl font-bold mb-4">Your Articles</h1>

      <div className="flex mb-4 space-x-2">
        <input className="border p-2 flex-grow" type="text" placeholder="Search by titles" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />

        <div className="flex space-x-2">
          <div className="flex space-x-2 items-center">
            <select
              className="border border-gray-300 rounded-lg text-gray-700 h-10 pl-3 pr-3 bg-white hover:border-gray-400 focus:outline-none appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses<IoIosArrowDown className='' /></option>
              <option value="Submitted">Submitted</option>
              <option value="Commented">Commented</option>
            </select>
          </div>
          <label className="flex items-center text-gray-700">
            Sort by
            <select className="border border-gray-300 ml-2 rounded-lg text-gray-700 h-10 pl-3 pr-6 bg-white hover:border-gray-400 focus:outline-none appearance-none">
              <option>Default</option>
            </select>
          </label>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        {currentArticles.map((article) => (
          <Link to={`/student/articleDetails/${encodeURIComponent(article.title)}`}>
            <div key={article.id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <h2 className="font-semibold mb-2">{article.title}</h2>
              <p className="mb-2">{truncateText(article.description, 140)}</p>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Upload date: {article.uploadDate}</span>
                <span>Status: {article.status}</span>
              </div>
            </div>
          </Link>
        ))}

      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

    </GeneralLayout>
  );
}

export default App;