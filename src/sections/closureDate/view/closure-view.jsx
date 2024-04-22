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
  const [academicYear, setAcademicYear] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [closureDate, setClosureDate] = useState('');
  const [finalClosureDate, setFinalClosureDate] = useState('');
  const [order, setOrder] = useState('asc');
  const [closureDates, setClosureDates] = useState([]);
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
      const newSelecteds = closureDates.map((n) => n.name);
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
    inputData: closureDates,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const fetchClosureDates = async () => {
    try {
      const response = await fetch('https://localhost:7002/api/AcademicTerms');
      if (!response.ok) {
        throw new Error('Could not fetch closure dates');
      }
      const data = await response.json();
      setClosureDates(data); // Assuming setUsers is your state setter for user data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchClosureDates();
  }, []);
  const notFound = !dataFiltered.length && !!filterName;
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleSubmit = async () => {
    if (!validateForm(academicYear, entryDate, closureDate, finalClosureDate)) {
      return;
  }
    try {
      const response = await fetch('https://localhost:7002/api/AcademicTerms/add-new-academic-term', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          academicYear: academicYear,
          entryDate: entryDate,
          closureDate: closureDate,
          finalClosure: finalClosureDate,
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to add new closure date'); // Use the error message from the response, if available
      }
  
      const result = await response.text(); 
      console.log(result); 
      alert('Closure date added successfully.');
      setAcademicYear('');
      setEntryDate('');
      setClosureDate('');
      setFinalClosureDate('');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error submitting new closure date:', error);
    }
  };
  function validateForm(academicYear, entryDate, closureDate, finalClosureDate) {
    // Check for empty fields
    if (!academicYear || !entryDate || !closureDate || !finalClosureDate) {
        alert('All fields must be filled.');
        return false;
    }

    // Validate academic year format
    const academicYearRegex = /^\d{4}-\d{4}$/;
    if (!academicYearRegex.test(academicYear)) {
        alert('Academic year must be in the format yyyy-yyyy.');
        return false;
    }

    // Validate date order
    const entryDateObj = new Date(entryDate);
    const closureDateObj = new Date(closureDate);
    const finalClosureObj = new Date(finalClosureDate);

    if (entryDateObj >= closureDateObj) {
        alert('Closure date must be after entry date.');
        return false;
    }

    if (closureDateObj >= finalClosureObj) {
        alert('Final closure date must be after closure date.');
        return false;
    }

    return true;
}
  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Closure dates</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
          New Closure Date
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
                rowCount={closureDates.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'academicYear', label: 'Academic Year' },
                  { id: 'startDate', label: 'Entries date' },
                  { id: 'endDate', label: 'Closure date' },
                  { id: 'finalDate', label: 'Final Closure date' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {closureDates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.entryDate} // Change from row.id to row.userName
                      academicYear={row.academicYear}
                      entryDate={row.entryDate}
                      closureDate={row.closureDate}
                      finalClosure={row.finalClosure}
                      selected={selected.indexOf(row.userName) !== -1} // Use userName for selection logic
                      handleClick={(event) => handleClick(event, row.userName)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, closureDates.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={closureDates.length}
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
            Add New Closure date
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="academicYear"
            label="Academic Year (yyyy-yyyy)"
            type="text"
            fullWidth
            variant="outlined"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          />
          <TextField
            margin="dense"
            id="entryDate"
            label="Entry Date"
            type="date"
            fullWidth
            variant="outlined"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="closureDate"
            label="Closure Date"
            type="date"
            fullWidth
            variant="outlined"
            value={closureDate}
            onChange={(e) => setClosureDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="finalClosureDate"
            label="Final Closure Date"
            type="date"
            fullWidth
            variant="outlined"
            value={finalClosureDate}
            onChange={(e) => setFinalClosureDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
            <Button onClick={handleSubmit} sx={{ mt: 2, mr: 1 }}>
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
