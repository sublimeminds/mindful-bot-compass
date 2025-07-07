import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';

const MonthlyAnalysis = () => {
  const monthlyStats = [
    {
      month: "January 2024",
      goalsSet: 8,
      goalsCompleted: 6,
      completionRate: 75,
      avgProgress: 82
    },
    {
      month: "February 2024", 
      goalsSet: 6,
      goalsCompleted: 5,
      completionRate: 83,
      avgProgress: 88
    },
    {
      month: "March 2024",
      goalsSet: 7,
      goalsCompleted: 7,
      completionRate: 100,
      avgProgress: 95
    }
  ];

  const categoryBreakdown = [
    { category: "Mindfulness", completed: 12, total: 15, percentage: 80 },
    { category: "Exercise", completed: 8, total: 12, percentage: 67 },
    { category: "Sleep", completed: 18, total: 21, percentage: 86 },
    { category: "Nutrition", completed: 9, total: 12, percentage: 75 },
    { category: "Learning", completed: 6, total: 9, percentage: 67 }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Monthly Analysis</h1>
          <p className="text-muted-foreground">Comprehensive analysis of your monthly goal progress</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Calendar className="w-4 h-4 mr-1" />
          March 2024
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">21</p>
            <p className="text-sm text-muted-foreground">Goals This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">18</p>
            <p className="text-sm text-muted-foreground">Goals Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">86%</p>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">31</p>
            <p className="text-sm text-muted-foreground">Active Days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.map((month, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{month.month}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {month.completionRate}% complete
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-center">
                    <div>
                      <p className="font-bold text-therapy-600">{month.goalsSet}</p>
                      <p className="text-muted-foreground">Set</p>
                    </div>
                    <div>
                      <p className="font-bold text-calm-600">{month.goalsCompleted}</p>
                      <p className="text-muted-foreground">Completed</p>
                    </div>
                    <div>
                      <p className="font-bold text-harmony-600">{month.avgProgress}%</p>
                      <p className="text-muted-foreground">Avg Progress</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={month.completionRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm font-bold">{category.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{category.completed}/{category.total} completed</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-therapy-50 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
              <p className="font-medium">Best Category</p>
              <p className="text-sm text-muted-foreground">Sleep (86% completion)</p>
            </div>
            <div className="p-4 bg-calm-50 rounded-lg text-center">
              <Target className="w-8 h-8 text-calm-500 mx-auto mb-2" />
              <p className="font-medium">Improvement Area</p>
              <p className="text-sm text-muted-foreground">Exercise & Learning</p>
            </div>
            <div className="p-4 bg-harmony-50 rounded-lg text-center">
              <Award className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
              <p className="font-medium">Achievement</p>
              <p className="text-sm text-muted-foreground">Perfect March completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyAnalysis;