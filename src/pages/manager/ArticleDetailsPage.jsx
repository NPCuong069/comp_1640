import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import "./articleDetails.css";
import ArticleDropdown from './ArticleDropdown';
import GeneralLayout from '../../components/general/GeneralLayout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2,FiEdit ,FiUser } from 'react-icons/fi';
function StudentArticleDetails() {
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const { title } = useParams();
    const [article, setArticle] = useState(null);
    const [showAddCommentModal, setShowAddCommentModal] = useState(false);
    const [show, setShow] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newCommentName, setNewCommentName] = useState('');
    const [newStatus, setNewStatus] = useState('');
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        } else {
            return text;
        }
    }
    const handleAddComment = async () => {
        if (!newComment.trim() || !newStatus) {
            alert("Please fill in the comment and select a status.");
            return;
        }

        const formDataForComment = new FormData();
        formDataForComment.append('CommentName', newCommentName); // You might want to dynamically set or omit this field
        formDataForComment.append('ContributionName', title);
        formDataForComment.append('UserName', '92176099_3'); // Replace this with the actual username
        formDataForComment.append('Content', newComment);

        try {
            // First API call: Add new comment
            await axios.post('https://localhost:7002/api/Comments/add-new-comment', formDataForComment, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Second API call: Update contribution status
            const formDataForStatus = new FormData();
            formDataForStatus.append('contributionName', title);
            await axios.post(`https://localhost:7002/api/Contributions/change-contribution-status?status=${newStatus}`, formDataForStatus, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Comment added and status updated successfully');
            // Close the modal and clear the fields after successful submission
            setShowAddCommentModal(false);
            setNewComment('');
            setNewStatus('');
            window.location.reload();
            // Optionally, refresh the article and comments to show the newly added comment
            // and the updated status
        } catch (error) {
            console.error('Failed to add comment or update status', error);
            alert('Failed to add comment or update status');
        }
    };
    // const AddCommentModal = ({ onClose, newCommentName, setNewCommentName, newComment, setNewComment, newStatus, setNewStatus, handleAddComment }) => (
    //     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    //         <div className="bg-white p-4 rounded-lg max-w-md w-full space-y-4">
    //             <input
    //                 className="w-full p-2 border rounded"
    //                 placeholder="Enter your comment name"
    //                 value={newCommentName}
    //                 onChange={(e) => setNewCommentName(e.target.value)}
    //             />
    //             <textarea
    //                 className="w-full p-2 border rounded"
    //                 placeholder="Enter your comment content"
    //                 value={newComment}
    //                 onChange={(e) => setNewComment(e.target.value)}
    //             />
    //             <select
    //                 className="w-full p-2 border rounded"
    //                 value={newStatus}
    //                 onChange={(e) => setNewStatus(e.target.value)}
    //             >
    //                 <option value="">Select Status</option>
    //                 <option value="Refer">Refer</option>
    //                 <option value="Selected">Selected</option>
    //             </select>
    //             <div className="flex justify-end space-x-2">
    //                 <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
    //                 <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddComment}>Add Comment</button>
    //             </div>
    //         </div>
    //     </div>
    // );
    useEffect(() => {
        async function fetchArticle() {
            try {
                const encodedTitle = encodeURIComponent(title);
                // Fetch the contribution first
                const response = await axios.get(`https://localhost:7002/api/Contributions/contribution/${encodedTitle}`);
                const articleData = response.data;
                setArticle(articleData);
                
                // Now we have the contributionId, we can fetch the comments
                if (articleData && articleData.contributionId) {
                    const commentsResponse = await axios.get(`https://localhost:7002/api/Comments/get-comment-list/${articleData.contributionId}`, {
                        headers: {
                            'accept': 'text/plain'
                        }
                    });
                    setComments(commentsResponse.data);
                }
            } catch (error) {
                console.error("Failed to fetch article details", error);
            }
        }
        
        fetchArticle();
    }, [title]);
    function CommentItem({ comment }) {
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };
        return (
            <div className="flex justify-between items-center p-2 hover:bg-gray-200 cursor-pointer" onClick={() => setSelectedComment(comment)}>
                <div>
                    <p>{comment.commentName}</p>
                </div>
                <span className="text-sm text-gray-500">{formatDate(comment.commentDate)}</span>
                <button onClick={() => onRemove(comment.id)} className="text-red-500 hover:text-red-700">
                    <IoIosRemove />
                </button>
            </div>
        );
    }
    function CommentModal({ comment, onClose }) {
        if (!comment) return null;
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold">{comment.commentDate}</h2>
                    <p className="mt-2">{comment.commentName}</p>
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
                    <h1 className=' bg-gray-300 p-2 text-3xl flex items-center gap-2 justify-between'> <div className='flex items-center'><button className='text-5xl' onClick={(e) => setShow(!show)}>{show ? <IoMdArrowDropdown className='' /> : <IoMdArrowDropright className='' />}</button> Files and Comment</div> <p className='text-xl text-red-500'>
                        {comments.length > 0 ? `${comments.length} comments` : "*Currently no comments"}</p>  </h1>
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
                                    <button onClick={() => setShowAddCommentModal(true)} className="ml-2">
                                        <IoIosAdd className="inline" />
                                    </button>
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
                </div>
                {selectedComment && <CommentModal comment={selectedComment} onClose={() => setSelectedComment(null)} />}
                {showAddCommentModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-lg max-w-md w-full space-y-4">
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Enter your comment name"
                                value={newCommentName}
                                onChange={(e) => setNewCommentName(e.target.value)}
                            />
                            <textarea
                                className="w-full p-2 border rounded"
                                placeholder="Enter your comment content"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowAddCommentModal(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddComment}>Add Comment</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </GeneralLayout>
    );
}

export default StudentArticleDetails;
