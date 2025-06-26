
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Monitor, 
  Apple, 
  Smartphone,
  Shield,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { githubService, GitHubRelease } from '@/services/githubService';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Downloads = () => {
  const { toast } = useToast();
  const [userPlatform, setUserPlatform] = useState<'windows' | 'macos' | 'linux'>('windows');

  useEffect(() => {
    setUserPlatform(githubService.detectUserPlatform());
  }, []);

  const { data: latestRelease, isLoading, error } = useQuery({
    queryKey: ['latest-release'],
    queryFn: githubService.getLatestRelease,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: allReleases } = useQuery({
    queryKey: ['all-releases'],
    queryFn: githubService.getAllReleases,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleDownload = (url: string, filename: string) => {
    window.open(url, '_blank');
    toast({
      title: 'Download Started',
      description: `${filename} download has begun.`,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'windows':
        return <Monitor className="h-5 w-5" />;
      case 'macos':
        return <Apple className="h-5 w-5" />;
      case 'linux':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Download className="h-5 w-5" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'windows':
        return 'Windows';
      case 'macos':
        return 'macOS';
      case 'linux':
        return 'Linux';
      default:
        return platform;
    }
  };

  const renderPlatformDownloads = (release: GitHubRelease) => {
    const platformAssets = githubService.getAssetsByPlatform(release.assets);
    
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(platformAssets).map(([platform, assets]) => (
          <Card key={platform} className={`relative ${userPlatform === platform ? 'ring-2 ring-therapy-500' : ''}`}>
            {userPlatform === platform && (
              <Badge className="absolute -top-2 left-4 bg-therapy-500">
                Recommended
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getPlatformIcon(platform)}
                <span>{getPlatformName(platform)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {githubService.formatFileSize(asset.size)} • {asset.download_count} downloads
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(asset.browser_download_url, asset.name)}
                      className="ml-2"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No downloads available for this platform yet.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-harmony-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Unable to Load Downloads</h1>
            <p className="text-muted-foreground">
              We're having trouble fetching the latest releases. Please try again later.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-harmony-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent mb-4">
            Download TherapySync
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the desktop application for offline access and enhanced privacy. Available for Windows, macOS, and Linux.
          </p>
        </div>

        {/* System Requirements */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <Shield className="h-8 w-8 text-therapy-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">Your data stays on your device</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-harmony-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Always Available</h3>
                <p className="text-sm text-muted-foreground">Works offline when you need it</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-flow-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Multi-User Support</h3>
                <p className="text-sm text-muted-foreground">Perfect for families and teams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Release */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading latest release...</p>
          </div>
        ) : latestRelease ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Latest Release</h2>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>{latestRelease.tag_name}</span>
              </Badge>
            </div>

            {renderPlatformDownloads(latestRelease)}

            {/* Release Notes */}
            {latestRelease.body && (
              <Card>
                <CardHeader>
                  <CardTitle>What's New in {latestRelease.tag_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{latestRelease.body}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Releases Available</h2>
            <p className="text-muted-foreground">
              Desktop applications are being prepared. Check back soon!
            </p>
          </div>
        )}

        {/* Installation Instructions */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Installation Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Monitor className="h-4 w-4 mr-2" />
                  Windows
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Download the .exe file</li>
                  <li>• Run the installer as administrator</li>
                  <li>• Follow the setup wizard</li>
                  <li>• Launch from Start Menu</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Apple className="h-4 w-4 mr-2" />
                  macOS
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Download the .dmg file</li>
                  <li>• Open and drag to Applications</li>
                  <li>• Right-click and "Open" first time</li>
                  <li>• Launch from Applications folder</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Linux
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Download .AppImage, .deb, or .rpm</li>
                  <li>• Make AppImage executable</li>
                  <li>• Install .deb/.rpm with package manager</li>
                  <li>• Launch from application menu</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.open('/help', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Help Center
            </Button>
            <Button variant="outline" onClick={() => window.open('/contact', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Downloads;
