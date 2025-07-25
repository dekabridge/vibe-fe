import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Cpu, FileText, Database, Briefcase, Users, Send, Building, Ticket, Bug, ChevronDown, ChevronRight, CheckCircle, Home, ClipboardList, FolderKanban, Trophy, Settings, ListChecks, PlusCircle, FolderPlus, Map, Search, BarChart3, DollarSign, Lightbulb, BookOpen, UserCircle, ChevronsLeft, ChevronsRight, Trash2, X, ArrowLeft, UploadCloud, File as FileIcon } from 'lucide-react';

// --- MOCK DATA ---
const supportingData = {
  salesforce: [
    { id: 'sf-1', type: 'Opportunity', name: 'Project Titan', stage: 'Proposal/Price Quote', amount: '$250,000', closeDate: '2024-09-30', link: '#' },
    { id: 'sf-2', type: 'Account', name: 'Global Tech Inc.', industry: 'Technology', link: '#' },
  ],
  zendesk: [
    { id: 'zd-1', type: 'Ticket', ticketId: '#86753', subject: 'Inquiry about Enterprise Plan', status: 'Open', requester: 'jane.doe@globaltech.com', link: '#' },
  ],
  jira: [
    { id: 'jr-1', type: 'Story', issueId: 'PROJ-123', summary: 'Develop new dashboard module', status: 'In Progress', assignee: 'Dev Team A', link: '#' },
  ],
};

const initialNextSteps = [
    { id: 1, evaluationId: 1, action: 'Finalize budget with CFO', owner: 'You', due: '2025-08-15', status: 'Not Started' },
    { id: 2, evaluationId: 1, action: 'Draft legal agreements for Berlin hub', owner: 'Legal Team', due: '2025-09-01', status: 'Not Started' },
    { id: 3, evaluationId: 3, action: 'Begin localization vendor selection', owner: 'Product Team', due: '2025-09-05', status: 'Not Started' },
    { id: 4, evaluationId: 2, action: 'Gather more customer information', owner: 'Product Team', due: '2025-07-26', status: 'Not Started' },
    { id: 5, evaluationId: 1, action: 'Schedule stakeholder meetings', owner: 'You', due: '2025-07-28', status: 'In Progress' },
];

const initialEvaluations = [
    { id: 1, name: 'Q4 2025 Product Strategy', type: 'Roadmap Planning', lastUpdated: '3 hours ago', simulations: 2, color: 'blue' },
    { id: 2, name: 'AI Agent Framework Evaluation', type: 'Spike in the Roadmap', lastUpdated: 'Yesterday', simulations: 0, color: 'indigo' },
    { id: 3, name: 'New Pricing Model Analysis', type: 'Pricing Exercise', lastUpdated: '2 days ago', simulations: 1, color: 'amber' },
];

const initialProjects = [
    { id: 1, name: 'Growth Initiatives', evaluationIds: [1] },
    { id: 2, name: 'Core Platform Enhancements', evaluationIds: [3] },
];

const defaultStakeholders = [
    { id: 1, nickname: 'CEO', basePersona: 'CEO', guidance: 'Focuses on top-line growth and market perception. Tends to be risk-averse regarding brand image.' },
    { id: 2, nickname: 'CFO', basePersona: 'CFO', guidance: 'Primarily concerned with budget adherence, ROI, and long-term financial viability. Very data-driven.' },
    { id: 3, nickname: 'Head of Sales', basePersona: 'Head of Sales', guidance: 'Concerned with sales cycle length, team enablement, and competitive positioning. Responds well to revenue projections.' },
    { id: 4, nickname: 'Head of Engineering', basePersona: 'Head of Engineering', guidance: 'Focuses on technical feasibility, scalability, and team capacity.' },
    { id: 5, nickname: 'Voice of the Customer', basePersona: 'Voice of the Customer', guidance: 'Represents the end-user experience, focusing on usability, satisfaction, and pain points.' },
];

