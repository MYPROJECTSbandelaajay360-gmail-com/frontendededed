"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

/**
 * Task Category Page Client Component
 * Renders the page with dynamic content from MongoDB
 * Uses the same layout as Accounting page
 */
const TaskCategoryPageClient = ({ category }) => {
    const router = useRouter();

    // State to manage the selected task frequency
    const [selectedTasks, setSelectedTasks] = useState("1-2 tasks per week");
    // State to manage the selected period for Earning Potential section
    const [selectedPeriod, setSelectedPeriod] = useState("weekly");
    // State to manage the selected period for Income Opportunities section
    const [selectedIncomePeriod, setSelectedIncomePeriod] = useState("weekly");
    // State to manage accordion open/close state
    const [openAccordion, setOpenAccordion] = useState(null);
    // State to manage error modal
    const [errorModal, setErrorModal] = useState({ show: false, message: "" });

    // Function to toggle accordion
    const toggleAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    // Function to convert text to slug
    const textToSlug = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    };

    // Function to check if page exists and navigate
    const handleHeadingClick = async (headingText, categorySlug = null, subcategorySlug = null) => {
        try {
            let categorySlugToCheck = categorySlug;
            let subcategorySlugToCheck = subcategorySlug;

            // If heading contains both category and subcategory (e.g., "Accounting - Financial Modelling" or "Accounting / Financial Modelling")
            if (headingText.includes(' - ') || headingText.includes(' / ') || headingText.includes(' – ')) {
                const parts = headingText.split(/[-\/–]/).map(p => p.trim()).filter(p => p);
                if (parts.length >= 2) {
                    categorySlugToCheck = textToSlug(parts[0]);
                    subcategorySlugToCheck = textToSlug(parts[1]);
                }
            } else if (!categorySlugToCheck && !subcategorySlugToCheck) {
                // If no category/subcategory provided, try as category first, then as subcategory with current category
                categorySlugToCheck = textToSlug(headingText);

                // First check as category
                let params = new URLSearchParams({ categorySlug: categorySlugToCheck });
                let response = await fetch(`/api/check-page-exists?${params.toString()}`);
                let data = await response.json();

                if (data.exists && data.url) {
                    router.push(data.url);
                    return;
                }

                // If not found as category, try as subcategory with current category
                if (category?.slug) {
                    subcategorySlugToCheck = categorySlugToCheck;
                    categorySlugToCheck = category.slug;
                }
            }

            // Check if page exists
            const params = new URLSearchParams({ categorySlug: categorySlugToCheck || category?.slug || '' });
            if (subcategorySlugToCheck) {
                params.append('subcategorySlug', subcategorySlugToCheck);
            }

            const response = await fetch(`/api/check-page-exists?${params.toString()}`);
            const data = await response.json();

            if (data.exists && data.url) {
                // Page exists, navigate to it
                router.push(data.url);
            } else {
                // Page doesn't exist, show error modal
                setErrorModal({
                    show: true,
                    message: `Page not available for "${headingText}". Please go back.`
                });
            }
        } catch (error) {
            console.error('Error checking page existence:', error);
            setErrorModal({
                show: true,
                message: `Error checking page for "${headingText}". Please go back.`
            });
        }
    };

    // Function to close error modal
    const closeErrorModal = () => {
        setErrorModal({ show: false, message: "" });
    };

    // Calculate earnings based on selected tasks (from database)
    const earnings = {
        "1-2 tasks per week": category.earnings1to2 || "₹1,039",
        "3-5 tasks per week": category.earnings3to5 || "₹2,598",
        "5+ tasks per week": category.earnings5plus || "₹3,637"
    };


    return (
        <>
            {/* Error Modal */}
            {errorModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Page Not Available</h3>
                        <p className="text-gray-700 mb-6">{errorModal.message}</p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={closeErrorModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className="relative min-h-[calc(100vh-56px)] flex justify-between items-start mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] text-white overflow-hidden flex-col md:flex-row gap-6 sm:gap-8">
                {/* Background Image */}
                {category.heroImage ? (
                    category.heroImage.startsWith('data:') || category.heroImage.startsWith('http') ? (
                        <img
                            src={category.heroImage}
                            alt={category.name}
                            className="absolute inset-0 w-full h-full object-cover z-0"
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : (
                        <Image
                            src={category.heroImage}
                            alt={category.name}
                            fill
                            sizes="100vw"
                            className="absolute inset-0 w-full h-full object-cover z-0"
                            priority
                        />
                    )
                ) : (
                    <Image
                        src="/images/accounting.webp"
                        alt={category.name}
                        fill
                        sizes="100vw"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                )}

                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none z-[1]"
                    style={{
                        background: 'linear-gradient(140deg, rgba(9,12,28,0.6), rgba(10,101,252,0.01))'
                    }}
                ></div>

                {/* Left Content */}
                <div className="relative z-[2] max-w-[560px]">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm sm:text-base mb-4 sm:mb-6 text-white/80">
                        <Link
                            href="/"
                            className="text-inherit no-underline transition-colors duration-200 hover:text-white"
                        >
                            Home
                        </Link>
                        <span>/</span>
                        <Link
                            href="/tasks/"
                            className="text-inherit no-underline transition-colors duration-200 hover:text-white"
                        >
                            Tasks
                        </Link>
                        <span>/</span>
                        <span className="font-bold text-white">{category.name}</span>
                    </div>

                    {/* Heading */}
                    <div className="heading-group">
                        <h1 className="text-[clamp(1.75rem,4vw,4rem)] mb-3 sm:mb-4 font-bold mt-4 sm:mt-6 md:mt-8 lg:mt-12">
                            {category.heroTitle}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mt-6 sm:mt-8 md:mt-10 lg:mt-14">
                            {category.heroDescription}
                        </p>
                    </div>
                </div>

                {/* Right Side Card */}
                <div className="relative z-[2] bg-white rounded-lg p-4 max-w-full md:max-w-[400px] w-full shadow-lg mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                    <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
                        See what you could earn
                    </h2>

                    <div className="border-t border-gray-300 w-full mb-4"></div>

                    {/* Task Frequency Dropdown */}
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <select
                                value={selectedTasks}
                                onChange={(e) => setSelectedTasks(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="1-2 tasks per week">1-2 tasks per week</option>
                                <option value="3-5 tasks per week">3-5 tasks per week</option>
                                <option value="5+ tasks per week">5+ tasks per week</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Location Input */}
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={category.location || "India"}
                                readOnly
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-300 w-full mb-4"></div>

                    {/* Earnings Display */}
                    <div className="text-center mb-4">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                            {earnings[selectedTasks]}
                        </p>
                        <p className="text-gray-600">{category.earningsPeriod || "per month"}</p>
                    </div>

                    {/* Join Button */}
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 mb-3">
                        Join Extrahand
                    </button>

                    {/* Disclaimer */}
                    <p className="text-center text-sm text-gray-500">
                        {category.disclaimer}
                    </p>
                </div>
            </section>

            {/* Why Join Extrahand Section */}
            {category.whyJoinTitle && category.whyJoinFeatures && category.whyJoinFeatures.length > 0 && (
                <section
                    className="relative min-h-[calc(100vh-10px)] mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(249, 243, 239)' }}
                >
                    <div className="mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {category.whyJoinTitle}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
                        {category.whyJoinFeatures.map((feature, index) => {
                            // Different icons for each feature
                            const icons = [
                                // All on your terms - Clock icon
                                <svg key={index} className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>,
                                // Get going for free - Lightning icon
                                <svg key={index} className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>,
                                // Secure payments - Lock icon
                                <svg key={index} className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>,
                                // Skills can thrill - Lightbulb icon
                                <svg key={index} className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            ];

                            return (
                                <div key={index} className="flex flex-col items-center text-center">
                                    <div className="mb-5">
                                        {icons[index] || icons[0]}
                                    </div>
                                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed text-base">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-start">
                        <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 mt-8 sm:mt-10 md:mt-12 text-sm sm:text-base">
                            {category.whyJoinButtonText || "Join Extrahand"}
                        </button>
                    </div>
                </section>
            )}

            {/* Static Tasks Section - After Why Join Extrahand */}
            {category.staticTasks && Array.isArray(category.staticTasks) && category.staticTasks.length > 0 && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(243, 247, 255)' }}
                >
                    <div className="mb-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {category.staticTasksSectionTitle || `${category.name} tasks in ${category.location || "India"}`}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700">
                            {category.staticTasksSectionDescription || "Check out what tasks people want done near you right now..."}
                        </p>
                    </div>

                    {/* Static Task Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
                        {category.staticTasks.map((task, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-2">
                                        {task.title || "Task Title"}
                                    </h3>
                                    <span className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
                                        {task.price || "₹0"}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    {task.description || "Task description"}
                                </p>

                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs text-gray-600">{task.date || "Thu Dec 4 2025"}</span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs text-gray-600">{task.timeAgo || "about 3 hours ago"}</span>
                                </div>

                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                    <span className="text-sm font-medium text-green-600">{task.status || "Open"}</span>
                                    <div className="flex items-center gap-2">
                                        {task.profileImage ? (
                                            <img
                                                src={task.profileImage}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const defaultIcon = e.target.parentElement.querySelector('.default-icon');
                                                    if (defaultIcon) defaultIcon.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center default-icon ${task.profileImage ? 'hidden' : ''}`}
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition-colors duration-200 text-xs sm:text-sm">
                                    Make an offer
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-300">
                        <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-md transition-colors duration-200 text-sm sm:text-base">
                            {category.browseAllTasksButtonText || "Browse all tasks"}
                        </button>
                        <p className="text-sm text-gray-600">
                            {category.lastUpdatedText || (() => {
                                const today = new Date();
                                const day = today.getDate();
                                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                const month = monthNames[today.getMonth()];
                                const year = today.getFullYear();
                                const getOrdinalSuffix = (day) => {
                                    if (day > 3 && day < 21) return 'th';
                                    switch (day % 10) {
                                        case 1: return 'st';
                                        case 2: return 'nd';
                                        case 3: return 'rd';
                                        default: return 'th';
                                    }
                                };
                                return `Last updated on ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
                            })()}
                        </p>
                    </div>
                </section>
            )}

            {/* Tasks Section - After Why Join Extrahand */}
            {category.tasks && Array.isArray(category.tasks) && category.tasks.length > 0 && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(243, 247, 255)' }}
                >
                    <div className="mb-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {category.name} tasks in {category.location || "India"}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700">
                            Check out what tasks people want done near you right now...
                        </p>
                    </div>

                    {/* Task Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
                        {category.tasks.map((task, index) => {
                            // Get current date - dynamic
                            const today = new Date();
                            const day = today.getDate();
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            const month = monthNames[today.getMonth()];
                            const year = today.getFullYear();
                            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                            const dayName = dayNames[today.getDay()];
                            const currentDate = `${dayName} ${month} ${day} ${year}`;

                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-2">
                                            {task.title || "Task Title"}
                                        </h3>
                                        <span className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
                                            {task.price || "₹0"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        {task.description || "Task description"}
                                    </p>

                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs text-gray-600">{currentDate}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-xs text-gray-600">about 3 hours ago</span>
                                    </div>

                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                        <span className="text-sm font-medium text-green-600">Open</span>
                                        <div className="flex items-center gap-2">
                                            {task.profileImage ? (
                                                <img
                                                    src={task.profileImage}
                                                    alt="Profile"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    onError={(e) => {
                                                        // Hide image and show default icon if image fails
                                                        e.target.style.display = 'none';
                                                        const defaultIcon = e.target.parentElement.querySelector('.default-icon');
                                                        if (defaultIcon) defaultIcon.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center default-icon ${task.profileImage ? 'hidden' : ''}`}
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 text-sm">
                                        Make an offer
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-300">
                        <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-md transition-colors duration-200 text-sm sm:text-base">
                            Browse all tasks
                        </button>
                        <p className="text-sm text-gray-600">
                            Last updated on {(() => {
                                const today = new Date();
                                const day = today.getDate();
                                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                const month = monthNames[today.getMonth()];
                                const year = today.getFullYear();
                                const getOrdinalSuffix = (day) => {
                                    if (day > 3 && day < 21) return 'th';
                                    switch (day % 10) {
                                        case 1: return 'st';
                                        case 2: return 'nd';
                                        case 3: return 'rd';
                                        default: return 'th';
                                    }
                                };
                                return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
                            })()}
                        </p>
                    </div>
                </section>
            )}

            {/* Earning Potential Section - After Static Tasks */}
            {category.earningPotentialTitle && category.earningPotentialData && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(6, 18, 87)' }}
                >
                    {/* Heading - Top Left */}
                    <div className="mb-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                            {category.earningPotentialTitle || 'Discover your earning potential in India'}
                        </h2>
                        <p className="text-lg text-white/90 mb-6">
                            {category.earningPotentialDescription || 'Earn money with every task'}
                        </p>
                    </div>

                    {/* Period Buttons */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setSelectedPeriod("weekly")}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold transition-colors duration-200 ${selectedPeriod === "weekly"
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                        >
                            weekly
                        </button>
                        <button
                            onClick={() => setSelectedPeriod("monthly")}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold transition-colors duration-200 ${selectedPeriod === "monthly"
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                        >
                            monthly
                        </button>
                        <button
                            onClick={() => setSelectedPeriod("yearly")}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold transition-colors duration-200 ${selectedPeriod === "yearly"
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                        >
                            yearly
                        </button>
                    </div>

                    {/* Three Cards in a Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Card 1: 1-2 tasks */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="text-center">
                                {/* Money at top */}
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                    {category.earningPotentialData?.[selectedPeriod]?.['1-2'] || '₹0'}
                                </p>
                                {/* Period label below money */}
                                <p className="text-sm text-gray-600 mb-2">
                                    {selectedPeriod === 'weekly' ? 'per week' : selectedPeriod === 'monthly' ? 'per month' : 'per year'}
                                </p>
                                {/* Tasks label below period */}
                                <p className="text-base text-gray-800 font-medium">
                                    1-2 tasks per week
                                </p>
                            </div>
                        </div>

                        {/* Card 2: 3-5 tasks */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="text-center">
                                {/* Money at top */}
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                    {category.earningPotentialData?.[selectedPeriod]?.['3-5'] || '₹0'}
                                </p>
                                {/* Period label below money */}
                                <p className="text-sm text-gray-600 mb-2">
                                    {selectedPeriod === 'weekly' ? 'per week' : selectedPeriod === 'monthly' ? 'per month' : 'per year'}
                                </p>
                                {/* Tasks label below period */}
                                <p className="text-base text-gray-800 font-medium">
                                    3-5 tasks per week
                                </p>
                            </div>
                        </div>

                        {/* Card 3: 5+ tasks */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="text-center">
                                {/* Money at top */}
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                    {category.earningPotentialData?.[selectedPeriod]?.['5+'] || '₹0'}
                                </p>
                                {/* Period label below money */}
                                <p className="text-sm text-gray-600 mb-2">
                                    {selectedPeriod === 'weekly' ? 'per week' : selectedPeriod === 'monthly' ? 'per month' : 'per year'}
                                </p>
                                {/* Tasks label below period */}
                                <p className="text-base text-gray-800 font-medium">
                                    5+ tasks per week
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer Text - Before Button */}
                    {category.earningPotentialDisclaimer && (
                        <div className="mb-6">
                            <p className="text-sm text-white/80">
                                {category.earningPotentialDisclaimer}
                            </p>
                        </div>
                    )}

                    {/* Join Button - Last */}
                    <div>
                        <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200">
                            {category.earningPotentialButtonText || 'Join Extrahand'}
                        </button>
                    </div>
                </section>
            )}

            {/* Income Opportunities Section - After Earning Potential Section and Before SEO */}
            {category.incomeOpportunitiesTitle && category.incomeOpportunitiesData && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(249, 243, 239)' }}
                >
                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {category.incomeOpportunitiesTitle || 'Unlock new income opportunities in India'}
                        </h2>
                        <p className="text-lg text-gray-700 mb-6">
                            {category.incomeOpportunitiesDescription || `Explore ${category.name} related tasks and discover your financial opportunities`}
                        </p>
                    </div>

                    {/* Period Buttons */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setSelectedIncomePeriod("weekly")}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold transition-colors duration-200 ${selectedIncomePeriod === "weekly"
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setSelectedIncomePeriod("monthly")}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold transition-colors duration-200 ${selectedIncomePeriod === "monthly"
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setSelectedIncomePeriod("yearly")}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold transition-colors duration-200 ${selectedIncomePeriod === "yearly"
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            Yearly
                        </button>
                    </div>

                    {/* Table for Selected Period */}
                    {(() => {
                        const periodData = category.incomeOpportunitiesData?.[selectedIncomePeriod];
                        const hasData = periodData && Array.isArray(periodData) && periodData.length > 0;

                        if (!hasData) {
                            return (
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                                    <p className="text-center text-gray-500">No data available for {selectedIncomePeriod} period.</p>
                                </div>
                            );
                        }

                        return (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                                    Type of {category.name} job
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                                                    1-2 tasks/week
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                                                    3-5 tasks/week
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                                                    5+ tasks/week
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {periodData.map((row, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-100">
                                                        {row?.jobType ? row.jobType.replace(/accounting/gi, category.name) : ""}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800 text-center border-b border-gray-100">
                                                        {row?.["1-2"] || ""}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800 text-center border-b border-gray-100">
                                                        {row?.["3-5"] || ""}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800 text-center border-b border-gray-100">
                                                        {row?.["5+"] || ""}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Disclaimer */}
                    {category.incomeOpportunitiesDisclaimer && (
                        <div className="mt-8 pt-6">
                            <p className="text-sm text-gray-600">
                                {category.incomeOpportunitiesDisclaimer.replace(/accounting/gi, category.name)}
                            </p>
                        </div>
                    )}
                </section>
            )}

            {/* How to Earn Money Section - After Income Opportunities Section and Before SEO */}
            {category.howToEarnTitle && category.howToEarnSteps && category.howToEarnSteps.length > 0 && (
                <section className="relative mx-24 rounded-3xl my-16 py-20 px-[100px] overflow-hidden max-[992px]:py-[60px] max-[992px]:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Title */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 text-left">
                            {category.howToEarnTitle || 'How to earn money on Extrahand'}
                        </h2>

                        {/* Steps - 3 Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {category.howToEarnSteps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center text-center">
                                    {/* Image */}
                                    {step.image && (
                                        <div className="w-full mb-6">
                                            <img
                                                src={step.image}
                                                alt={step.subtitle || `Step ${index + 1}`}
                                                className="w-full h-auto rounded-lg object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="w-full">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {step.subtitle || ''}
                                        </h3>
                                        <p className="text-base text-gray-700">
                                            {step.description || ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        {category.howToEarnButtonText && (
                            <div className="mt-8 text-left">
                                <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200">
                                    {category.howToEarnButtonText}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Get Inspired: Top Taskers Section */}
            {category.getInspiredTitle && category.topTaskers && category.topTaskers.length > 0 && (
                <section className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden" style={{ backgroundColor: 'rgb(243, 243, 247)' }}>
                    <div className="max-w-6xl mx-auto">
                        {/* Section Title */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 text-left">
                            {category.getInspiredTitle}
                        </h2>

                        {/* Tasker Cards - 3 Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {category.topTaskers.map((tasker, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    {/* Meet Text, Name, Years on Left - Profile Image on Right */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        {/* Left Side: Meet Text, Name, Years */}
                                        <div className="flex-1">
                                            {tasker.meetText && (
                                                <p className="text-sm text-gray-600 mb-2">{tasker.meetText}</p>
                                            )}
                                            {tasker.name && (
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                                    {tasker.name}
                                                </h3>
                                            )}
                                            {tasker.yearsOnExtrahand && (
                                                <p className="text-sm text-gray-600">{tasker.yearsOnExtrahand}</p>
                                            )}
                                        </div>

                                        {/* Right Side: Profile Image */}
                                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                            {tasker.profileImage ? (
                                                <img
                                                    src={tasker.profileImage}
                                                    alt={tasker.name || `Tasker ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    {tasker.location && (
                                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{tasker.location}</span>
                                        </div>
                                    )}

                                    {/* Rating and Stats Section */}
                                    <div className="border-t border-gray-200 pt-4 mt-4 rounded-lg p-4" style={{ backgroundColor: 'rgb(243, 247, 255)' }}>
                                        <div className="flex justify-between items-start gap-4">
                                            {/* Left: Rating Section */}
                                            <div className="flex-1">
                                                {tasker.rating && (
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <span className="text-base sm:text-lg font-semibold text-gray-900">{tasker.rating}</span>
                                                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {tasker.overallRatingText && (
                                                    <p className="text-xs text-gray-600 mb-1">{tasker.overallRatingText}</p>
                                                )}
                                                {tasker.reviewsCount && (
                                                    <p className="text-sm text-gray-700">{tasker.reviewsCount}</p>
                                                )}
                                            </div>

                                            {/* Right: Completion Rate Section */}
                                            <div className="flex-1 text-right">
                                                {tasker.completionRate && (
                                                    <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{tasker.completionRate}</p>
                                                )}
                                                {tasker.completionRateText && (
                                                    <p className="text-xs text-gray-600 mb-1">{tasker.completionRateText}</p>
                                                )}
                                                {tasker.tasksCount && (
                                                    <p className="text-sm text-gray-700">{tasker.tasksCount}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        {category.getInspiredButtonText && (
                            <div className="mt-8 text-left">
                                <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200">
                                    {category.getInspiredButtonText}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* We've Got You Covered Section */}
            {category.insuranceCoverTitle && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden flex justify-center justify-items-center"
                >
                    {/* Heading - Top Left */}
                    <div className="mb-6 flex flex-col items-start justify-center gap-8">
                        {category.insuranceCoverTitle && (
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                                {category.insuranceCoverTitle}
                            </h2>
                        )}
                        {category.insuranceCoverDescription && (
                            <p className="text-lg text-gray-700 mb-6">
                                {category.insuranceCoverDescription}
                            </p>
                        )}
                        {category.insuranceCoverButtonText && (
                            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-200 mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base">
                                {category.insuranceCoverButtonText}
                            </button>
                        )}
                    </div>

                    {/* Three Columns */}
                    {category.insuranceCoverFeatures && Array.isArray(category.insuranceCoverFeatures) && category.insuranceCoverFeatures.length >= 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mt-4">
                            {/* Column 1: Empty or placeholder */}
                            <div></div>

                            {/* Column 2: Public liability insurance */}
                            <div className="flex flex-col items-start justify-start mt-10 gap-8">
                                <div className="flex items-center gap-3 mb-4">
                                    {/* Human face icon */}
                                    {category.insuranceCoverFeatures[0]?.icon === "human" && (
                                        <svg
                                            className="w-8 h-8 text-gray-800"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    )}
                                    {category.insuranceCoverFeatures[0]?.subtitle && (
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                            {category.insuranceCoverFeatures[0].subtitle}
                                        </h3>
                                    )}
                                </div>
                                {category.insuranceCoverFeatures[0]?.subdescription && (
                                    <p className="text-gray-700 leading-relaxed text-base">
                                        {category.insuranceCoverFeatures[0].subdescription}
                                    </p>
                                )}
                            </div>

                            {/* Column 3: Top rated insurance */}
                            <div className="flex flex-col items-start justify-start mt-10 gap-10">
                                <div className="flex items-center gap-3 mb-4">
                                    {/* Star icon */}
                                    {category.insuranceCoverFeatures[1]?.icon === "star" && (
                                        <svg
                                            className="w-8 h-8 text-amber-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    )}
                                    {category.insuranceCoverFeatures[1]?.subtitle && (
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                            {category.insuranceCoverFeatures[1].subtitle}
                                        </h3>
                                    )}
                                </div>
                                {category.insuranceCoverFeatures[1]?.subdescription && (
                                    <p className="text-gray-700 leading-relaxed text-base">
                                        {category.insuranceCoverFeatures[1].subdescription}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Top Accounting related questions Section */}
            {category.questionsTitle && category.questions && Array.isArray(category.questions) && category.questions.length > 0 && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(249, 243, 239)' }}
                >
                    {/* Heading */}
                    <div className="mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {category.questionsTitle}
                        </h2>
                    </div>

                    {/* Accordion */}
                    <div className="space-y-4">
                        {category.questions.map((question, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                                >
                                    {question.subtitle && (
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 pr-2 sm:pr-4">
                                            {question.subtitle}
                                        </h3>
                                    )}
                                    <svg
                                        className={`w-6 h-6 text-gray-600 shrink-0 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    {question.description && (
                                        <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                                            {question.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Ways to earn money with accounting tasks Section */}
            {category.waysToEarnTitle && category.waysToEarnContent && Array.isArray(category.waysToEarnContent) && category.waysToEarnContent.length > 0 && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                >
                    {/* Heading - Top Left */}
                    <div className="mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {category.waysToEarnTitle}
                        </h2>
                    </div>

                    {/* Three Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Distribute content items across 3 columns */}
                        {(() => {
                            // Split content items into 3 columns
                            const itemsPerColumn = Math.ceil(category.waysToEarnContent.length / 3);
                            const columns = [[], [], []];

                            category.waysToEarnContent.forEach((item, index) => {
                                const columnIndex = Math.floor(index / itemsPerColumn);
                                if (columnIndex < 3) {
                                    columns[columnIndex].push(item);
                                }
                            });

                            return columns.map((columnItems, colIndex) => (
                                <div key={colIndex} className="flex flex-col gap-6">
                                    {columnItems.map((item, itemIndex) => (
                                        <React.Fragment key={itemIndex}>
                                            {/* If item has heading, show heading first */}
                                            {item.heading && (
                                                <h3 className={`text-xl sm:text-2xl font-semibold text-gray-800 ${itemIndex > 0 || colIndex > 0 ? '' : ''}`}>
                                                    {item.heading}
                                                </h3>
                                            )}

                                            {/* Text Content - split by newlines into paragraphs */}
                                            {item.text && (
                                                item.text.split('\n\n').filter(p => p.trim()).map((paragraph, pIndex) => (
                                                    <p key={pIndex} className="text-gray-700 leading-relaxed text-base">
                                                        {paragraph.trim()}
                                                    </p>
                                                ))
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ));
                        })()}
                    </div>
                </section>
            )}

            {/* Explore other ways to earn money Section */}
            {category.exploreOtherWaysTitle && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                >
                    {/* Heading - Top Left */}
                    <div className="mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                            {category.exploreOtherWaysTitle}
                        </h2>
                    </div>

                    {/* Two Images in One Row */}
                    {category.exploreOtherWaysTasks && Array.isArray(category.exploreOtherWaysTasks) && category.exploreOtherWaysTasks.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {category.exploreOtherWaysTasks.map((task, index) => (
                                <div key={index} className="flex flex-col">
                                    {/* Image Card */}
                                    <div className="w-full h-[300px] relative rounded-lg overflow-hidden mb-4">
                                        {task.image ? (
                                            task.image.startsWith('data:') || task.image.startsWith('http') ? (
                                                <img
                                                    src={task.image}
                                                    alt={task.subtitle || `Task ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Image
                                                    src={task.image}
                                                    alt={task.subtitle || `Task ${index + 1}`}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            )
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Subtitle */}
                                    {task.subtitle && (
                                        <h3
                                            onClick={() => handleHeadingClick(task.subtitle)}
                                            className="text-2xl font-semibold text-gray-800 mb-2 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
                                        >
                                            {task.subtitle}
                                        </h3>
                                    )}

                                    {/* Subheading (Earnings) */}
                                    {task.subheading && (
                                        <p className="text-lg font-semibold text-gray-700">
                                            {task.subheading}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Button and Disclaimer */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {category.exploreOtherWaysButtonText && (
                            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200">
                                {category.exploreOtherWaysButtonText}
                            </button>
                        )}
                    </div>
                    {category.exploreOtherWaysDisclaimer && (
                        <p className="text-md text-gray-600 flex justify-start mt-8">
                            {category.exploreOtherWaysDisclaimer}
                        </p>
                    )}
                </section>
            )}

            {/* Top Locations Section */}
            {category.topLocationsTitle && category.topLocationsHeadings && Array.isArray(category.topLocationsHeadings) && category.topLocationsHeadings.length > 0 && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(243, 247, 255)' }}
                >
                    {/* Three Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1: Big location icon and heading */}
                        <div className="flex flex-col items-start">
                            <div className="mb-6">
                                {/* Big location icon */}
                                <svg
                                    className="w-20 h-20 text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mt-4 sm:mt-6">
                                {category.topLocationsTitle}
                            </h2>
                        </div>

                        {/* Column 2: Location list (first half) */}
                        <div className="flex flex-col gap-3 ml-20">
                            {category.topLocationsHeadings.slice(0, Math.ceil(category.topLocationsHeadings.length / 2)).map((heading, index) => (
                                heading && heading.trim() !== "" && (
                                    <p
                                        key={index}
                                        onClick={() => handleHeadingClick(heading)}
                                        className="text-lg text-gray-800 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
                                    >
                                        {heading}
                                    </p>
                                )
                            ))}
                        </div>

                        {/* Column 3: Location list (second half) */}
                        <div className="flex flex-col gap-3">
                            {category.topLocationsHeadings.slice(Math.ceil(category.topLocationsHeadings.length / 2)).map((heading, index) => (
                                heading && heading.trim() !== "" && (
                                    <p
                                        key={index + Math.ceil(category.topLocationsHeadings.length / 2)}
                                        onClick={() => handleHeadingClick(heading)}
                                        className="text-lg text-gray-800 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
                                    >
                                        {heading}
                                    </p>
                                )
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Browse Similar Tasks Section */}
            {category.browseSimilarTasksTitle && category.browseSimilarTasksHeadings && Array.isArray(category.browseSimilarTasksHeadings) && category.browseSimilarTasksHeadings.length > 0 && (
                <section
                    className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] overflow-hidden"
                    style={{ backgroundColor: 'rgb(243, 247, 255)' }}
                >
                    {/* Two Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Column 1: Icon and Heading */}
                        <div className="flex flex-col items-start">
                            {/* Wrench, Brush, Pencil Icon */}
                            <div className="mb-6 relative w-16 h-16">
                                <svg
                                    className="w-full h-full text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {/* Paintbrush */}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                    />
                                </svg>
                                {/* Pencil icon */}
                                <svg
                                    className="absolute top-2 right-2 w-8 h-8 text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                                {/* Wrench icon */}
                                <svg
                                    className="absolute bottom-0 left-0 w-6 h-6 text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-6xl font-bold text-gray-800 max-[600px]:text-3xl">
                                {category.browseSimilarTasksTitle}
                            </h2>
                        </div>

                        {/* Column 2: Job Items List */}
                        <div className="flex flex-col gap-3 justify-start">
                            {category.browseSimilarTasksHeadings.map((heading, index) => (
                                heading && heading.trim() !== "" && (
                                    <p
                                        key={index}
                                        onClick={() => handleHeadingClick(heading)}
                                        className="text-lg text-gray-800 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
                                    >
                                        {heading}
                                    </p>
                                )
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer Section - Dynamic from MongoDB */}
            {category.footer && <Footer footerData={category.footer} />}

        </>
    );
};

export default TaskCategoryPageClient;

