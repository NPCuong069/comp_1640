import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, PhotographIcon } from '@heroicons/react/outline';
import GeneralLayout from '../../components/general/GeneralLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/general/Spinner';
function AddNewArticle() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTerm, setActiveTerm] = useState(null);
    const username = localStorage.getItem('username');
    const facultyName = localStorage.getItem('facultyName');
    const [daysLeft, setDaysLeft] = useState(0);
    const navigate = useNavigate();
    const Spinner = () => (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        if (!termsAgreed) {
            alert('You must agree to the terms and conditions.');
            setIsLoading(false);
            return;
        }
        if (!selectedFile || !selectedImageFile) {
            alert('Please select both a document file and an image file to upload.');
            setIsLoading(false);
            return;
        }
        if (!title || !description) {
            alert('All fields are required.');
            setIsLoading(false);
            return;
        }
        formData.append('UserName', username);
        formData.append('FacultyName', facultyName);
        formData.append('Title', title);
        formData.append('Description', description);
        formData.append('TermsAgreed', termsAgreed);
        formData.append('ImageFile', selectedImageFile);
        formData.append('DocumentFile', selectedFile);
    
        try {
            const response = await axios.post('https://localhost:7002/api/Contributions/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Contribution uploaded successfully', response.data);
            alert('Contribution uploaded successfully');
            navigate(`/student/articleDetails/${title}`);
    
            // Now send the email asynchronously
            const emailFormData = new FormData();
            emailFormData.append('contributionId', response.data.contributionId);
    
            axios.post('https://localhost:7002/api/Contributions/send-email', emailFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((emailResponse) => {
                console.log('Email sent successfully', emailResponse);
            }).catch((emailError) => {
                console.error('Error sending email:', emailError);
            });
    
            setIsLoading(false);
        } catch (error) {
            console.error('Error uploading contribution:', error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const fetchAcademicTerms = async () => {
            try {
                const response = await axios.get('https://localhost:7002/api/AcademicTerms');
                const terms = response.data;
                determineActiveTerm(terms);
            } catch (error) {
                console.error('Failed to fetch academic terms:', error);
            }
        };
        fetchAcademicTerms();
        // Other useEffect content...
    }, []);
    const determineActiveTerm = (terms) => {
        const currentDate = new Date();
        const currentTerm = terms.find(term => {
            const entryDate = new Date(term.entryDate);
            const closureDate = new Date(term.closureDate);
            return currentDate >= entryDate && currentDate <= closureDate;
        });

        if (currentTerm) {
            const closureDate = new Date(currentTerm.closureDate);
            const timeDiff = closureDate - currentDate;
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setDaysLeft(daysLeft);
        } else {
            setDaysLeft(null);
        }
        setActiveTerm(currentTerm);
    };
    const [files, setFiles] = useState([
        // Initial demo files can be left here or removed
    ]);
    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleAddNewFile = () => {
        if (selectedFile) {
            const newFile = {
                name: selectedFile.name,
                size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`, // Convert size from bytes to MB
                type: selectedFile.type,
                icon: selectedFile.type.startsWith('image/') ? <PhotographIcon className="h-5 w-5 text-gray-500" /> : <DocumentTextIcon className="h-5 w-5 text-gray-500" />,
            };

            // Update the files state to include the new file
            setFiles([...files, newFile]);
            // Reset selected file
            setSelectedFile(null);
            // Optionally reset the file input
            document.getElementById('file-input').value = '';
        }
    };

    return (
        <GeneralLayout>
            {isLoading ? (
                <div>
                    <Spinner /> </div>// Use the Spinner component when loading
            ) : (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {activeTerm ? (
                        <div>
                            <h2 className="text-xl font-bold mb-6">Add new article for this year magazine ({activeTerm ? activeTerm.academicYear : 'Loading...'})</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="closure-date">
                                        Closure date: {new Date(activeTerm.closureDate).toLocaleDateString()} ({daysLeft} days left)
                                    </label>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="faculty">
                                        Faculty: {facultyName}
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="article-title">
                                        Article title
                                    </label>
                                    <input onChange={e => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="article-title" type="text" placeholder="Enter your article title" />

                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="article-content">
                                        Article Description
                                    </label>
                                    <textarea onChange={e => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="article-content" placeholder="Enter your article content" rows="4"></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file-submissions">
                                        File submissions
                                    </label>
                                </div>
                                <div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="document-file">
                                            Document File
                                        </label>
                                        <input
                                            type="file"
                                            id="document-file"
                                            onChange={handleFileChange}
                                            className="mb-4"
                                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        />
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-file">
                                            Image File
                                        </label>
                                        <input type="file" id="image-file" onChange={handleImageFileChange} className="mb-4" accept="image/*" />
                                    </div>
                                    <div className="text-sm mt-3 text-gray-600">
                                        Accepted file types:
                                        <div>Document files: .doc .docx .epub .gdoc .odt .oth .ott .pdf .rtf</div>
                                        <div>Image files: .jpg .jpeg .png</div>
                                    </div>
                                </div>

                                <div className="mb-4 flex items-center py-4">
                                    <input type="checkbox"
                                        checked={termsAgreed}
                                        onChange={(e) => setTermsAgreed(e.target.checked)} className="mr-2" />
                                    <label htmlFor="terms-checkbox" className="text-sm text-gray-700">I have read and agreed to the <a href="/student/termsandconditions" className="text-purple-600 hover:text-purple-800">Terms and Conditions</a>.</label>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700" onClick={handleSubmit}>
                                        APPLY ARTICLE
                                    </button>
                                    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <p>There is currently no entry date for new contributions.</p>
                    )}
                </div>
            )}
        </GeneralLayout>
    );
}

export default AddNewArticle;