import SvgColor from '../../components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/admin/index',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/admin/user',
    icon: icon('ic_user'),
  },
  {
    title: 'faculty',
    path: '/admin/faculty',
    icon: icon('ic_cart'),
  },
  {
    title: 'closure date',
    path: '/admin/closureDate',
    icon: icon('calendar'),
  },
];

export default navConfig;
