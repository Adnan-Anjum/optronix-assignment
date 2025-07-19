import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, ArrowLeft, MapPin, CheckCircle, User, Mail, Phone, Calendar, UserCheck, X, Sparkles } from 'lucide-react';
import axios from 'axios';
import { port } from '../Store/API';

// Zod schemas for each step
const step1Schema = z.object({
    fullName: z.string().regex(/^[A-Za-z\s]+$/, 'Full Name must contain only letters and spaces').min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().regex(/^\d{10}$/, 'Phone Number must be exactly 10 digits'),
    gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Gender is required' }) }),
    dateOfBirth: z.string().min(1, 'Date of Birth is required'),
    address: z.string().min(1, 'Address is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
});

const step2Schema = z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

const RegistrationForm = () => {
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({});
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [location, setLocation] = useState(null);
const [locationLoading, setLocationLoading] = useState(false);
const [modalOpen, setModalOpen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// Initialize forms for each step
const step1Form = useForm({ resolver: zodResolver(step1Schema) });
const step2Form = useForm({ resolver: zodResolver(step2Schema) });

// Reset function to clear all form data and return to step 1
const resetFormData = () => {
    // Reset all state variables
    setCurrentStep(1);
    setFormData({});
    setShowPassword(false);
    setPasswordStrength('weak');
    setShowConfirmPassword(false);
    setLocation(null);
    setLocationLoading(false);
    setIsSubmitting(false);
    
    // Reset both forms
    step1Form.reset();
    step2Form.reset();
    
    // Reset accuracy error
    setAccuracyError(false);
};

const handleNext = (data, nextStep) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(nextStep);
};

const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
};

const [accuracyError, setAccuracyError] = useState(false);
const handleGetLocation = () => {
    setLocationLoading(true);
    if (false) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy, // Accuracy in meters
            timestamp: new Date(position.timestamp).toISOString(),
            };
            setLocation(locationData);
            step2Form.setValue('latitude', locationData.latitude);
            step2Form.setValue('longitude', locationData.longitude);
            setLocationLoading(false);
            // Validate coordinates
            if (locationData.accuracy > 100) {
                setAccuracyError(true);
            }
        },
        (error) => {
            console.error('Geolocation Error:', error.message, 'Code:', error.code);
            setLocationLoading(false);
            alert('Unable to get location. Error: ' + error.message);
        },
        {
            enableHighAccuracy: true, // Prioritize GPS
            timeout: 10000, // Wait up to 10 seconds
            maximumAge: 0, // No cached results
        }
        );
    } else {
        setLocationLoading(false);
        alert('Geolocation is not supported by this browser.');
    }
    };

