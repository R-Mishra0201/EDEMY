/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyCourses = () => {

  const { currency, backendURL, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  // ✅ FIXED: Added 'async' keyword
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendURL + '/api/educator/courses',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='md:table-auto table-fixed w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Published On</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-500'>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id} className='border-b border-gray-500/20'>
                    <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center'>
                      <img 
                        src={course.courseThumbnail} 
                        alt={course.courseTitle} 
                        className='w-16 h-16 object-cover rounded' 
                      />
                      <span className='truncate hidden md:block ml-2'>{course.courseTitle}</span>
                    </td>
                    <td className='px-4 py-3'>
                      {currency}
                      {Math.floor(
                        (course.enrolledStudents?.length || 0) * 
                        (course.coursePrice - (course.discount * course.coursePrice / 100))
                      )}
                    </td>
                    <td className='px-4 py-3'>{course.enrolledStudents?.length || 0}</td>
                    <td className='px-4 py-3'>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className='px-4 py-8 text-center text-gray-500'>
                    No courses found. Create your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default MyCourses