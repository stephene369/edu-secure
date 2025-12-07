// components/CourseCard.jsx
import React from 'react';
import { Clock, Users, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CourseCard({ course, onClick, className }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Image du cours */}
      <div className="aspect-video bg-gray-200 relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Nouveau
          </span>
        )}
      </div>

      {/* Contenu du cours */}
      <div className="p-4">
        {/* Catégorie */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {course.category}
          </span>
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
            {course.level}
          </span>
        </div>

        {/* Titre */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Instructeur */}
        <div className="flex items-center mb-3">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-700">{course.instructor.name}</span>
        </div>

        {/* Métriques */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Prix et action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {course.price === 0 ? (
              <span className="text-lg font-bold text-green-600">Gratuit</span>
            ) : (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {course.price.toLocaleString()} FCFA
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {course.originalPrice.toLocaleString()} FCFA
                  </span>
                )}
              </>
            )}
          </div>
          {course.discount && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
              -{course.discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}