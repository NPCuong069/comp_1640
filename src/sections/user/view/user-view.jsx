import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Tabs, Tab, Box, Modal, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';


import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';



export default function UserPage() {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const handleSubmitStudent = async () => {
    if (!newStudent.username.trim() || !newStudent.email.trim() || !newStudent.password.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    // Additional validation as needed

    try {
      const response = await fetch('https://localhost:7002/api/Admin/add-new-user', { // Adjust endpoint as necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        alert('User added successfully.');
        setIsModalOpen(false);
        setNewStudent({ firstName: '', lastName: '', username: '', email: '', password: '' }); // Reset form
        fetchUsers(); // Refresh the list of users
      } else {
        console.log(response.json());
        alert('Failed to add student. Username already existed.');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      console.log(response.error);
      alert('An error occurred. Please try again.');
    }
  };
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    roleName: ''
  });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:7002/api/Users/get-all-user');
      if (!response.ok) {
        throw new Error('Could not fetch users');
      }
      const data = await response.json();
      const nonAdminUsers = data.filter(user => user.roleName !== "Admin");
      setUsers(nonAdminUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab !== null) {
        setActiveTab(Number(savedTab));
    }
    fetchUsers();
    fetchFaculties();
  }, []);
  const notFound = !dataFiltered.length && !!filterName;
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const [faculties, setFaculties] = useState([]);
  const fetchFaculties = async () => {
    try {
      const response = await fetch('https://localhost:7002/api/Faculties/get-all-faculties');
      if (!response.ok) {
        throw new Error('Could not fetch faculties');
      }
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };
  const handleSubmitFaculty = async () => {
    if (!newFacultyName.trim()) {
      alert('Please enter a faculty name.');
      return;
    }
    try {
      const response = await fetch('https://localhost:7002/api/Admin/add-new-faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ facultyName: newFacultyName }),
      });
      if (response.ok) {
        alert('Faculty added successfully.');
        setIsModalOpen(false);
        setNewFacultyName('');
      } else {
        alert('Failed to add faculty.');
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const filteredUsers = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  }).filter((user) => {
    if (activeTab === 0) return user.facultyName === null;
    if (activeTab === 1) return user.facultyName !== null;
    return true;
  });
  const headLabels = [
    { id: 'name', label: 'Username' },
    { id: 'fullName', label: 'Full name' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'action', label: 'Action' },
    { id: '', label: '' },
  ].filter(label => label !== null);
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
          New User
        </Button>
      </Stack>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="user status tabs">
        <Tab label="Pending" />
        <Tab label="Activated" />
      </Tabs>
      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                headLabel={headLabels}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.userName}
                      username={row.userName}
                      name={`${row.firstName} ${row.lastName}`}
                      email={row.email}
                      faculties={faculties}
                      facultyname={row.facultyName}
                      role={row.roleName}
                      status={row.facultyName ==="No Faculty" ? 'pending' : 'activated'}
                      selected={selected.indexOf(row.userName) !== -1}
                      handleClick={(event) => handleClick(event, row.userName)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New User
          </Typography>
          <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              id="firstName"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
              value={newStudent.firstName}
              onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
            />
            <TextField
              margin="dense"
              id="lastName"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
              value={newStudent.lastName}
              onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
            />
            <TextField
              margin="dense"
              id="username"
              name="username"
              label="Username"
              type="text"
              fullWidth
              variant="standard"
              value={newStudent.username}
              onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
            />
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value, password: e.target.value })}
            />
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={newStudent.roleName}
                onChange={(e) => setNewStudent({ ...newStudent, roleName: e.target.value })}
                fullWidth
              >
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Marketing Coordinator">Marketing Coordinator</MenuItem>
                <MenuItem value="Marketing Manager">Marketing Manager</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmitStudent}>Submit</Button>
            </Stack>
          </Box>
        </Box>
      </Modal>

    </Container>
  );
}
