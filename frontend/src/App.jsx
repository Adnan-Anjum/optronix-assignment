import React from 'react'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { routepath } from './Store/Routes.jsx';

const routerobject = createBrowserRouter(routepath)

const App = () => {
  return (
      <RouterProvider router={routerobject}/>
  )
}

export default App