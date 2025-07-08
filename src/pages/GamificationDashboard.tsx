import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Book, User, Zap } from 'lucide-react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import AchievementBadge from '@/components/gamification/AchievementBadge';
import KnowledgeLibrary from '@/components/gamification/KnowledgeLibrary';
import UserAvatarCreator from '@/components/avatar/UserAvatarCreator';
import { useGamification } from '@/hooks/useGamification';
import { useUserAvatar } from '@/hooks/useUserAvatar';

const GamificationDashboard = () => {
  const { userAchievements, availableBadges, isLoading: gamificationLoading } = useGamification();
  const { hasAvatar, isLoading: avatarLoading } = useUserAvatar();

  const isLoading = gamificationLoading || avatarLoading;

  if (isLoading) {
    return (
      <DashboardLayoutWithSidebar>
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-therapy-100 rounded w-64 mb-4"></div>
            <div className="h-32 bg-therapy-100 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-therapy-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayoutWithSidebar>
    );
  }

  // Get earned and unearned achievements
  const earnedAchievements = userAchievements || [];
  const unearnedAchievements = availableBadges?.filter(badge => 
    !earnedAchievements.some(earned => earned.id === badge.id)
  ) || [];

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-therapy-900 mb-2">
            Progress & Achievements
          </h1>
          <p className="text-therapy-600">
            Track your progress, unlock achievements, and customize your therapy experience
          </p>
        </div>

        {/* XP Progress Bar */}
        <XPProgressBar />

        {/* Main Content Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            
            <TabsTrigger value="knowledge" className="flex items-center space-x-2">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Knowledge</span>
            </TabsTrigger>
            
            <TabsTrigger value="avatar" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Avatar</span>
            </TabsTrigger>
            
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-therapy-900 mb-4">
                🏆 Your Achievements ({earnedAchievements.length})
              </h2>
              
              {earnedAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      isEarned={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-therapy-50 rounded-lg">
                  <Trophy className="h-12 w-12 text-therapy-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-therapy-600 mb-2">
                    No achievements yet
                  </h3>
                  <p className="text-therapy-500">
                    Complete your first therapy session or breathing exercise to start earning achievements!
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-therapy-900 mb-4">
                🎯 Available Achievements ({unearnedAchievements.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unearnedAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isEarned={false}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Knowledge Tab */}
          <TabsContent value="knowledge">
            <KnowledgeLibrary />
          </TabsContent>

          {/* Avatar Tab */}
          <TabsContent value="avatar">
            <UserAvatarCreator />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg p-6 border border-therapy-200">
                <h3 className="font-semibold text-therapy-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-therapy-600">Achievements Earned:</span>
                    <span className="font-semibold">{earnedAchievements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-therapy-600">Avatar Status:</span>
                    <span className="font-semibold">{hasAvatar ? 'Created' : 'Not Created'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-therapy-600">Knowledge Items:</span>
                    <span className="font-semibold">Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  {earnedAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700">
                        Earned "{achievement.title}"
                      </span>
                    </div>
                  ))}
                  {earnedAchievements.length === 0 && (
                    <p className="text-green-600">No recent activity</p>
                  )}
                </div>
              </div>

              {/* Next Goals */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">Suggested Next Steps</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700">Complete your first therapy session</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700">Try a breathing exercise</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700">Create your 3D avatar</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default GamificationDashboard;