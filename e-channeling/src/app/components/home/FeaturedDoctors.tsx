"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useSelector } from "react-redux";
import { fetchTopRatedDoctors } from "@/store/doctor/doctorSlice";
import Link from "next/link";

const FeaturedDoctors = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { loading, error } = useSelector((state: RootState) => state.doctor);

    // fetch doctors
    // useEffect(() => {
    //     dispatch(fetchTopRatedDoctors());
    // }, []);

    // mock data
    const doctors = [
        {
            id: 1,
            name: "Dr. Samantha Perera",
            specialization: "Cardiologist",
            hospital: "National Hospital, Colombo",
            rating: 4.9,
            reviews: 124,
            experience: "15 years exp.",
            availability: "Today",
            availabilityColor: "bg-green-500",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: 2,
            name: "Dr. Arjun Rajapakse",
            specialization: "Dermatologist",
            hospital: "Asiri Hospital, Kandy",
            rating: 4.7,
            reviews: 89,
            experience: "10 years exp.",
            availability: "Tomorrow",
            availabilityColor: "bg-blue-500",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: 3,
            name: "Dr. Fathima Nizar",
            specialization: "Pediatrician",
            hospital: "Lady Ridgeway Hospital, Colombo",
            rating: 4.8,
            reviews: 156,
            experience: "12 years exp.",
            availability: "Today",
            availabilityColor: "bg-green-500",
            image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: 4,
            name: "Dr. Tharaka Wijesekara",
            specialization: "Neurologist",
            hospital: "Nawaloka Hospital, Colombo",
            rating: 4.9,
            reviews: 203,
            experience: "18 years exp.",
            availability: "Tomorrow",
            availabilityColor: "bg-blue-500",
            image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        },
    ];

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Star
                    key="half"
                    className="w-4 h-4 text-yellow-400 fill-current opacity-50"
                />
            );
        }

        return stars;
    };

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Featured Doctors
                    </h2>
                    <Link
                        className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base self-start sm:self-auto cursor-pointer"
                        href="/search"
                    >
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {loading ? (
                        <>
                            {[...Array(4)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
                                >
                                    <div className="relative h-40 sm:h-48 bg-gray-300" />

                                    <div className="p-3 sm:p-4 space-y-2">
                                        <div className="h-5 bg-gray-300 rounded w-3/4" />

                                        <div className="h-4 bg-gray-300 rounded w-1/2" />

                                        <div className="flex items-start">
                                            <div className="w-4 h-4 bg-gray-300 rounded mr-2 mt-0.5 flex-shrink-0" />
                                            <div className="h-4 bg-gray-300 rounded w-2/3" />
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-3 sm:mt-4">
                                            <div className="flex items-center">
                                                <div className="flex space-x-1 mr-2">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-4 h-4 bg-gray-300 rounded"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <div className="h-3 bg-gray-300 rounded w-6" />
                                                <div className="h-3 bg-gray-300 rounded w-10 ml-2" />
                                            </div>
                                            <div className="h-3 bg-gray-300 rounded w-20" />
                                        </div>

                                        <div className="w-full h-9 bg-gray-300 rounded-lg mt-3 sm:mt-4" />
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8 col-span-full">
                            {typeof error === "string"
                                ? error
                                : "Failed to load featured doctors."}
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="text-gray-500 text-center py-12 col-span-full">
                            <p className="text-lg font-medium">
                                No doctors available at the moment.
                            </p>
                            <p className="text-sm mt-2">
                                Please check back later.
                            </p>
                        </div>
                    ) : (
                        <>
                            {doctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className="bg-white rounded-xl transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden border border-gray-100"
                                >
                                    <div className="relative h-44 sm:h-52 overflow-hidden">
                                        <div
                                            className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${doctor.availabilityColor} text-white px-2 py-1 rounded-full text-xs font-medium z-10`}
                                        >
                                            {doctor.availability}
                                        </div>

                                        <Image
                                            src={doctor.image}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover object-[center_20%]"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        />
                                    </div>

                                    <div className="p-3 sm:p-4">
                                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1 line-clamp-1">
                                            {doctor.name}
                                        </h3>

                                        <p className="text-blue-600 font-medium text-sm mb-2">
                                            {doctor.specialization}
                                        </p>

                                        <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-3">
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">
                                                {doctor.hospital}
                                            </span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm mb-3 sm:mb-4 gap-2 sm:gap-0">
                                            <div className="flex items-center">
                                                <div className="flex items-center mr-1">
                                                    {renderStars(doctor.rating)}
                                                </div>
                                                <span className="font-medium text-gray-700 mr-1">
                                                    {doctor.rating}
                                                </span>
                                                <span className="text-gray-500">
                                                    ({doctor.reviews})
                                                </span>
                                            </div>
                                            <span className="text-gray-600">
                                                {doctor.experience}
                                            </span>
                                        </div>

                                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base cursor-pointer">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedDoctors;
