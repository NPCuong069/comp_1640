import { Helmet } from 'react-helmet-async';
import { ClosureView } from '../../sections/closureDate/view';



const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};
// ----------------------------------------------------------------------

export default function ClosurePage() {
  return (
    <>
      <ClosureView />
    </>
  );
}
