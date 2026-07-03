import type { RouteObject } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import LandingPage from '../pages/landing/page';
import Home from '../pages/home/page';
import CampaignsPage from '../pages/campaigns/page';
import AccountsPage from '../pages/accounts/page';
import ContentPage from '../pages/content/page';
import EngagementPage from '../pages/engagement/page';
import InsightsPage from '../pages/insights/page';
import OnboardingPage from '../pages/onboarding/page';
import PublishPage from '../pages/publish/page';
import Layout from '../components/feature/Layout';

import KnowledgePage from '../pages/knowledge/page';
import ResearchPage from '../pages/research/page';
import IntegrationsPage from '../pages/integrations/page';
import TeamPage from '../pages/team/page';
import SettingsPage from '../pages/settings/page';
import GoalPage from '../pages/goal/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/goal',
    element: <GoalPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: <Home />,
      },
      {
        path: '/campaigns',
        element: <CampaignsPage />,
      },
      {
        path: '/accounts',
        element: <AccountsPage />,
      },
      {
        path: '/content',
        element: <ContentPage />,
      },
      {
        path: '/publish',
        element: <PublishPage />,
      },
      {
        path: '/engagement',
        element: <EngagementPage />,
      },
      {
        path: '/insights',
        element: <InsightsPage />,
      },
      {
        path: '/knowledge',
        element: <KnowledgePage />,
      },
      {
        path: '/research',
        element: <ResearchPage />,
      },
      {
        // 市场与竞品已并入研究页竞争情报 tab（EPIC-M0-03，Gap Analysis G 组判定）
        path: '/competitors',
        element: <Navigate to="/research?tab=competitive" replace />,
      },
      {
        path: '/integrations',
        element: <IntegrationsPage />,
      },
      {
        path: '/team',
        element: <TeamPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
