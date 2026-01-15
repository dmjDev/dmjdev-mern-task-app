import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthProvider'
import { TasksProvider } from './context/TasksProvider'

import { Navbar } from './components/Navbar'

import LoginPage from './pages/LoginPage'
import TasksPage from './pages/TasksPage'
import RegisterPage from './pages/RegisterPage'
import TaskFormPage from './pages/TaskFormPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <AuthProvider>
      <TasksProvider>
        <BrowserRouter>
          <main className='container mx-auto px-5' style={{ minWidth: '550px' }}>
            <Navbar />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='*' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/login/:failCode' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path='/tasks' element={<TasksPage />} />
                <Route path='/tasks/new' element={<TaskFormPage />} />
                <Route path='/tasks/:id' element={<TaskFormPage />} />
                <Route path='/profile' element={<ProfilePage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TasksProvider>
    </AuthProvider>
  )
}

export default App