const onFinalSubmit = async (data) => {
    setIsSubmitting(true);
    const deviceInfo = getDeviceInfo();

    const payload = { ...formData, ...data, deviceInfo };
    
    try {
        const response = await axios.post(`${port}/req/v1/client/register`, payload, {   
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        // Show success modal first
        setModalOpen(true);
        setModalData(response.data.record);
        // Reset form data after successful registration
        resetFormData();
        
    } catch (err) {
        console.log(err);
        // Handle error (you might want to show an error modal here)
    } finally {
        setIsSubmitting(false);
    }
};

// Success Modal Component
const [modalData, setModalData] = useState({});
const SuccessModal = () => {
    if (!modalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
                onClick={() => setModalOpen(false)}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 border border-gray-600">

                {/* Modal Content */}
                <div className="p-8 text-center">
                    {/* Success Icon with Animation */}
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h3 className="text-lg sm:text-xl md:text-2xl poppins-medium text-white">
                        Registration Successful! 🎉
                    </h3>
                    
                    <p className="text-gray-300 text-sm sm:text-base mb-4 poppins-light">
                        Welcome ! Your account has been created successfully.
                    </p>
                    

                    {/* User Info Summary */}
                    <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
                        <div className="flex items-center justify-center mb-3">
                            <User className="w-5 h-5 text-blue-400 mr-2" />
                            <span className="text-sm font-medium text-gray-300">Account Created For:</span>
                        </div>
                        <p className="text-base sm:text-lg text-white poppins-medium">
                            {modalData.name}
                        </p>
                        <p className="text-sm text-gray-400 poppins-light">
                            {modalData.email}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                // Add navigation logic here (e.g., redirect to dashboard)
                                console.log('Navigate to dashboard');
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 poppins-medium text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            Get Started
                        </button>
                        
                        <button
                            onClick={() => setModalOpen(false)}
                            className="w-full bg-transparent text-gray-300 py-2 px-6 rounded-lg hover:bg-gray-700/50 focus:outline-none focus:ring-4 focus:ring-gray-600 poppins-light text-sm transition-all duration-200 border border-gray-600 hover:border-gray-500"
                        >
                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

const renderProgressBar = () => {
    const progress = (currentStep / 2) * 100;
    return (
    <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-gray-300">Step {currentStep} of 2</span>
        <span className="text-sm font-medium text-blue-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
        ></div>
        </div>
    </div>
    );
};

const renderLocationMap = () => {
    if (!location) return null;
    
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01}%2C${location.latitude-0.01}%2C${location.longitude+0.01}%2C${location.latitude+0.01}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`;
    
    return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                Your Location on Map
            </h3>
            <div className="bg-gray-700 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                ></iframe>
            </div>
            <div className="mt-3 text-sm text-gray-300">
                <p>Lat: {location.latitude?.toFixed(6)}, Lng: {location.longitude?.toFixed(6)}</p>
                <p>
                    Accuracy: <span>
                            {accuracyError ? <span className='text-red-500'>Low</span> : <span className='text-green-500'>High</span>}
                        </span> {(location.accuracy).toFixed(2)} m
                <br />
                </p>
            </div>
        </div>
    );
};

const [addressLength, setAddressLength] = useState(0);

const charCount = (e)=>{
    setAddressLength(e.currentTarget.value.length);
}


// Password strength calculation
const [passwordStrength, setPasswordStrength] = useState('weak');

const calculatePasswordStrength = (password) => {
    let strength = 'weak';
    const lengthScore = password.length >= 8 ? 1 : 0;
    const hasUpperCase = /[A-Z]/.test(password) ? 1 : 0;
    const hasLowerCase = /[a-z]/.test(password) ? 1 : 0;
    const hasNumbers = /\d/.test(password) ? 1 : 0;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 1 : 0;
    
    const score = lengthScore + hasUpperCase + hasLowerCase + hasNumbers + hasSpecial;

    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';
    else strength = 'weak';
    setPasswordStrength(strength);
};

useEffect(()=>{
    calculatePasswordStrength(step1Form.watch('password'));
},[step1Form.watch('password')])


const getDeviceInfo = () => {
        const userAgent = navigator?.userAgent;
        let deviceType = 'unknown';
        
        // Basic device type detection
        if (/mobile/i.test(userAgent)) {
            deviceType = 'mobile';
        } else if (/tablet/i.test(userAgent)) {
            deviceType = 'tablet';
        } else {
            deviceType = 'desktop';
        }

        return {
            userAgent: userAgent,
            platform: navigator.platform || 'unknown',
            browserLanguage: navigator.language || navigator.userLanguage || 'unknown',
            deviceType: deviceType,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString()
        };
    };

const renderStep = () => {
    switch (currentStep) {
    case 1:
        return (
        <div className="space-y-6">
            <div className="text-center mb-4">
            <div className="flex items-center justify-center mx-auto mb-2">
                <div className='p-2 bg-blue-600 rounded-full'>
                    <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={1.2} />
                </div>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl poppins-medium text-white">Create Your Account</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Fill in your details to get started</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Full Name *
                </label>
                <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                    {...step1Form.register('fullName')}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 bg-gray-800 text-white placeholder-gray-500 ${
                    step1Form.formState.errors.fullName ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                />
                </div>
                {step1Form.formState.errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.fullName.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Email Address *
                </label>
                <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                    type="email"
                    {...step1Form.register('email')}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 bg-gray-800 text-white placeholder-gray-500 ${
                    step1Form.formState.errors.email ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                />
                </div>
                {step1Form.formState.errors.email && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.email.message}</p>
                )}
            </div>

            {/* Phone Number */}
            <div>
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Phone Number *
                </label>
                <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                    type="text"
                    {...step1Form.register('phoneNumber')}
                    placeholder="Enter your phone number"
                    className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 bg-gray-800 text-white placeholder-gray-500 ${
                    step1Form.formState.errors.phoneNumber ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                />
                </div>
                {step1Form.formState.errors.phoneNumber && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.phoneNumber.message}</p>
                )}
            </div>

            {/* Gender */}
            <div>
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Gender *
                </label>
                <select
                {...step1Form.register('gender')}
                className={`w-full text-sm sm:text-base px-4 py-2 border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 bg-gray-800 text-white ${
                    step1Form.formState.errors.gender ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                }`}
                >
                <option value="" className="bg-gray-800">Select your gender</option>
                <option value="Male" className="bg-gray-800">Male</option>
                <option value="Female" className="bg-gray-800">Female</option>
                <option value="Other" className="bg-gray-800">Other</option>
                </select>
                {step1Form.formState.errors.gender && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.gender.message}</p>
                )}
            </div>

            {/* Date of Birth */}
            <div>
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Date of Birth *
                </label>
                <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                    type="date"
                    {...step1Form.register('dateOfBirth')}
                    className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 bg-gray-800 text-white [color-scheme:dark] ${
                    step1Form.formState.errors.dateOfBirth ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                />
                </div>
                {step1Form.formState.errors.dateOfBirth && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.dateOfBirth.message}</p>
                )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Complete Address *
                </label>
                <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <textarea
                    {...step1Form.register('address')}
                    placeholder="Enter your complete address"
                    rows="3"
                    className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 resize-none bg-gray-800 text-white placeholder-gray-500 ${
                    step1Form.formState.errors.address ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onChange={charCount}
                />
                </div>
                {step1Form.formState.errors.address && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.address.message}</p>
                )}
                {addressLength !=0 && <p className="text-xs text-gray-400 mt-1">Characters : {addressLength}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Password *
                </label>
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    {...step1Form.register('password')}
                    placeholder="Create a strong password"
                    className={`w-full text-sm sm:text-base px-4 py-2 border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 pr-12 bg-gray-800 text-white placeholder-gray-500 ${
                    step1Form.formState.errors.password ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                </div>
                {step1Form.formState.errors.password && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.password.message}</p>
                )}

                <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-300">Password Strength:</span>
                        <span className={`text-xs capitalize ${
                            passwordStrength === 'strong' ? 'text-green-400' :
                            passwordStrength === 'medium' ? 'text-yellow-400' :
                            'text-red-400'
                        }`}>
                            {passwordStrength}
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                passwordStrength === 'strong' ? 'bg-green-400 w-full' :
                                passwordStrength === 'medium' ? 'bg-yellow-400 w-2/3' :
                                'bg-red-400 w-1/3'
                            }`}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-xs sm:text-sm poppins-medium text-gray-300 mb-2">
                Confirm Password *
                </label>
                <div className="relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...step1Form.register('confirmPassword')}
                    placeholder="Confirm your password"
                    className={`w-full text-sm sm:text-base px-4 py-2 border-1 rounded-lg poppins-light focus:outline-none focus:border-blue-500 transition-all duration-200 pr-12 bg-gray-800 text-white placeholder-gray-500 ${
                    step1Form.formState.errors.confirmPassword ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                </div>
                {step1Form.formState.errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{step1Form.formState.errors.confirmPassword.message}</p>
                )}
            </div>
            </div>

            <button
            type="button"
            onClick={step1Form.handleSubmit((data) => handleNext(data, 2))}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 poppins-medium text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
            Continue to Location Setup
            </button>
        </div>
        );
    case 2:
        return (
        <div className="space-y-6">
            <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl poppins-medium text-white">Enable Location Services</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
                Help us provide personalized recommendations and services based on your location.
            </p>
            </div>

            {/* Map Section */}
            {location && renderLocationMap()}

            <div className="space-y-4">
            {!location && (
                <>
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 poppins-medium text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    >
                        {locationLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                            Getting your location...
                        </div>
                        ) : (
                        <div className="flex items-center justify-center">
                            <MapPin className="w-6 h-6 mr-3" />
                            Enable Location Access
                        </div>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={step2Form.handleSubmit(onFinalSubmit)}
                        disabled={isSubmitting}
                        className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-600 poppins-medium text-sm sm:text-base transition-all duration-200 border-1 border-gray-600 hover:border-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-transparent mr-2"></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Skip for now'
                        )}
                    </button>
                </>
            )}

            {location && (
                <button
                type="button"
                onClick={step2Form.handleSubmit(onFinalSubmit)}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-green-200 poppins-medium text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                {isSubmitting ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                        Creating Account...
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 mr-3" />
                        Complete Registration
                    </div>
                )}
                </button>
            )}
            </div>
        </div>
        );
    default:
        return null;
    }
};

return (
    <div className="min-h-screen bg-gray-900 sm:bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-2 sm:p-4">
    <div className="sm:bg-gray-800 rounded-3xl sm:shadow-2xl max-w-4xl w-full py-4 sm:p-8 mx-4 sm:border sm:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-0">
        {currentStep > 1 && (
            <button
            onClick={handleBack}
            className="p-3 hover:bg-gray-700 rounded-full transition-colors"
            >
            <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
        )}
        {currentStep > 1 && <div className="w-12"></div>}
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Form Content */}
        <div className="space-y-6">
        {renderStep()}
        </div>

    </div>
    
    {/* Success Modal */}
    <SuccessModal />
    </div>
);
};

export default RegistrationForm;