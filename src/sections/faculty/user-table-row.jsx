import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from '../../components/label';
import Iconify from '../../components/iconify';


export default function UserTableRow({
  selected,
  facultyName,
  handleClick,
}) {
  const [open, setOpen] = useState(null);


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const token = localStorage.getItem('token');
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleDeleteUser = async (facultyName) => {
    // Ask for confirmation before proceeding with the deletion
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (!isConfirmed) {
      return; // Stop if not confirmed
    }
  
    try {
      const response = await fetch(`https://localhost:7002/api/Admin/delete-user?userName=${facultyName}`, {
        method: 'DELETE', // Assuming the API requires a DELETE request
        headers: {
          // Add any necessary headers here, such as Authorization headers
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 204) {
        alert('User successfully deleted.');
      } else {
        alert('Failed to delete user. Please try again later.');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while trying to delete the user. Please check the console for more details.');
    }
  };


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none" >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap style={{ marginLeft: 20 }}>
              {facultyName}
            </Typography>
          </Stack>
        </TableCell>



        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  facultyName: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
