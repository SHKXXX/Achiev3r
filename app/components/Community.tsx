"use client";

import React, { useState, useEffect } from 'react';
import './Community.css';

interface Goal {
  id: string;
  title: string;
  category: string;
  image: string;
  progress: number;
  stake: number;
  endDate: string;
  timeLeft: string;
  winChance?: number;
  potentialReward?: number;
  isUserGoal?: boolean;
  isFollowing?: boolean;
}

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('others');
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Load initial goals based on active tab
    loadGoals(activeTab);
    
    // Simulate loading more goals when scrolling
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      
      if (scrolled > scrollable - 100) {
        // In a real app, this would load more goals from an API
        console.log("Load more goals...");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const loadGoals = (tab: string) => {
    // In a real app, this would fetch from an API
    let loadedGoals: Goal[] = [];
    
    switch(tab) {
      case 'others':
        loadedGoals = [
          {
            id: '1',
            title: 'Run a Marathon',
            category: 'Fitness',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
            progress: 45,
            stake: 150,
            endDate: 'By 15th August',
            timeLeft: '12 Days Left'
          },
          {
            id: '2',
            title: 'Learn Spanish',
            category: 'Education',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
            progress: 30,
            stake: 200,
            endDate: 'By 30th September',
            timeLeft: '23 Days Left'
          },
          {
            id: '3',
            title: 'Write a Book',
            category: 'Creative',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
            progress: 15,
            stake: 500,
            endDate: 'By 1st December',
            timeLeft: '40 Days Left'
          }
        ];
        break;
      case 'my':
        loadedGoals = [
          {
            id: '4',
            title: 'Lose 5kg',
            category: 'Fitness',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
            progress: 90,
            stake: 100,
            endDate: 'By 30th June',
            timeLeft: '5 Days Left',
            winChance: 85,
            isUserGoal: true
          },
          {
            id: '5',
            title: 'Creating Mobile App Design',
            category: 'UI/UX Design',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
            progress: 75,
            stake: 250,
            endDate: 'By 5th July',
            timeLeft: '3 Days Left',
            winChance: 70,
            isUserGoal: true
          }
        ];
        break;
      case 'following':
        loadedGoals = [
          {
            id: '6',
            title: 'Read 12 Books',
            category: 'Education',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
            progress: 65,
            stake: 180,
            endDate: 'By 31st December',
            timeLeft: '18 Days Left',
            potentialReward: 25,
            isFollowing: true
          }
        ];
        break;
      default:
        loadedGoals = [];
    }
    
    setGoals(loadedGoals);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSharePoll = (goalId: string) => {
    alert(`Sharing poll for goal ${goalId}`);
  };

  return (
    <div className="community-container">
      <div className="header">
        <div className="logo">Achiev3r</div>
        <div className="wallet">
          <i className="fas fa-wallet"></i>
          <span>420 GC</span>
        </div>
      </div>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'others' ? 'active' : ''}`}
          onClick={() => handleTabClick('others')}
        >
          Others' Goals
        </div>
        <div 
          className={`tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => handleTabClick('my')}
        >
          My Goals
        </div>
        <div 
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => handleTabClick('following')}
        >
          Following
        </div>
      </div>
      
      <div className="tab-content active">
        {goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="far fa-compass"></i>
            </div>
            <p>You're not following any other goals yet</p>
            <p>Share polls on others' goals to start earning rewards</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div className="goal-user">
                  <img src={goal.image} className="user-avatar" alt="User avatar" />
                  <div className="goal-info">
                    <div className="goal-title">{goal.title}</div>
                    <div className="goal-date">{goal.endDate}</div>
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
                <div className="time-left">{goal.timeLeft}</div>
                {activeTab === 'others' && (
                  <button 
                    className="share-btn"
                    onClick={() => handleSharePoll(goal.id)}
                  >
                    <i className="fas fa-share-alt"></i> Share Poll
                  </button>
                )}
                {activeTab === 'my' && goal.winChance !== undefined && (
                  <div className="win-chance">Win Chance: {goal.winChance}%</div>
                )}
                {activeTab === 'following' && goal.potentialReward !== undefined && (
                  <div className="potential-reward">Potential Reward: {goal.potentialReward} GC</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="bottom-nav">
        <div className="nav-item">
          <a href="home.html">
            <div className="nav-icon"><i className="fas fa-home"></i></div>
            <div>Home</div>
          </a>
        </div>
        <div className="nav-item active">
          <a href="community.html"> 
            <div className="nav-icon"><i className="fas fa-users"></i></div>
            <div>Community</div>
          </a>
        </div>
        <div className="nav-item">
          <a href="goals.html">
            <div className="nav-icon"><i className="fas fa-bullseye"></i></div>
            <div>Goals</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Community;