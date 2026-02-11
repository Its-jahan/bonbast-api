import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Key, Plus, Copy, Check, Loader2 } from 'lucide-react';

const SCOPE_LABELS: Record<string, string> = {
  all: 'API همه',
  currency: 'API ارز',
  crypto: 'API ارز دیجیتال',
  gold: 'API طلا',
};

type ApiKeyItem = {
  api_key_id: number;
  masked: string;
  status: string;
  created_at: string;
  plan: { slug: string; scope: string; name: string };
  usage: {
    month: string;
    request_count: number;
    monthly_quota: number;
    remaining: number;
  };
};

type Plan = {
  slug: string;
  scope: string;
  name: string;
  monthly_quota: number;
  rpm_limit: number;
  price_irr: number;
};

async function apiFetch(
  path: string,
  options: RequestInit & { token?: string } = {}
) {
  const { token, ...init } = options;
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(init.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export default function Dashboard() {
  const { user, session, signOut } = useAuth();
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [addRequestsKeyId, setAddRequestsKeyId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const token = session?.access_token;

  const fetchKeys = async () => {
    if (!token) return;
    try {
      const data = await apiFetch('/me/keys', { token });
      setKeys(data.keys);
    } catch {
      setKeys([]);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await apiFetch('/plans');
      setPlans(data.plans);
    } catch {
      setPlans([]);
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([fetchKeys(), fetchPlans()])
      .finally(() => setLoading(false))
      .catch((e) => setError(e.message));
  }, [token]);

  const handlePurchase = async () => {
    if (!selectedPlan || !token) return;
    setPurchasing(true);
    setError('');
    try {
      const data = await apiFetch('/me/purchase', {
        method: 'POST',
        body: JSON.stringify({ plan_slug: selectedPlan.slug }),
        token,
      });
      setNewApiKey(data.api_key);
      setSelectedPlan(null);
      fetchKeys();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطا');
    } finally {
      setPurchasing(false);
    }
  };

  const handleAddRequests = async (apiKeyId: number) => {
    if (!token) return;
    setAddRequestsKeyId(apiKeyId);
    setError('');
    try {
      await apiFetch(`/me/keys/${apiKeyId}/add-requests`, {
        method: 'POST',
        body: JSON.stringify({}),
        token,
      });
      fetchKeys();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطا');
    } finally {
      setAddRequestsKeyId(null);
    }
  };

  const copyKey = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">داشبورد</h1>
            <p className="text-muted-foreground text-sm">
              {user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            خروج
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* API Keys */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">API Keyهای من</h2>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              در حال بارگذاری...
            </div>
          ) : keys.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                هنوز API Key ندارید. یک پلن خریداری کنید.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {keys.map((k) => (
                <Card key={k.api_key_id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base">
                        {SCOPE_LABELS[k.plan.scope] || k.plan.name}
                      </CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {k.masked}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        مصرف ماهانه ({k.usage.month})
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (k.usage.request_count / k.usage.monthly_quota) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {k.usage.request_count.toLocaleString('fa-IR')} /{' '}
                          {k.usage.monthly_quota.toLocaleString('fa-IR')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {k.usage.remaining.toLocaleString('fa-IR')} ریکوئست باقی‌مانده
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddRequests(k.api_key_id)}
                      disabled={addRequestsKeyId === k.api_key_id}
                    >
                      {addRequestsKeyId === k.api_key_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span className="mr-1">خرید ۵۰۰۰ ریکوئست (دمو)</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Purchase new plan */}
        <section>
          <h2 className="text-lg font-semibold mb-4">خرید API جدید</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.slug}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    {SCOPE_LABELS[plan.scope] || plan.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.monthly_quota.toLocaleString('fa-IR')} ریکوئست/ماه
                  </p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" size="sm">
                    خرید (دمو)
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Purchase confirmation dialog */}
        <Dialog
          open={!!selectedPlan}
          onOpenChange={(open) => !open && setSelectedPlan(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                پرداخت (دمو) - {selectedPlan?.name}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              با کلیک روی پرداخت، بدون درگاه واقعی، خرید موفق انجام می‌شود.
            </p>
            <Button
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              پرداخت و دریافت API Key
            </Button>
          </DialogContent>
        </Dialog>

        {/* New API Key dialog */}
        <Dialog
          open={!!newApiKey}
          onOpenChange={(open) => !open && setNewApiKey(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key شما</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              این کلید فقط یک‌بار نمایش داده می‌شود. حتماً کپی کنید.
            </p>
            <div className="flex gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg text-sm break-all font-mono">
                {newApiKey}
              </code>
              <Button variant="outline" size="icon" onClick={copyKey}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={() => setNewApiKey(null)}>متوجه شدم</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
