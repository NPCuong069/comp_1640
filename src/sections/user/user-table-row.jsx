import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@mui/material';
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

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  faculty,
  email,
  role,
  status,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [userRole, setUserRole] = useState(role);
  useEffect(() => {
    setUserRole(role);
  }, [role]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    const isConfirmed = window.confirm(`Are you sure you want to change the user's role to ${newRole}?`);

    if (isConfirmed) {
      setUserRole(newRole);
      // Here, update the role in your backend
      // updateUserRole(userId, newRole);
      // Make sure you handle the promise or callback from updateUserRole to catch errors or confirm success
    }
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{faculty}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>   <Select
          value={userRole}
          onChange={handleRoleChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="Student">Student</MenuItem>
          <MenuItem value="Guest">Guest</MenuItem>
          <MenuItem value="Coordination Manager">Marketing Manager</MenuItem>
          <MenuItem value="Marketing Manager">Marketing Manager</MenuItem>
          {/* Add other roles as needed */}
        </Select></TableCell>

        <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
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
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
