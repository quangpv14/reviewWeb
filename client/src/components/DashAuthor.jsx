import { Checkbox, Table, Button, TextInput, Label, Modal, Dropdown } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiCheck } from "react-icons/hi";
import { IoSearchSharp } from "react-icons/io5";
import { MdError } from "react-icons/md";

export default function DashAuthor() {
    const { currentUser, error } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [filters, setFilters] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId) // Bỏ chọn người dùng nếu đã được chọn
                : [...prevSelected, userId] // Chọn người dùng nếu chưa được chọn
        );
    };

    // "Select All"
    const handleSelectAllChange = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]); // Bỏ chọn tất cả nếu tất cả đang được chọn
        } else {
            setSelectedUsers(users.map((user) => user._id)); // Chọn tất cả nếu chưa tất cả đang được chọn
        }
    };

    // Hàm xử lý khi thay đổi vai trò người dùng
    const handleRoleChange = (userId, newRole) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, isAdmin: newRole === 'Admin' } : user
            )
        );

    };

    const handleCloseModal = () => {
        setShowErrorModal(false);
        setShowSuccessModal(false);
    };

    const changeRole = async () => {
        setUpdateError(null);
        setUpdateSuccess(null);
        const selectedUserDetails = users.filter(user => selectedUsers.includes(user._id));
        if (selectedUsers.length === 0) {
            setUpdateError("Please select the user to update");
            setShowErrorModal(true);
        }
        else {
            try {

                const response = await fetch('/api/user/update/info/role/${currentUser._id}', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        listUsers: selectedUserDetails,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    setUpdateSuccess(data.message);
                    setShowSuccessModal(true);
                    setSelectedUsers([]);
                } else {
                    setUpdateError(data.message);
                    setShowErrorModal(true);
                }
            } catch (error) {
                console.log(error.message);
            }

        }
    };


    const handleFilterChange = (e) => {
        setFilters(e.target.value);
    };

    const handleFilter = async () => {
        const urlParams = new URLSearchParams();
        urlParams.set('searchtext', filters);
        try {
            const response = await fetch(`/api/user/filterusers/search?${urlParams}`);
            const dataSearch = await response.json();
            if (response.ok) {
                setUsers(dataSearch);
                setShowMore(false);
            } else {
                console.error(dataSearch.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefresh = async () => {
        try {
            const res = await fetch(`/api/user/getusers`);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }

        setFilters('');

    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <div>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    Users Authorization
                </h1>
            </div>

            <div className='w-[1200px]'>
                <div className='flex space-x-4 justify-between mb-5'>
                    <div className='flex space-x-4 justify-between mb-5'>
                        <TextInput type="text" placeholder="Please enter words to search" id="search" onChange={handleFilterChange} value={filters} aria-label="Search" style={{ width: '280px' }} />
                        <Button onClick={handleFilter}>
                            <IoSearchSharp className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
                            Search
                        </Button>
                        <Button onClick={handleRefresh} className='bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700'>
                            Refresh
                        </Button>
                    </div>
                    <div className='flex h-[43px]'>
                        <Button className='text-white bg-gray-700 mr-5' onClick={changeRole}>
                            Change role
                        </Button>

                    </div>
                </div>
            </div>


            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md w-[1200px]'>
                        <Table.Head>
                            <Table.HeadCell className="p-4">
                                <Checkbox
                                    checked={selectedUsers.length === users.length}
                                    onChange={handleSelectAllChange}
                                />
                            </Table.HeadCell>
                            <Table.HeadCell className='w-[50px]'>STT</Table.HeadCell>
                            <Table.HeadCell className='w-[250px]'>Username</Table.HeadCell>
                            <Table.HeadCell className='w-[200px]'>Email</Table.HeadCell>
                            <Table.HeadCell className='w-[150px]'>Role</Table.HeadCell>
                            <Table.HeadCell className='w-[200px]'>Action</Table.HeadCell>
                            <Table.HeadCell></Table.HeadCell>


                        </Table.Head>
                        {users.map((user, index) => (
                            <Table.Body className='divide-y' key={user._id}>
                                <Table.Row
                                    key={user._id}
                                    className={index % 2 === 0 ? 'bg-white dark:border-gray-700 dark:bg-gray-800' : 'bg-gray-100 dark:border-gray-700 dark:bg-gray-900'}
                                >
                                    <Table.Cell className="p-4 w-[20px]">
                                        <Checkbox
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={() => handleCheckboxChange(user._id)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>


                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <span className='font-bold'>Administrator</span>
                                        ) : (
                                            'Standard User'
                                        )}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Dropdown
                                            label='Change role'
                                            inline={true}
                                        >
                                            <Dropdown.Item onClick={() => handleRoleChange(user._id, 'Admin')}>
                                                Admin
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleRoleChange(user._id, 'Standard User')}>
                                                Standard User
                                            </Dropdown.Item>
                                        </Dropdown>
                                    </Table.Cell>
                                    <Table.Cell></Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (

                <h1 className='text-center'>You have no users yet!</h1>
            )}

            <Modal show={showErrorModal}>
                <div className='text-center'>
                    <div className='flex items-center justify-center bg-red-500'>
                        <MdError className="mx-auto mb-3 h-7 w-7 rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200 mt-3" />
                    </div>
                    <div className='flex items-center justify-center h-[70px]'>
                        <h2 className="text-3xl font-bold text-red-500">Error!</h2>
                    </div>

                    <h3 className="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">
                        {updateError}
                    </h3>

                    <div className="flex justify-center gap-4">
                        <Button color="success" className='w-[120px] mb-4'
                            onClick={() => {
                                handleCloseModal();
                            }}
                        >
                            {"Okay"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal hiển thị thông báo thành công */}
            <Modal
                show={showSuccessModal}
            >
                <div className='text-center'>
                    <div className='flex items-center justify-center bg-green-500'>
                        <HiCheck className="mx-auto mb-3 h-7 w-7 rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200 mt-3" />
                    </div>
                    <div className='flex items-center justify-center h-[70px]'>
                        <h2 className="text-3xl font-bold text-green-500">Success!</h2>
                    </div>

                    <h3 className="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">
                        {updateSuccess}
                    </h3>

                    <div className="flex justify-center gap-4">
                        <Button color="success" className='w-[120px] mb-4'
                            onClick={
                                async () => {
                                    handleCloseModal();
                                    try {
                                        const res = await fetch(`/api/user/getusers`);
                                        const data = await res.json();
                                        if (res.ok) {
                                            setUsers(data.users);
                                            if (data.users.length < 9) {
                                                setShowMore(false);
                                            }
                                        }
                                    } catch (error) {
                                        console.log(error.message);
                                    }

                                }}
                        >
                            {"Okay"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div >
    );
}
