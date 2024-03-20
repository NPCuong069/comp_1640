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
import { Tabs, Tab, Box, Modal, TextField } from '@mui/material';


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

  // const handleSort = (event, id) => {
  //   const isAsc = orderBy === id && order === 'asc';
  //   if (id !== '') {
  //     setOrder(isAsc ? 'desc' : 'asc');
  //     setOrderBy(id);
  //   }
  // };

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
      const response = await fetch('https://localhost:7002/api/Users');
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
      const response = await fetch('https://localhost:7002/api/Users/faculties');
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
    if (activeTab === 0) return user.roleName === "Default";
    if (activeTab === 1) return user.roleName !== "Default";
    return true;
  });
  const headLabels = [
    { id: 'name', label: 'Username' },
    { id: 'fullName', label: 'Full name' },
    activeTab === 1 ? { id: 'faculty', label: 'Faculty' } : null, 
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
          New Faculty
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
                      faculty={row.facultyName}
                      role={row.roleName} 
                      status={row.roleName === "Default" ? 'pending' : 'activated'} 
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
            Add New Faculty
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="facultyName"
              label="Faculty Name"
              type="text"
              fullWidth
              variant="standard"
              value={newFacultyName}
              onChange={(e) => setNewFacultyName(e.target.value)}
            />
            <Button onClick={handleSubmitFaculty} sx={{ mt: 2, mr: 1 }}>
              Submit
            </Button>
            <Button onClick={() => setIsModalOpen(false)} sx={{ mt: 2 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
