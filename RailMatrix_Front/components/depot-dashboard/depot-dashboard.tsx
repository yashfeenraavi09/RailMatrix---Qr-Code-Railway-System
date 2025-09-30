"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Truck } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import QrCodeAssetForm from "@/components/depot-dashboard/QrCodeAssetForm";

interface DepotDashboardProps {
  userData: any;
  accessToken: string;
  onLogout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function DepotDashboard({
  userData,
  accessToken,
  onLogout,
}: DepotDashboardProps) {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("inventory");

  // Inventory state
  const [inventory, setInventory] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  // Dispatch
  const [dispatchOrders, setDispatchOrders] = useState<any[]>([]);
  const [isUpdatingDispatch, setIsUpdatingDispatch] = useState<string | null>(null);

  // Warranty (static sample data)
  const [warrantyClaims, setWarrantyClaims] = useState<any[]>([]);
  const [isProcessingWarranty, setIsProcessingWarranty] = useState<string | null>(null);

  // --- Fetch Inventory ---
  useEffect(() => {
    const fetchInventory = async () => {
      setLoadingInventory(true);
      setInventoryError(null);
      try {
        const res = await fetch(`${API_URL}/depot/inventory`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok)
          throw new Error(`Failed to fetch inventory: ${res.status}`);
        const data = await res.json();
        setInventory(data);
      } catch (err: any) {
        setInventoryError(err.message);
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInventory();
  }, [accessToken]);

  // --- Fetch Dispatch Orders ---
  useEffect(() => {
    const fetchDispatch = async () => {
      try {
        const res = await fetch(`${API_URL}/depot/dispatch`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setDispatchOrders(data);
      } catch {}
    };
    fetchDispatch();
  }, [accessToken]);

  // --- Static Warranty Claims ---
  useEffect(() => {
    setWarrantyClaims([
      {
        id: "C1",
        component: "Brake Shoe",
        defect_description: "Excessive wear after 2 weeks",
        reported_by: "EMP123",
        vendor_name: "Vendor A",
        status: "Under Review",
      },
      {
        id: "C2",
        component: "Coupler",
        defect_description: "Locking pin not engaging",
        reported_by: "EMP456",
        vendor_name: "Vendor B",
        status: "Approved",
      },
      {
        id: "C3",
        component: "Air Hose",
        defect_description: "Crack causing air leak",
        reported_by: "EMP789",
        vendor_name: "Vendor C",
        status: "Rejected",
      },
    ]);
  }, []);

  // --- Dispatch Update ---
  const handleDispatchUpdate = async (dispatchId: string, status: string) => {
    setIsUpdatingDispatch(dispatchId);
    try {
      const res = await fetch(`${API_URL}/depot/dispatch_update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ dispatchId, status }),
      });
      const data = await res.json();
      if (data.success) alert(`Dispatch updated to ${status}`);
      else alert("Failed to update dispatch");
    } catch {
      alert("Network error");
    } finally {
      setIsUpdatingDispatch(null);
    }
  };

  // --- Warranty Decision (local state update) ---
  const handleWarrantyDecision = async (
    claimId: string,
    decision: "Approved" | "Rejected"
  ) => {
    setIsProcessingWarranty(claimId);
    try {
      // Simulate async delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Update local state
      setWarrantyClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: decision } : c))
      );

      alert(`Claim ${decision}. Vendor notified if approved.`);
    } catch {
      alert("Something went wrong");
    } finally {
      setIsProcessingWarranty(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {t("depot.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {userData.employee_id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("dashboard.logout")}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="inventory">Inventory Tracking</TabsTrigger>
            <TabsTrigger value="qr-generation">QR Generation</TabsTrigger>
            <TabsTrigger value="warranty">Warranty Claims</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            {loadingInventory ? (
              <p>Loading inventory...</p>
            ) : inventoryError ? (
              <p className="text-red-500">{inventoryError}</p>
            ) : (
              <div className="space-y-4">
                {inventory.map((item) => (
                  <Card key={item._id}>
                    <CardHeader>
                      <CardTitle>{item.item_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p>Total Stock</p>
                          <p>{item.stock}</p>
                        </div>
                        <div>
                          <p>Allocated</p>
                          <p>{item.allocated}</p>
                        </div>
                        <div>
                          <p>Available</p>
                          <p>{item.available}</p>
                        </div>
                      </div>
                      <Progress
                        value={
                          (item.available / (item.reorder_level || 1)) * 100
                        }
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* QR Generation Tab */}
          <TabsContent value="qr-generation">
            <QrCodeAssetForm />
          </TabsContent>

          {/* Dispatch Tab */}
          <TabsContent value="dispatch">
            {dispatchOrders.map((order) => (
              <Card key={order.id} className="mb-2">
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p>{order.destination}</p>
                    <Badge>{order.status}</Badge>
                  </div>
                  {order.status !== "Delivered" && (
                    <Button
                      onClick={() =>
                        handleDispatchUpdate(
                          order.id,
                          order.status === "Ready" ? "In Transit" : "Delivered"
                        )
                      }
                      disabled={isUpdatingDispatch === order.id}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Warranty Tab */}
          <TabsContent value="warranty">
            {warrantyClaims.length === 0 ? (
              <p className="text-muted-foreground">
                No warranty claims reported.
              </p>
            ) : (
              warrantyClaims.map((claim) => (
                <Card key={claim.id} className="mb-3">
                  <CardHeader>
                    <CardTitle>{claim.component}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Defect</p>
                        <p>{claim.defect_description || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Reported By</p>
                        <p>{claim.reported_by || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Vendor</p>
                        <p>{claim.vendor_name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Status</p>
                        <Badge>{claim.status}</Badge>
                      </div>
                    </div>

                    {claim.status === "Under Review" && (
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          onClick={() =>
                            handleWarrantyDecision(claim.id, "Approved")
                          }
                          disabled={isProcessingWarranty === claim.id}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleWarrantyDecision(claim.id, "Rejected")
                          }
                          disabled={isProcessingWarranty === claim.id}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
