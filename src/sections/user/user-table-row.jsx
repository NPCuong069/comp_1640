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
  name,
  username,
  facultyname,
  email,
  role,
  faculties,
  status,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [userRole, setUserRole] = useState(role);
  const [selectedFaculty, setSelectedFaculty] = useState(facultyname || '');
  useEffect(() => {
    setUserRole(role);
  }, [role]);
  useEffect(() => {
    setUserRole(role);
    setSelectedFaculty(facultyname || ''); 
    console.log(facultyname);
  }, [role, facultyname]);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const token = localStorage.getItem('token');
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleFacultyChange = async (event) => {
    const newFacultyName = event.target.value;
    const confirmChange = window.confirm('Do you want to change this user\'s faculty?');

    if (confirmChange) {
      try {
        const requestBody = {
          userName: username, // Assuming you have the user's userName accessible under a `user` prop
          facultyName: newFacultyName,
        };
        const response = await fetch('https://localhost:7002/api/Admin/assign-user-to-faculty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          alert('Faculty updated successfully.');
          setSelectedFaculty(newFacultyName);
          localStorage.setItem('selectedTab', facultyname!="No Faculty"?1:0); 
          window.location.reload();
        } else {
          alert('Failed to update faculty. User is not a student.');
        }
      } catch (error) {
        console.error('Error updating faculty:', error);
        alert('An error occurred while updating the faculty. Check the console for more details.');
      }
    }
  };
  const handleDeleteUser = async (userName) => {
    // Ask for confirmation before proceeding with the deletion
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (!isConfirmed) {
      return; // Stop if not confirmed
    }

    try {
      const response = await fetch(`https://localhost:7002/api/Admin/delete-user?userName=${userName}`, {
        method: 'DELETE', // Assuming the API requires a DELETE request
        headers: {
          // Add any necessary headers here, such as Authorization headers
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 204) {
        alert('User successfully deleted.');
        // Optionally: Trigger a refresh of the user list or update the component state to remove the deleted user
      } else {
        // Handle unsuccessful deletion with a generic message
        // You might want to customize this based on the response status or message
        alert('Failed to delete user. Please try again later.');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while trying to delete the user. Please check the console for more details.');
    }
  };

  const handleActivateClick = async () => {
    if (!userRole || userRole === 'Select role') {
      alert('You need to choose a role if you want to activate this user.');
      return;
    }

    try {
      // Prepare the role assignment data
      const roleAssignmentDto = {
        userName: username, // Assuming the 'name' prop holds the username
        roleName: userRole
      };

      // Call the API to assign the role
      const response = await fetch('https://localhost:7002/api/Admin/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(roleAssignmentDto)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert('User activated successfully with role: ' + userRole);
      localStorage.setItem('selectedTab', facultyname!="No Faculty"?0:1); 
      window.location.reload();
      // Here you might want to trigger a refresh of the user list or perform other UI updates
    } catch (error) {
      console.error('Failed to assign role to user:', error);
      alert('Failed to activate user.');
    }
  };




  console.log(faculties);
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none" >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap style={{ marginLeft: 20 }}>
              {username}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          <Select
            value={selectedFaculty}
            onChange={handleFacultyChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="No Faculty" >
              No Faculty
            </MenuItem>
            {faculties.map((faculty) => (
              <MenuItem key={faculty.facultyName} value={faculty.facultyName}>
                {faculty.facultyName}
              </MenuItem>
            ))}
          </Select>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>   {role}</TableCell>

        <TableCell >
          <Button
            color="warning"
            variant="contained"
            size="small"
            onClick={() => handleDeleteUser(username)}
            style={{ marginLeft: 5 }}
          >
            Delete
          </Button>
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
  faculties: PropTypes.array,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
