import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Cpu, FileText, Database, Briefcase, Users, Send, Building, Ticket, Bug, ChevronDown, ChevronRight, CheckCircle, Home, ClipboardList, FolderKanban, Trophy, Settings, ListChecks, PlusCircle, FolderPlus, Map, Search, BarChart3, DollarSign, Lightbulb, BookOpen, UserCircle, ChevronsLeft, ChevronsRight, Trash2, X, ArrowLeft } from 'lucide-react';

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
    { id: 1, action: 'Finalize budget with CFO', owner: 'You', due: '2024-08-15', status: 'Not Started' },
    { id: 2, action: 'Draft legal agreements for Berlin hub', owner: 'Legal Team', due: '2024-09-01', status: 'Not Started' },
    { id: 3, action: 'Begin localization vendor selection', owner: 'Product Team', due: '2024-09-05', status: 'Not Started' },
];

const initialEvaluations = [
    { id: 1, name: 'Q4 2025 Product Strategy', type: 'Roadmap Planning', lastUpdated: '3 hours ago', simulations: 2, nextStep: { action: 'Schedule meetings with stakeholders.', owner: 'You', due: '2024-07-28' }, color: 'blue' },
    { id: 2, name: 'AI Agent Framework Evaluation', type: 'Spike in the Roadmap', lastUpdated: 'Yesterday', simulations: 0, nextStep: { action: 'Gather more customer information.', owner: 'Product Team', due: '2024-07-26' }, color: 'indigo' },
    { id: 3, name: 'New Pricing Model Analysis', type: 'Pricing Exercise', lastUpdated: '2 days ago', simulations: 1, nextStep: { action: 'Analyze competitor pricing tiers.', owner: 'Marketing', due: '2024-07-30' }, color: 'amber' },
];

const initialProjects = [
    { id: 1, name: 'Growth Initiatives', evaluationIds: [1] },
    { id: 2, name: 'Core Platform Enhancements', evaluationIds: [3] },
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

  const [mainMessages, setMainMessages] = useState([
    { sender: 'DekaBridge Agent', text: 'Welcome to the evaluation roadmap. I am the DekaBridge Agent, your strategic AI. How can we begin defining the problem space today?', type: 'ai' },
    { sender: 'Decision Coach', text: 'Cognitive fallacy detected, Decision Coach will help you determine alternative options.', type: 'ai' },
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
      const currentRoom = simulationRooms.find(room => room.id === chatTabId);
      if (!currentRoom) return;

      setSimulationMessages(prev => ({
        ...prev,
        [chatTabId]: [...(prev[chatTabId] || []), newUserMessage]
      }));

      setTimeout(() => {
        const simAgent = currentRoom.agents[Math.floor(Math.random() * currentRoom.agents.length)];
        const simResponse = { sender: simAgent, text: `That's a good question. From my perspective as the ${simAgent}, we need to consider...`, type: 'simulation' };
        setSimulationMessages(prev => ({
          ...prev,
          [chatTabId]: [...(prev[chatTabId] || []), simResponse]
        }));
      }, 1500);
    }
  };

  const handleLaunchSimulation = (selectedAgents) => {
    if (selectedAgents.length > 0) {
      const newRoomId = `sim-room-${simulationRooms.length + 1}`;
      const newRoom = {
        id: newRoomId,
        name: `Room ${simulationRooms.length + 1}`,
        agents: selectedAgents,
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
    }
  };

  const handleStartNewEvaluation = () => {
    const newEvaluation = {
      id: Date.now(),
      name: 'New Evaluation: Roadmap Planning',
      type: 'Roadmap Planning',
      lastUpdated: 'Just now',
      simulations: 0,
      nextStep: { action: 'Define initial problem statement.', owner: 'You', due: '2025-01-01' },
      color: 'blue'
    };
    setEvaluations(prev => [newEvaluation, ...prev]);
    setActiveLeftNav('Evaluations');
    setActiveEvaluationId(newEvaluation.id);
  };
  
  const handleSelectSpecificEvaluation = (id) => {
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
    setProjects(prevProjects => prevProjects.map(p => 
        p.id === projectId 
        ? { ...p, evaluationIds: [...p.evaluationIds, evaluationId] } 
        : p
    ));
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
    if (activeLeftNav === 'Welcome') {
      return <WelcomeScreen 
        evaluations={evaluations} 
        projects={projects}
        onNavigateToEvaluations={() => setActiveLeftNav('Evaluations')} 
        onNavigateToImpact={() => setActiveLeftNav('Impact')} 
        onStartNewEvaluation={handleStartNewEvaluation}
        onSelectEvaluation={handleSelectSpecificEvaluation}
      />;
    }
    if (activeLeftNav === 'Evaluations') {
      if (activeEvaluationId) {
        const currentEval = evaluations.find(e => e.id === activeEvaluationId);
        return <EvaluationView evaluation={currentEval} onUpdateName={handleUpdateEvaluationName} onGoBack={handleGoBack} projects={projects} onAssignRequest={(id) => setAssigningEvaluation(evaluations.find(ev => ev.id === id))}/>;
      }
      return <EvaluationsPage evaluations={unassignedEvaluations} onSelectEvaluation={handleSelectSpecificEvaluation} onDelete={handleDeleteEvaluation} onAssignRequest={(id) => setAssigningEvaluation(evaluations.find(ev => ev.id === id))} onUpdateName={handleUpdateEvaluationName} />;
    }
    if (activeLeftNav === 'Projects') {
        return <ProjectsPage projects={projects} allEvaluations={evaluations} onUpdateProjectName={handleUpdateProjectName} onCreateNewProject={handleCreateNewProject} onSelectEvaluation={handleSelectSpecificEvaluation}/>
    }
    if (activeLeftNav === 'Impact') {
      return <ImpactPage />;
    }
    return <div className="p-8"><h1 className="text-4xl font-bold text-[#003E7C]">{activeLeftNav}</h1><p className="text-gray-500 mt-2">This page is under construction.</p></div>;
  };

  const EvaluationView = ({ evaluation, onUpdateName, onGoBack, projects, onAssignRequest }) => {
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
            <span className="text-sm font-medium text-[#003E7C] bg-blue-100 px-3 py-1 rounded-full">{assignedProject.name}</span>
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
            mainMessages={mainMessages}
            simulationRooms={simulationRooms}
            simulationMessages={simulationMessages}
            onSendMessage={handleSendMessage}
            onLaunchSimulation={handleLaunchSimulation}
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
            {activeRightTab === 'data' && <SupportingDataView />}
            {activeRightTab === 'nextSteps' && <NextStepsView steps={nextSteps} />}
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
    </div>
  );
}

// --- CHILD COMPONENTS ---

const LeftSidebar = ({ activeItem, setActiveItem, isExpanded, setIsExpanded, setActiveEvaluationId }) => (
  <nav className={`bg-[#001931] flex flex-col py-8 gap-6 transition-all duration-300 ${isExpanded ? 'w-56' : 'w-20 items-center'}`}>
    <div className={`text-white font-bold text-2xl h-8 flex items-center ${isExpanded ? 'px-6' : 'px-0 justify-center'}`}>DB</div>
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

// ... (Rest of the components remain largely the same)

const ChatContainer = ({ mainMessages, simulationRooms, simulationMessages, onSendMessage, onLaunchSimulation }) => {
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
            onLaunchSimulation(selectedAgents);
            const newRoomId = `sim-room-${simulationRooms.length + 1}`;
            setActiveTab(newRoomId);
        }} />
      ) : (
        <ChatView messages={currentMessages} onSendMessage={(text) => onSendMessage(text, activeTab)} />
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

const ChatView = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) { onSendMessage(input.trim()); setInput(''); }
  };

  const getAgentIcon = (sender) => {
    if (sender === 'DekaBridge Agent') return <Bot className="w-6 h-6 text-[#0063C6]" />;
    if (sender === 'Decision Coach') return <Cpu className="w-6 h-6 text-purple-600" />;
    if (sender === 'You') return <User className="w-6 h-6 text-white" />;
    if (sender === 'System') return <Settings className="w-6 h-6 text-gray-500" />;
    return <Briefcase className="w-6 h-6 text-yellow-800" />;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
            {msg.type !== 'user' && <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">{getAgentIcon(msg.sender)}</div>}
            <div className={`max-w-lg p-4 rounded-xl ${msg.type === 'user' ? 'bg-[#0063C6] text-white' : 'bg-[#E8EDF2] text-[#001931]'}`}>
              <p className="font-bold text-sm mb-1">{msg.sender}</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
            </div>
            {msg.type === 'user' && <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#0063C6] flex items-center justify-center">{getAgentIcon(msg.sender)}</div>}
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

const SupportingDataView = () => (
  <div className="p-6 space-y-6">
    <DataSection title="Salesforce" icon={Building} data={supportingData.salesforce} renderItem={SalesforceItem} />
    <DataSection title="Zendesk" icon={Ticket} data={supportingData.zendesk} renderItem={ZendeskItem} />
    <DataSection title="Jira" icon={Bug} data={supportingData.jira} renderItem={JiraItem} />
  </div>
);

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

const SimulationLauncherView = ({ onLaunch }) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  
  const handleSelectAgent = (agentName) => {
    setSelectedAgents(prev => prev.includes(agentName) ? prev.filter(a => a !== agentName) : [...prev, agentName]);
  };

  const handleLaunchClick = () => { onLaunch(selectedAgents); setSelectedAgents([]); };

  return (
    <div className="p-6 text-center flex-1 flex flex-col justify-center bg-slate-50/50">
      <div>
        <h3 className="text-2xl font-bold text-[#003E7C] mb-4">New Simulation</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Select one or more personas to start a new simulation in its own room.</p>
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

const NextStepsView = ({ steps }) => (
    <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-[#003E7C]">Action Items</h3>
        <div className="bg-white rounded-xl border border-gray-200/80">
            <table className="w-full text-left">
                <thead className="border-b border-gray-200/80">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-gray-500">Action</th>
                        <th className="p-4 text-sm font-semibold text-gray-500">Owner</th>
                        <th className="p-4 text-sm font-semibold text-gray-500">Due Date</th>
                        <th className="p-4 text-sm font-semibold text-gray-500">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {steps.map(step => (
                        <tr key={step.id} className="border-b border-gray-200/80 last:border-b-0">
                            <td className="p-4 text-gray-800 font-medium">{step.action}</td>
                            <td className="p-4 text-gray-600">{step.owner}</td>
                            <td className="p-4 text-gray-600">{step.due}</td>
                            <td className="p-4"><span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">{step.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

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


// --- WELCOME SCREEN COMPONENT ---
const WelcomeScreen = ({ onNavigateToEvaluations, onNavigateToImpact, onStartNewEvaluation, evaluations, projects, onSelectEvaluation }) => {
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
          <h2 className="text-4xl font-bold tracking-tight text-[#003E7C] sm:text-5xl">Welcome back, Skyler.</h2>
          <p className="mt-2 text-lg text-gray-600">Let's make some smart, fast, and objective decisions today.</p>
        </div>

        <WelcomeSection title="Start a new Evaluation">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <EvaluationCard title="Roadmap Planning" description="Define and prioritize features for your next product cycle." icon={Map} color="blue" onClick={onStartNewEvaluation} />
            <EvaluationCard title="Spike in the Roadmap" description="Investigate a technical or business unknown to de-risk future work." icon={Search} color="indigo" />
            <EvaluationCard title="Analyze Existing Proposal" description="Upload a document to identify its strengths, weaknesses, and biases." icon={BarChart3} color="emerald" />
            <EvaluationCard title="Pricing Exercise" description="Model different pricing strategies and their potential revenue impact." icon={DollarSign} color="amber" />
            <EvaluationCard title="Strategic Sandbox" description="Tackle any product challenge or explore new ideas in an open-ended conversation." icon={Lightbulb} color="cyan" />
          </div>
        </WelcomeSection>

        <WelcomeSection title="Resume an Evaluation" onHeaderClick={onNavigateToEvaluations} isLink>
          <div className="space-y-4">
            {assignedEvaluations.slice(0, 2).map(ev => (
                 <ResumeCard 
                    key={ev.id}
                    type={ev.type}
                    title={ev.name}
                    projectName={ev.projectName}
                    lastUpdated={ev.lastUpdated}
                    simulations={ev.simulations}
                    nextStep={ev.nextStep}
                    color={ev.color}
                    onSelect={() => onSelectEvaluation(ev.id)}
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

const ResumeCard = ({ type, title, projectName, lastUpdated, simulations, nextStep, color, onAssign, onDelete, onSelect, onUpdateName }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-100',
        indigo: 'text-indigo-600 bg-indigo-100',
        amber: 'text-amber-600 bg-amber-100',
    };
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="flex-grow cursor-pointer" onClick={onSelect}>
                 <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {onUpdateName ? (
                        <EditableTitle 
                            initialValue={title}
                            onSave={onUpdateName}
                            tag="h4"
                            textClasses="text-lg font-semibold text-[#003E7C]"
                        />
                    ) : (
                        <h4 className="text-lg font-semibold text-[#003E7C]">{title}</h4>
                    )}
                    {projectName && <span className="text-xs font-semibold uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{projectName}</span>}
                    <span className={`text-xs font-semibold uppercase ${colors[color]} px-2 py-0.5 rounded-full`}>{type}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4 flex-wrap">
                    <span>Last updated: {lastUpdated}</span>
                    <a href="#" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-[#0063C6] hover:underline">
                        <FileText size={14} /> Proposal
                    </a>
                    <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-gray-400" /> Simulations: {simulations}
                    </span>
                </div>
            </div>
            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200 mt-4 sm:mt-0 pt-4 sm:pt-0 sm:pl-4 sm:ml-4 flex-shrink-0 flex items-center gap-2">
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
                    <div className="text-left">
                        <h5 className="text-sm font-semibold text-gray-700">Next Step</h5>
                        <p className="text-sm text-gray-600 mt-1">{nextStep.action} <span className="text-gray-400">({nextStep.owner} - {nextStep.due})</span></p>
                    </div>
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

const EvaluationsPage = ({ evaluations, onSelectEvaluation, onDelete, onAssignRequest, onUpdateName }) => (
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
                    type={ev.type}
                    title={ev.name}
                    lastUpdated={ev.lastUpdated}
                    simulations={ev.simulations}
                    nextStep={ev.nextStep}
                    color={ev.color}
                    onSelect={() => onSelectEvaluation(ev.id)}
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

const ProjectsPage = ({ projects, allEvaluations, onUpdateProjectName, onCreateNewProject, onSelectEvaluation }) => {
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
                                                type={ev.type}
                                                title={ev.name}
                                                lastUpdated={ev.lastUpdated}
                                                simulations={ev.simulations}
                                                nextStep={ev.nextStep}
                                                color={ev.color}
                                                onSelect={() => onSelectEvaluation(ev.id)}
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
