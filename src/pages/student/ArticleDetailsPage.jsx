import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import "./articleDetails.css";
import ArticleDropdown from './ArticleDropdown';
import GeneralLayout from '../../components/general/GeneralLayout';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function StudentArticleDetails() {
    const sampleComments = [
        {
            id: 1,
            commentDate: '2023-03-15',
            content: 'This article provides a very insightful perspective on the subject. Well done!'
        },
        {
            id: 2,
            commentDate: '2023-03-16',
            content: 'Interesting read, but I think it misses some crucial points about the topic.'
        },
        {
            id: 3,
            commentDate: '2023-03-17',
            content: 'Great article! I appreciate the depth of research that went into this.'
        },
        {
            id: 4,
            commentDate: '2023-03-18',
            content: 'Could use more examples to illustrate the main points, but overall a solid piece.'
        },
        {
            id: 5,
            commentDate: '2023-03-19',
            content: 'I disagree with some of the arguments made in this article, but it was still an interesting read.'
        },
    ];
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const { title } = useParams();
    const [article, setArticle] = useState(null);
    const [show, setShow] = useState(false);
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        } else {
            return text;
        }
    }
    useEffect(() => {
        async function fetchArticle() {
            try {
                const encodedTitle = encodeURIComponent(title);
                const response = await axios.get(`https://localhost:7002/api/Contributions/contribution/${encodedTitle}`);
                setArticle(response.data);
            } catch (error) {
                console.error("Failed to fetch article details", error);
            }
        }
        fetchArticle();
        setComments(sampleComments);
    }, [title]);
    function CommentItem({ comment }) {
        return (
            <div className="cursor-pointer hover:bg-gray-200 p-2" onClick={() => setSelectedComment(comment)}>
                {truncateText(comment.content, 30)}
                <span className="text-sm pl-2">({comment.commentDate})</span>
            </div>
        );
    }
    function CommentModal({ comment, onClose }) {
        if (!comment) return null;
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold">{comment.commentDate}</h2>
                    <p className="mt-2">{comment.content}</p>
                    <button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
    if (!article) return <div>Loading...</div>;
    return (
        <GeneralLayout>
            <div className='text-lg' >
                <h1 className='bg-gray-200 p-2'>Title: {article.title}</h1>
                <h2 className='mt-3'>Status: {article.status}</h2>
                <h2 className='mt-3'>Faculty: {article.facultyName}</h2>
                <h3 className='mt-3'>Closure date: 12/27/2023</h3> {/* Update this dynamically if possible */}
                <p className='mt-3'>Description: {article.description}</p>
                <h1 className=' mt-5 font-semibold '>Submissions list</h1>
                <div className=' mt-3 grid grid-cols-1 text-xl gap-2'>
                    <h1 className=' bg-gray-300 p-2 text-3xl flex items-center gap-2 justify-between'> <div className='flex items-center'><button className='text-5xl' onClick={(e) => setShow(!show)}>{show ? <IoMdArrowDropdown className='' /> : <IoMdArrowDropright className='' />}</button> Files and Comment</div> <p className='text-xl text-red-500'>*Currently no comment</p>  </h1>
                    {show && <form action="">
                        <table className='w-full  [&>tbody>*:nth-child(odd)]:bg-gray-200 [&>tbody>*:nth-child()]:p-2  '>
                            <tbody className=' p-2'>
                                <tr className=' p-2 mt-2 '>
                                    <td>
                                        Status
                                    </td>
                                    <td>
                                        Selected
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Upload date
                                    </td>
                                    <td>
                                        12/26/2023
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        File submission
                                    </td>
                                    <td className='flex items-center gap-2'>
                                        <a href={`https://localhost:7002/api/Contributions/DownloadFile?title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2'>
                                            <FaFilePdf className='text-red-500' />
                                            {article.fileName}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ verticalAlign: 'top' }}>
                                        Comments
                                    </td>
                                    <td>
                                        <div className="overflow-auto max-h-48 border border-gray-300 rounded-lg">
                                            {comments.length > 0 ? comments.map(comment => (
                                                <CommentItem key={comment.id} comment={comment} />
                                            )) : "Currently no comment."}
                                        </div>
                                        {selectedComment && <CommentModal comment={selectedComment} onClose={() => setSelectedComment(null)} />}
                                    </td>
                                </tr>


                            </tbody>
                        </table>


                    </form>}

                </div>

            </div>
        </GeneralLayout>
    );
}

export default StudentArticleDetails;