// --- MAIN APP COMPONENT ---
export default function App() {
  // --- STATE MANAGEMENT ---
  const [activeLeftNav, setActiveLeftNav] = useState('Welcome');
  const [activeRightTab, setActiveRightTab] = useState('proposal');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [projects, setProjects] = useState(initialProjects);
  const [activeEvaluationId, setActiveEvaluationId] = useState(null);
  const [assigningEvaluation, setAssigningEvaluation] = useState(null);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [userName, setUserName] = useState('Skyler Place');
  const [settingsInitialTab, setSettingsInitialTab] = useState('Profile');
  const [highlightedNextStepId, setHighlightedNextStepId] = useState(null);

  const [mainMessages, setMainMessages] = useState([
    { sender: 'DekaBridge Agent', text: 'Welcome to the evaluation roadmap. I am the DekaBridge Agent, your strategic AI. How can we begin defining the problem space today?', type: 'ai' },
    { sender: 'Decision Coach', text: 'Cognitive fallacy detected, Decision Coach will help you determine alternative options.', type: 'ai' },
    { sender: 'You', text: 'I need help figuring out how to fit more things into my roadmap', type: 'user' },

  ]);
  
  const [simulationRooms, setSimulationRooms] = useState([]);
  const [simulationMessages, setSimulationMessages] = useState({});
  
  const [proposalText, setProposalText] = useState(
    `## Project Phoenix: Strategic Initiative Proposal\n\n**1. Problem Statement:**\n...`
  );
  const [nextSteps, setNextSteps] = useState(initialNextSteps);

  // --- HANDLERS ---
  const handleSendMessage = (text, chatTabId) => {
    const newUserMessage = { sender: 'You', text, type: 'user' };
    
    if (chatTabId === 'conversation') {
      setMainMessages(prev => [...prev, newUserMessage]);
      setTimeout(() => {
        const dekaResponse = { sender: 'DekaBridge Agent', text: 'That\'s a valid point. I\'ve updated the proposal.', type: 'ai' };
        setMainMessages(prev => [...prev, dekaResponse]);
      }, 1200);
    } else if (chatTabId.startsWith('sim-room-')) {
      // ... simulation message logic
    }
  };

  const handleLaunchSimulation = (selectedAgents, evaluationId) => {
    if (selectedAgents.length > 0) {
      const newRoomId = `sim-room-${simulationRooms.length + 1}`;
      const newRoom = {
        id: newRoomId,
        name: `Room ${simulationRooms.length + 1}`,
        agents: selectedAgents,
        evaluationId: evaluationId,
      };
      setSimulationRooms(prev => [...prev, newRoom]);

      const agentList = selectedAgents.join(', ');
      const simulationMessage = { sender: 'System', text: `(Simulation Started) You are now in a meeting with: ${agentList}.`, type: 'system' };
      const firstSpeaker = selectedAgents[0];
      const firstMessage = { sender: firstSpeaker, text: `Good morning. I'm the ${firstSpeaker}. Thanks for pulling this group together. Let's start with the budget.`, type: 'simulation' };
      
      setSimulationMessages(prev => ({
        ...prev,
        [newRoomId]: [simulationMessage, firstMessage]
      }));
      return newRoomId; // Return the new ID
    }
    return null;
  };

  const handleStartNewEvaluation = (name, color) => {
    const newEvaluation = {
      id: Date.now(),
      name: `New Evaluation: ${name}`,
      type: name,
      lastUpdated: 'Just now',
      simulations: 0,
      color: color,
    };
    setEvaluations(prev => [newEvaluation, ...prev]);
    setActiveLeftNav('Evaluations');
    setActiveEvaluationId(newEvaluation.id);
  };
  
  const handleSelectSpecificEvaluation = (id, initialTab = 'proposal', nextStepId = null) => {
    setActiveRightTab(initialTab);
    setHighlightedNextStepId(nextStepId);
    setActiveEvaluationId(id);
    setActiveLeftNav('Evaluations');
  }

  const handleDeleteEvaluation = (id) => {
    setEvaluations(prev => prev.filter(ev => ev.id !== id));
    if (activeEvaluationId === id) {
        setActiveEvaluationId(null);
    }
  };
  
  const handleAssignToProject = (evaluationId, projectId) => {
    setProjects(prevProjects => {
        const projectsWithoutEval = prevProjects.map(p => ({
            ...p,
            evaluationIds: p.evaluationIds.filter(id => id !== evaluationId)
        }));
        return projectsWithoutEval.map(p =>
            p.id === projectId
            ? { ...p, evaluationIds: [...p.evaluationIds, evaluationId] }
            : p
        );
    });
    setAssigningEvaluation(null);
  };
  
  const handleCreateAndAssignProject = (evaluationId, newProjectName) => {
    const newProject = {
      id: Date.now(),
      name: newProjectName,
      evaluationIds: [evaluationId]
    };
    setProjects(prev => [...prev, newProject]);
    setAssigningEvaluation(null);
  };
  
  const handleUpdateEvaluationName = (id, newName) => {
    setEvaluations(prevEvals => 
      prevEvals.map(ev => ev.id === id ? { ...ev, name: newName } : ev)
    );
  };
  
  const handleUpdateProjectName = (id, newName) => {
    setProjects(prevProjects =>
      prevProjects.map(p => p.id === id ? { ...p, name: newName } : p)
    );
  };
  
  const handleCreateNewProject = (name) => {
    const newProject = { id: Date.now(), name, evaluationIds: [] };
    setProjects(prev => [...prev, newProject]);
  };

  const handleUpdateNextStep = (id, field, value) => {
    setNextSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  };

  const handleDeleteNextStep = (id) => {
    setNextSteps(prevSteps => prevSteps.filter(step => step.id !== id));
  };

  const handleAddNewStep = (newStepData) => {
    const newStep = {
      id: Date.now(),
      evaluationId: activeEvaluationId,
      ...newStepData
    };
    setNextSteps(prevSteps => [...prevSteps, newStep]);
    setShowAddStepModal(false);
  };

  const unassignedEvaluations = evaluations.filter(ev => 
    !projects.some(p => p.evaluationIds.includes(ev.id))
  );
  
  const handleGoBack = () => {
    const isAssigned = projects.some(p => p.evaluationIds.includes(activeEvaluationId));
    if (isAssigned) {
        setActiveLeftNav('Projects');
    } else {
        setActiveLeftNav('Evaluations');
    }
    setActiveEvaluationId(null);
  };

  const renderActiveView = () => {
    const handleNavigate = (page, initialTab = 'Profile') => {
      setActiveLeftNav(page);
      setSettingsInitialTab(initialTab);
    };

    if (activeLeftNav === 'Welcome') {
      return <WelcomeScreen 
        userName={userName}
        evaluations={evaluations} 
        projects={projects}
        nextSteps={nextSteps}
        onNavigateToEvaluations={() => handleNavigate('Evaluations')} 
        onNavigateToProjects={() => handleNavigate('Projects')}
        onNavigateToImpact={() => handleNavigate('Impact')} 
        onStartNewEvaluation={handleStartNewEvaluation}
        onSelectEvaluation={handleSelectSpecificEvaluation}
      />;
    }
    if (activeLeftNav === 'Evaluations') {
      if (activeEvaluationId) {
        const currentEval = evaluations.find(e => e.id === activeEvaluationId);
        return <EvaluationView 
                    userName={userName}
                    evaluation={currentEval} 
                    onUpdateName={handleUpdateEvaluationName} 
                    onGoBack={handleGoBack} 
                    projects={projects} 
                    onAssignRequest={(id) => setAssigningEvaluation(evaluations.find(ev => ev.id === id))} 
                    onNavigate={handleNavigate}
                    mainMessages={mainMessages}
                    simulationRooms={simulationRooms.filter(r => r.evaluationId === activeEvaluationId)}
                    simulationMessages={simulationMessages}
                    onSendMessage={handleSendMessage}
                    onLaunchSimulation={(agents) => handleLaunchSimulation(agents, activeEvaluationId)}
                    activeRightTab={activeRightTab}
                    setActiveRightTab={setActiveRightTab}
                    proposalText={proposalText}
                    nextSteps={nextSteps.filter(s => s.evaluationId === activeEvaluationId)}
                    onUpdateNextStep={handleUpdateNextStep}
                    onDeleteNextStep={handleDeleteNextStep}
                    onAddNewStep={() => setShowAddStepModal(true)}
                    highlightedNextStepId={highlightedNextStepId}
                />;
      }
      return <EvaluationsPage evaluations={unassignedEvaluations} nextSteps={nextSteps} onSelectEvaluation={handleSelectSpecificEvaluation} onDelete={handleDeleteEvaluation} onAssignRequest={(id) => setAssigningEvaluation(evaluations.find(ev => ev.id === id))} onUpdateName={handleUpdateEvaluationName} />;
    }
    if (activeLeftNav === 'Projects') {
        return <ProjectsPage projects={projects} allEvaluations={evaluations} nextSteps={nextSteps} onUpdateProjectName={handleUpdateProjectName} onCreateNewProject={handleCreateNewProject} onSelectEvaluation={handleSelectSpecificEvaluation}/>
    }
    if (activeLeftNav === 'Impact') {
      return <ImpactPage />;
    }
    if (activeLeftNav === 'Settings') {
        return <SettingsPage userName={userName} onUserNameChange={setUserName} initialTab={settingsInitialTab} />;
    }
    if (activeLeftNav === 'About') {
        return <AboutPage />;
    }
    return <div className="p-8"><h1 className="text-4xl font-bold text-[#003E7C]">{activeLeftNav}</h1><p className="text-gray-500 mt-2">This page is under construction.</p></div>;
  };

  const EvaluationView = ({ 
    userName,
    evaluation, 
    onUpdateName, 
    onGoBack, 
    projects, 
    onAssignRequest, 
    onNavigate,
    mainMessages,
    simulationRooms,
    simulationMessages,
    onSendMessage,
    onLaunchSimulation,
    activeRightTab,
    setActiveRightTab,
    proposalText,
    nextSteps,
    onUpdateNextStep,
    onDeleteNextStep,
    onAddNewStep,
    highlightedNextStepId
  }) => {
    const assignedProject = projects.find(p => p.evaluationIds.includes(evaluation?.id));

    return (
    <>
      <header className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
            <button onClick={onGoBack} title="Go back" className="p-2 text-gray-400 hover:text-[#0063C6] hover:bg-gray-200/50 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
            </button>
          <EditableTitle 
            initialValue={evaluation?.name || "Evaluation"}
            onSave={(newName) => onUpdateName(evaluation.id, newName)}
            tag="h1"
            textClasses="text-3xl font-bold text-[#003E7C]"
          />
          {assignedProject ? (
            <button onClick={() => onAssignRequest(evaluation.id)} className="text-sm font-medium text-[#003E7C] bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
              {assignedProject.name}
            </button>
          ) : (
            <button onClick={() => onAssignRequest(evaluation.id)} title="Add to Project" className="text-gray-400 hover:text-[#0063C6] transition-colors">
              <FolderPlus className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>
      
      <div className="flex-1 flex gap-8 overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col h-full">
          <ChatContainer 
            userName={userName}
            mainMessages={mainMessages}
            simulationRooms={simulationRooms}
            simulationMessages={simulationMessages}
            onSendMessage={onSendMessage}
            onLaunchSimulation={onLaunchSimulation}
            onNavigate={onNavigate}
          />
        </div>
        <div className="hidden md:flex w-1/2 flex-col bg-white rounded-xl border border-gray-200/80 shadow-sm h-full">
          <div className="flex border-b border-gray-200/80">
            <InfoTabButton id="proposal" activeTab={activeRightTab} onClick={setActiveRightTab} icon={FileText}>Proposal</InfoTabButton>
            <InfoTabButton id="data" activeTab={activeRightTab} onClick={setActiveRightTab} icon={Database}>Facts</InfoTabButton>
            <InfoTabButton id="nextSteps" activeTab={activeRightTab} onClick={setActiveRightTab} icon={ListChecks}>Next Steps</InfoTabButton>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 rounded-b-xl">
            {activeRightTab === 'proposal' && <ProposalView content={proposalText} />}
            {activeRightTab === 'data' && <FactsView />}
            {activeRightTab === 'nextSteps' && <NextStepsView steps={nextSteps} onUpdate={onUpdateNextStep} onDelete={onDeleteNextStep} onAdd={onAddNewStep} highlightedStepId={highlightedNextStepId} />}
          </div>
        </div>
      </div>
    </>
    );
  };

  // --- RENDER ---
  return (
    <div className="bg-slate-100 text-[#001931] font-sans flex h-screen">
      <LeftSidebar 
        activeItem={activeLeftNav} 
        setActiveItem={setActiveLeftNav} 
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        setActiveEvaluationId={setActiveEvaluationId}
      />
      
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 overflow-hidden">
        {renderActiveView()}
      </main>
      
      {assigningEvaluation && (
        <AssignProjectModal 
          evaluation={assigningEvaluation}
          projects={projects}
          onClose={() => setAssigningEvaluation(null)}
          onAssign={handleAssignToProject}
          onCreateAndAssign={handleCreateAndAssignProject}
        />
      )}

      {showAddStepModal && (
        <AddNextStepModal
          onClose={() => setShowAddStepModal(false)}
          onAdd={handleAddNewStep}
        />
      )}
    </div>
  );
}

// --- CHILD COMPONENTS ---

const LeftSidebar = ({ activeItem, setActiveItem, isExpanded, setIsExpanded, setActiveEvaluationId }) => (
  <nav className={`bg-[#001931] flex flex-col py-8 gap-6 transition-all duration-300 ${isExpanded ? 'w-56' : 'w-20 items-center'}`}>
    <button onClick={() => { setActiveItem('About'); setActiveEvaluationId(null); }} className={`text-white font-bold text-2xl h-8 flex items-center ${isExpanded ? 'px-6' : 'px-0 justify-center w-full'}`}>DB</button>
    <div className={`flex flex-col gap-2 mt-10 w-full ${isExpanded ? 'px-4' : 'items-center'}`}>
      <SidebarButton name="Welcome" icon={Home} activeItem={activeItem} onClick={() => { setActiveItem('Welcome'); setActiveEvaluationId(null); }} isExpanded={isExpanded} />
      <SidebarButton name="Evaluations" icon={ClipboardList} activeItem={activeItem} onClick={() => { setActiveItem('Evaluations'); setActiveEvaluationId(null); }} isExpanded={isExpanded} />
      <SidebarButton name="Projects" icon={FolderKanban} activeItem={activeItem} onClick={() => { setActiveItem('Projects'); setActiveEvaluationId(null); }} isExpanded={isExpanded} />
      <SidebarButton name="Impact" icon={Trophy} activeItem={activeItem} onClick={() => { setActiveItem('Impact'); setActiveEvaluationId(null); }} isExpanded={isExpanded} />
    </div>
    <div className={`mt-auto w-full ${isExpanded ? 'px-4' : 'items-center flex flex-col'}`}>
       <SidebarButton name="Settings" icon={Settings} activeItem={activeItem} onClick={() => { setActiveItem('Settings'); setActiveEvaluationId(null); }} isExpanded={isExpanded} />
       <button onClick={() => setIsExpanded(!isExpanded)} className="w-full mt-4 text-gray-400 hover:bg-white/10 hover:text-white p-4 rounded-xl flex items-center gap-4 transition-colors justify-center">
        {isExpanded ? <ChevronsLeft size={20}/> : <ChevronsRight size={20} />}
       </button>
    </div>
  </nav>
);

const ChatContainer = ({ userName, mainMessages, simulationRooms, simulationMessages, onSendMessage, onLaunchSimulation, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('conversation');
  
  let currentMessages = [];
  if (activeTab === 'conversation') {
    currentMessages = mainMessages;
  } else if (activeTab.startsWith('sim-room-')) {
    currentMessages = simulationMessages[activeTab] || [];
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200/80 shadow-sm">
      <div className="flex border-b border-gray-200/80 px-2 pt-2">
        <ChatTabButton name="Conversation" id="conversation" activeTab={activeTab} onClick={setActiveTab} />
        <ChatTabButton name="Simulation" id="simulation-launcher" activeTab={activeTab} onClick={setActiveTab} icon={PlusCircle} />
        {simulationRooms.map(room => (
          <ChatTabButton key={room.id} name={room.name} id={room.id} activeTab={activeTab} onClick={setActiveTab} />
        ))}
      </div>
      
      {activeTab === 'simulation-launcher' ? (
        <SimulationLauncherView onLaunch={(selectedAgents) => {
            const newRoomId = onLaunchSimulation(selectedAgents);
            if (newRoomId) {
                setActiveTab(newRoomId);
            }
        }} onNavigate={onNavigate} />
      ) : (
        <ChatView userName={userName} messages={currentMessages} onSendMessage={(text) => onSendMessage(text, activeTab)} />
      )}
    </div>
  );
};

const ChatTabButton = ({ name, id, activeTab, onClick, icon: Icon }) => (
  <button onClick={() => onClick(id)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap rounded-t-lg ${activeTab === id ? 'text-[#0063C6] border-b-2 border-[#0063C6] bg-white' : 'text-gray-500 hover:bg-gray-100/50 hover:text-[#003E7C]'}`}>
    {Icon && <Icon className="w-4 h-4" />}
    {name}
  </button>
);

const ChatView = ({ userName, messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) { onSendMessage(input.trim()); setInput(''); }
  };

  const getAgentIcon = (sender) => {
    if (sender === 'DekaBridge Agent') return <Bot className="w-5 h-5 text-[#0063C6]" />;
    if (sender === 'Decision Coach') return <Cpu className="w-5 h-5 text-purple-600" />;
    if (sender === 'You') return <User className="w-5 h-5 text-white" />;
    if (sender === 'System') return <Settings className="w-5 h-5 text-gray-500" />;
    return <Briefcase className="w-5 h-5 text-yellow-800" />;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
            {msg.type !== 'user' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">{getAgentIcon(msg.sender)}</div>}
            <div className={`max-w-md p-3 rounded-xl ${msg.type === 'user' ? 'bg-[#0063C6] text-white' : 'bg-[#E8EDF2] text-[#001931]'}`}>
              <p className="font-semibold text-xs mb-1">{msg.sender === 'You' ? userName.split(' ')[0] : msg.sender}</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
            </div>
            {msg.type === 'user' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#0063C6] flex items-center justify-center">{getAgentIcon(msg.sender)}</div>}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/80 flex items-center gap-3">
        <button type="button" title="Add document" className="flex-shrink-0 flex items-center justify-center w-12 h-12 text-gray-500 hover:text-[#0063C6] rounded-full hover:bg-gray-100 transition-colors">
            <PlusCircle className="w-6 h-6" />
        </button>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 bg-gray-100 border-2 border-transparent rounded-lg p-4 h-12 focus:ring-2 focus:ring-[#0063C6] focus:border-transparent focus:outline-none transition" />
        <button type="submit" className="flex-shrink-0 bg-[#0063C6] hover:bg-[#003E7C] text-white font-bold h-12 w-12 rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!input.trim()}>
            <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

const SidebarButton = ({ name, icon: Icon, activeItem, onClick, isExpanded }) => (
  <button onClick={onClick} title={name} className={`w-full flex items-center gap-4 rounded-xl transition-all duration-300 transform ${isExpanded ? 'p-4 justify-start' : 'h-14 justify-center'} ${activeItem === name ? 'bg-[#0063C6] text-white' : 'text-gray-400 hover:bg-white/10'}`}>
    <Icon className="w-6 h-6 flex-shrink-0" />
    {isExpanded && <span className="font-semibold">{name}</span>}
  </button>
);

const InfoTabButton = ({ id, activeTab, onClick, icon: Icon, children }) => (
  <button onClick={() => onClick(id)} className={`flex-1 flex items-center justify-center gap-2 p-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === id ? 'text-[#0063C6] border-[#0063C6]' : 'text-gray-500 border-transparent hover:bg-gray-100/50 hover:text-[#003E7C]'}`}>
    <Icon className="w-5 h-5" />{children}
  </button>
);

const ProposalView = ({ content }) => (
  <div className="p-6 prose prose-sm max-w-none prose-headings:text-[#003E7C] prose-strong:text-[#001931]">
    <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />').replace(/## (.*?)<br \/>/g, '<h2>$1</h2>').replace(/\*\* (.*?)<br \/>/g, '<strong>$1</strong>') }} />
  </div>
);

const FactsView = () => {
    const [facts, setFacts] = useState([
        { id: 1, fact: "Opportunity 'Project Titan' is currently in the Proposal/Price Quote stage.", source: 'Salesforce', reference: 'Project Titan', link: '#' },
        { id: 2, fact: "Support ticket #86753 regarding the Enterprise Plan is still open.", source: 'Zendesk', reference: '#86753', link: '#' },
        { id: 3, fact: "The 'Develop new dashboard module' story is currently In Progress.", source: 'Jira', reference: 'PROJ-123', link: '#' },
        { id: 4, fact: "Account 'Global Tech Inc.' has an annual revenue of $15M.", source: 'Salesforce', reference: 'Global Tech Inc.', link: '#' },
    ]);

    const getSourceLogo = (source) => {
        switch (source) {
            case 'Salesforce':
                return 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg';
            case 'Zendesk':
                return 'https://cdn.worldvectorlogo.com/logos/zendesk.svg';
            case 'Jira':
                return 'https://cdn.worldvectorlogo.com/logos/jira-1.svg';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#003E7C]">Relevant Facts</h3>
            <div className="bg-white rounded-xl border border-gray-200/80">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-200/80">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-500 w-3/5">Fact</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Source</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facts.map(fact => (
                            <tr key={fact.id} className="border-b border-gray-200/80 last:border-b-0">
                                <td className="p-4 text-gray-800 font-medium text-sm">{fact.fact}</td>
                                <td className="p-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <img src={getSourceLogo(fact.source)} alt={`${fact.source} logo`} className="h-4 w-4 object-contain" />
                                        <span>{fact.source}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">
                                    <a href={fact.link} target="_blank" rel="noopener noreferrer" className="text-[#0063C6] hover:underline">
                                        {fact.reference}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DataSection = ({ title, icon: Icon, data, renderItem: RenderItem }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl border border-gray-200/80">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50/50 rounded-t-xl">
        <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-[#0063C6]" /><h3 className="font-bold text-lg text-[#003E7C]">{title}</h3></div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && <div className="p-4 space-y-3">{data.map(item => <RenderItem key={item.id} item={item} />)}</div>}
    </div>
  );
};

const SalesforceItem = ({ item }) => (<a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200/70 transition-colors"><p className="font-semibold text-[#003E7C]">{item.name}</p><div className="text-sm text-gray-600 flex items-center gap-4 mt-1"><span>Type: {item.type}</span>{item.stage && <span>Stage: {item.stage}</span>}{item.amount && <span>Amount: {item.amount}</span>}</div></a>);
const ZendeskItem = ({ item }) => (<a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200/70 transition-colors"><p className="font-semibold text-[#003E7C]">{item.ticketId}: {item.subject}</p><div className="text-sm text-gray-600 flex items-center gap-4 mt-1"><span>Status: <span className={item.status === 'Open' ? 'text-red-600' : 'text-yellow-600'}>{item.status}</span></span><span>Requester: {item.requester}</span></div></a>);
const JiraItem = ({ item }) => (<a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200/70 transition-colors"><p className="font-semibold text-[#003E7C]">{item.issueId}: {item.summary}</p><div className="text-sm text-gray-600 flex items-center gap-4 mt-1"><span>Type: {item.type}</span><span>Status: <span className="text-blue-600">{item.status}</span></span><span>Assignee: {item.assignee}</span></div></a>);

const SimulationLauncherView = ({ onLaunch, onNavigate }) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  
  const handleSelectAgent = (agentName) => {
    setSelectedAgents(prev => prev.includes(agentName) ? prev.filter(a => a !== agentName) : [...prev, agentName]);
  };

  const handleLaunchClick = () => { onLaunch(selectedAgents); setSelectedAgents([]); };

  return (
    <div className="p-6 text-center flex-1 flex flex-col justify-center bg-slate-50/50">
      <div>
        <h3 className="text-2xl font-bold text-[#003E7C] mb-4">New Simulation</h3>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">Select one or more personas to start a new simulation in its own room.</p>
        <div className="text-right mb-4">
            <button onClick={() => onNavigate('Settings', 'Stakeholders')} className="text-sm font-medium text-[#0063C6] hover:text-[#003E7C] whitespace-nowrap">Edit Stakeholders</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <PersonaButton name="CEO" onSelect={handleSelectAgent} isSelected={selectedAgents.includes('CEO')} />
          <PersonaButton name="CFO" onSelect={handleSelectAgent} isSelected={selectedAgents.includes('CFO')} />
          <PersonaButton name="Head of Sales" onSelect={handleSelectAgent} isSelected={selectedAgents.includes('Head of Sales')} />
          <PersonaButton name="Head of Engineering" onSelect={handleSelectAgent} isSelected={selectedAgents.includes('Head of Engineering')} />
          <PersonaButton name="Voice of the Customer" onSelect={handleSelectAgent} isSelected={selectedAgents.includes('Voice of the Customer')} />
        </div>
        <button onClick={handleLaunchClick} disabled={selectedAgents.length === 0} className="w-full bg-[#0063C6] hover:bg-[#003E7C] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"><Users className="w-5 h-5" />Launch Simulation</button>
      </div>
    </div>
  );
};

const PersonaButton = ({ name, onSelect, isSelected, disabled }) => (
  <button onClick={() => onSelect(name)} disabled={disabled} className={`p-4 border-2 rounded-xl transition-all text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 ${isSelected ? 'bg-[#0063C6] border-[#0063C6] text-white scale-105 shadow-lg' : 'bg-white border-gray-200 text-[#003E7C] hover:border-[#0063C6]'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <p className="font-bold">{name}</p>
    <p className="text-xs mt-1">{`Simulate`}</p>
  </button>
);

const NextStepsView = ({ steps, onUpdate, onDelete, onAdd, highlightedStepId }) => {
    const statusOptions = ['Not Started', 'In Progress', 'Completed'];
    const highlightedRef = useRef(null);

    useEffect(() => {
        if (highlightedRef.current) {
            highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [highlightedStepId]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Not Started':
                return 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800 focus:ring-blue-500';
            case 'Completed':
                return 'bg-green-100 text-green-800 focus:ring-green-500';
            default:
                return 'bg-gray-100 text-gray-800 focus:ring-gray-500';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#003E7C]">Action Items</h3>
                <button onClick={onAdd} className="bg-[#0063C6] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#003E7C]">Add Action Item</button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200/80">
                <table className="w-full text-left table-fixed">
                    <thead className="border-b border-gray-200/80">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-500 w-[55%]">Action</th>
                            <th className="p-4 text-sm font-semibold text-gray-500 w-[20%]">Due Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-500 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {steps.map(step => (
                            <tr 
                                key={step.id} 
                                ref={step.id === highlightedStepId ? highlightedRef : null}
                                className={`border-b border-gray-200/80 last:border-b-0 transition-colors duration-1000 ${step.id === highlightedStepId ? 'bg-blue-100' : ''}`}
                            >
                                <td className="p-2 align-top">
                                    <AutosizeTextarea 
                                        value={step.action}
                                        onChange={(e) => onUpdate(step.id, 'action', e.target.value)}
                                        rows={1}
                                        className="w-full bg-transparent p-2 border border-transparent rounded-md focus:bg-white focus:border-gray-300 focus:outline-none resize-none text-xs"
                                    />
                                </td>
                                <td className="p-2 align-top">
                                    <input 
                                        type="date"
                                        value={step.due}
                                        onChange={(e) => onUpdate(step.id, 'due', e.target.value)}
                                        className="w-full bg-transparent p-2 border border-transparent rounded-md focus:bg-white focus:border-gray-300 focus:outline-none text-xs"
                                    />
                                </td>
                                <td className="p-2 align-top">
                                    <select 
                                        value={step.status} 
                                        onChange={(e) => onUpdate(step.id, 'status', e.target.value)}
                                        className={`w-full font-semibold p-2 border border-transparent rounded-md focus:outline-none text-xs appearance-none ${getStatusClasses(step.status)}`}
                                    >
                                        {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                    </select>
                                </td>
                                <td className="p-2 text-right align-top">
                                    <button onClick={() => onDelete(step.id)} className="text-gray-400 hover:text-red-600 p-2">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const EditableTitle = ({ initialValue, onSave, tag: Tag = 'h1', textClasses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (value.trim() === '') {
      setValue(initialValue);
    } else {
      onSave(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };
  
  const handleHeadingClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${textClasses} bg-transparent border-2 border-[#0063C6] rounded-md -m-1 p-0.5 outline-none`}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <Tag onClick={handleHeadingClick} className={`${textClasses} cursor-pointer hover:bg-gray-200/50 rounded-md -m-1 p-1`}>
      {initialValue}
    </Tag>
  );
};

const AutosizeTextarea = (props) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '0px'; // Reset height to recalculate
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [props.value]); // Rerun this effect whenever the text value changes

    return (
        <textarea
            ref={textareaRef}
            {...props}
        />
    );
};
// --- WELCOME SCREEN COMPONENT ---
const WelcomeScreen = ({ userName, onNavigateToEvaluations, onNavigateToProjects, onNavigateToImpact, onStartNewEvaluation, evaluations, projects, nextSteps, onSelectEvaluation }) => {
  const assignedEvaluations = projects.flatMap(p => 
    p.evaluationIds.map(evalId => {
        const evaluation = evaluations.find(e => e.id === evalId);
        return { ...evaluation, projectName: p.name };
    })
  ).filter(Boolean);

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-[#003E7C] sm:text-5xl">Welcome back, {userName.split(' ')[0]}.</h2>
          <p className="mt-2 text-lg text-gray-600">Let's make some smart, fast, and objective decisions today.</p>
        </div>

        <WelcomeSection title="Start a new Evaluation">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <EvaluationCard title="Roadmap Planning" description="Define and prioritize features for your next product cycle." icon={Map} color="blue" onClick={() => onStartNewEvaluation('Roadmap Planning', 'blue')} />
            <EvaluationCard title="Spike in the Roadmap" description="Investigate a technical or business unknown to de-risk future work." icon={Search} color="indigo" onClick={() => onStartNewEvaluation('Spike in the Roadmap', 'indigo')} />
            <EvaluationCard title="Analyze Existing Proposal" description="Upload a document to identify its strengths, weaknesses, and biases." icon={BarChart3} color="emerald" onClick={() => onStartNewEvaluation('Analyze Existing Proposal', 'emerald')} />
            <EvaluationCard title="Pricing Exercise" description="Model different pricing strategies and their potential revenue impact." icon={DollarSign} color="amber" onClick={() => onStartNewEvaluation('Pricing Exercise', 'amber')} />
            <EvaluationCard title="Strategic Sandbox" description="Tackle any product challenge or explore new ideas in an open-ended conversation." icon={Lightbulb} color="cyan" onClick={() => onStartNewEvaluation('Strategic Sandbox', 'cyan')} />
          </div>
        </WelcomeSection>

        <WelcomeSection title="Resume an Evaluation" onHeaderClick={onNavigateToProjects} isLink>
          <div className="space-y-4">
            {assignedEvaluations.slice(0, 2).map(ev => (
                 <ResumeCard 
                    key={ev.id}
                    evaluation={ev}
                    projectName={ev.projectName}
                    onSelect={(initialTab, stepId) => onSelectEvaluation(ev.id, initialTab, stepId)}
                    nextSteps={nextSteps}
                />
            ))}
          </div>
        </WelcomeSection>
        
        <WelcomeSection title="Track Decision Impact" onHeaderClick={onNavigateToImpact} isLink>
          <ImpactTable />
        </WelcomeSection>
      </div>
    </div>
  );
};

const WelcomeSection = ({ title, children, onHeaderClick, isLink }) => (
  <section className="mt-16 first:mt-0">
    <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-6">
        <h3 className="text-xl font-semibold text-[#003E7C]">{title}</h3>
        {isLink && (
            <button onClick={onHeaderClick} className="text-sm font-medium text-[#0063C6] hover:text-[#003E7C]">
                View All &rarr;
            </button>
        )}
    </div>
    {children}
  </section>
);

const EvaluationCard = ({ title, description, icon: Icon, color, onClick }) => {
  const colors = {
    blue: 'bg-blue-100 text-[#0063C6]',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };
  return (
    <div onClick={onClick} className="bg-white p-5 rounded-xl border border-gray-200/80 flex flex-col items-start transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="font-semibold text-[#003E7C]">{title}</h4>
      <p className="text-sm text-gray-500 mt-1 flex-grow">{description}</p>
    </div>
  );
};

const ResumeCard = ({ evaluation, projectName, onAssign, onDelete, onSelect, onUpdateName, nextSteps }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-100',
        indigo: 'text-indigo-600 bg-indigo-100',
        amber: 'text-amber-600 bg-amber-100',
    };
    
    const relevantNextSteps = nextSteps.filter(step => step.evaluationId === evaluation.id && step.status !== 'Completed');
    const mostUrgentNextStep = relevantNextSteps.sort((a, b) => new Date(a.due) - new Date(b.due))[0];

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="flex-grow cursor-pointer" onClick={() => onSelect()}>
                 <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {onUpdateName ? (
                        <EditableTitle 
                            initialValue={evaluation.name}
                            onSave={onUpdateName}
                            tag="h4"
                            textClasses="text-lg font-semibold text-[#003E7C]"
                        />
                    ) : (
                        <h4 className="text-lg font-semibold text-[#003E7C]">{evaluation.name}</h4>
                    )}
                    {projectName && <span className="text-xs font-semibold uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{projectName}</span>}
                    <span className={`text-xs font-semibold uppercase ${colors[evaluation.color]} px-2 py-0.5 rounded-full`}>{evaluation.type}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4 flex-wrap">
                    <span>Last updated: {evaluation.lastUpdated}</span>
                    <button onClick={(e) => { e.stopPropagation(); onSelect('proposal'); }} className="flex items-center gap-1.5 text-[#0063C6] hover:underline">
                        <FileText size={14} /> Proposal
                    </button>
                </div>
            </div>
            <div className="w-full sm:w-72 border-t sm:border-t-0 sm:border-l border-gray-200 mt-4 sm:mt-0 pt-4 sm:pt-0 sm:pl-4 sm:ml-4 flex-shrink-0 flex items-center gap-2">
                {onAssign && onDelete ? (
                    <>
                        <button onClick={onAssign} title="Add to Project" className="p-2 text-gray-500 hover:text-[#0063C6] hover:bg-gray-100 rounded-md">
                            <FolderPlus size={20} />
                        </button>
                        <button onClick={onDelete} title="Delete Evaluation" className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                            <Trash2 size={20} />
                        </button>
                    </>
                ) : (
                    mostUrgentNextStep ? (
                        <button onClick={(e) => { e.stopPropagation(); onSelect('nextSteps', mostUrgentNextStep.id); }} className="text-left w-full">
                            <h5 className="text-sm font-semibold text-gray-700">Next Step</h5>
                            <p className="text-sm text-gray-600 mt-1 hover:text-[#0063C6]">{mostUrgentNextStep.action} <span className="text-gray-400">({mostUrgentNextStep.due})</span></p>
                        </button>
                    ) : (
                         <div className="text-left">
                            <h5 className="text-sm font-semibold text-gray-700">Next Step</h5>
                            <p className="text-sm text-gray-500 mt-1">No pending action items.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

const ImpactTable = () => {
    const tableData = [
        { proposal: 'International Expansion Plan', project: 'Growth', milestone: 'First Country Online', date: 'Aug 05, 2025', roi: '$2.5M Expansion' },
        { proposal: 'Mobile App V2 Strategy', project: 'Mobile', milestone: '100k Users Rolled Out', date: 'Aug 18, 2025', roi: '$750k ARR' },
        { proposal: 'Project Phoenix Launch', project: 'Core Platform', milestone: 'Customers Live', date: 'Aug 28, 2025', roi: '$1.2M ARR' },
    ];
    return (
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposal Name</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected ROI</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Steps</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                         {tableData.map((row, index) => (
                             <tr key={index}>
                                <td className="px-4 py-3 whitespace-nowrap font-medium text-[#003E7C]">{row.proposal}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.project}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.milestone}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.date}</td>
                                <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-700">{row.roi}</td>
                                <td className="px-4 py-3 whitespace-nowrap font-medium">
                                    <div className="flex items-center gap-2">
                                        <button className="text-[#0063C6] hover:text-[#003E7C] text-xs font-semibold">Adjust</button>
                                        <button className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold">Report</button>
                                    </div>
                                </td>
                            </tr>
                         ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const EvaluationsPage = ({ evaluations, onSelectEvaluation, onDelete, onAssignRequest, onUpdateName, nextSteps }) => (
    <div className="flex-grow overflow-y-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#003E7C]">New Evaluations</h2>
            <p className="text-gray-500 mt-1">Please assign an evaluation to a project.</p>
        </div>
        <div className="space-y-4">
            {evaluations.map(ev => (
                <ResumeCard 
                    key={ev.id}
                    evaluation={ev}
                    nextSteps={nextSteps}
                    onSelect={(initialTab, stepId) => onSelectEvaluation(ev.id, initialTab, stepId)}
                    onDelete={(e) => { e.stopPropagation(); onDelete(ev.id); }}
                    onAssign={(e) => { e.stopPropagation(); onAssignRequest(ev.id); }}
                    onUpdateName={(newName) => onUpdateName(ev.id, newName)}
                />
            ))}
        </div>
      </div>
    </div>
);

const ImpactPage = () => (
    <div className="flex-grow overflow-y-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#003E7C] mb-8">Decision Impact Dashboard</h2>
        <ImpactTable />
      </div>
    </div>
);
const AboutPage = () => (
    <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl border border-gray-200/80 shadow-sm">
            <h2 className="text-3xl font-bold text-[#001931]">DekaBridge</h2>
            <p className="text-gray-500 mt-1">Version 1.0.0</p>
            
            <div className="my-6 border-t border-gray-200"></div>

            <p className="text-sm text-gray-600">
                &copy; 2025 DekaBridge, Inc. All rights reserved.
            </p>
            <a href="https://www.dekabridge.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#0063C6] hover:underline mt-1 block">
                https://www.dekabridge.com/
            </a>

            <div className="mt-6 bg-blue-50 text-blue-800 font-semibold px-4 py-2 rounded-lg inline-block">
                Designed in the mountains, built by the bay.
            </div>
        </div>
    </div>
);
const ProjectsPage = ({ projects, allEvaluations, onUpdateProjectName, onCreateNewProject, onSelectEvaluation, nextSteps }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [expandedProjects, setExpandedProjects] = useState(projects.map(p => p.id));

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            onCreateNewProject(newProjectName.trim());
            setNewProjectName('');
        }
    };

    const toggleProject = (id) => {
        setExpandedProjects(prev => 
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex-grow overflow-y-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-[#003E7C]">Projects</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="New project name..."
                            className="bg-white border-2 border-gray-200 rounded-lg p-2 h-10 focus:ring-2 focus:ring-[#0063C6] focus:border-transparent focus:outline-none transition"
                        />
                        <button onClick={handleCreateProject} className="bg-[#0063C6] text-white px-4 h-10 rounded-lg font-semibold hover:bg-[#003E7C] transition-colors">Create</button>
                    </div>
                </div>
                <div className="space-y-6">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white rounded-xl border border-gray-200/80">
                            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleProject(project.id)}>
                                <EditableTitle 
                                    initialValue={project.name}
                                    onSave={(newName) => onUpdateProjectName(project.id, newName)}
                                    tag="h3"
                                    textClasses="text-xl font-bold text-[#003E7C]"
                                />
                                <ChevronDown className={`transition-transform ${expandedProjects.includes(project.id) ? 'rotate-180' : ''}`} />
                            </div>
                            {expandedProjects.includes(project.id) && (
                                <div className="p-4 border-t border-gray-200/80 space-y-3">
                                    {project.evaluationIds.length > 0 ? (
                                        allEvaluations.filter(ev => project.evaluationIds.includes(ev.id)).map(ev => (
                                            <ResumeCard
                                                key={ev.id}
                                                evaluation={ev}
                                                nextSteps={nextSteps}
                                                onSelect={(initialTab, stepId) => onSelectEvaluation(ev.id, initialTab, stepId)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm px-4">No evaluations assigned to this project yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AssignProjectModal = ({ evaluation, projects, onClose, onAssign, onCreateAndAssign }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleCreate = () => {
        if (newProjectName.trim()) {
            onCreateAndAssign(evaluation.id, newProjectName.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#003E7C]">Assign to Project</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <p className="text-sm text-gray-600 mb-4">Assign "<span className="font-semibold">{evaluation.name}</span>" to an existing project or create a new one.</p>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {projects.map(p => (
                        <button key={p.id} onClick={() => onAssign(evaluation.id, p.id)} className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                            {p.name}
                        </button>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <p className="font-semibold text-gray-700 mb-2">Or create a new project</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="New project name..."
                            className="flex-grow bg-white border-2 border-gray-200 rounded-lg p-2 h-10 focus:ring-2 focus:ring-[#0063C6] focus:border-transparent focus:outline-none transition"
                        />
                        <button onClick={handleCreate} className="bg-[#0063C6] text-white px-4 h-10 rounded-lg font-semibold hover:bg-[#003E7C] transition-colors">Create & Assign</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddNextStepModal = ({ onClose, onAdd }) => {
    const [action, setAction] = useState('');
    const [due, setDue] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('Not Started');
    const statusOptions = ['Not Started', 'In Progress', 'Completed'];
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleCreate = () => {
        if (action.trim()) {
            onAdd({
                action,
                due,
                status,
                owner: 'Unassigned' // Default owner
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#003E7C]">Add New Action Item</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Action</label>
                        <textarea 
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            rows={3}
                            placeholder="Describe the action item..."
                            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input 
                            type="date"
                            value={due}
                            onChange={(e) => setDue(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border bg-white"
                        >
                            {statusOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t flex justify-end">
                    <button onClick={handleCreate} className="bg-[#0063C6] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#003E7C]">Add Item</button>
                </div>
            </div>
        </div>
    );
};

const SettingsPage = ({ userName, onUserNameChange, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'Profile');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);


    return (
        <div className="flex-grow overflow-y-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-[#003E7C] mb-8">Settings</h2>
                <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                    <nav className="flex border-b border-gray-200/80">
                        <SettingsTabButton name="Profile" activeTab={activeTab} onClick={setActiveTab} />
                        <SettingsTabButton name="Files" activeTab={activeTab} onClick={setActiveTab} />
                        <SettingsTabButton name="Integrations" activeTab={activeTab} onClick={setActiveTab} />
                        <SettingsTabButton name="Stakeholders" activeTab={activeTab} onClick={setActiveTab} />
                    </nav>
                    <div className="p-8">
                        {activeTab === 'Profile' && <ProfileSettings userName={userName} onUserNameChange={onUserNameChange} />}
                        {activeTab === 'Files' && <FileSettings />}
                        {activeTab === 'Integrations' && <IntegrationsSettings />}
                        {activeTab === 'Stakeholders' && <StakeholderSettings />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsTabButton = ({ name, activeTab, onClick }) => (
    <button 
        onClick={() => onClick(name)}
        className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === name ? 'text-[#0063C6] border-[#0063C6]' : 'text-gray-500 border-transparent hover:text-[#003E7C]'}`}
    >
        {name}
    </button>
);

const ProfileSettings = ({ userName, onUserNameChange }) => {
    const [role, setRole] = useState('Product Manager');

    return (
        <div>
            <h3 className="text-xl font-bold text-[#003E7C] mb-6">Profile</h3>
            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCircle size={48} className="text-gray-400" />
                    </div>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">Upload Picture</button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" value={userName} onChange={(e) => onUserNameChange(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border" />
                </div>
                 <button className="bg-[#0063C6] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#003E7C]">Save Changes</button>
            </div>
        </div>
    );
};

const FileSettings = () => {
    const [files, setFiles] = useState([
        { id: 1, name: 'Q3_Roadmap_Draft.pdf', type: 'pdf' },
        { id: 2, name: 'Competitor_Analysis.docx', type: 'doc' },
        { id: 3, name: 'Launch_Plan.pptx', type: 'ppt' },
    ]);

    const handleDelete = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };
    
    const getFileIcon = (type) => {
        if (type === 'pdf') return <FileIcon className="text-red-500" />;
        if (type === 'doc') return <FileIcon className="text-blue-500" />;
        if (type === 'ppt') return <FileIcon className="text-orange-500" />;
        return <FileIcon className="text-gray-500" />;
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-[#003E7C] mb-6">Uploaded Files</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 relative">
                <UploadCloud size={48} className="mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600">Drag & drop files here or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">Supports: PDF, DOCX, PPTX</p>
                <input type="file" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
            </div>
            <div className="space-y-3">
                {files.map(file => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <span className="font-medium">{file.name}</span>
                        </div>
                        <button onClick={() => handleDelete(file.id)} className="text-gray-400 hover:text-red-600">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const IntegrationsSettings = () => {
    const [connected, setConnected] = useState(['Jira']);

    const allIntegrations = [
        { id: 'jira', name: 'Jira', logo: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg' },
        { id: 'zendesk', name: 'Zendesk', logo: 'https://cdn.worldvectorlogo.com/logos/zendesk.svg' },
        { id: 'onedrive', name: 'OneDrive', logo: 'https://cdn.worldvectorlogo.com/logos/onedrive-2.svg' },
        { id: 'googledrive', name: 'Google Drive', logo: 'https://cdn.worldvectorlogo.com/logos/google-drive.svg' },
        { id: 'salesforce', name: 'Salesforce', logo: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg' },
    ];

    const handleConnect = (id) => {
        setConnected(prev => [...prev, id]);
    };

    const handleDisconnect = (id) => {
        setConnected(prev => prev.filter(item => item !== id));
    };

    const connectedIntegrations = allIntegrations.filter(int => connected.includes(int.id));
    const availableIntegrations = allIntegrations.filter(int => !connected.includes(int.id));

    return (
        <div>
            <h3 className="text-xl font-bold text-[#003E7C] mb-6">Integrations</h3>
            
            {connectedIntegrations.length > 0 && (
                <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-600 mb-4">Connected Integrations</h4>
                    <div className="space-y-3">
                        {connectedIntegrations.map(int => (
                            <div key={int.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                                <div className="flex items-center gap-4">
                                    <img src={int.logo} alt={`${int.name} logo`} className="h-8 w-8 object-contain" />
                                    <span className="font-semibold">{int.name}</span>
                                </div>
                                <button onClick={() => handleDisconnect(int.id)} className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-600">Disconnect</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {availableIntegrations.length > 0 && (
                 <div>
                    <h4 className="text-md font-semibold text-gray-600 mb-4">Available Integrations</h4>
                    <div className="space-y-3">
                        {availableIntegrations.map(int => (
                            <div key={int.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img src={int.logo} alt={`${int.name} logo`} className="h-8 w-8 object-contain" />
                                    <span className="font-semibold">{int.name}</span>
                                </div>
                                <button onClick={() => handleConnect(int.id)} className="bg-[#0063C6] hover:bg-[#003E7C] text-white px-4 py-1.5 rounded-md text-sm font-medium">Connect</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StakeholderSettings = () => {
    const basePersonas = ['CEO', 'CFO', 'Head of Sales', 'Head of Engineering', 'Voice of the Customer'];
    
    const [stakeholders, setStakeholders] = useState(defaultStakeholders);
    const [expandedId, setExpandedId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleUpdateField = (id, field, value) => {
        setStakeholders(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleAddNew = (newStakeholderData) => {
        const newStakeholder = {
            id: Date.now(),
            nickname: newStakeholderData.nickname,
            basePersona: newStakeholderData.basePersona,
            guidance: 'Add behavioral guidance here...' // Add default guidance
        };
        setStakeholders(prev => [...prev, newStakeholder]);
        setShowAddModal(false);
        setExpandedId(newStakeholder.id);
    };
    
    const handleDelete = (id) => {
        setStakeholders(prev => prev.filter(s => s.id !== id));
    };
    
    const handleReset = (id) => {
        const stakeholderToReset = stakeholders.find(s => s.id === id);
        const defaultState = defaultStakeholders.find(ds => ds.name === stakeholderToReset.basePersona);
        if (defaultState) {
            setStakeholders(prev => prev.map(s => s.id === id ? { ...s, nickname: defaultState.name, guidance: defaultState.guidance } : s));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#003E7C]">Stakeholders</h3>
                <button onClick={() => setShowAddModal(true)} className="bg-[#0063C6] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#003E7C]">Add New</button>
            </div>
            <div className="space-y-4">
                {stakeholders.map(stakeholder => (
                    <div key={stakeholder.id} className="bg-white rounded-xl border border-gray-200/80">
                        <button 
                            className="w-full flex justify-between items-center p-4 text-left"
                            onClick={() => setExpandedId(expandedId === stakeholder.id ? null : stakeholder.id)}
                        >
                            <h4 className="text-lg font-semibold text-[#003E7C]">{stakeholder.nickname}</h4>
                            <ChevronDown className={`transition-transform ${expandedId === stakeholder.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedId === stakeholder.id && (
                            <div className="p-4 border-t border-gray-200/80">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nickname</label>
                                        <input 
                                            type="text"
                                            value={stakeholder.nickname}
                                            onChange={(e) => handleUpdateField(stakeholder.id, 'nickname', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Base DekaBridge Persona</label>
                                        <select
                                            value={stakeholder.basePersona}
                                            onChange={(e) => handleUpdateField(stakeholder.id, 'basePersona', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border bg-white"
                                        >
                                            {basePersonas.map(persona => (
                                                <option key={persona} value={persona}>{persona}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Additional Behavioral Guidance</label>
                                        <textarea 
                                            value={stakeholder.guidance}
                                            onChange={(e) => handleUpdateField(stakeholder.id, 'guidance', e.target.value)}
                                            rows={4}
                                            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200/80 flex justify-end gap-2">
                                    <button className="text-sm font-medium text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md">Validate Changes</button>
                                    <button onClick={() => handleReset(stakeholder.id)} className="text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">Reset to Default</button>
                                    <button onClick={() => handleDelete(stakeholder.id)} className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {showAddModal && <AddStakeholderModal basePersonas={basePersonas} onClose={() => setShowAddModal(false)} onAdd={handleAddNew} />}
        </div>
    );
};

const AddStakeholderModal = ({ basePersonas, onClose, onAdd }) => {
    const [nickname, setNickname] = useState('');
    const [basePersona, setBasePersona] = useState(basePersonas[0]);
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleCreate = () => {
        if (nickname.trim()) {
            onAdd({
                nickname,
                basePersona,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#003E7C]">Create New Stakeholder</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nickname</label>
                        <input 
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="e.g., Head of Product"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Base DekaBridge Persona</label>
                        <select
                            value={basePersona}
                            onChange={(e) => setBasePersona(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0063C6] focus:border-[#0063C6] sm:text-sm p-2 border bg-white"
                        >
                            {basePersonas.map(persona => (
                                <option key={persona} value={persona}>{persona}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t flex justify-end">
                    <button onClick={handleCreate} className="bg-[#0063C6] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#003E7C]">Create Stakeholder</button>
                </div>
            </div>
        </div>
    );
};
