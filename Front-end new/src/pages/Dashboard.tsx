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
  all: 'All APIs',
  currency: 'Currency API',
  crypto: 'Crypto API',
  gold: 'Gold API',
};

type ApiKeyItem = {
  api_key_id: number;
  api_key?: string;
  api_url?: string;
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
  is_demo?: boolean;
};

type Plan = {
  slug: string;
  scope: string;
  name: string;
  monthly_quota: number;
  rpm_limit: number;
  price_irr: number;
};

type ApiError = Error & { status?: number };

const DEMO_STORAGE_KEY = 'demo_api_keys';
const DEMO_REQUESTS_ADDON = 5000;

const buildMaskedKey = (apiKey: string) => {
  const prefix = apiKey.split('_', 1)[0];
  const last4 = apiKey.slice(-4);
  return `${prefix}_…${last4}`;
};

const getMonthKey = () => new Date().toISOString().slice(0, 7);

const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return '/api';
  return `${window.location.origin}/api`;
};

const buildApiUrl = (apiKey: string) => `${getApiBaseUrl()}/v1/key/${apiKey}/prices`;

const loadDemoKeys = (): ApiKeyItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ApiKeyItem[];
    return parsed.map((item) => ({
      ...item,
      api_url: item.api_url ?? (item.api_key ? buildApiUrl(item.api_key) : undefined),
    }));
  } catch {
    return [];
  }
};

const saveDemoKeys = (items: ApiKeyItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(items));
};

