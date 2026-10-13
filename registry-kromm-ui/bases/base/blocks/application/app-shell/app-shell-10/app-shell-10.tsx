"use client";

import { cn } from "cn";
import {
  Bell,
  Globe,
  Key,
  LayoutDashboard,
  Moon,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/registry/bases/base/ui/badge";
import { Button } from "@/registry/bases/base/ui/button";
import { Card, CardContent } from "@/registry/bases/base/ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/base/ui/field";
import { Input } from "@/registry/bases/base/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select";
import { Separator } from "@/registry/bases/base/ui/separator";
import { Switch } from "@/registry/bases/base/ui/switch";

const sections = [
  {
    desc: "Basic account settings",
    icon: LayoutDashboard,
    id: "general",
    label: "General",
  },
  { desc: "Personal information", icon: User, id: "profile", label: "Profile" },
  { desc: "Security and login", icon: Shield, id: "account", label: "Account" },
  {
    desc: "Email and push preferences",
    icon: Bell,
    id: "notifications",
    label: "Notifications",
  },
  {
    desc: "Theme and display",
    icon: Moon,
    id: "appearance",
    label: "Appearance",
  },
  { desc: "Members and permissions", icon: Users, id: "team", label: "Team" },
  { desc: "Plans and payment", icon: Key, id: "billing", label: "Billing" },
  {
    desc: "Connected services",
    icon: Globe,
    id: "integrations",
    label: "Integrations",
  },
];

const timezoneOptions = [
  { label: "UTC", value: "UTC" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Central Time (CT)", value: "America/Chicago" },
  { label: "Mountain Time (MT)", value: "America/Denver" },
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "London (GMT/BST)", value: "Europe/London" },
  { label: "Paris (CET/CEST)", value: "Europe/Paris" },
  { label: "Tokyo (JST)", value: "Asia/Tokyo" },
];

const localeOptions = [
  { label: "English (US)", value: "en-US" },
  { label: "English (UK)", value: "en-GB" },
  { label: "Español", value: "es-ES" },
  { label: "Français", value: "fr-FR" },
  { label: "Deutsch", value: "de-DE" },
  { label: "日本語", value: "ja-JP" },
];

function SectionNavItem({
  icon: Icon,
  label,
  desc,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  active: boolean;
}) {
  return (
    <a
      href={`#${label.toLowerCase()}`}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-muted/50 text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground/70">{desc}</p>
      </div>
    </a>
  );
}

function SettingsForm({ section }: { section: (typeof sections)[0] }) {
  switch (section.id) {
    case "general": {
      return (
        <div className="space-y-6">
          <Field name="workspaceName">
            <FieldLabel>Workspace name</FieldLabel>
            <FieldDescription>
              This is the name shown to members.
            </FieldDescription>
            <Input id="workspaceName" defaultValue="Kromm Workspace" />
          </Field>
          <Field name="workspaceUrl">
            <FieldLabel>Workspace URL</FieldLabel>
            <FieldDescription>Your workspace subdomain.</FieldDescription>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">https://</span>
              <Input
                id="workspaceUrl"
                defaultValue="kromm-workspace"
                className="flex-1"
              />
              <span className="text-muted-foreground">.kromm.app</span>
            </div>
          </Field>
        </div>
      );
    }
    case "profile": {
      return (
        <div className="space-y-6">
          <Field name="displayName">
            <FieldLabel>Display name</FieldLabel>
            <FieldDescription>How others see you.</FieldDescription>
            <Input id="displayName" defaultValue="Jane Doe" />
          </Field>
          <Field name="email">
            <FieldLabel>Email</FieldLabel>
            <FieldDescription>
              Used for login and notifications.
            </FieldDescription>
            <Input id="email" type="email" defaultValue="jane@kromm.dev" />
          </Field>
          <Field name="timezone">
            <FieldLabel>Timezone</FieldLabel>
            <NativeSelect id="timezone" defaultValue="America/Los_Angeles">
              {timezoneOptions.map((opt) => (
                <NativeSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
        </div>
      );
    }
    case "account": {
      return (
        <div className="space-y-6">
          <Field name="password">
            <FieldLabel>Password</FieldLabel>
            <FieldDescription>Last changed 3 months ago.</FieldDescription>
            <Button variant="outline" size="sm">
              <Key className="mr-2 size-4" />
              Change password
            </Button>
          </Field>
          <Field name="twoFA">
            <FieldLabel>Two-factor authentication</FieldLabel>
            <FieldDescription>Add an extra layer of security.</FieldDescription>
            <Button variant="outline" size="sm">
              <Shield className="mr-2 size-4" />
              Enable 2FA
            </Button>
          </Field>
        </div>
      );
    }
    case "notifications": {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <FieldLabel htmlFor="email-notifications">
                Email notifications
              </FieldLabel>
              <FieldDescription>
                Receive emails for important updates.
              </FieldDescription>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <FieldLabel htmlFor="push-notifications">
                Push notifications
              </FieldLabel>
              <FieldDescription>
                Receive browser notifications.
              </FieldDescription>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <FieldLabel htmlFor="marketing-emails">
                Marketing emails
              </FieldLabel>
              <FieldDescription>
                Receive product updates and tips.
              </FieldDescription>
            </div>
            <Switch id="marketing-emails" />
          </div>
        </div>
      );
    }
    case "appearance": {
      return (
        <div className="space-y-6">
          <Field name="theme">
            <FieldLabel>Theme</FieldLabel>
            <FieldDescription>
              Choose your preferred color scheme.
            </FieldDescription>
            <NativeSelect id="theme" defaultValue="system">
              <NativeSelectOption value="system">System</NativeSelectOption>
              <NativeSelectOption value="light">Light</NativeSelectOption>
              <NativeSelectOption value="dark">Dark</NativeSelectOption>
            </NativeSelect>
          </Field>
          <Field name="locale">
            <FieldLabel>Language</FieldLabel>
            <NativeSelect id="locale" defaultValue="en-US">
              {localeOptions.map((opt) => (
                <NativeSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
        </div>
      );
    }
    case "team": {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Members</h3>
            <Button size="sm">
              <User className="mr-2 size-4" />
              Invite member
            </Button>
          </div>
          <div className="space-y-3">
            {[
              {
                email: "jane@kromm.dev",
                initials: "JD",
                name: "Jane Doe",
                role: "Owner",
              },
              {
                email: "john@kromm.dev",
                initials: "JS",
                name: "John Smith",
                role: "Admin",
              },
              {
                email: "alice@kromm.dev",
                initials: "AB",
                name: "Alice Brown",
                role: "Member",
              },
            ].map((member) => (
              <div key={member.email} className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {member.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "billing": {
      return (
        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Current plan: Pro</p>
            <p className="text-xs text-muted-foreground mt-1">
              $20/month per member, billed annually
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Manage billing
            </Button>
          </div>
        </div>
      );
    }
    case "integrations": {
      return (
        <div className="space-y-4">
          {["GitHub", "Slack", "Linear", "Jira", "Vercel"].map((name) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <Globe className="size-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">{name}</span>
              </div>
              <Badge variant="outline" className="rounded-full text-xs">
                Connected
              </Badge>
            </div>
          ))}
        </div>
      );
    }
    default: {
      return null;
    }
  }
}

export function AppShell10() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const currentSection =
    sections.find((s) => s.id === activeSection) ?? sections[0];

  return (
    <div className="flex h-svh w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar - Section Navigation */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex h-[50px] items-center gap-2 border-b border-border px-4">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            K
          </div>
          <span className="text-sm font-semibold">Kromm</span>
        </div>

        <nav
          className="flex-1 space-y-1 overflow-y-auto p-3"
          aria-label="Settings"
        >
          {sections.map((section) => (
            <SectionNavItem
              key={section.id}
              icon={section.icon}
              label={section.label}
              desc={section.desc}
              active={activeSection === section.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(section.id);
              }}
            />
          ))}
        </nav>

        <div className="border-t border-border p-3 text-xs text-muted-foreground/70">
          v1.0.0 · Kromm Settings
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[50px] shrink-0 items-center gap-3 border-b border-border px-4">
          <h1 className="text-sm font-semibold">Settings</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
          <section
            id={activeSection}
            className="max-w-2xl space-y-6"
            aria-labelledby={`${activeSection}-title`}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {React.createElement(currentSection.icon, {
                  className: "size-4",
                })}
              </div>
              <div>
                <h2
                  id={`${activeSection}-title`}
                  className="text-base font-semibold"
                >
                  {currentSection.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentSection.desc}
                </p>
              </div>
            </div>

            <Card className="space-y-6">
              <CardContent className="pt-6 pb-6">
                <SettingsForm section={currentSection} />
              </CardContent>
            </Card>
          </section>

          <Separator />
          <p className="text-xs text-muted-foreground text-center">
            AppShell10 — settings shell with vertical section nav and forms.
          </p>
        </main>
      </div>
    </div>
  );
}
