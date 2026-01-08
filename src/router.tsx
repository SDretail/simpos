import { Outlet, createHashRouter, useLocation, useRouteError } from 'react-router-dom';
import Login from './apps/auth/Login';
import Pos from './apps/pos';
import { OrderManager } from './contexts/OrderManager';
import { DataProvider } from './contexts/DataProvider';
import { Home } from './apps/home/Home';
import SessionScreen from './apps/pos/SessionScreen';
import ReportScreen from './apps/pos/ReportScreen';
import Purchase from './apps/purchase';
import PurchaseReport from './apps/purchase/PurchaseReport';
import PurchaseDetails from './apps/purchase/PurchaseDetails';
import ProductDetails from './apps/product/ProductDetails';
import Inventory from './apps/inventory';
import OrderScreen from './apps/pos/OrderScreen';
import { RootLayout } from './components/layout/RootLayout';

export const router = createHashRouter([
  {
    path: '/',
    errorElement: <GlobalError />,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'pos',
        element: (
          <DataProvider>
            <OrderManager>
              <Outlet />
            </OrderManager>
          </DataProvider>
        ),
        children: [
          {
            path: '',
            element: <Pos />,
          },
          {
            path: 'session',
            element: <SessionScreen />,
          },
          {
            path: 'report',
            element: <ReportScreen />,
          },
          {
            path: 'orders/:orderId',
            element: <OrderScreen />,
          },
        ],
      },
      {
        path: 'purchase',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Purchase />,
          },
          {
            path: 'report',
            element: <PurchaseReport />,
          },
          {
            path: ':purchaseOrderId',
            element: <PurchaseDetails />,
          },
        ],
      },
      {
        path: 'product/:productId',
        element: <ProductDetails />,
      },
      {
        path: 'inventory',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Inventory />,
          },
          {
            path: 'report',
            element: <Inventory />,
          },
        ],
      },
      {
        path: '*',
        element: <Debug404 />,
      },
    ],
  },
  {
    future: {
      v7_startTransition: true,
    },
  },
]);

function GlobalError() {
  const error: any = useRouteError();
  const location = useLocation();
  return (
    <div style={{ padding: 20, color: 'red', background: 'white', overflow: 'auto', maxHeight: '100vh' }}>
      <h1>Application Error</h1>
      <pre>{error.statusText || error.message}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <p>Path: {location.pathname}</p>
      <p>Hash: {location.hash}</p>
      <button onClick={() => window.location.reload()} style={{ padding: 10, marginTop: 10 }}>
        Reload App
      </button>
    </div>
  );
}

function Debug404() {
  const location = useLocation();
  return (
    <div style={{ padding: 20, color: 'red', background: 'white' }}>
      <h1>404 Not Found</h1>
      <p>Current Path: {location.pathname}</p>
      <p>Current Hash: {location.hash}</p>
      <p>Full Href: {window.location.href}</p>
    </div>
  );
}
