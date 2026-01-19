import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'

const StudentsEnrolled = () => {
  const { backendURL, getToken, isEducator } = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(
        backendURL + '/api/educator/enrolled-students',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        // ✅ CRITICAL: Sanitize ALL student data before setting state
        const sanitizedStudents = (data.enrolledStudents || [])
          .filter(item => {
            // Only include items with complete valid data
            return (
              item && 
              item.student && 
              item.student._id &&
              item.student.name &&
              typeof item.student.name === 'string' &&
              item.courseTitle
            )
          })
          .map(item => ({
            student: {
              _id: item.student._id,
              name: item.student.name,
              imageUrl: item.student.imageUrl || 'https://via.placeholder.com/40'
            },
            courseTitle: item.courseTitle,
            purchaseDate: item.purchaseDate || new Date().toISOString()
          }))

        setEnrolledStudents(sanitizedStudents)
      } else {
        toast.error(data.message || 'Failed to fetch enrolled students')
        setEnrolledStudents([])
      }
    } catch (error) {
      console.error('Fetch enrolled students error:', error)
      toast.error(error.response?.data?.message || error.message)
      setEnrolledStudents([])
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents()
    }
  }, [isEducator])

  // ✅ Early return pattern
  if (enrolledStudents === null) {
    return <Loading />
  }

  return (
    <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <h2 className='pb-4 text-lg font-medium'>Enrolled Students</h2>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='table-fixed md:table-auto w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                <th className='px-4 py-3 font-semibold'>Student Name</th>
                <th className='px-4 py-3 font-semibold'>Course Title</th>
                <th className='px-4 py-3 font-semibold'>Purchase Date</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-500'>
              {enrolledStudents.length > 0 ? (
                enrolledStudents.map((item, index) => (
                  <tr key={item.student._id + index} className='border-b border-gray-500/20'>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>
                      {index + 1}
                    </td>
                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img
                        src={item.student.imageUrl}
                        alt={item.student.name}
                        className='w-9 h-9 rounded-full object-cover'
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://via.placeholder.com/40'
                        }}
                      />
                      <span className='truncate'>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                    <td className='px-4 py-3'>
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='px-4 py-8 text-center text-gray-500'>
                    No enrolled students yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentsEnrolled
