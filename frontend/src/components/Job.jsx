import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Job = ({ job }) => {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime)
    const currentTime = new Date()
    const timeDifference = currentTime - createdAt
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60))
  }

  const handleSave = () => {
    setIsSaved(true)
    // Optionally trigger API or Redux action
  }

  return (
    <motion.div
      layout
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? 'Today'
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <AnimatePresence mode="wait">
          {isSaved ? (
            <motion.div
              key="saved"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button variant="outline" size="icon" className="rounded-full text-green-600">
                <BookmarkCheck />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="unsaved"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={handleSave}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <Bookmark />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Badge className={'text-blue-700 font-bold'} variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className={'text-[#F83002] font-bold'} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>
        <AnimatePresence>
          {isSaved ? (
            <motion.button
              key="saved-label"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold text-green-600"
              disabled
            >
              Saved
            </motion.button>
          ) : (
            <motion.button
              key="save-label"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={handleSave}
              className="text-sm font-semibold text-[#7209b7]"
            >
              Save for Later
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Job
