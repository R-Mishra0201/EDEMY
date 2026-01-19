import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
  const {currency, calculateRating} = useContext(AppContext)
  
  // Safety check - if no course data, don't render
  if (!course) {
    return null;
  }
  
  return (
    <Link 
      to={'/course/' + course._id} 
      onClick={() => scrollTo(0,0)}
      className='border border-gray-500/30 overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-200 flex flex-col h-full'
    >
      {/* Fixed aspect ratio for image */}
      <div className='w-full aspect-video bg-gray-200 overflow-hidden'>
        <img 
          className='w-full h-full object-cover'
          src={course.courseThumbnail || ''} 
          alt={course.courseTitle || 'Course thumbnail'} 
        />
      </div>
      
      {/* Content with flex-grow to fill remaining space */}
      <div className='p-3 text-left flex flex-col flex-grow'>
        {/* Title - fixed height with line clamp */}
        <h3 className='text-base font-semibold line-clamp-2 min-h-[3rem] mb-1'>
          {course.courseTitle || 'Untitled Course'}
        </h3>
        
        {/* Educator name - single line */}
        <p className='text-gray-500 text-sm truncate mb-2'>
          {course.educator?.name || 'Educator'}
        </p>
        
        {/* Rating section */}
        <div className='flex items-center space-x-2 mb-2'>
          <p className='text-sm font-medium'>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img 
                key={i} 
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} 
                alt="" 
                className='w-3.5 h-3.5' 
              />
            ))}
          </div>
          <p className='text-gray-500 text-sm'>({course.courseRatings?.length || 0})</p>
        </div>
        
        {/* Price - pushed to bottom */}
        <p className='text-base font-semibold text-gray-800 mt-auto'>
          {currency}{((course.coursePrice || 0) - (course.discount || 0) * (course.coursePrice || 0) / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard
