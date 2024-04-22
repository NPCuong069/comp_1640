import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import "./articleDetails.css";
import { formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';
import ArticleDropdown from './ArticleDropdown';
import GeneralLayout from '../../components/general/GeneralLayout';
import { FiEdit2, FiEdit, FiUser } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
    const [closureDate, setClosureDate] = useState('');
    const [finalClosureDate, setFinalClosureDate] = useState('');
    const username = localStorage.getItem('username');
    const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
    const ChangeStatusModal = ({ currentStatus, onUpdateStatus, onClose }) => {
        const [selectedStatus, setSelectedStatus] = useState(currentStatus);
        const handleUpdateStatus = () => {
            onUpdateStatus(selectedStatus);
        };
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg max-w-md w-full space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Change Status</h3>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="Refer">Refer</option>
                        <option value="Selected">Selected</option>
                    </select>
                    <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleUpdateStatus}>Update Status</button>
                    </div>
                </div>
            </div>
        );
    };
    const handleUpdateStatus = async (newStatus) => {
        try {
            const formDataForStatus = new FormData();
            formDataForStatus.append('contributionId', '19');
            const response = await axios.post(`https://localhost:7002/api/Contributions/change-contribution-status?status=Refer`, formDataForStatus, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Status updated successfully');
            setShowChangeStatusModal(false);
            setArticle({ ...article, status: newStatus });
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        } else {
            return text;
        }
    }
    function formatDateOnly(dateStr) {
        return new Date(dateStr).toLocaleDateString();
    }
    const onRemove = async (commentName) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await axios.delete(`https://localhost:7002/api/Comments/delete-comment/${encodeURIComponent(commentName)}`);
                alert("Comment deleted successfully.");

                // Refresh comments list after deletion
                const commentsResponse = await axios.get(`https://localhost:7002/api/Comments/get-comment-list/${encodeURIComponent(title)}`, {
                    headers: {
                        'accept': 'text/plain'
                    }
                });
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("Failed to delete comment", error);
                alert("Failed to delete comment.");
            }
        }
    };
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert("Please fill in the comment.");
            return;
        }

        const formDataForComment = new FormData();
        formDataForComment.append('CommentName', newCommentName); // You might want to dynamically set or omit this field
        formDataForComment.append('ContributionName', title);
        formDataForComment.append('ContributionId', article.contributionId);
        formDataForComment.append('UserName', '92176099_3'); // Replace this with the actual username
        formDataForComment.append('Content', newComment);

        try {
            // First API call: Add new comment
            await axios.post('https://localhost:7002/api/Comments/add-new-comment', formDataForComment, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });


            alert('Comment added successfully');
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
    const AddCommentModal = ({ onClose, newCommentName, setNewCommentName, newComment, setNewComment, newStatus, setNewStatus, handleAddComment }) => (
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
                <select
                    className="w-full p-2 border rounded"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                >
                    <option value="">Select Status</option>
                    <option value="Refer">Refer</option>
                    <option value="Selected">Selected</option>
                </select>
                <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddComment}>Add Comment</button>
                </div>
            </div>
        </div>
    );
    useEffect(() => {
        async function fetchArticle() {
            try {
                const encodedTitle = encodeURIComponent(title);
                const response = await axios.get(`https://localhost:7002/api/Contributions/contribution/${encodedTitle}`);
                const articleData = response.data;
                setArticle(articleData);
                fetchComments(articleData.contributionId);
                // Now, fetch the academic term details
                if (articleData.academicTermId) {
                    await fetchAcademicTermDetails(articleData.academicTermId);
                }
            } catch (error) {
                console.error("Failed to fetch article details", error);
            }
        }
        async function fetchComments(contributionId) {
            try {
                const commentsResponse = await axios.get(`https://localhost:7002/api/Comments/get-comment-list/${contributionId}`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        }
        async function fetchAcademicTermDetails(academicTermId) {
            try {
                const response = await axios.get(`https://localhost:7002/api/AcademicTerms/${academicTermId}`);
                setClosureDate(response.data.closureDate);
                setFinalClosureDate(response.data.finalClosure);
            } catch (error) {
                console.error('Failed to fetch academic term details:', error);
            }
        }

        fetchArticle();
    }, [title]);
    function CommentItem({ comment }) {
        // Function to format the date using date-fns for "time ago" format
        const timeAgo = formatDate => {
            return formatDistanceToNow(new Date(formatDate), { addSuffix: true });
        };

        return (
            <div className="flex items-start space-x-4 p-4 border-b">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {username == comment.userName ? <FiUser /> : <FiEdit />}
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between">
                        <p className="font-bold">{comment.commentName} ({username == comment.userName ? 'You' : 'Student'})</p>
                        <span className="text-sm text-gray-500">{timeAgo(comment.commentDate)}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{truncateText(comment.content, 100)}</p>
                </div>
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
    const isAddCommentButtonHidden = () => {
        if (!article) return true;
        const daysSinceUpload = differenceInDays(new Date(), parseISO(article.submissionDate));
        return daysSinceUpload > 14 && comments.length === 0;
    };
    if (!article) return <div>Loading...</div>;
    return (
        <GeneralLayout>
            <div className='text-lg' >
                <h1 className='bg-gray-200 p-2'>Title: {article.title}</h1>
                <h2 className='mt-3'>Status: {article.status}</h2>
                <h2 className='mt-3'>Faculty: {article.facultyName}</h2>
                <h3 className='mt-3'>Closure date: {closureDate}</h3>
                <h3 className='mt-3'>Final Closure date: {finalClosureDate}</h3>
                <p className='mt-3'>Description: {article.description}</p>
                <h1 className=' mt-5 font-semibold '>Submissions list</h1>
                <div className=' mt-3 grid grid-cols-1 text-xl gap-2'>
                    <h1 className=' bg-gray-300 p-2 text-3xl flex items-center gap-2 justify-between'> <div className='flex items-center'>Files and Comment</div> <p className='text-xl text-red-500'>
                        {comments.length > 0 ? `${comments.length} comments` : "*Currently no comments"}</p>  </h1>
                    <table className='w-full  [&>tbody>*:nth-child(odd)]:bg-gray-200 [&>tbody>*:nth-child()]:p-2  '>
                        <tbody className=' p-2'>
                            <tr className=' p-2 mt-2 '>
                                <td>
                                    Status
                                </td>
                                <td className='flex justify-between'>
                                    {article.status}  
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => setShowChangeStatusModal(true)}>
                                        Change Status
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Upload date
                                </td>
                                <td>
                                    {formatDateOnly(article.submissionDate)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    File submission
                                </td>
                                <td className='flex items-center gap-2'>
                                    <a href={`https://localhost:7002/api/Contributions/DownloadFile?title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2'>
                                    <FaFileWord className='text-blue-500' />
                                        {article.fileName}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ verticalAlign: 'top' }}>
                                    <h2>Comments</h2>
                                    {!isAddCommentButtonHidden() && (
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setShowAddCommentModal(true)} >
                                            Add New
                                        </button>
                                    )}
                                    {comments.length === 0 && isAddCommentButtonHidden() && (
                                        <p className='text-base'>It has been over 14 days without any comments on this contribution.</p>
                                    )}
                                </td>
                                {!isAddCommentButtonHidden() && (
                                    <td>
                                        <div className="overflow-auto max-h-48 border border-gray-300 rounded-lg">
                                            {comments.length > 0 ? comments.slice().reverse().map(comment => (
                                                <CommentItem key={comment.id} comment={comment} />
                                            )) : "Currently no comment"}
                                        </div>
                                        {selectedComment && <CommentModal comment={selectedComment} onClose={() => setSelectedComment(null)} />}
                                    </td>
                                    )}
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
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddComment}>Add New</button>
                            </div>
                        </div>
                    </div>
                )}
                {showChangeStatusModal && (
                    <ChangeStatusModal
                        currentStatus={article.status}
                        onUpdateStatus={()=>handleUpdateStatus(newStatus)}
                        onClose={() => setShowChangeStatusModal(false)}
                    />
                )}
            </div>

        </GeneralLayout>
    );
}

export default StudentArticleDetails;
