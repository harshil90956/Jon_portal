import React, { useRef, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function OtpVerify() {
    const length = 6;
    const [otp, setOtp] = useState(Array(length).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        const value = element.value.replace(/\D/, '');
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join('');
        const email = localStorage.getItem('pendingEmail');

        if (!email || enteredOtp.length !== length) {
            setError("Please enter the full OTP and ensure email is present in signup Form.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('otp', enteredOtp);

            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, {
                email,
                otp: enteredOtp,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            

            if (res.status === 201) {
               toast.success(res.data.message || 'OTP Verified Successfully');
                localStorage.removeItem('pendingEmail');
                navigate('/login');
            } else {
                setError(res.data.message || 'OTP Verification Failed');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h5 className="text-xl font-semibold mb-4">Enter OTP</h5>
            <div className="flex gap-2 mb-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="w-12 h-12 text-center text-lg border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                ))}
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
                onClick={handleVerify}
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-blck transition disabled:opacity-50"
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>
        </div>
    );
}