const isAuthError = (error: unknown) => (error as ApiError)?.status === 401;

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
    const apiError = new Error(err.error || res.statusText) as ApiError;
    apiError.status = res.status;
    throw apiError;
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
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [newApiUrl, setNewApiUrl] = useState<string | null>(null);
  const [addRequestsKeyId, setAddRequestsKeyId] = useState<number | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const token = session?.access_token;

  const fetchKeys = async () => {
    if (demoMode) {
      setKeys(loadDemoKeys());
      return;
    }
    if (!token) return;
    try {
      const data = await apiFetch('/me/keys', { token });
      setKeys(data.keys);
    } catch (e) {
      if (isAuthError(e)) {
        setDemoMode(true);
        setKeys(loadDemoKeys());
        return;
      }
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

  const handlePurchase = async (plan: Plan) => {
    if (!token && !user?.email) return;
    setPurchasing(true);
    setPurchasingPlan(plan.slug);
    setError('');
    try {
      const data = await apiFetch('/me/purchase', {
        method: 'POST',
        body: JSON.stringify({ plan_slug: plan.slug }),
        token,
      });
      setNewApiKey(data.api_key);
      setNewApiUrl(data.api_url ?? buildApiUrl(data.api_key));
      await fetchKeys();
    } catch (e) {
      if (isAuthError(e)) {
        const demoEmail =
          user?.email?.trim() || `demo+${user?.id ?? 'user'}@example.com`;
        try {
          const data = await apiFetch('/purchase', {
            method: 'POST',
            body: JSON.stringify({ plan_slug: plan.slug, email: demoEmail }),
          });
          const apiUrl = data.api_url ?? buildApiUrl(data.api_key);
          const demoKey: ApiKeyItem = {
            api_key_id: Date.now(),
            api_key: data.api_key,
            api_url: apiUrl,
            masked: buildMaskedKey(data.api_key),
            status: 'active',
            created_at: new Date().toISOString(),
            plan: { slug: plan.slug, scope: plan.scope, name: plan.name },
            usage: {
              month: getMonthKey(),
              request_count: 0,
              monthly_quota: plan.monthly_quota,
              remaining: plan.monthly_quota,
            },
            is_demo: true,
          };
          const nextKeys = [demoKey, ...loadDemoKeys()];
          saveDemoKeys(nextKeys);
          setDemoMode(true);
          setKeys(nextKeys);
          setNewApiKey(data.api_key);
          setNewApiUrl(apiUrl);
          return;
        } catch (demoError) {
          setError(
            demoError instanceof Error
              ? demoError.message
              : 'Something went wrong.'
          );
          return;
        }
      }
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setPurchasing(false);
      setPurchasingPlan(null);
    }
  };

  const handleAddRequests = async (apiKeyId: number) => {
    if (demoMode) {
      setAddRequestsKeyId(apiKeyId);
      const existing = loadDemoKeys();
      const updated = existing.map((item) => {
        if (item.api_key_id !== apiKeyId) return item;
        const nextQuota = item.usage.monthly_quota + DEMO_REQUESTS_ADDON;
        const nextRemaining = item.usage.remaining + DEMO_REQUESTS_ADDON;
        return {
          ...item,
          usage: {
            ...item.usage,
            monthly_quota: nextQuota,
            remaining: nextRemaining,
          },
        };
      });
      saveDemoKeys(updated);
      setKeys(updated);
      setAddRequestsKeyId(null);
      return;
    }
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
      if (isAuthError(e)) {
        setDemoMode(true);
        setKeys(loadDemoKeys());
        setAddRequestsKeyId(null);
        return;
      }
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setAddRequestsKeyId(null);
    }
  };

  const handleCopy = async (value: string, token: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      setError('Copy failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            {demoMode && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Demo mode (auth unavailable)
              </span>
            )}
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-12">
          {/* API Keys */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">My API Keys</h2>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </div>
            ) : keys.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-10 text-center text-muted-foreground">
                  You do not have any API keys yet. Buy a plan to get started.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {keys.map((k) => {
                  const apiUrl = k.api_url ?? (k.api_key ? buildApiUrl(k.api_key) : undefined);
                  return (
                  <Card key={k.api_key_id} className="shadow-sm">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Key className="w-5 h-5 text-primary" />
                          <CardTitle className="text-base">
                            {SCOPE_LABELS[k.plan.scope] || k.plan.name}
                          </CardTitle>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">
                          {k.masked}
                        </p>
                      </div>
                      {apiUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(apiUrl, `url-${k.api_key_id}`)}
                        >
                          {copiedToken === `url-${k.api_key_id}` ? 'Copied URL' : 'Copy URL'}
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          API Key
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded-lg bg-muted px-3 py-2 text-xs break-all font-mono">
                            {k.api_key ?? k.masked}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(k.api_key ?? '', `key-${k.api_key_id}`)}
                            disabled={!k.api_key}
                          >
                            {copiedToken === `key-${k.api_key_id}` ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                      </div>

                      {apiUrl && (
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            API URL
                          </p>
                          <code className="block rounded-lg bg-muted px-3 py-2 text-xs break-all font-mono">
                            {apiUrl}
                          </code>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Monthly usage ({k.usage.month})
                        </p>
                        <div className="flex items-center gap-3">
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
                          <span className="text-sm font-medium tabular-nums">
                            {k.usage.request_count.toLocaleString('en-US')} /{' '}
                            {k.usage.monthly_quota.toLocaleString('en-US')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {k.usage.remaining.toLocaleString('en-US')} requests remaining
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddRequests(k.api_key_id)}
                        disabled={addRequestsKeyId === k.api_key_id}
                      >
                        {addRequestsKeyId === k.api_key_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        <span className="ml-1">Buy 5,000 requests (demo)</span>
                      </Button>
                    </CardContent>
                  </Card>
                );
                })}
              </div>
            )}
          </section>

          {/* Purchase new plan */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Buy a New API Key</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.slug}
                  className="hover:border-primary transition-colors shadow-sm"
                >
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base">
                      {SCOPE_LABELS[plan.scope] || plan.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {plan.monthly_quota.toLocaleString('en-US')} requests/month
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {plan.rpm_limit.toLocaleString('en-US')} rpm limit
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePurchase(plan);
                      }}
                      disabled={purchasing && purchasingPlan === plan.slug}
                    >
                      {purchasing && purchasingPlan === plan.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      <span>
                        {purchasing && purchasingPlan === plan.slug ? 'Processing...' : 'Buy (demo)'}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* New API Key dialog */}
        <Dialog
          open={!!newApiKey}
          onOpenChange={(open) => {
            if (!open) {
              setNewApiKey(null);
              setNewApiUrl(null);
              setCopiedToken(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your API Key</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This key is shown only once. Copy it now.
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <code className="flex-1 p-3 bg-muted rounded-lg text-xs break-all font-mono">
                  {newApiKey}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(newApiKey ?? '', 'dialog-key')}
                >
                  {copiedToken === 'dialog-key' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {newApiUrl && (
                <div className="flex gap-2">
                  <code className="flex-1 p-3 bg-muted rounded-lg text-xs break-all font-mono">
                    {newApiUrl}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(newApiUrl, 'dialog-url')}
                  >
                    {copiedToken === 'dialog-url' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={() => {
                setNewApiKey(null);
                setNewApiUrl(null);
              }}
            >
              Got it
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
