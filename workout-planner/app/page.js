'use client'

import { useState, useEffect } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const EXERCISE_CATEGORIES = {
  'Strength': ['Push-ups', 'Pull-ups', 'Squats', 'Lunges', 'Plank', 'Deadlifts', 'Bench Press', 'Shoulder Press'],
  'Cardio': ['Running', 'Cycling', 'Jump Rope', 'HIIT', 'Swimming', 'Rowing', 'Elliptical'],
  'Flexibility': ['Yoga', 'Stretching', 'Pilates', 'Mobility Work'],
  'Sports': ['Basketball', 'Soccer', 'Tennis', 'Boxing', 'Martial Arts']
}

export default function WorkoutPlanner() {
  const [schedule, setSchedule] = useState({})
  const [selectedDay, setSelectedDay] = useState(null)
  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '', notes: '', category: 'Strength' })

  useEffect(() => {
    const saved = localStorage.getItem('workoutSchedule')
    if (saved) {
      setSchedule(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('workoutSchedule', JSON.stringify(schedule))
  }, [schedule])

  const addWorkout = (day) => {
    if (!newWorkout.name || !newWorkout.duration) return

    const workout = {
      id: Date.now(),
      ...newWorkout,
      completed: false
    }

    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), workout]
    }))

    setNewWorkout({ name: '', duration: '', notes: '', category: 'Strength' })
    setShowAddWorkout(false)
    setSelectedDay(null)
  }

  const deleteWorkout = (day, workoutId) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(w => w.id !== workoutId)
    }))
  }

  const toggleComplete = (day, workoutId) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map(w =>
        w.id === workoutId ? { ...w, completed: !w.completed } : w
      )
    }))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      paddingBottom: '80px'
    }}>
      <header style={{
        textAlign: 'center',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>💪 Workout Planner</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>Plan your weekly fitness routine</p>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {DAYS.map(day => {
          const workouts = schedule[day] || []
          const completedCount = workouts.filter(w => w.completed).length

          return (
            <div key={day} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div>
                  <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#333' }}>{day}</h2>
                  {workouts.length > 0 && (
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      {completedCount}/{workouts.length} completed
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedDay(day)
                    setShowAddWorkout(true)
                  }}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>+</span> Add Workout
                </button>
              </div>

              {workouts.length === 0 ? (
                <p style={{ color: '#999', fontSize: '14px', margin: 0, textAlign: 'center', padding: '20px 0' }}>
                  No workouts planned yet
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {workouts.map(workout => (
                    <div key={workout.id} style={{
                      background: workout.completed ? '#f0fdf4' : '#f9fafb',
                      border: `2px solid ${workout.completed ? '#86efac' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <input
                        type="checkbox"
                        checked={workout.completed}
                        onChange={() => toggleComplete(day, workout.id)}
                        style={{
                          width: '20px',
                          height: '20px',
                          marginTop: '2px',
                          cursor: 'pointer',
                          accentColor: '#667eea'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '16px',
                            color: workout.completed ? '#059669' : '#333',
                            textDecoration: workout.completed ? 'line-through' : 'none'
                          }}>
                            {workout.name}
                          </h3>
                          <span style={{
                            background: '#ddd6fe',
                            color: '#6d28d9',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}>
                            {workout.category}
                          </span>
                        </div>
                        <p style={{
                          margin: '0 0 4px 0',
                          fontSize: '14px',
                          color: '#666'
                        }}>
                          ⏱️ {workout.duration} minutes
                        </p>
                        {workout.notes && (
                          <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#888',
                            fontStyle: 'italic'
                          }}>
                            {workout.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteWorkout(day, workout.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '20px',
                          cursor: 'pointer',
                          padding: '0',
                          width: '24px',
                          height: '24px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showAddWorkout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}
        onClick={() => {
          setShowAddWorkout(false)
          setSelectedDay(null)
        }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#333' }}>
              Add Workout - {selectedDay}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                Category
              </label>
              <select
                value={newWorkout.category}
                onChange={(e) => setNewWorkout({ ...newWorkout, category: e.target.value, name: '' })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px'
                }}
              >
                {Object.keys(EXERCISE_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                Exercise
              </label>
              <select
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px'
                }}
              >
                <option value="">Select an exercise</option>
                {EXERCISE_CATEGORIES[newWorkout.category].map(exercise => (
                  <option key={exercise} value={exercise}>{exercise}</option>
                ))}
                <option value="custom">Custom Exercise...</option>
              </select>
            </div>

            {newWorkout.name === 'custom' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                  Custom Exercise Name
                </label>
                <input
                  type="text"
                  placeholder="Enter exercise name"
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '16px'
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                placeholder="30"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#555' }}>
                Notes (optional)
              </label>
              <textarea
                value={newWorkout.notes}
                onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                placeholder="e.g., 3 sets of 10 reps"
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowAddWorkout(false)
                  setSelectedDay(null)
                  setNewWorkout({ name: '', duration: '', notes: '', category: 'Strength' })
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => addWorkout(selectedDay)}
                disabled={!newWorkout.name || !newWorkout.duration}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: newWorkout.name && newWorkout.duration ? '#667eea' : '#d1d5db',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: newWorkout.name && newWorkout.duration ? 'pointer' : 'not-allowed'
                }}
              >
                Add Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
