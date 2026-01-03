import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom' // 1. Import useLocation
import Home from './pages/student/Home.jsx'
import CoursesList from './pages/student/CoursesList.jsx'
import CourseDetails from './pages/student/CourseDetails.jsx'
import MyEnrollments from './pages/student/MyEnrollments.jsx'
import Player from './pages/student/Player.jsx'
import Loading from './components/student/Loading.jsx'
import Educator from './pages/educator/Educator.jsx'
import Dashboard from './pages/educator/Dashboard.jsx'
import AddCourse from './pages/educator/AddCourse.jsx'
import MyCourses from './pages/educator/MyCourses.jsx'
import StudentsEnrolled from './pages/educator/StudentsEnrolled.jsx'
import Navbar from './components/student/Navbar.jsx'
import "quill/dist/quill.snow.css";

const App = () => {

  // 2. Get the current location
  const location = useLocation()
  
  // 3. Check if the current path is an educator path
  const isEducatorRoute = location.pathname.startsWith('/educator')

  return (
    <div className='text-default min-h-screen bg-white'>
      
      {/* 4. Only show Student Navbar if NOT on an educator route */}
      { !isEducatorRoute && <Navbar /> }
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        
        {/* Educator Routes */}
        <Route path='/educator' element={<Educator />}>
            <Route path='/educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='student-enrolled' element={<StudentsEnrolled />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App