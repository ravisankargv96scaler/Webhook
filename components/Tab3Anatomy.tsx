import React, { useState } from 'react';
import { WebhookEvent } from '../types';
import { CreditCard, GitMerge, UserPlus, AlertTriangle } from 'lucide-react';

const events: WebhookEvent[] = [
  {
    id: 'evt_1',
    name: 'Payment Succeeded',
    description: 'Triggered when a customer invoice is paid.',
    headers: {
      'POST': '/webhooks/stripe HTTP/1.1',
      'Host': 'api.your-saas.com',
      'Content-Type': 'application/json',
      'Stripe-Signature': 't=1698223344,v1=5257a869e7ece...',
      'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'
    },
    body: {
      id: "evt_1M5j4eLkdIwHu7ix",
      object: "event",
      type: "invoice.payment_succeeded",
      data: {
        object: {
          id: "in_1M5j4eLkdIwHu7ix",
          amount_paid: 2900,
          currency: "usd",
          customer_email: "jane@example.com",
          status: "paid"
        }
      }
    }
  },
  {
    id: 'evt_2',
    name: 'PR Merged',
    description: 'Triggered when a PR is merged into main.',
    headers: {
      'POST': '/webhooks/github HTTP/1.1',
      'Host': 'ci.your-company.com',
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'pull_request',
      'X-Hub-Signature-256': 'sha256=757107ea0eb2509...'
    },
    body: {
      action: "closed",
      pull_request: {
        url: "https://api.github.com/repos/octocat/Hello-World/pulls/1347",
        state: "closed",
        title: "Amazing new feature",
        merged: true,
        merged_by: {
          login: "octocat"
        },
        base: {
          ref: "main"
        }
      }
    }
  },
  {
    id: 'evt_3',
    name: 'User Created',
    description: 'Triggered on new account registration.',
    headers: {
      'POST': '/webhooks/auth0 HTTP/1.1',
      'Host': 'api.users.com',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer whsec_...'
    },
    body: {
      event: "user.created",
      timestamp: "2023-10-25T14:00:00Z",
      user: {
        user_id: "auth0|653123456789",
        email: "new_dev@tech.com",
        email_verified: false,
        created_at: "2023-10-25T14:00:00.000Z"
      }
    }
  }
];

const Tab3Anatomy: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent>(events[0]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Sidebar: Event List */}
      <div className="w-full md:w-1/3 space-y-4">
        <div className="bg-surface p-4 rounded-xl border border-slate-700">
          <h3 className="font-bold text-white mb-4">Sample Events</h3>
          <div className="space-y-2">
            {events.map(evt => (
              <button
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3
                  ${selectedEvent.id === evt.id 
                    ? 'bg-primary/20 border-primary text-white shadow-md' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                `}
              >
                {evt.id === 'evt_1' && <CreditCard className="w-4 h-4" />}
                {evt.id === 'evt_2' && <GitMerge className="w-4 h-4" />}
                {evt.id === 'evt_3' && <UserPlus className="w-4 h-4" />}
                <div>
                  <div className="font-semibold text-sm">{evt.name}</div>
                  <div className="text-[10px] opacity-70 truncate">{evt.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-700/50 text-amber-200 text-xs flex gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>
            Notice that every webhook is just a standard HTTP POST request. The "magic" is simply the convention of JSON schemas and specific headers like signatures.
          </p>
        </div>
      </div>

      {/* Main: Code Inspector */}
      <div className="w-full md:w-2/3 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
        {/* Mac-style Window Header */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="ml-4 text-xs font-mono text-slate-500">request_inspector.http</span>
        </div>

        {/* Code Content */}
        <div className="p-6 font-mono text-sm overflow-auto max-h-[500px]">
          {/* Headers */}
          <div className="text-slate-400 mb-4 select-text">
            {Object.entries(selectedEvent.headers).map(([key, value]) => (
              <div key={key}>
                <span className="text-purple-400 font-bold">{key === 'POST' ? key : `${key}:`}</span>{' '}
                <span className="text-emerald-300">{value}</span>
              </div>
            ))}
          </div>

          {/* Empty Line Separator */}
          <div className="h-4"></div>

          {/* JSON Body */}
          <div className="text-slate-300 whitespace-pre-wrap select-text">
            {JSON.stringify(selectedEvent.body, null, 2)}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Tab3Anatomy;
