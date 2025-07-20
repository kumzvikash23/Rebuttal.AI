import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function UpcomingEvents() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample upcoming debate events
  const upcomingEvents = [
    {
      id: 1,
      title: "National High School Debate Championship",
      date: "2024-02-14",
      time: "09:00 AM",
      location: "Virtual Event",
      type: "Championship",
      description: "Join the biggest high school debate competition of the year. Open to all high school students.",
      registrationDeadline: "2024-02-10",
      prize: "$5,000 Scholarship",
      participants: "200+ students"
    },
    {
      id: 2,
      title: "College Debate League Finals",
      date: "2024-02-21",
      time: "02:00 PM",
      location: "University Conference Center",
      type: "Finals",
      description: "The final round of the college debate league. Watch top debaters compete for the championship.",
      registrationDeadline: "2024-02-18",
      prize: "Trophy & Recognition",
      participants: "16 finalists"
    },
    {
      id: 3,
      title: "Public Speaking Workshop",
      date: "2024-02-28",
      time: "06:00 PM",
      location: "Community Center",
      type: "Workshop",
      description: "Learn advanced public speaking techniques from professional speakers and debate coaches.",
      registrationDeadline: "2024-02-25",
      prize: "Certificate of Completion",
      participants: "50 students"
    }
  ];

  // Get current month events
  const getCurrentMonthEvents = () => {
    return upcomingEvents;
  };

  const currentMonthEvents = getCurrentMonthEvents();

  // Calendar helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const isEventDay = (day) => {
    return currentMonthEvents.some(event => formatDate(event.date) === day);
  };

  const getEventForDay = (day) => {
    return currentMonthEvents.find(event => formatDate(event.date) === day);
  };

  // Calendar data structure to match the reference design
  const calendarWeeks = [
    {
      weekNumber: 1,
      days: [1, 2, 3, 4, 5, 6, 7],
      hasNavigation: true
    },
    {
      weekNumber: 2,
      days: [8, 9, 10, 11, 12, 13, 14],
      hasEvent: true,
      eventDay: 14,
      eventText: "Debate Day Week 1!"
    },
    {
      weekNumber: 3,
      days: [15, 16, 17, 18, 19, 20, 21],
      hasEvent: true,
      eventDay: 21,
      eventText: "Debate Day Week 2!"
    },
    {
      weekNumber: 4,
      days: [22, 23, 24, 25, 26, 27, 28],
      hasEvent: true,
      eventDay: 28,
      eventText: "Debate Day Week 3!"
    }
  ];

  return (
    <>
      <Head>
        <title>Upcoming Events - Debating App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  ← Back to Home
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Upcoming Events</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Understanding the Event Schedule
            </h1>
            <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-700">
              <p>
                Each event you see on the calendar represents an upcoming debate competition, workshop, or speaking opportunity. 
                Events are scheduled throughout the month to provide regular opportunities for practice and competition.
              </p>
              <p>
                For example, if an event is scheduled for Friday the 14th, you can register up to 5 days before the event date 
                to secure your spot and prepare for the competition.
              </p>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-0 mb-0">
              {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-900 py-3 text-sm border-b-2 border-black">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Weeks */}
            {calendarWeeks.map((week, weekIndex) => (
              <div key={week.weekNumber}>
                {/* Week Header */}
                <div className="bg-black text-white text-center py-2 font-semibold">
                  Event Week {week.weekNumber}
                </div>
                
                {/* Week Days */}
                <div className="grid grid-cols-7 gap-0">
                  {week.days.map((day, dayIndex) => {
                    const isEventDay = week.hasEvent && day === week.eventDay;
                    const hasNavigation = week.hasNavigation && day === 7;
                    
                    return (
                      <div
                        key={day}
                        className={`h-24 border border-gray-300 relative cursor-pointer transition-colors ${
                          isEventDay ? 'bg-pink-500 text-white' : 'bg-white text-gray-900'
                        }`}
                        onClick={() => isEventDay && setSelectedEvent(getEventForDay(day))}
                      >
                        {/* Day Number */}
                        <div className={`text-2xl font-bold text-center pt-2 ${
                          isEventDay ? 'text-white' : 'text-gray-900'
                        }`}>
                          {day}
                        </div>
                        
                        {/* Event Text */}
                        {isEventDay && (
                          <div className="text-center text-sm font-medium px-1">
                            {week.eventText}
                          </div>
                        )}
                        
                        {/* Navigation Arrow */}
                        {hasNavigation && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Event Logo */}
                        {isEventDay && (
                          <div className="absolute top-2 right-2">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-pink-300">
                              <span className="text-pink-600 font-bold text-sm">D</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Event Details Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-gray-700">📅 Date:</span>
                      <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">⏰ Time:</span>
                      <p className="text-gray-900">{selectedEvent.time}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">📍 Location:</span>
                      <p className="text-gray-900">{selectedEvent.location}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">🏆 Prize:</span>
                      <p className="text-gray-900">{selectedEvent.prize}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-700">📝 Description:</span>
                    <p className="text-gray-900 mt-1">{selectedEvent.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-gray-700">📋 Registration Deadline:</span>
                      <p className="text-gray-900">{new Date(selectedEvent.registrationDeadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">👥 Participants:</span>
                      <p className="text-gray-900">{selectedEvent.participants}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition">
                      🎯 Register Now
                    </button>
                    <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                      📋 Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Events List */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 All Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">📅 Date:</span> {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">⏰ Time:</span> {event.time}
                        </div>
                        <div>
                          <span className="font-medium">📍 Location:</span> {event.location}
                        </div>
                        <div>
                          <span className="font-medium">🏆 Prize:</span> {event.prize}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition ml-4"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 