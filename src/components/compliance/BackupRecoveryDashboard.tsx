import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { backupRecoverySystem } from '@/services/backupRecoverySystem';
import { enhancedBackupService } from '@/services/enhancedBackupService';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const BackupRecoveryDashboard = () => {
  const [backupStatistics, setBackupStatistics] = useState({
    totalBackups: 0,
    successfulBackups: 0,
    failedBackups: 0,
    totalSize: 0,
    averageSize: 0,
    lastBackup: null
  });

  const [crossCloudBackupStatistics, setCrossCloudBackupStatistics] = useState({
    totalCrossCloudBackups: 0,
    successfulBackups: 0,
    failedBackups: 0,
    totalSizeBytes: 0,
    averageDestinations: 0,
    lastBackup: null
  });

  useEffect(() => {
    const fetchBackupStatistics = () => {
      const stats = backupRecoverySystem.getBackupStatistics();
      setBackupStatistics(stats);
    };

    const fetchCrossCloudBackupStatistics = () => {
      const stats = enhancedBackupService.getBackupStatistics();
      setCrossCloudBackupStatistics(stats);
    };

    fetchBackupStatistics();
    fetchCrossCloudBackupStatistics();
  }, []);

  const handleTestDisasterRecovery = async () => {
    try {
      const result = await enhancedBackupService.testDisasterRecovery();
      if (result) {
        toast.success(`Disaster recovery test passed`);
      } else {
        toast.error(`Disaster recovery test failed`);
      }
    } catch (error) {
      toast.error('Failed to run disaster recovery test');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Backup Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Statistics of local backups.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Statistic</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Total Backups</TableCell>
                <TableCell>{backupStatistics.totalBackups}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Successful Backups</TableCell>
                <TableCell>{backupStatistics.successfulBackups}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Failed Backups</TableCell>
                <TableCell>{backupStatistics.failedBackups}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Size</TableCell>
                <TableCell>{(backupStatistics.totalSize / (1024 * 1024)).toFixed(2)} MB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Size</TableCell>
                <TableCell>{(backupStatistics.averageSize / (1024 * 1024)).toFixed(2)} MB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Backup</TableCell>
                <TableCell>{backupStatistics.lastBackup ? backupStatistics.lastBackup.toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cross-Cloud Backup Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Statistics of cross-cloud backups.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Statistic</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Total Backups</TableCell>
                <TableCell>{crossCloudBackupStatistics.totalCrossCloudBackups}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Successful Backups</TableCell>
                <TableCell>{crossCloudBackupStatistics.successfulBackups}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Failed Backups</TableCell>
                <TableCell>{crossCloudBackupStatistics.failedBackups}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Size</TableCell>
                <TableCell>{(crossCloudBackupStatistics.totalSizeBytes / (1024 * 1024)).toFixed(2)} MB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Destinations</TableCell>
                <TableCell>{crossCloudBackupStatistics.averageDestinations.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Backup</TableCell>
                <TableCell>{crossCloudBackupStatistics.lastBackup ? crossCloudBackupStatistics.lastBackup.toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disaster Recovery</CardTitle>
          <CardContent>
            <Button onClick={handleTestDisasterRecovery}>Test Disaster Recovery</Button>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default BackupRecoveryDashboard;
