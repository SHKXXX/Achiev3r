"use client";

import React, { useState, useEffect } from 'react';
import type { User } from '../../lib/generated/prisma'; // adjust path if needed
import './Goals.css'; // We'll extract the CSS to a separate file

interface Goal {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  stake: number;
  description: string;
  currentValue?: number;
}

//modified
interface GoalsProps {
  title?: string;
  initialTab?: string;
  user?: User | null;
}

const Goals: React.FC<GoalsProps> = ({ user }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    stake: 0,
    category: "",
  });
   const userId = user?.id;

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setNewGoal((prev) => ({ ...prev, startDate: today }));
  }, []);

  // FETCH EXISTING GOALS
  useEffect(() => {
    if (!userId) return;

 const fetchGoals = async () => {
      try {
        const res = await fetch(`/api/goals?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          const fetchedGoals: Goal[] = data.goals.map((g: any) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            startDate: g.startDate,
            endDate: g.endDate || "",
            progress: Math.floor(((g.currentAmount ?? 0) / (g.goalAmount ?? 1)) * 100),
            stake: g.goalAmount ?? 0,
            currentValue: g.currentAmount ?? 0,
            description: g.description ?? "",
          }));
          setGoals(fetchedGoals);
        }
      } catch (err) {
        console.error("Error fetching goals:", err);
      }
    };

    fetchGoals();
  }, [userId]);


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setNewGoal(prev => ({ ...prev, startDate: today }));
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!userId) {
    alert("User session not found! Please connect your wallet.");
    return;
  }

  const goalData = {
    userId,
    title: newGoal.title,
    description: newGoal.description,
    category: selectedCategory,
    stake: Number(newGoal.stake),
    startDate: newGoal.startDate,
    endDate: newGoal.endDate,
  };

  const response = await fetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goalData),
  });

  const data = await response.json();

  if (response.ok) {
    setGoals((prev) => [data.goal, ...prev]);
    setShowAddModal(false);
    setNewGoal({
      title: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      stake: 0,
      category: "",
    });
    setSelectedCategory("");
  } else {
    alert(data.error || "Failed to create goal");
  }
};

  const openGoalModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowGoalModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="goal-tracker">
      <div className="header">
        <div className="logo">GoalTracker</div>
        <div className="wallet">
          <i className="fas fa-wallet"></i>
          <span>420 GC</span>
        </div>
      </div>
      
      <div className="page-title">My Goals</div>
      
      <div className="goals-list">
        {goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-bullseye"></i>
            </div>
            <p>You don't have any goals yet</p>
            <p>Create your first goal to get started!</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-card" onClick={() => openGoalModal(goal)}>
              <div className="goal-header">
                <div className="goal-user">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                    className="user-avatar" 
                    alt="User avatar" 
                  />
                  <div className="goal-info">
                    <div className="goal-title">{goal.title}</div>
                    <div className="goal-date">By {formatDate(goal.endDate)}</div>
                  </div>
                </div>
                <div className="goal-stake">
                  <i className="fas fa-coins"></i> {goal.stake} GC
                </div>
              </div>
              <div className="goal-category">{goal.category}</div>
              <div className="progress-container">
                <div className="progress-info">
                  <div className="progress-text">Progress</div>
                  <div className="progress-percent">{goal.progress}%</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${goal.progress}%`}}></div>
                </div>
              </div>
              <div className="goal-footer">
                <div className="time-left">{calculateDaysLeft(goal.endDate)} Days Left</div>
                <button 
                  className="share-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Sharing this goal with the community for monitoring!');
                  }}
                >
                  <i className="fas fa-share-alt"></i> Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="add-goal-btn" onClick={() => setShowAddModal(true)}>
        <i className="fas fa-plus add-icon"></i>
      </div>
      
      <div className="bottom-nav">
        <div className="nav-item">
          <a href="home.html">
            <div className="nav-icon"><i className="fas fa-home"></i></div>
            <div>Home</div>
          </a>
        </div>
        <div className="nav-item">
          <a href="community.html">
            <div className="nav-icon"><i className="fas fa-users"></i></div>
            <div>Community</div>
          </a>
        </div>
        <div className="nav-item active">
          <a href="goals.html"> 
            <div className="nav-icon"><i className="fas fa-bullseye"></i></div>
            <div>Goals</div>
          </a>
        </div>
      </div>
      
      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create New Goal</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Goal Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Lose 5kg, Read 10 books" 
                  name="title"
                  value={newGoal.title}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Describe your goal in detail..." 
                  name="description"
                  value={newGoal.description}
                  onChange={handleInputChange}
                  required 
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="category-tags">
                  <div 
                    className={`category-tag ${selectedCategory === 'fitness' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('fitness')}
                  >
                    Fitness
                  </div>
                  <div 
                    className={`category-tag ${selectedCategory === 'sleep' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('sleep')}
                  >
                    Sleep
                  </div>
                  <div 
                    className={`category-tag ${selectedCategory === 'study' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('study')}
                  >
                    Study
                  </div>
                  <div 
                    className={`category-tag ${selectedCategory === 'other' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('other')}
                  >
                    Other
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    name="startDate"
                    value={newGoal.startDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    name="endDate"
                    value={newGoal.endDate}
                    onChange={handleInputChange}
                    min={newGoal.startDate}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Stake Amount</label>
                <div className="stake-amount">
                  <span className="stake-prefix">GC</span>
                  <input 
                    type="number" 
                    className="form-input stake-input" 
                    placeholder="Amount" 
                    min="1" 
                    name="stake"
                    value={newGoal.stake || ''}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-label" style={{fontSize: '12px', fontWeight: 'normal', marginTop: '8px'}}>
                  This amount will be staked towards your goal. You'll get it back with interest if you succeed.
                </div>
              </div>
              
              <button type="submit" className="submit-btn">Create Goal</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Goal Detail Modal */}
      {showGoalModal && selectedGoal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Goal Details</h2>
              <button className="close-btn" onClick={() => setShowGoalModal(false)}>&times;</button>
            </div>
            
            <div className="goal-details">
              <div className="detail-item">
                <div className="detail-label">Goal Title</div>
                <div className="detail-value">{selectedGoal.title}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Category</div>
                <div className="detail-value">{selectedGoal.category}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Start Date</div>
                <div className="detail-value">{formatDate(selectedGoal.startDate)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">End Date</div>
                <div className="detail-value">{formatDate(selectedGoal.endDate)}</div>
              </div>
              
              <div className="progress-circle">
                <svg viewBox="0 0 100 100">
                  <circle className="circle-bg" cx="50" cy="50" r="40"></circle>
                  <circle 
                    className="circle-progress" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (selectedGoal.progress / 100 * 251.2)}
                  ></circle>
                </svg>
                <div className="circle-text">{selectedGoal.progress}%</div>
              </div>
              
              <div className="pool-info">
                <div className="pool-item">
                  <div className="pool-amount">{selectedGoal.stake} GC</div>
                  <div className="pool-label">Initial Stake</div>
                </div>
                <div className="pool-item">
                  <div className="pool-amount">{selectedGoal.currentValue} GC</div>
                  <div className="pool-label">Current Value</div>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Description</div>
                <div className="detail-value">{selectedGoal.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;