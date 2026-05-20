import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Star, ExternalLink } from 'lucide-react';
import api from '../../../shared/api/api';
import { useApp } from '../../../shared/context/AppContext';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['Up to 5 blog posts', 'Subdomain access', 'Standard support'],
    buttonText: 'Current Plan',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    description: 'For growing blogs',
    features: ['Unlimited blog posts', 'Custom domain support', 'Advanced SEO', 'Priority support'],
    buttonText: 'Upgrade to Pro',
    icon: <Zap className="text-yellow-500" size={24} />,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49',
    description: 'For large organizations',
    features: ['White-labeling', 'Dedicated account manager', 'SLA support', 'Custom integrations'],
    buttonText: 'Contact Sales',
    icon: <Star className="text-purple-500" size={24} />,
  },
];

const BillingDashboard: React.FC = () => {
  const { showNotification } = useApp();
  const [loading, setLoading] = useState<string | null>(null);
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    fetchTenantData();
    
    // Check for success/cancel in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      showNotification('Success', 'Subscription updated successfully! It may take a minute to reflect.', 'success');
    } else if (params.get('canceled')) {
      showNotification('Canceled', 'Subscription update was canceled.', 'info');
    }
  }, []);

  const fetchTenantData = async () => {
    try {
      const response = await api.get('/auth/profile');
      setTenant(response.data.tenantId); // It's populated in backend
    } catch (err) {
      console.error('Failed to fetch tenant data', err);
    }
  };

  const currentPlan = tenant?.plan || 'free';

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    setLoading(planId);
    try {
      const response = await api.post('/billing/create-checkout-session', { plan: planId });
      window.location.href = response.data.url;
    } catch (err) {
      showNotification('Error', 'Failed to initiate checkout. Please try again.', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading('manage');
    try {
      const response = await api.post('/billing/create-portal-session');
      window.location.href = response.data.url;
    } catch (err) {
      showNotification('Error', 'Failed to open billing portal.', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Subscription Plan</h3>
          <p className="text-gray-500 mt-1">Manage your billing and plan details</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full uppercase tracking-wider">
              Current: {currentPlan} Plan
            </span>
            {tenant?.stripeCustomerId && (
              <button 
                onClick={handleManageBilling}
                disabled={loading === 'manage'}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                {loading === 'manage' ? 'Loading...' : (
                  <>
                    Manage Billing <ExternalLink size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <CreditCard className="text-gray-400" size={40} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`bg-white p-8 rounded-2xl border ${plan.popular ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-200'} relative flex flex-col`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase">
                Most Popular
              </span>
            )}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold">{plan.name}</h4>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>
              {plan.icon}
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black">{plan.price}</span>
              <span className="text-gray-400 text-sm ml-1">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2 shrink-0" size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.disabled || currentPlan === plan.id || loading === plan.id}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                currentPlan === plan.id
                  ? 'bg-gray-100 text-gray-400 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50'
              }`}
            >
              {loading === plan.id ? 'Processing...' : (currentPlan === plan.id ? 'Current Plan' : plan.buttonText)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingDashboard;
