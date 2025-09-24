"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Truck, CheckCircle } from "lucide-react";
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
  const [isUpdatingDispatch, setIsUpdatingDispatch] = useState<string | null>(
    null
  );

  // Warranty
  const [warrantyClaims, setWarrantyClaims] = useState<any[]>([]);
  const [isProcessingWarranty, setIsProcessingWarranty] = useState<
    string | null
  >(null);

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
        console.log(data);
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

  // --- Fetch Warranty Claims ---
  useEffect(() => {
    const fetchWarranty = async () => {
      try {
        const res = await fetch(`${API_URL}/depot/warranty`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setWarrantyClaims(data);
      } catch {}
    };
    fetchWarranty();
  }, [accessToken]);

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

  // --- Warranty Claim ---
  const handleWarrantyClaim = async (claimId: string) => {
    setIsProcessingWarranty(claimId);
    try {
      const res = await fetch(`${API_URL}/depot/warranty_claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ claimId, reportedBy: userData.employee_id }),
      });
      const data = await res.json();
      if (data.success) alert(`Warranty claim processed: ${data.claim.id}`);
      else alert("Failed to process warranty claim");
    } catch {
      alert("Network error");
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
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="qr-generation">QR Generation</TabsTrigger>
            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
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

          {/* QR Generation Tab - Asset Form */}
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
            {warrantyClaims.map((claim) => (
              <Card key={claim.id} className="mb-2">
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p>{claim.component}</p>
                    <Badge>{claim.status}</Badge>
                  </div>
                  {claim.status === "Under Review" && (
                    <Button
                      onClick={() => handleWarrantyClaim(claim.id)}
                      disabled={isProcessingWarranty === claim.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Process
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
