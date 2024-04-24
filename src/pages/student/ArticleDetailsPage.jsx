import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import "./articleDetails.css";
import { formatDistanceToNow } from 'date-fns';
import ArticleDropdown from './ArticleDropdown';
import GeneralLayout from '../../components/general/GeneralLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiEdit, FiUser } from 'react-icons/fi';
import axios from 'axios';

function StudentArticleDetails() {
    const [showImageModal, setShowImageModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [showAddCommentModal, setShowAddCommentModal] = useState(false);
    const [newCommentName, setNewCommentName] = useState('');
    const [newComment, setNewComment] = useState('');
    const { title } = useParams();
    const [article, setArticle] = useState(null);
    const navigate = useNavigate;
    const [show, setShow] = useState(false);
    const username = localStorage.getItem('username');
    const imageUrl = `https://localhost:7002/api/Contributions/DownloadImageFile?title=${encodeURIComponent(title)}`
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImageFile, setEditImageFile] = useState(null);
    const [closureDate, setClosureDate] = useState('');
    const [finalClosureDate, setFinalClosureDate] = useState('');
    const [editDocumentFile, setEditDocumentFile] = useState(null);
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
    const handleAddComment = async () => {
        if (!newCommentName.trim() || !newComment.trim()) {
            // Check if either the comment name or the content is empty
            let errorMessage = "Please fill out all fields.";
            if (!newCommentName.trim()) {
                errorMessage = "Comment name cannot be empty.";
            } else if (!newComment.trim()) {
                errorMessage = "Comment content cannot be empty.";
            }
            alert(errorMessage);
            return;
        }
        const formDataForComment = new FormData();
        formDataForComment.append('CommentName', newCommentName); // You might want to dynamically set or omit this field
        formDataForComment.append('ContributionName', title);
        formDataForComment.append('UserName', username); // Replace this with the actual username
        formDataForComment.append('Content', newComment);
        formDataForComment.append('ContributionId', article.contributionId);
        try {
            await axios.post('https://localhost:7002/api/Comments/add-new-comment', formDataForComment, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Comment added updated successfully');
            setShowAddCommentModal(false);
            setNewComment('');
            window.location.reload();
        } catch (error) {
            console.error('Failed to add comment', error);
            alert('Failed to add comment or update status');
        }
    };
    const ImageModal = ({ src, onClose }) => (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg">
                <div className="absolute top-0 right-0 m-2">
                    <button onClick={onClose} className="text-xl font-semibold text-gray-800 hover:text-gray-600">&times;</button>
                </div>
                <img src={src} alt="Full Size" style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
            </div>
        </div>
    );
    const toggleImageModal = () => {
        setShowImageModal(!showImageModal);
    };
    const handleEditArticle = async () => {
        // Check if any field is empty
        if (!editTitle.trim() || !editDescription.trim() || !editImageFile || !editDocumentFile) {
            let errorMessage = "Please fill out all fields.";
            if (!editTitle.trim()) {
                errorMessage = "Title cannot be empty.";
            } else if (editTitle.length > 255) {
                errorMessage = "Title cannot be more than 255 characters.";
            } else if (!editDescription.trim()) {
                errorMessage = "Description cannot be empty.";
            } else if (!editImageFile) {
                errorMessage = "Image file cannot be empty.";
            } else if (!editDocumentFile) {
                errorMessage = "Document file cannot be empty.";
            }
            alert(errorMessage);
            return; // Stop the form submission
        }

        const formDataForEdit = new FormData();
        formDataForEdit.append('ContributionId', article.contributionId);
        formDataForEdit.append('Title', editTitle);
        formDataForEdit.append('Description', editDescription);
        formDataForEdit.append('ImageFile', editImageFile);
        formDataForEdit.append('DocumentFile', editDocumentFile);

        try {
            await axios.put('https://localhost:7002/api/Contributions/update', formDataForEdit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Article updated successfully');
            setShowEditModal(false);
            // Reload the article details to reflect the updates
            navigate(`/student/overview/${encodeURIComponent(editTitle)}`);
        } catch (error) {
            console.error('Failed to update the article:', error.response ? error.response.data : error);
            alert('Failed to update the article: ' + (error.response ? error.response.data : 'An error occurred'));
        }
    };
    const EditModal = () => {
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <div className="relative bg-white p-4 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Edit Article</h2>
                    <input
                        type="text"
                        placeholder="Edit title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <textarea
                        placeholder="Edit description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <input
                        type="file"
                        onChange={handleImageFileChange}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <input
                        type="file"
                        onChange={handleDocumentFileChange}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <div className="flex justify-between space-x-2">
                        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowEditModal(false)}>Cancel</button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleEditArticle}>Save Changes</button>
                    </div>
                </div>
            </div>
        );
    };
    const handleImageFileChange = (event) => {
        setEditImageFile(event.target.files[0]);
    };
    const fetchAcademicTermDetails = async () => {
        try {
            const response = await axios.get('https://localhost:7002/api/AcademicTerms/1');
            setClosureDate(response.data.closureDate);
            setFinalClosureDate(response.data.finalClosure);
        } catch (error) {
            console.error('Failed to fetch academic term details:', error);
            // Handle errors appropriately, e.g., show an error message
        }
    };

    const handleDocumentFileChange = (event) => {
        setEditDocumentFile(event.target.files[0]);
    };
    useEffect(() => {
        async function fetchArticle() {
            try {
                const encodedTitle = encodeURIComponent(title);
                const response = await axios.get(`https://localhost:7002/api/Contributions/contribution/${encodedTitle}`);
                const articleData = response.data;
                setArticle(articleData);
                fetchComments(articleData.contributionId);
                setEditTitle(articleData.title);
                setEditDescription(articleData.description);
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
                        {username == comment.userName ? <FiUser /> : <FiEdit />} {/* Use FiUserCheck icon for students and FiUserPlus icon for coordinators */}
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between">
                        <p className="font-bold">{comment.commentName} ({username == comment.userName ? 'You' : 'Coordinator'})</p>
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
                <h3 className='mt-3'>Closure date: {closureDate}</h3> {/* Update this dynamically if possible */}
                <h3 className='mt-3'>Final closure date: {finalClosureDate}</h3>
                <p className='mt-3'>Description: {article.description}</p>
                <h1 className=' mt-5 font-semibold '>Submissions list</h1>
                <button onClick={() => setShowEditModal(true)} className="text-gray-600 hover:text-gray-800">
                    <FiEdit2 className="h-6 w-6" />
                </button>
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
                                    {article.status === 'Selected' ? 'Published' : article.status}
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
                                <td className='flex flex-col  gap-2'>
                                    <a href={`https://localhost:7002/api/Contributions/DownloadFile?title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2'>
                                        <FaFilePdf className='text-red-500' />
                                        {article.fileName}
                                    </a>
                                    <div>
                                        <img src={imageUrl} alt="Article Image" style={{ maxWidth: '100%', height: '100px', cursor: 'pointer' }} onClick={toggleImageModal} />
                                    </div>
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
                                        {comments.length > 0 ? comments.slice().reverse().map(comment => (
                                            <CommentItem key={comment.CommentId} comment={comment} />
                                        )) : "Currently no comment."}
                                    </div>
                                    {selectedComment && <CommentModal comment={selectedComment} onClose={() => setSelectedComment(null)} />}

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {showImageModal && <ImageModal src={imageUrl} onClose={toggleImageModal} />}
                {showEditModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="relative bg-white p-4 rounded-lg max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-4">Edit Article</h2>
                            <input
                                type="text"
                                placeholder="Edit title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                                required
                            />
                            <textarea
                                placeholder="Edit description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                                required
                            />
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-file">
                                Image File
                            </label>
                            <input
                                type="file"
                                onChange={handleImageFileChange}
                                className="w-full p-2 border rounded mb-2"
                                accept="image/*"
                                required
                            />
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-file">
                                Document File
                            </label>
                            <input
                                type="file"
                                onChange={handleDocumentFileChange}
                                className="w-full p-2 border rounded mb-2"
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                required
                            />
                            <div className="flex justify-between space-x-2">
                                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleEditArticle}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}
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
