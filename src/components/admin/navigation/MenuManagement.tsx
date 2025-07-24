
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import { NavigationMenu, NavigationMenuItem } from '@/types/navigation';
import { Settings, Plus, Edit, Eye, EyeOff } from 'lucide-react';

const MenuManagement = () => {
  const { menuConfig, loading } = useNavigationMenus();
  const [editingMenu, setEditingMenu] = useState<NavigationMenu | null>(null);
  const [editingItem, setEditingItem] = useState<NavigationMenuItem | null>(null);

  const handleToggleMenu = async (menu: NavigationMenu) => {
    // TODO: Implement menu update functionality
    console.log('Toggle menu:', menu.id, !menu.is_active);
  };

  const handleToggleItem = async (item: NavigationMenuItem) => {
    // TODO: Implement menu item update functionality
    console.log('Toggle item:', item.id, !item.is_active);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading navigation menus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Navigation Menu Management</h2>
          <p className="text-gray-600">Configure header navigation menus and items</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu
        </Button>
      </div>


      <div className="grid gap-6">
        {menuConfig.menus.map((menu) => (
          <Card key={menu.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{menu.label}</CardTitle>
                    <CardDescription>Menu: {menu.name}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={menu.is_active ? 'default' : 'secondary'}>
                    {menu.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch
                    checked={menu.is_active}
                    onCheckedChange={() => handleToggleMenu(menu)}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Position</Label>
                    <Input value={menu.position} readOnly />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Input value={menu.icon} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      {menu.is_active ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">
                        {menu.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Menu Items</h4>
                  <div className="space-y-2">
                    {menuConfig.items
                      .filter(item => item.menu_id === menu.id)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.gradient} flex items-center justify-center`}>
                              <span className="text-xs text-white font-bold">
                                {item.icon.slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.title}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            <Switch
                              checked={item.is_active}
                              onCheckedChange={() => handleToggleItem(item)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Database tables not yet created. Currently showing fallback menu structure.
        </p>
        <p className="text-sm text-gray-500">
          Run the SQL migration to enable full menu management functionality.
        </p>
      </div>
    </div>
  );
};

export default MenuManagement;
