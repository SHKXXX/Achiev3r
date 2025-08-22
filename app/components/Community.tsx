"use client";

import React, { useState, useEffect, Dispatch, SetStateAction} from 'react';
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
  userId?: string;
}

interface CommunityProps {
setActiveTab: Dispatch<SetStateAction<string>>;
  user?: any; // You might want to define a proper user type
}

const Community: React.FC<CommunityProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>('others');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const address  = user?.fid;
  const userId = user?.id || address;

  useEffect(() => {
    loadGoals(activeTab);
    
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      
      if (scrolled > scrollable - 100) {
        console.log("Load more goals...");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, userId]);

  const loadGoals = async (tab: string) => {
    setIsLoading(true);
    
    try {
      let loadedGoals: Goal[] = [];
      
      switch(tab) {
        case 'others':
          // Fetch other users' goals from API
          loadedGoals = await fetchCommunityGoals();
          break;
        case 'my':
          // Fetch current user's goals
          loadedGoals = await fetchUserGoals();
          break;
        case 'following':
          // Fetch goals the user is following
          loadedGoals = await fetchFollowingGoals();
          break;
        default:
          loadedGoals = [];
      }
      
      setGoals(loadedGoals);
    } catch (error) {
      console.error("Error loading goals:", error);
      // Fallback to sample data if API fails
      setGoals(getSampleGoals(tab));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunityGoals = async (): Promise<Goal[]> => {
    try {
      const response = await fetch('/api/goals/community');
      if (response.ok) {
        const data = await response.json();
        return data.goals.map((goal: any) => formatGoalForDisplay(goal, false));
      }
    } catch (error) {
      console.error("Error fetching community goals:", error);
    }
    return getSampleGoals('others');
  };

  const fetchUserGoals = async (): Promise<Goal[]> => {
    if (!userId) return [];
    
    try {
      const response = await fetch(`/api/goals?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.goals.map((goal: any) => formatGoalForDisplay(goal, true));
      }
    } catch (error) {
      console.error("Error fetching user goals:", error);
    }
    return getSampleGoals('my');
  };

  const fetchFollowingGoals = async (): Promise<Goal[]> => {
    if (!userId) return [];
    
    try {
      const response = await fetch(`/api/goals/following?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.goals.map((goal: any) => formatGoalForDisplay(goal, false, true));
      }
    } catch (error) {
      console.error("Error fetching following goals:", error);
    }
    return getSampleGoals('following');
  };

  const formatGoalForDisplay = (goal: any, isUserGoal: boolean = false, isFollowing: boolean = false): Goal => {
    const progress = Math.floor(((goal.currentAmount ?? 0) / (goal.goalAmount ?? 1)) * 100);
    const endDate = goal.endDate ? new Date(goal.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days if no end date
    
    return {
      id: goal.id,
      title: goal.title,
      category: goal.category,
      image: goal.user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      progress,
      stake: goal.goalAmount || 0,
      endDate: `By ${endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`,
      timeLeft: calculateDaysLeft(endDate.toISOString()) + ' Days Left',
      winChance: isUserGoal ? Math.min(100, progress + 20) : undefined, // Example calculation
      potentialReward: isFollowing ? Math.floor((goal.goalAmount || 0) * 0.1) : undefined, // Example: 10% reward
      isUserGoal,
      isFollowing,
      userId: goal.userId
    };
  };

  const getSampleGoals = (tab: string): Goal[] => {
    // Your existing sample data logic
    switch(tab) {
      case 'others':
        return [
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
          // ... other sample goals
        ];
      case 'my':
        return [
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
          // ... other sample goals
        ];
      case 'following':
        return [
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
      default:
        return [];
    }
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSharePoll = async (goalId: string) => {
    try {
      // Share the goal to community
      const response = await fetch('/api/goals/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
          userId
        }),
      });
      
      if (response.ok) {
        alert('Goal shared to community successfully!');
      } else {
        alert('Failed to share goal. Please try again.');
      }
    } catch (error) {
      console.error('Error sharing goal:', error);
      alert('Error sharing goal. Please try again.');
    }
  };

  const handleFollowGoal = async (goalId: string) => {
    try {
      const response = await fetch('/api/goals/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
          userId
        }),
      });
      
      if (response.ok) {
        alert('Now following this goal!');
        // Refresh the following tab
        if (activeTab === 'following') {
          loadGoals('following');
        }
      } else {
        alert('Failed to follow goal. Please try again.');
      }
    } catch (error) {
      console.error('Error following goal:', error);
      alert('Error following goal. Please try again.');
    }
  };

  if (isLoading) {
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
          {/* Tabs remain the same */}
        </div>
        
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading goals...</p>
        </div>
      </div>
    );
  }

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
            {activeTab === 'my' ? (
              <>
                <p>You haven't created any goals yet</p>
                <p>Create your first goal to get started!</p>
              </>
            ) : activeTab === 'following' ? (
              <>
                <p>You're not following any goals yet</p>
                <p>Follow goals to track their progress and earn rewards</p>
              </>
            ) : (
              <>
                <p>No community goals available</p>
                <p>Be the first to share a goal!</p>
              </>
            )}
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
                    onClick={() => handleFollowGoal(goal.id)}
                  >
                    <i className="fas fa-plus"></i> Follow
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