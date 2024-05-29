import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import { Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const updatePassword = async (userId, oldPassword, newPassword, confirmPassword, dispatch,
    setUpdateUserError, setUpdateUserSuccess, setShowLogoutMessage, navigate) => {
    try {
        dispatch(updateStart());

        const res = await fetch(`/api/user/changepassword/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
        } else {
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("Password updated successfully");
            setUpdateUserError(null);

            setTimeout(() => {
                setUpdateUserSuccess(null);
                setShowLogoutMessage(true);

                // After another 2 seconds, hide login message and navigate to sign-in page
                setTimeout(() => {
                    setShowLogoutMessage(false);
                    navigate('/sign-in');
                }, 2000);
            }, 2000);
        }
    } catch (error) {
        dispatch(updateFailure(error.message));
        setUpdateUserError(error.message);
    }
};

export default function ChangPassWord() {
    const [oldPassword, setOldPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);

    const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePassword(currentUser._id, oldPassword, newPassword, confirmPassword, dispatch,
            setUpdateUserError, setUpdateUserSuccess, setShowLogoutMessage, navigate);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', maxWidth: '550px', width: '100%' }}>
                <h1 className='text-2xl font-semibold text-center my-5'>
                    Change your's password
                </h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="oldPassword" style={{ width: '150px', marginBottom: '10px', marginRight: '48px' }}>Old Password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={handleOldPasswordChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="newPassword" style={{ width: '150px', marginBottom: '10px', marginRight: '48px' }}>New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="confirmPassword" style={{ width: '190px', marginBottom: '10px', marginRight: '20px' }}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box',
                            }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Update Password
                    </button>
                </form>
                {updateUserSuccess && (
                    <Alert color='success' className='mt-5'>
                        {updateUserSuccess}
                    </Alert>
                )}
                {updateUserError && (
                    <Alert color='failure' className='mt-5'>
                        {updateUserError}
                    </Alert>
                )}
                {showLogoutMessage && (
                    <Alert color='warning' className='mt-5'>
                        You will be redirected to the login page in a moment...
                    </Alert>
                )}

            </div>
        </div>


    );
}
