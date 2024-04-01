import React, { useState } from 'react';
import { DocumentTextIcon, PhotographIcon } from '@heroicons/react/outline';
import GeneralLayout from '../../components/general/GeneralLayout';
import axios from 'axios';
function AddNewArticle() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (!termsAgreed) {
            alert('You must agree to the terms and conditions.');
            return;
        }
        if (selectedFile) {
            formData.append('File', selectedFile);
        } else {
            alert('Please select a file to upload.');
            return;
        }

        formData.append('UserName', '92176099_1'); // You should replace this with actual user name
        formData.append('FacultyName', 'IT'); // You should replace this with actual faculty name
        formData.append('Title', title);
        formData.append('Description', description);
        formData.append('TermsAgreed', true);
        formData.append('ImageFile', selectedImageFile);

        if (selectedFile) {
            formData.append('DocumentFile', selectedFile);
        }

        try {
            const response = await axios.post('https://localhost:7002/api/Contributions/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Contribution uploaded successfully', response.data);
            // Handle success response
        } catch (error) {
            console.error('Error uploading contribution:', error);
            // Handle error response
        }
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
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-bold mb-6">Add new article for this year magazine (2023)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="closure-date">
                            Closure date: 12/27/2023
                        </label>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="faculty">
                            Faculty: faculty of science and engineering
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
                            <input type="file" id="file-input" onChange={handleFileChange} className="mb-4" />
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-file">
                                Image File
                            </label>
                            <input type="file" id="image-file" onChange={handleImageFileChange} className="mb-4" accept="image/*" />
                        </div>
                        <div className="border border-gray-200 rounded">
                            <div className="flex justify-between px-3 py-2 border-b border-gray-200 bg-white">
                                <span>Name</span>
                                <span className="w-16 text-right">Size</span>
                                <span className="w-24 text-right">Type</span>
                            </div>
                            <div className="max-h-24 overflow-auto">
                                <ul className="space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center p-3 border-t border-gray-200">
                                            <span className="flex-grow flex items-center">
                                                {file.icon}
                                                <span className="ml-4">{file.name}</span>
                                            </span>
                                            <span className="flex-shrink-0 w-16 text-right">{file.size}</span>
                                            <span className="flex-shrink-0 w-24 text-right">{file.type}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
        </GeneralLayout>
    );
}

export default AddNewArticle;