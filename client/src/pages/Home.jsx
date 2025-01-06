import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Plus, MessageCircle, Pencil, Trash, User,} from "lucide-react";
import useTenantListData from "@/hooks/useTenantListData";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/api/authApi";
import { addTenant, deleteTenant, editTenant, sendAlert,} from "@/api/tenantApi";

const Home = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile: "",
    profile: null,
  });
  const { users, setUsers } = useTenantListData();
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [alertingIds, setAlertingIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Reset preview URL when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen && previewUrl) {
      setPreviewUrl(null);
    }
  }, [isAddDialogOpen]);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
    } catch (err) {
      navigate("/login");
    } finally {
      setPageLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setPreviewUrl(user.profile);
    setFormData(user);
    setIsEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({ name: "", address: "", mobile: "" });
    setIsAddDialogOpen(true);
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      const response = await editTenant({ ...formData, id: selectedUser._id });
      setUsers(
        users.map((user) =>
          user._id === response.data?.data?._id ? { ...user, ...formData, ...response.data.data } : user
        )
      );
      showNotification("success", "User updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      showNotification("error", "Failed to update user");
    }finally{
      setLoading(false);
    }
  };

  const handleSubmitAdd = async () => {
    setLoading(true);
    try {
      const response = await addTenant(formData);
      setUsers([...users, response.data?.data]);
      showNotification("success", "User added successfully!");
      setIsAddDialogOpen(false);
    } catch (error) {
      showNotification("error", "Failed to add user");
    }
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    setDeletingIds((prev) => new Set([...prev, userId]));
    try {
      await deleteTenant({ id: userId });
      setUsers(users.filter((user) => user._id !== userId));
      showNotification("success", "User deleted successfully!");
    } catch (error) {
      showNotification("error", "Failed to delete user");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleAlert = async (userId, mobile) => {
    setAlertingIds((prev) => new Set([...prev, userId]));
    try {
      await sendAlert({ mobile });
      showNotification("success", "Alert sent successfully!");
    } catch (error) {
      showNotification("error", "Failed to send alert");
    } finally {
      setAlertingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      3000
    );
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user._id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={user.profile}
                    alt={`${user.name}'s profile`}
                  />
                  <AvatarFallback>
                    <User className="w-6 h-6 text-gray-400" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{user.address}</p>
                  <p className="text-sm text-gray-600 mb-4">{user.mobile}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAlert(user._id, user.mobile)}
                      disabled={alertingIds.has(user._id)}
                    >
                      {alertingIds.has(user._id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Alert
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingIds.has(user._id)}
                    >
                      {deletingIds.has(user._id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0"
        onClick={handleAdd}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
              <Label htmlFor="profile-upload" className="cursor-pointer">
                <Avatar className="w-20 h-20 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <AvatarImage src={previewUrl} />
                  <AvatarFallback className="bg-gray-50">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">
                          Add Photo
                        </span>
                      </div>
                    )}
                  </AvatarFallback>
                </Avatar>
              </Label>
              <Input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitEdit} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="profile-upload" className="cursor-pointer">
                <Avatar className="w-20 h-20 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <AvatarImage src={previewUrl} />
                  <AvatarFallback className="bg-gray-50">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">
                          Add Photo
                        </span>
                      </div>
                    )}
                  </AvatarFallback>
                </Avatar>
              </Label>
              <Input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="add-address">Address</Label>
              <Input
                id="add-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="add-mobile">Mobile</Label>
              <Input
                id="add-mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitAdd} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert
            variant={notification.type === "error" ? "destructive" : "default"}
            className="bg-green-400"
          >
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default Home;
