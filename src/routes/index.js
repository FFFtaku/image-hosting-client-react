import { Navigate } from 'react-router-dom';
import RouteGuard from '@/components/common/RouteGuard';
import Login from '@/pages/Login';
import Work from '@/pages/Work';
import WorkImageDisplay from '@/pages/WorkImageDisplay';
import WorkImageModify from '@/pages/WorkImageModify';

const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/work',
    element: <RouteGuard render={guarderFunc => <Work guarderFunc={guarderFunc} />} />,
    children:[
      {
        path:'',
        element:<WorkImageDisplay />
      },
      {
        path:'modify',
        element:<WorkImageModify />
      }
    ]
  },
  {
    path: '/',
    element: <Navigate to='/login' />
  }
];
export default routes;