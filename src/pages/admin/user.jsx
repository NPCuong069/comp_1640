import { Helmet } from 'react-helmet-async';
import { UserView } from '../../sections/user/view';



const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};
// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <UserView />
    </>
  );
}
