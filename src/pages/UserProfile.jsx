import React, { useState, useEffect } from 'react';
import GeneralLayout from '../components/general/GeneralLayout';
import { FiUser, FiEdit, FiSettings } from 'react-icons/fi'; // Ensure you have react-icons installed
import axios from 'axios';
function ProfileSettings() {
    const [isEditable, setIsEditable] = useState(false);
    const currentPassword = localStorage.getItem('password');
    const [passwordFields, setPasswordFields] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        faculty: '',
        role: '',
        email: ''
    });
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordFields(prevFields => ({ ...prevFields, [name]: value }));
    };

    const closeChangePasswordModal = () => {
        setShowChangePasswordModal(false);
    };

    const submitChangePassword = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = passwordFields;
    
        // Check for empty fields
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }
        if(currentPassword!=oldPassword){
            alert('Wrong old password.');
            return;
        }
        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('UserName', profileData.username);
            formData.append('FirstName', profileData.firstName);
            formData.append('LastName', profileData.lastName);
            formData.append('Email', profileData.email);
            formData.append('Password', passwordFields.newPassword);
            // Include other necessary fields like Email, etc.

            // Make the PUT request
            const response = await axios.put('https://localhost:7002/api/Users/update', formData, {
                headers: {
                }
            });
    
            // If the response is successful, inform the user and clear the form
            alert('Password changed successfully.');
            localStorage.setItem('password',passwordFields.newPassword);
            setShowChangePasswordModal(false);
            setPasswordFields({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            // If the request fails, inform the user
            console.error('Failed to change password:', error);
            alert('Failed to change password. Please try again.');
        }
    };

    useEffect(() => {
        // Replace with actual username retrieval from localStorage
        const username = localStorage.getItem('username');

        // Replace with actual API call
        fetch(`https://localhost:7002/api/Users/userName?userName=${username}`)
            .then(response => response.json())
            .then(data => {
                setProfileData({
                    ...profileData,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.userName,
                    faculty: data.facultyName,
                    role: data.roleName,
                    email: data.email
                });
            })
            .catch(error => console.error('Error fetching user data:', error));
        console.log('Editable state:', isEditable);
    }, []);

    const handleInputChange = (e) => {
        if (isEditable) {
            const { name, value } = e.target;
            setProfileData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const toggleEdit = (e) => {
        e.preventDefault(); // Prevent default button click behavior
        setIsEditable(prevEditable => !prevEditable);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submit action

        // Check if we are in editable mode
        if (!isEditable) {
            console.log('Not in editable mode.');
            toggleEdit;
            return;
        }

        try {
            // Construct form data for the PUT request
            const formData = new FormData();
            formData.append('UserName', profileData.username);
            formData.append('FirstName', profileData.firstName);
            formData.append('LastName', profileData.lastName);
            formData.append('Email', profileData.email);
            formData.append('Password', currentPassword);
            // Include other necessary fields like Email, etc.

            // Make the PUT request
            const response = await axios.put('https://localhost:7002/api/Users/update', formData, {
                headers: {
                }
            });
            alert('Information updated successfully');
            console.log('Update response:', response.data);
            // Handle success, such as showing a success message or updating the state

        } catch (error) {
            console.error('Failed to update profile:', error);
            // Handle error, such as showing an error message
        } finally {
            // Always turn off edit mode after the attempt to submit
            setIsEditable(false);
        }
    };

    return (
        <GeneralLayout>
            <div className="container mx-auto p-4 md:flex md:items-start md:justify-center">
                <div className="md:w-1/6 mb-4 md:mb-0 md:mr-4 self-center">
                    <div className="flex flex-col items-center">
                        {profileData.role === 'Student' ? <FiUser size="96" /> : <FiEdit size="96" />}
                        <span className="mt-2 text-gray-700 text-sm font-semibold">
                            {profileData.role}
                        </span>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 md:flex-grow">
                    <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                    <form onSubmit={handleSubmit} className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="firstName">
                            Username
                        </label>
                        <input
                            name="username"
                            type="text"
                            value={profileData.username}
                            onChange={handleInputChange}
                            disabled={true}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <label className="block text-gray-700 text-sm font-bold mb-2 mt-6" htmlFor="firstName">
                            Email
                        </label>
                        <input
                            name="email"
                            type="text"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled={true}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <label className="block text-gray-700 text-sm font-bold mb-2 mt-6" htmlFor="firstName">
                            Faculty name
                        </label>
                        <input
                            name="faculty"
                            type="text"
                            value={profileData.faculty}
                            onChange={handleInputChange}
                            disabled={true}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <div className="md:flex md:items-center mb-4 mt-6">
                            <div className="md:w-1/2 md:pr-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="md:w-1/2 md:pl-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                               />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6 mt-6">
                            <div className="md:w-1/2">
                                <span className="text-gray-700 text-sm font-bold">Change password</span>
                                <div>

                                </div>
                                <span className="text-gray-500 text-xs">Password must be at least 8 characters long</span>
                            </div>
                            <div className="md:w-1/2 text-right">
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => setShowChangePasswordModal(true)}
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                        {isEditable && (
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit" // The type is submit, so it will trigger form submission
                            >
                                {isEditable ? 'Save Changes' : 'Edit Profile'}
                            </button>
                              )}
                            {!isEditable && (
                                <button
                                    onClick={toggleEdit} // This button is only shown when not in edit mode to enable editing
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="md:w-1/6 mb-4 md:mb-0 md:mr-4 self-center">
                </div>
            </div>
            {showChangePasswordModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" id="my-modal">
                    <div className="bg-white rounded-lg w-1/3">
                        <div className="flex justify-between items-center border-b border-gray-200 p-5">
                            <h3 className="text-xl font-medium text-gray-900">Change Password</h3>
                            <button onClick={closeChangePasswordModal}>X</button>
                        </div>
                        <form onSubmit={submitChangePassword} className="p-5">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                                    Current Password
                                </label>
                                <input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type="password"
                                    value={passwordFields.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={passwordFields.newPassword}
                                    onChange={handlePasswordChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordFields.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                <button
                                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                    type="submit"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GeneralLayout>
    );
}

export default ProfileSettings;
