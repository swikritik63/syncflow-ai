'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MobileFrame } from '@/components/MobileFrame';
import { NavigationBar, TabType } from '@/components/NavigationBar';
import { TinderFeed } from '@/components/TinderFeed';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { ScheduleModal } from '@/components/ScheduleModal';
import { CalendarView } from '@/components/CalendarView';
import { StudioView } from '@/components/StudioView';
import { BusinessModal } from '@/components/BusinessModal';
import { RevenueCatPaywall } from '@/components/RevenueCatPaywall';
import { AuthScreen } from '@/components/AuthScreen';
import { BusinessProfile, ScheduledPost, MemeTemplate } from '@/types';
import { defaultBusinessProfile, generateMemeFeed } from '@/lib/hookEngine';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [logoutMessage, setLogoutMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [business, setBusiness] = useState<BusinessProfile>(defaultBusinessProfile);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Active Meme for Schedule Modal
  const [activeMemeToSchedule, setActiveMemeToSchedule] = useState<MemeTemplate | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Load persisted user & profile on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bme_current_user');
      if (savedUser) {
        setCurrentUser(savedUser);
      }
      const saved = localStorage.getItem('bme_business_profile') || localStorage.getItem('fastlane_business_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setBusiness(parsed);
      }
    } catch (err) {
      console.warn('Could not read saved profile:', err);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('bme_current_user');
      localStorage.removeItem('bme_business_profile');
      localStorage.removeItem('fastlane_business_profile');
    } catch (e) {
      console.warn('Storage warning:', e);
    }
    setCurrentUser(null);
    setBusiness(defaultBusinessProfile); // Reset to default so next login shows onboarding
    setLogoutMessage('Logged out of demo account. You can log back in anytime with 1 tap!');
  };

  // Scheduled posts state (seeded with 2 high-converting examples)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 'sched_initial_1',
      templateId: 'video_001_ibai_whiteboard_explaining',
      videoUrl: '/videos/video_001_ibai_whiteboard_explaining.mp4',
      hook: 'POV: How our engine finally solved 6-hour support queues for founders.',
      caption: 'Stop wasting time manually writing video reels! Link in bio to try our Marketing Engine free. 🚀',
      hashtags: ['#marketingengine', '#saashacks', '#growthhacking', '#fyp'],
      scheduledDate: 'Today',
      scheduledTime: '6:30 PM (Peak)',
      status: 'scheduled',
      viewsForecast: '145k',
      channel: 'instagram',
    },
    {
      id: 'sched_initial_2',
      templateId: 'video_002_jim_carrey_fast_typing',
      videoUrl: '/videos/video_002_jim_carrey_fast_typing.mp4',
      hook: 'Me explaining how our Marketing Engine cuts video production costs 10x without corporate BS.',
      caption: 'The secret weapon founders gatekeep to automate viral TikToks and Reels.',
      hashtags: ['#marketingengine', '#techfounder', '#indiehacker', '#reels'],
      scheduledDate: 'Tomorrow',
      scheduledTime: '12:15 PM (Lunch)',
      status: 'scheduled',
      viewsForecast: '98k',
      channel: 'instagram',
    },
  ]);

  // Set of scheduled template IDs for instant checkmark status
  const scheduledIds = useMemo(
    () => new Set(scheduledPosts.map((p) => p.templateId)),
    [scheduledPosts]
  );

  // Dynamic RAG meme feed adapted for current business
  const dynamicMemeDeck = useMemo(
    () => generateMemeFeed(business),
    [business]
  );

  // Handle Onboarding Completion
  const handleOnboardingComplete = (newProfile: BusinessProfile) => {
    setBusiness(newProfile);
    setActiveTab('feed');
  };

  // Handle Approving a Meme from the Tinder Deck (Right swipe or Green Check)
  const handleApproveMeme = (meme: MemeTemplate) => {
    setActiveMemeToSchedule(meme);
    setIsScheduleModalOpen(true);
  };

  // Handle Schedule Success (From ScheduleModal)
  const handleScheduleSuccess = (newPost: ScheduledPost, autoPostInstagram: boolean) => {
    setScheduledPosts((prev) => [newPost, ...prev]);
    // Smoothly redirect to Calendar tab to view the scheduled post
    setTimeout(() => {
      setActiveTab('calendar');
    }, 400);
  };

  const handleRemoveScheduledPost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'pro') {
      setIsPaywallOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <MobileFrame
      businessName={business.companyName || business.name}
      onOpenBusinessModal={() => setIsBusinessModalOpen(true)}
      onOpenPaywall={() => setIsPaywallOpen(true)}
      isPro={isPro}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {/* 0. If not logged in, show AuthScreen */}
      {!currentUser ? (
        <AuthScreen
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            setLogoutMessage('');
          }}
          logoutMessage={logoutMessage}
        />
      ) : !business.onboarded ? (
        <OnboardingWizard
          initialProfile={business}
          onComplete={handleOnboardingComplete}
        />
      ) : (
        <>
          {/* Tab 1: Tinder-Style Viral Hook Feed */}
          {activeTab === 'feed' && (
            <TinderFeed
              memes={dynamicMemeDeck}
              business={business}
              onApprove={handleApproveMeme}
              scheduledIds={scheduledIds}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              onEditBusiness={() => {
                setBusiness((prev) => ({ ...prev, onboarded: false }));
              }}
            />
          )}

          {/* Tab 2: Content Calendar & Instagram Publisher */}
          {activeTab === 'calendar' && (
            <CalendarView
              posts={scheduledPosts}
              business={business}
              onRemovePost={handleRemoveScheduledPost}
              onGoToFeed={() => setActiveTab('feed')}
            />
          )}

          {/* Tab 3: AI Creative Studio (Amazon Photos & Video Generator) */}
          {activeTab === 'studio' && (
            <StudioView
              business={business}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              isPro={isPro}
            />
          )}

          {/* Bottom Navigation */}
          <NavigationBar
            activeTab={activeTab}
            onChangeTab={handleTabChange}
            scheduledCount={scheduledPosts.length}
          />
        </>
      )}

      {/* Post-Approval Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        meme={activeMemeToSchedule}
        business={business}
        onScheduleSuccess={handleScheduleSuccess}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        isPro={isPro}
        currentScheduledCount={scheduledPosts.length}
      />

      {/* Business Profile Modal */}
      <BusinessModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        currentBusiness={business}
        onSelectBusiness={(b) => setBusiness(b)}
      />

      {/* RevenueCat Paywall Modal */}
      <RevenueCatPaywall
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        isPro={isPro}
        onUpgradeSuccess={() => setIsPro(true)}
      />
    </MobileFrame>
  );
}
