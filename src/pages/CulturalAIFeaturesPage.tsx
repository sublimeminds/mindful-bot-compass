
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CulturalAIFeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-balance-50/30 to-therapy-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Cultural AI Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience therapy that understands and respects your cultural background, values, and unique perspective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center bg-white/80 backdrop-blur-sm border border-balance-200/50">
              <CardHeader>
                <Globe className="h-12 w-12 text-balance-500 mx-auto mb-4" />
                <CardTitle className="text-balance-800">Multi-Cultural Understanding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI is trained to understand diverse cultural contexts, traditions, and communication styles.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border border-therapy-200/50">
              <CardHeader>
                <Heart className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle className="text-therapy-800">Culturally Sensitive Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive therapy that honors your cultural values while providing effective mental health support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border border-flow-200/50">
              <CardHeader>
                <Users className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle className="text-flow-800">Family & Community Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Understand how family dynamics and community relationships impact your mental wellness.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-balance-500 to-therapy-500 hover:from-balance-600 hover:to-therapy-600 text-white px-8 py-4 text-lg"
            >
              Experience Cultural AI
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CulturalAIFeaturesPage;
