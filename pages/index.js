import { ChatCopilot } from '@/components/ChatCopilot';
import { ContentStudio } from '@/components/ContentStudio';
import { ExperimentPlanner } from '@/components/ExperimentPlanner';
import { Layout } from '@/components/Layout';
import { PersonaGenerator } from '@/components/PersonaGenerator';
import { SetupForm } from '@/components/SetupForm';
import { useBrand } from '@/context/BrandContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { activeBrand } = useBrand();
  const [activeTab, setActiveTab] = useState('setup');
  const [personas, setPersonas] = useState([]);
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    // Reset downstream data when switching brands to avoid cross-mixing insights.
    setPersonas([]);
    setExperiments([]);
  }, [activeBrand?.id]);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'setup' && <SetupForm />}
      {activeTab === 'personas' && (
        <PersonaGenerator personas={personas} onPersonasGenerated={setPersonas} />
      )}
      {activeTab === 'content' && <ContentStudio personas={personas} />}
      {activeTab === 'experiments' && (
        <ExperimentPlanner experiments={experiments} onExperimentsGenerated={setExperiments} />
      )}
      {activeTab === 'chat' && (
        <ChatCopilot personas={personas} experiments={experiments} />
      )}
    </Layout>
  );
}
