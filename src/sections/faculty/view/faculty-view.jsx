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
import { Tabs, Tab, Box,Modal,TextField } from '@mui/material';


import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';



export default function Faculty() {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [faculties, setFaculties] = useState([]);
  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = faculties.map((n) => n.name);
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
    inputData: faculties,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const fetchFaculties = async () => {
    try {
      const response = await fetch('https://localhost:7002/api/Users/faculties');
      if (!response.ok) {
        throw new Error('Could not fetch users');
      }
      const data = await response.json();
      setFaculties(data); // Assuming setUsers is your state setter for user data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchFaculties();
  }, []);
  const notFound = !dataFiltered.length && !!filterName;
  const handleOpenModal = () => {
    setIsModalOpen(true);
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
        window.location.reload();
      } else {
        alert('Failed to add faculty.');
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Faculties</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
          New Faculty
        </Button>
      </Stack>

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
                rowCount={faculties.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Faculty name' },
                  { id: 'action', label: 'Action' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {faculties
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.facultyName} // Change from row.id to row.userName
                      facultyName={row.facultyName}
                      selected={selected.indexOf(row.userName) !== -1} // Use userName for selection logic
                      handleClick={(event) => handleClick(event, row.userName)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, faculties.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={faculties.length}
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
