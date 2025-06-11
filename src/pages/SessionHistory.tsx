
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, BarChart3, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import SessionHistoryList from "@/components/session/SessionHistoryList";
import SessionFilters from "@/components/session/SessionFilters";
import Header from "@/components/Header";

const SessionHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessionSummaries, isLoading } = useSessionHistory();
  const [activeTab, setActiveTab] = useState('list');
  const [filters, setFilters] = useState({
    dateRange: '30d',
    moodFilter: 'all',
    sortBy: 'date'
  });

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8">Please sign in to view your session history.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Calendar className="h-6 w-6 mr-2" />
                  Session History
                </h1>
                <p className="text-muted-foreground">
                  Review your therapy sessions and track your progress over time
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Session List</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SessionFilters 
                    dateRange={filters.dateRange}
                    moodFilter={filters.moodFilter}
                    sortBy={filters.sortBy}
                    onDateRangeChange={(dateRange) => setFilters(prev => ({ ...prev, dateRange }))}
                    onMoodFilterChange={(moodFilter) => setFilters(prev => ({ ...prev, moodFilter }))}
                    onSortByChange={(sortBy) => setFilters(prev => ({ ...prev, sortBy }))}
                  />
                </CardContent>
              </Card>

              {/* Session List */}
              <SessionHistoryList
                sessionSummaries={sessionSummaries}
                isLoading={isLoading}
                dateRange={filters.dateRange}
                moodFilter={filters.moodFilter}
                sortBy={filters.sortBy}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Session Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analytics coming soon</h3>
                    <p className="text-muted-foreground">
                      Detailed analytics about your session patterns and progress
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SessionHistory;
