import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { CodeTabs } from '@/components/code-tabs';
import { highlightCodeSnippet } from '@/lib/markdown';
import {
  ArrowRight,
  Terminal,
  Shield,
  Zap,
  Cpu,
  Layers,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Lock,
  Boxes,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const apiExamples = [
  {
    label: 'cURL',
    lang: 'bash',
    code: `curl -X POST https://api.naagmani.app/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer nm_live_9f8a7e6d5c4b3a21" \\
  -d '{
    "model": "smart",
    "messages": [
      {"role": "system", "content": "You are a concise AI runtime assistant."},
      {"role": "user", "content": "What are the benefits of Naagmani AI OS?"}
    ],
    "plugins": ["dlp-masker", "semantic-cache"]
  }'`,
  },
  {
    label: 'Node.js',
    lang: 'typescript',
    code: `import OpenAI from 'openai';

// Naagmani is 100% OpenAI-compatible
const client = new OpenAI({
  baseURL: 'https://api.naagmani.app/v1',
  apiKey: process.env.NAAGMANI_API_KEY, // e.g. nm_live_...
});

const response = await client.chat.completions.create({
  model: 'smart', // Virtual alias routes to best model
  messages: [
    { role: 'user', content: 'Generate a distributed token bucket limiter.' }
  ],
  stream: true,
});

for await (const chunk of response) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}`,
  },
  {
    label: 'Python',
    lang: 'python',
    code: `from openai import OpenAI
import os

client = OpenAI(
    base_url="https://api.naagmani.app/v1",
    api_key=os.environ.get("NAAGMANI_API_KEY"),
)

stream = client.chat.completions.create(
    model="smart",  # Automatic failover & cost-optimized routing
    messages=[
        {"role": "user", "content": "Explain zero-leakage BYOK vaults."}
    ],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")`,
  },
  {
    label: 'Go',
    lang: 'go',
    code: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/sashabaranov/go-openai"
)

func main() {
	config := openai.DefaultConfig(os.Getenv("NAAGMANI_API_KEY"))
	config.BaseURL = "https://api.naagmani.app/v1"

	client := openai.NewClientWithConfig(config)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "smart",
			Messages: []openai.ChatCompletionMessage{
				{Role: "user", Content: "Hello from Naagmani Go client!"},
			},
		},
	)
	if err != nil {
		panic(err)
	}
	fmt.Println(resp.Choices[0].Message.Content)
}`,
  },
];

const pillars = [
  {
    icon: Layers,
    title: 'One Unified API',
    description:
      'Direct any OpenAI SDK, LangChain, or agentic framework to Naagmani with a single base URL change.',
    href: '/docs/api/overview',
  },
  {
    icon: Zap,
    title: 'Smart Model Routing',
    description:
      'Dynamically route prompts across OpenAI, Anthropic, Gemini, and DeepSeek based on cost, latency, or health.',
    href: '/docs/concepts/routing',
  },
  {
    icon: Shield,
    title: 'Zero-Leakage BYOK Vault',
    description:
      'Store provider API keys in an encrypted hardware-grade vault. Application developers never see master secrets.',
    href: '/docs/concepts/api-keys',
  },
  {
    icon: Cpu,
    title: 'Polyglot Plugin Engine',
    description:
      'Extend gateway pipelines with isolated plugins written in Go, Node.js, or Python via naagmani.plugin/v1.',
    href: '/docs/plugins/overview',
  },
  {
    icon: BarChart3,
    title: 'Real-Time FinOps Metering',
    description:
      'Track prompt tokens, completion tokens, costs, and tenant quotas across organizations, projects, and environments.',
    href: '/docs/concepts/usage',
  },
  {
    icon: Terminal,
    title: 'Native Developer CLI',
    description:
      'Scaffold plugins, validate manifests, run local cluster gateways, and package extensions with the naagmani CLI.',
    href: '/docs/cli/installation',
  },
];

const quickstartSteps = [
  {
    step: '01',
    title: 'Generate API Key',
    desc: 'Create an environment-scoped API key with granular permissions and rate limits.',
    href: '/docs/quickstart/api-key',
  },
  {
    step: '02',
    title: 'Make First Request',
    desc: 'Send an OpenAI-compatible completion request using your favorite language SDK or cURL.',
    href: '/docs/quickstart/first-request',
  },
  {
    step: '03',
    title: 'Stream Tokens',
    desc: 'Receive real-time Server-Sent Events (SSE) with sub-10ms gateway dispatch latency.',
    href: '/docs/quickstart/streaming',
  },
  {
    step: '04',
    title: 'Author Custom HDK Plugin',
    desc: 'Build prompt sanitizers, DLP scanners, and MCP agents in Go, Node.js, or Python.',
    href: '/docs/plugins/development',
  },
];

export default async function HomePage() {
  const highlightedExamples = await Promise.all(
    apiExamples.map(async (example) => ({
      ...example,
      highlightedHtml: await highlightCodeSnippet(example.code, example.lang),
    }))
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-zinc-200 dark:border-zinc-800">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative">
            <div className="flex flex-col items-center text-center max-w-4xl 2xl:max-w-5xl mx-auto">
              {/* Release Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-6 animate-in fade-in duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Naagmani 1.0.0 is now live</span>
                <span className="text-zinc-400 dark:text-zinc-600">|</span>
                <Link href="/docs/introduction/what-is-naagmani" className="hover:underline flex items-center gap-1">
                  Explore Architecture <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Hero Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.15]">
                The AI Runtime for your applications.
              </h1>

              {/* Supporting Text */}
              <p className="mt-6 text-lg sm:text-xl 2xl:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl 2xl:max-w-4xl">
                Instead of managing isolated AI providers, custom routing, security keys, plugins, and token metering separately — standardize everything behind one high-performance, OpenAI-compatible AI gateway.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/docs/quickstart/overview"
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/docs/api/overview"
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all"
                >
                  API Reference
                </Link>
                <Link
                  href="/docs/plugins/overview"
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all flex items-center gap-1.5"
                >
                  <Cpu className="w-4 h-4 text-emerald-500" />
                  Plugins & HDKs
                </Link>
              </div>
            </div>

            {/* Interactive API Demonstration Box */}
            <div className="mt-14 max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto">
              <div className="text-center mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Instant Drop-in Integration
                </span>
              </div>
              <CodeTabs tabs={highlightedExamples} defaultTab={0} />
            </div>
          </div>
        </section>

        {/* Quickstart Flow Section */}
        <section className="py-16 md:py-24 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Go from docs to production in minutes
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                A streamlined developer workflow engineered for speed, security, and extensibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickstartSteps.map((item) => (
                <Link
                  key={item.step}
                  href={item.href}
                  className="group relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-2xl font-black text-emerald-500/40 group-hover:text-emerald-500 transition-colors">
                      {item.step}
                    </span>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-3 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-mono text-emerald-500 group-hover:translate-x-1 transition-transform">
                    <span>Read guide</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Core Infrastructure Pillars Grid */}
        <section className="py-16 md:py-24 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-500">
                  Infrastructure Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
                  Complete AI Runtime Capabilities
                </h2>
              </div>
              <Link
                href="/docs/introduction/architecture"
                className="text-xs sm:text-sm font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1.5 self-start md:self-auto"
              >
                View full architecture breakdown <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 2xl:gap-8">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Link
                    key={pillar.title}
                    href={pillar.href}
                    className="group p-6 2xl:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 hover:border-emerald-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors mb-4">
                        <Icon className="w-5 h-5 2xl:w-6 2xl:h-6" />
                      </div>
                      <h3 className="text-base 2xl:text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm 2xl:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-mono text-zinc-400 group-hover:text-emerald-500 transition-colors">
                      <span>Explore section</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Public Ecosystem Section */}
        <section className="py-16 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 sm:p-12 2xl:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl 2xl:max-w-2xl">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-500">
                  Open Ecosystem
                </span>
                <h3 className="text-2xl 2xl:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
                  Plug into the Naagmani SDK & CLI Ecosystem
                </h3>
                <p className="mt-3 text-sm 2xl:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Scaffold custom plugins with native Go, TypeScript, or Python HDKs. Manage local clusters, test schemas, and deploy policies using our pre-compiled single binary CLI.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/docs/cli/installation"
                    className="px-4 py-2 2xl:px-5 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                  >
                    Install CLI
                  </Link>
                  <Link
                    href="/docs/sdk/go"
                    className="px-4 py-2 2xl:px-5 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500 transition-colors"
                  >
                    Go HDK
                  </Link>
                  <Link
                    href="/docs/sdk/node"
                    className="px-4 py-2 2xl:px-5 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500 transition-colors"
                  >
                    Node HDK
                  </Link>
                  <Link
                    href="/docs/sdk/python"
                    className="px-4 py-2 2xl:px-5 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500 transition-colors"
                  >
                    Python HDK
                  </Link>
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col gap-3 font-mono text-xs 2xl:text-sm text-zinc-400 bg-zinc-950 p-6 2xl:p-8 rounded-xl border border-zinc-800 shadow-md">
                <span className="text-emerald-400 font-semibold"># Install via npm</span>
                <code className="text-zinc-200 bg-zinc-900 px-3 py-2 rounded border border-zinc-800">
                  npm install -g naagmani
                </code>
                <span className="text-emerald-400 font-semibold mt-2"># Check cluster health</span>
                <code className="text-zinc-200 bg-zinc-900 px-3 py-2 rounded border border-zinc-800">
                  naagmani doctor
                </code>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-white dark:bg-[#09090B] text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-[1920px] 4xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Naagmani Docs</span>
            <span>—</span>
            <span>The AI Runtime for your applications.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs/introduction/what-is-naagmani" className="hover:text-emerald-500 transition-colors">
              Docs
            </Link>
            <Link href="/docs/api/overview" className="hover:text-emerald-500 transition-colors">
              API Reference
            </Link>
            <Link href="/docs/security/overview" className="hover:text-emerald-500 transition-colors">
              Security
            </Link>
            <a
              href="https://github.com/bhakha-services/naagmani-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 transition-colors flex items-center gap-1"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
