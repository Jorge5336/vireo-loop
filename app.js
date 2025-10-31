// Vireo Loop V10 - Wellness & Focus Tracker
const { useState, useEffect, useRef } = React;

// Utility: Get today's date key
const getTodayKey = () => new Date().toISOString().split('T')[0];

// Utility: Calculate sober streak
const calculateStreak = (startDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Initial state structure
const getInitialData = () => {
  const stored = localStorage.getItem('vireoLoop');
  if (stored) return JSON.parse(stored);
  
  return {
    sobrietyStartDate: null,
    dailyLogs: {},
    timerSessions: [],
    urgeSurfLogs: [],
    musicEntries: [],
    betterStrategies: [
      "Call someone who understands",
      "Take a walk, even just 5 minutes",
      "Write down what I'm feeling",
      "Listen to music that moves me",
      "Remember why I started this journey"
    ]
  };
};

// Mood emoji mapping
const moodEmojis = {
  great: '✨',
  good: '😊',
  okay: '😐',
  low: '😔',
  difficult: '🌧️'
};

const energyEmojis = {
  high: '⚡',
  medium: '🔋',
  low: '🪫'
};

// Main App Component
function VireoLoop() {
  const [data, setData] = useState(getInitialData);
  const [currentView, setCurrentView] = useState('loop');
  const [todayLog, setTodayLog] = useState(() => {
    const today = getTodayKey();
    return data.dailyLogs[today] || {
      date: today,
      mood: null,
      energy: null,
      sleep: null,
      drankToday: false,
      feltTempted: false,
      gotOutside: false,
      movedBody: false,
      notes: ''
    };
  });

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vireoLoop', JSON.stringify(data));
  }, [data]);

  // Update today's log in data
  useEffect(() => {
    const today = getTodayKey();
    setData(prev => ({
      ...prev,
      dailyLogs: {
        ...prev.dailyLogs,
        [today]: todayLog
      }
    }));
  }, [todayLog]);

  const streak = calculateStreak(data.sobrietyStartDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-8 pt-3 sm:pt-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <Icons.Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 animate-pulse" />
            <h1 className="text-2xl sm:text-4xl font-light tracking-wide">Vireo Loop</h1>
            <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-full">V10</span>
          </div>
          <p className="text-purple-300 text-xs sm:text-sm italic">your soft reset button</p>
        </header>

        {/* Navigation */}
        <nav className="flex flex-col sm:flex-row gap-1 sm:gap-2 mb-4 sm:mb-6 bg-black/20 backdrop-blur-sm rounded-2xl sm:rounded-full p-2">
          {[
            { id: 'loop', icon: Icons.TrendingUp, label: 'Loop' },
            { id: 'focus', icon: Icons.Timer, label: 'Focus' },
            { id: 'urge', icon: Icons.Wind, label: 'Urge Surf' },
            { id: 'music', icon: Icons.Music, label: 'Music' }
          ].map(nav => (
            <button
              key={nav.id}
              onClick={() => setCurrentView(nav.id)}
              className={`flex items-center justify-center gap-2 py-2 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-full transition-all flex-1 ${
                currentView === nav.id
                  ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                  : 'hover:bg-white/10'
              }`}
            >
              <nav.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">{nav.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="bg-black/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl border border-white/10">
          {currentView === 'loop' && <DailyLoopView data={data} setData={setData} todayLog={todayLog} setTodayLog={setTodayLog} streak={streak} />}
          {currentView === 'focus' && <FocusView data={data} setData={setData} />}
          {currentView === 'urge' && <UrgeSurfView data={data} setData={setData} />}
          {currentView === 'music' && <MusicView data={data} setData={setData} />}
        </main>
      </div>
    </div>
  );
}

// Daily Loop Component
function DailyLoopView({ data, setData, todayLog, setTodayLog, streak }) {
  const updateLog = (field, value) => {
    setTodayLog(prev => ({ ...prev, [field]: value }));
  };

  const setStartDate = () => {
    const startDate = prompt('Enter your sobriety start date (YYYY-MM-DD):');
    if (startDate) {
      setData(prev => ({ ...prev, sobrietyStartDate: startDate }));
    }
  };

  // Get last 7 days for timeline
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      days.push({
        key,
        log: data.dailyLogs[key] || null,
        label: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return days;
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Sober Streak */}
      <div className="text-center py-4 sm:py-6 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-xl sm:rounded-2xl border border-purple-400/30">
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
          {[...Array(Math.min(streak, 5))].map((_, i) => (
            <Icons.Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <div className="text-4xl sm:text-5xl font-light mb-1">{streak}</div>
        <div className="text-xs sm:text-sm text-purple-300">days of clarity</div>
        {!data.sobrietyStartDate && (
          <button onClick={setStartDate} className="mt-2 sm:mt-3 text-xs text-purple-400 hover:text-purple-300 underline">
            Set start date
          </button>
        )}
      </div>

      {/* Today's Check-in */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Mood */}
        <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <label className="text-xs sm:text-sm text-purple-300 mb-2 block">How's your mood?</label>
          <div className="flex gap-1 sm:gap-2">
            {Object.entries(moodEmojis).map(([key, emoji]) => (
              <button
                key={key}
                onClick={() => updateLog('mood', key)}
                className={`flex-1 py-2 text-xl sm:text-2xl rounded-lg transition-all ${
                  todayLog.mood === key ? 'bg-purple-600 scale-110 shadow-lg' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <label className="text-xs sm:text-sm text-purple-300 mb-2 block">Energy level?</label>
          <div className="flex gap-1 sm:gap-2">
            {Object.entries(energyEmojis).map(([key, emoji]) => (
              <button
                key={key}
                onClick={() => updateLog('energy', key)}
                className={`flex-1 py-2 text-xl sm:text-2xl rounded-lg transition-all ${
                  todayLog.energy === key ? 'bg-teal-600 scale-110 shadow-lg' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sleep */}
      <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <label className="text-xs sm:text-sm text-purple-300 mb-2 block">Sleep (hours)</label>
        <input
          type="number"
          value={todayLog.sleep || ''}
          onChange={(e) => updateLog('sleep', parseFloat(e.target.value))}
          className="w-full bg-black/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="7.5"
          step="0.5"
        />
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {[
          { key: 'drankToday', label: 'Drank today', color: 'red-500' },
          { key: 'feltTempted', label: 'Felt tempted', color: 'amber-500' },
          { key: 'gotOutside', label: 'Got outside', color: 'emerald-500' },
          { key: 'movedBody', label: 'Moved my body', color: 'blue-500' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => updateLog(item.key, !todayLog[item.key])}
            className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all border-2 ${
              todayLog[item.key]
                ? `bg-${item.color}/20 border-${item.color}`
                : 'bg-white/5 border-transparent hover:bg-white/10'
            }`}
          >
            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${
              todayLog[item.key] ? `border-${item.color} bg-${item.color}/50` : 'border-gray-500'
            }`}>
              {todayLog[item.key] && <Icons.Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />}
            </div>
            <span className="text-xs sm:text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <label className="text-xs sm:text-sm text-purple-300 mb-2 block">Notes for today</label>
        <textarea
          value={todayLog.notes}
          onChange={(e) => updateLog('notes', e.target.value)}
          className="w-full bg-black/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px] resize-none"
          placeholder="How are you feeling? What's on your mind?"
        />
      </div>

      {/* 7-Day Timeline */}
      <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm text-purple-300 mb-3">Last 7 Days</h3>
        <div className="flex gap-1 sm:gap-2">
          {getLast7Days().map(day => (
            <div key={day.key} className="flex-1 text-center">
              <div className="text-xs text-gray-400 mb-1">{day.label}</div>
              <div className="h-10 sm:h-12 bg-black/30 rounded-lg flex flex-col items-center justify-center gap-1">
                {day.log ? (
                  <>
                    <div className="text-base sm:text-lg">{moodEmojis[day.log.mood] || '·'}</div>
                    {day.log.feltTempted && <div className="w-1 h-1 bg-amber-400 rounded-full"></div>}
                  </>
                ) : (
                  <div className="text-gray-600">·</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Focus Timer Component
function FocusView({ data, setData }) {
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const presets = [
    { name: 'Stretch', duration: 10, icon: '🧘', color: 'emerald' },
    { name: 'Read', duration: 45, icon: '📖', color: 'blue' },
    { name: 'Deep Work', duration: 90, icon: '💻', color: 'purple' },
    { name: 'Quick Break', duration: 5, icon: '☕', color: 'amber' }
  ];

  const startTimer = (preset) => {
    setActiveTimer(preset);
    setTimeLeft(preset.duration * 60);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setActiveTimer(null);
    setTimeLeft(0);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (activeTimer && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer complete
            setData(prevData => ({
              ...prevData,
              timerSessions: [...prevData.timerSessions, {
                type: activeTimer.name,
                duration: activeTimer.duration,
                completedAt: new Date().toISOString()
              }]
            }));
            resetTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer, isPaused, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const encouragements = [
    "You're exactly where you need to be.",
    "This moment is yours.",
    "Breathe. You've got this.",
    "One step at a time.",
    "Your focus is a gift to yourself."
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {!activeTimer ? (
        <>
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-light mb-1 sm:mb-2">Choose Your Focus</h2>
            <p className="text-purple-300 text-xs sm:text-sm italic">{encouragements[Math.floor(Math.random() * encouragements.length)]}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => startTimer(preset)}
                className={`bg-${preset.color}-500/20 hover:bg-${preset.color}-500/30 border-2 border-${preset.color}-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:scale-105 shadow-lg`}
              >
                <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{preset.icon}</div>
                <div className="font-medium text-sm sm:text-base mb-1">{preset.name}</div>
                <div className="text-xs sm:text-sm text-gray-300">{preset.duration} min</div>
              </button>
            ))}
          </div>

          {/* Recent Sessions */}
          {data.timerSessions.length > 0 && (
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 mt-4 sm:mt-6">
              <h3 className="text-xs sm:text-sm text-purple-300 mb-3">Recent Sessions</h3>
              <div className="space-y-2">
                {data.timerSessions.slice(-5).reverse().map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm bg-black/30 rounded-lg px-3 py-2">
                    <span>{session.type}</span>
                    <span className="text-gray-400">{session.duration} min</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="text-4xl sm:text-5xl mb-2 sm:mb-4">{activeTimer.icon}</div>
          <h2 className="text-xl sm:text-2xl font-light">{activeTimer.name}</h2>
          
          {/* Timer Display */}
          <div className="text-5xl sm:text-7xl md:text-8xl font-light gradient-text">
            {formatTime(timeLeft)}
          </div>

          {/* Progress Ring */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
            <svg className="transform -rotate-90 w-24 h-24 sm:w-32 sm:h-32">
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-white/10 sm:hidden"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - timeLeft / (activeTimer.duration * 60))}`}
                className={`text-${activeTimer.color}-500 transition-all duration-1000 sm:hidden`}
                strokeLinecap="round"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/10 hidden sm:block"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - timeLeft / (activeTimer.duration * 60))}`}
                className={`text-${activeTimer.color}-500 transition-all duration-1000 hidden sm:block`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icons.Heart className={`w-6 h-6 sm:w-8 sm:h-8 text-${activeTimer.color}-500 ${isPaused ? '' : 'animate-pulse'}`} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 sm:gap-4 justify-center">
            <button
              onClick={togglePause}
              className="bg-white/10 hover:bg-white/20 rounded-full p-3 sm:p-4 transition-all"
            >
              {isPaused ? <Icons.Play className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icons.Pause className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <button
              onClick={resetTimer}
              className="bg-white/10 hover:bg-white/20 rounded-full p-3 sm:p-4 transition-all"
            >
              <Icons.RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <p className="text-purple-300 text-xs sm:text-sm italic mt-4 sm:mt-6">
            {encouragements[Math.floor(Math.random() * encouragements.length)]}
          </p>
        </div>
      )}
    </div>
  );
}

// Urge Surf Component
function UrgeSurfView({ data, setData }) {
  const [step, setStep] = useState(0);
  const [feeling, setFeeling] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [breathCount, setBreathCount] = useState(0);

  const steps = [
    { title: "Name What You're Feeling", subtitle: "No judgment. Just truth." },
    { title: "Breathe", subtitle: "Three deep breaths. You have time." },
    { title: "Recall a Better Strategy", subtitle: "What helps you instead?" },
    { title: "You Surfed the Urge", subtitle: "That's courage." }
  ];

  const currentStep = steps[step];

  const completeSession = () => {
    setData(prev => ({
      ...prev,
      urgeSurfLogs: [...prev.urgeSurfLogs, {
        feeling,
        strategy: selectedStrategy,
        timestamp: new Date().toISOString()
      }]
    }));
    // Reset
    setStep(0);
    setFeeling('');
    setSelectedStrategy('');
    setBreathCount(0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress */}
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-all ${
              idx <= step ? 'bg-teal-500' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-light mb-1">{currentStep.title}</h2>
        <p className="text-purple-300 text-xs sm:text-sm italic">{currentStep.subtitle}</p>
      </div>

      <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {/* Step 0: Name Feeling */}
        {step === 0 && (
          <textarea
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            className="w-full bg-black/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] sm:min-h-[120px] resize-none"
            placeholder="I'm feeling..."
            autoFocus
          />
        )}

        {/* Step 1: Breathe */}
        {step === 1 && (
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-ping-slow"></div>
              <div className="absolute inset-0 bg-teal-500/30 rounded-full animate-pulse"></div>
              <Icons.Wind className="absolute inset-0 m-auto w-10 h-10 sm:w-12 sm:h-12 text-teal-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-light">{breathCount} / 3</div>
            <button
              onClick={() => {
                if (breathCount < 3) setBreathCount(breathCount + 1);
                if (breathCount === 2) setTimeout(() => setStep(2), 500);
              }}
              className="bg-teal-600 hover:bg-teal-700 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all"
            >
              {breathCount < 3 ? 'Breathe In... Out...' : 'Continue'}
            </button>
          </div>
        )}

        {/* Step 2: Strategy */}
        {step === 2 && (
          <div className="space-y-2 sm:space-y-3">
            {data.betterStrategies.map((strategy, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStrategy(strategy)}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-lg transition-all border-2 ${
                  selectedStrategy === strategy
                    ? 'bg-amber-500/30 border-amber-400'
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                {strategy}
              </button>
            ))}
            <input
              type="text"
              placeholder="Or write your own..."
              className="w-full bg-black/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  setSelectedStrategy(e.target.value);
                  setData(prev => ({
                    ...prev,
                    betterStrategies: [...prev.betterStrategies, e.target.value]
                  }));
                  e.target.value = '';
                }
              }}
            />
          </div>
        )}

        {/* Step 3: Completion */}
        {step === 3 && (
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="text-5xl sm:text-6xl">🌊</div>
            <p className="text-base sm:text-lg text-purple-300">
              You named it. You breathed. You chose differently.
            </p>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 text-left space-y-2">
              <div className="text-xs sm:text-sm text-gray-400">You felt:</div>
              <div className="text-sm sm:text-base text-white">{feeling}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-3">You chose:</div>
              <div className="text-sm sm:text-base text-white">{selectedStrategy}</div>
            </div>
            <button
              onClick={completeSession}
              className="bg-emerald-600 hover:bg-emerald-700 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all"
            >
              Complete & Log
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step > 0 && step < 3 && (
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 bg-white/10 hover:bg-white/20 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all"
          >
            Back
          </button>
          {step === 2 && selectedStrategy && (
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-teal-600 hover:bg-teal-700 py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {step === 0 && (
        <button
          onClick={() => feeling && setStep(1)}
          disabled={!feeling}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-2 sm:py-3 text-sm sm:text-base rounded-full transition-all"
        >
          Begin
        </button>
      )}
    </div>
  );
}

// Music Scratchpad Component with Audio Recording
function MusicView({ data, setData }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [entry, setEntry] = useState('');
  const intervalRef = useRef(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const audioUrlRef = useRef(null);

  const startSession = () => {
    setIsActive(true);
    setEntry('');
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const endSession = () => {
    if (entry.trim() || audioBlob) {
      const newEntry = {
        text: entry,
        timestamp: new Date().toISOString()
      };

      // Convert audio blob to base64 if present
      if (audioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newEntry.audio = reader.result; // base64 string
          setData(prev => ({
            ...prev,
            musicEntries: [...prev.musicEntries, newEntry]
          }));
        };
        reader.readAsDataURL(audioBlob);
      } else {
        setData(prev => ({
          ...prev,
          musicEntries: [...prev.musicEntries, newEntry]
        }));
      }
    }
    
    setIsActive(false);
    setTimeLeft(20 * 60);
    setEntry('');
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const exportJournal = () => {
    const text = data.musicEntries
      .map(e => `${new Date(e.timestamp).toLocaleString()}\n${e.text}\n${e.audio ? '[Audio Recording Attached]' : ''}\n\n---\n\n`)
      .join('');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vireo-music-journal-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  // Audio Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Clean up audio URL if it exists
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = URL.createObjectURL(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vireo-voice-memo-${new Date().toISOString()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Session timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {!isActive ? (
        <>
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-light mb-1 sm:mb-2">Music Scratchpad</h2>
            <p className="text-purple-300 text-xs sm:text-sm italic">20 minutes. Just you and sound.</p>
          </div>

          <button
            onClick={startSession}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 sm:py-6 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2 sm:gap-3"
          >
            <Icons.Music className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg">Start Session</span>
          </button>

          {/* Recent Entries */}
          {data.musicEntries.length > 0 && (
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm text-purple-300">Recent Entries</h3>
                <button
                  onClick={exportJournal}
                  className="text-xs text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
                >
                  <Icons.Download className="w-3 h-3" />
                  Export All
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {data.musicEntries.slice(-10).reverse().map((entry, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    {entry.text && <div className="text-xs sm:text-sm mb-2">{entry.text}</div>}
                    {entry.audio && (
                      <audio 
                        controls 
                        className="w-full h-8 sm:h-10"
                        src={entry.audio}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Timer */}
          <div className="text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl font-light bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {formatTime(timeLeft)}
            </div>
            <Icons.Music className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-purple-500 animate-bounce" />
          </div>

          {/* Audio Recording Controls */}
          <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="text-xs sm:text-sm text-purple-300 mb-3 block">
              Voice Memo
            </label>

            {!audioBlob ? (
              <div className="space-y-3 sm:space-y-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Start Recording</span>
                  </button>
                ) : (
                  <>
                    {/* Recording Animation */}
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 sm:w-1.5 bg-red-500 rounded-full recording-bar"
                            style={{
                              height: `${20 + Math.random() * 30}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-xl sm:text-2xl font-light text-red-400">
                        {formatTime(recordingTime)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 animate-pulse">
                        Recording...
                      </div>
                    </div>

                    <button
                      onClick={stopRecording}
                      className="w-full bg-white/10 hover:bg-white/20 py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Icons.MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Stop Recording</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {/* Audio Player */}
                <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-400 mb-2">
                    Recording ({formatTime(recordingTime)})
                  </div>
                  <audio 
                    controls 
                    className="w-full h-8 sm:h-10"
                    src={audioUrlRef.current}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* Recording Actions */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={deleteRecording}
                    className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 py-2 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Trash className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Delete</span>
                  </button>
                  <button
                    onClick={downloadRecording}
                    className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 py-2 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Save className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text Entry Field */}
          <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="text-xs sm:text-sm text-purple-300 mb-2 block">
              What's emerging?
            </label>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full bg-black/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] sm:min-h-[150px] resize-none"
              placeholder="Lyric fragments, feelings, chord progressions, whatever flows..."
              autoFocus
            />
          </div>

          {/* End Button */}
          <button
            onClick={endSession}
            className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-full text-sm sm:text-base transition-all"
          >
            End Session & Save
          </button>
        </div>
      )}
    </div>
  );
}

// Render the app
ReactDOM.render(<VireoLoop />, document.getElementById('root'));
