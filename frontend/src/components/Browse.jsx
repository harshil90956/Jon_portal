import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { motion } from 'framer-motion'

const Browse = () => {
  useGetAllJobs()
  const { allJobs } = useSelector((store) => store.job)
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(''))
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-bold text-3xl sm:text-4xl text-gray-800 mb-10">
          Search Results ({allJobs.length})
        </h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {allJobs.map((job) => (
            <motion.div key={job._id} variants={cardVariants}>
              <Job job={job} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Browse
