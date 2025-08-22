"use client";
import React, { useState, useEffect } from 'react';
import './Home.css';
import type { User } from '../../lib/generated/prisma'; // adjust path if needed
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
  getAddress,
  getName,
  getAvatar,
} from "@coinbase/onchainkit/identity";

interface HomeProps {
  user: User | null;
}


const Home: React.FC<HomeProps> = ({ user }) => {
  const [energyLevel, setEnergyLevel] = useState(7);
  const [notes, setNotes] = useState("Need to complete my workout routine and work on the app design for at least 2 hours.");
  const [showModal, setShowModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Save Notes');
  const [currentDate, setCurrentDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [ensName, setEnsName] = useState<string | null>(null);

useEffect(() => {
  if (!user?.fid) return;

  const fetchEnsName = async () => {
    const address = user.fid as `0x${string}`;

    const name = await getName({
      address,
      chain: { id: 8453, name: "Base" },
    }).catch(() => null);

    setEnsName(name);
  };

  fetchEnsName();
}, [user]);


  useEffect(() => {
    // Set current date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
    
    setCurrentDate(now.toLocaleDateString('en-US', options));
    setDayOfWeek(now.toLocaleDateString('en-US', dayOptions));
  }, []);

  const handleEnergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnergyLevel(Number(e.target.value));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = () => {
    // In a real app, this would save to local storage or a database
    setSaveStatus('Saved!');
    setTimeout(() => {
      setSaveStatus('Save Notes');
    }, 2000);
  };

  const getEnergyColor = () => {
    if (energyLevel < 4) {
      return '#e65c5c';
    } else if (energyLevel < 7) {
      return '#f2c94c';
    } else {
      return '#6fcf97';
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <div className="profile-section">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
            className="profile-pic" 
            alt="Profile" 
          />
          <div className="profile-info">
            <h2>{ensName ?? user?.username ?? "Guest"}</h2>
            <p>Welcome back!</p>
          </div>
        </div>
        <div className="wallet">
          <i className="fas fa-wallet"></i>
          <span>420 GC</span>
        </div>
      </div>
      
      <div className="date-section">
        <div className="today-date">{currentDate}</div>
        <div className="day-of-week">{dayOfWeek}</div>
      </div>
      
      <div className="notes-section">
        <div className="section-title">
          <i className="fas fa-sticky-note"></i>
          <span>Daily Notes</span>
        </div>
        <textarea 
          className="notes-textarea" 
          placeholder="Write your thoughts, ideas, or plans for today..."
          value={notes}
          onChange={handleNotesChange}
        ></textarea>
        <button className="save-btn" onClick={handleSaveNotes}>
          <i className="fas fa-save"></i> {saveStatus}
        </button>
      </div>
      
      <div className="energy-section">
        <div className="section-title">
          <i className="fas fa-battery-full"></i>
          <span>Energy Level Today</span>
        </div>
        <div className="energy-slider-container">
          <div className="energy-labels">
            <span className="energy-label">Low</span>
            <span className="energy-label">Medium</span>
            <span className="energy-label">High</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={energyLevel} 
            className="energy-slider" 
            onChange={handleEnergyChange}
          />
          <div className="energy-value" style={{ color: getEnergyColor() }}>
            {energyLevel}/10
          </div>
        </div>
        <button className="ai-suggestion-btn" onClick={() => setShowModal(true)}>
          <i className="fas fa-robot"></i> Get AI Suggestions
        </button>
      </div>
      
      <div className="coin-growth-section">
        <div className="section-title">
          <i className="fas fa-chart-line"></i>
          <span>Your Goal Coin Growth</span>
        </div>
        <div className="coin-chart">
          <div className="chart-bar" style={{ height: '70%' }}>
            <span className="chart-value">100</span>
            <span className="chart-bar-label">Mon</span>
          </div>
          <div className="chart-bar" style={{ height: '78%' }}>
            <span className="chart-value">108</span>
            <span className="chart-bar-label">Tue</span>
          </div>
          <div className="chart-bar" style={{ height: '85%' }}>
            <span className="chart-value">115</span>
            <span className="chart-bar-label">Wed</span>
          </div>
          <div className="chart-bar" style={{ height: '82%' }}>
            <span className="chart-value">112</span>
            <span className="chart-bar-label">Thu</span>
          </div>
          <div className="chart-bar" style={{ height: '90%' }}>
            <span className="chart-value">120</span>
            <span className="chart-bar-label">Fri</span>
          </div>
          <div className="chart-bar" style={{ height: '95%' }}>
            <span className="chart-value">125</span>
            <span className="chart-bar-label">Sat</span>
          </div>
          <div className="chart-bar" style={{ height: '100%' }}>
            <span className="chart-value">130</span>
            <span className="chart-bar-label">Sun</span>
          </div>
        </div>
        <div className="growth-info">
          <div className="growth-item">
            <div className="growth-value">100 GC</div>
            <div className="growth-label">Initial Stake</div>
          </div>
          <div className="growth-item">
            <div className="growth-value">130 GC</div>
            <div className="growth-label">Current Value</div>
          </div>
          <div className="growth-item">
            <div className="growth-value">+30%</div>
            <div className="growth-label">Growth</div>
          </div>
        </div>
      </div>
      
      <div className="bottom-nav">
        <div className="nav-item active">
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
        <div className="nav-item">
          <a href="goals.html">
            <div className="nav-icon"><i className="fas fa-bullseye"></i></div>
            <div>Goals</div>
          </a>
        </div>
      </div>
      
      {/* AI Suggestion Modal */}
      {showModal && (
        <div className="ai-suggestion-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="fas fa-robot"></i>
                <span>AI Energy Suggestions</span>
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <p>Based on your energy level of <span className="modal-energy-value">{energyLevel}</span>/10, here are some suggestions to boost your energy:</p>
            
            <ul className="suggestion-list">
              <li>Take a 10-minute walk outside to get some fresh air and sunlight</li>
              <li>Drink a glass of water - dehydration often causes fatigue</li>
              <li>Do 5 minutes of stretching to improve blood circulation</li>
              <li>Listen to upbeat music for a quick mood and energy boost</li>
              <li>Have a healthy snack like nuts or fruit for sustained energy</li>
            </ul>
            
            <button className="save-btn" style={{marginTop: '20px', width: '100%'}} onClick={() => setShowModal(false)}>
              <i className="fas fa-check"></i> Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;