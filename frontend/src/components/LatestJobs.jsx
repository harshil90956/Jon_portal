import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.15
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100
    }
  }
}

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-7xl mx-auto my-20"
    >
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 60 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {allJobs.length <= 0 ? (
          <motion.span className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            No Job Available
          </motion.span>
        ) : (
          allJobs.slice(0, 6).map((job) => (
            <motion.div key={job._id} variants={cardVariants} whileHover={{ scale: 1.03 }}>
              <LatestJobCards job={job} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  )
}

export default LatestJobs
