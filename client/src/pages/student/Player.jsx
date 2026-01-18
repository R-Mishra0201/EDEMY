import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const Player = () => {

  const { enrolledCourses, calculateChapterTime, backendURL, getToken, userData, fetchUserEnrolledCourses } = useContext(AppContext)
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course)
        
        // Find user's rating
        if (course.courseRatings && Array.isArray(course.courseRatings)) {
          course.courseRatings.forEach((item) => {
            if (item.userId === userData?._id) {
              setInitialRating(item.rating)
            }
          })
        }
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0 && courseId && userData) {
      getCourseData()
    }
  }, [enrolledCourses, courseId, userData])

  const markLectureAsCompleted = async (lectureId) => {
    try {
      // Check if already completed
      if (progressData?.lectureCompleted?.includes(lectureId)) {
        toast.info('Lecture already marked as completed');
        return;
      }

      // Save current state for rollback
      const previousData = progressData ? { ...progressData } : null;

      // Optimistic UI update
      setProgressData(prev => ({
        ...prev,
        lectureCompleted: prev?.lectureCompleted 
          ? [...prev.lectureCompleted, lectureId] 
          : [lectureId]
      }));

      // Send to backend
      const token = await getToken();
      const { data } = await axios.post(
        backendURL + '/api/user/update-course-progress',
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        // Optionally refetch to ensure sync
        await getCourseProgress()
      } else {
        toast.error(data.message)
        // Rollback on failure
        if (previousData) {
          setProgressData(previousData);
        }
      }
    } catch (error) {
      console.error('Mark lecture error:', error);
      toast.error(error.response?.data?.message || error.message)
      // Refetch to get accurate state
      await getCourseProgress()
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        backendURL + '/api/user/get-course-progress',
        { courseId },
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (data.success) {
        setProgressData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Get progress error:', error);
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleRate = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        backendURL + '/api/user/add-rating',
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Rating error:', error);
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (courseId) {
      getCourseProgress()
    }
  }, [courseId])

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        
        {/* --- Left Column: Course Structure --- */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          <div className="pt-5">
            {courseData?.courseContent?.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="border border-gray-300 bg-white mb-2 rounded">
                <div 
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" 
                  onClick={() => toggleSection(chapterIndex)}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      className={`transform transition-transform ${openSections[chapterIndex] ? 'rotate-180' : ''}`} 
                      src={assets.down_arrow_icon} 
                      alt="arrow icon" 
                    />
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent?.length || 0} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ${openSections[chapterIndex] ? "max-h-96 overflow-y-auto" : "max-h-0"}`}>
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent?.map((lecture, lectureIndex) => {
                      const isCompleted = progressData?.lectureCompleted?.includes(lecture.lectureId);
                      
                      return (
                        <li key={lecture.lectureId} className="flex items-center gap-2 py-1">
                          <img 
                            src={isCompleted ? assets.blue_tick_icon : assets.play_icon} 
                            alt={isCompleted ? "completed" : "play"} 
                            className="w-4 h-4" 
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureVideoUrl && (
                                <p 
                                  onClick={() => {
                                    setPlayerData({
                                      ...lecture,
                                      chapter: chapterIndex + 1,
                                      lecture: lectureIndex + 1
                                    })
                                  }} 
                                  className="text-blue-500 cursor-pointer hover:underline"
                                >
                                  Watch
                                </p>
                              )}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* --- Right Column: Player --- */}
        <div className='md:mt-10'>
          {playerData ? (
            <div className='w-full'>
              <YouTube
                key={playerData.lectureId}
                videoId={getYouTubeVideoId(playerData.lectureVideoUrl)}
                opts={{
                  playerVars: {
                    autoplay: 1,
                    origin: window.location.origin
                  }
                }}
                iframeClassName="w-full aspect-video"
                onError={(e) => {
                  console.error('YouTube player error:', e);
                  toast.error('Failed to load video. Please check the video URL.');
                }}
              />

              <div className='flex justify-between items-center mt-4 flex-wrap gap-2'>
                <p className='text-xl font-bold'>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button
                  key={`btn-${playerData.lectureId}`}
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className={`px-4 py-2 rounded transition-colors ${
                    progressData?.lectureCompleted?.includes(playerData.lectureId)
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={progressData?.lectureCompleted?.includes(playerData.lectureId)}
                >
                  {progressData?.lectureCompleted?.includes(playerData.lectureId)
                    ? '✓ Completed'
                    : 'Mark as Complete'}
                </button>
              </div>
            </div>
          ) : (
            <div className='w-full'>
              <img 
                src={courseData?.courseThumbnail || ''} 
                alt={courseData?.courseTitle || 'Course thumbnail'} 
                className='w-full rounded' 
              />
              <p className='text-center mt-4 text-gray-600'>Select a lecture to start watching</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default Player