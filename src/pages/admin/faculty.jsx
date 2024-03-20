import { Helmet } from 'react-helmet-async';
import { FacultyView } from '../../sections/faculty/view';



const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};
// ----------------------------------------------------------------------

export default function FacultyPage() {
  return (
    <>
      <FacultyView />
    </>
  );
}
