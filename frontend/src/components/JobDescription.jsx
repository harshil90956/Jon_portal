import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
        <div className="max-w-7xl mx-auto my-12 px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{singleJob?.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge className="text-blue-700 font-semibold px-3 py-1.5" variant="outline">
                {singleJob?.postion} Positions
              </Badge>
              <Badge className="text-[#F83002] font-semibold px-3 py-1.5" variant="outline">
                {singleJob?.jobType}
              </Badge>
              <Badge className="text-[#7209b7] font-semibold px-3 py-1.5" variant="outline">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>
      
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg text-white transition duration-300 ease-in-out px-6 py-2 text-lg shadow-md ${
              isApplied
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#7209b7] hover:bg-[#5f32ad] hover:scale-105'
            }`}
          >
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        </div>
      
        {/* Divider */}
        <h2 className="mt-10 mb-4 text-xl font-semibold border-b pb-2 border-gray-300 text-gray-800">
          Job Description
        </h2>
      
        {/* Job Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Job Details</h3>
          <ul className="space-y-3 text-gray-700 text-base">
            <li>
              <span className="font-semibold text-gray-900">Role:</span>{' '}
              {singleJob?.title}
            </li>
            <li>
              <span className="font-semibold text-gray-900">Location:</span>{' '}
              {singleJob?.location}
            </li>
            <li>
              <span className="font-semibold text-gray-900">Description:</span>{' '}
              {singleJob?.description}
            </li>
            <li>
              <span className="font-semibold text-gray-900">Experience:</span>{' '}
              {singleJob?.experienceLevel} yrs
            </li>
            <li>
              <span className="font-semibold text-gray-900">Salary:</span>{' '}
              {singleJob?.salary} LPA
            </li>
            <li>
              <span className="font-semibold text-gray-900">Total Applicants:</span>{' '}
              {singleJob?.applications?.length}
            </li>
            <li>
              <span className="font-semibold text-gray-900">Posted Date:</span>{' '}
              {singleJob?.createdAt?.split('T')[0]}
            </li>
          </ul>
        </div>
      </div>
      
    )
}

export default JobDescription