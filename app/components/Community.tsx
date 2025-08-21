"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button, Icon } from "./DemoComponents";

type Goal = {
  id: string;
  title: string;
  category: string;
  image: string;
  progressPercent: number;
  stakeLabel: string;
  dueLabel?: string;
  participants: string[]; // image urls; using built-in images for now
  contextLabel: string; // varies per tab
  contextEmphasis?: string; // e.g., CTA or probability
};

export type CommunityTab = "all" | "mine" | "following";

const avatarUrls = [
  "/icon.png",
  "/logo.png",
  "/splash.png",
  "/hero.png",
];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-[var(--app-gray)] rounded-full">
      <div
        className="h-2 bg-[var(--app-accent)] rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function AvatarStack({ urls }: { urls: string[] }) {
  return (
    <div className="flex -space-x-2">
      {urls.slice(0, 4).map((u, i) => (
        <Image
          key={`${u}-${i}`}
          src={u}
          width={24}
          height={24}
          alt="avatar"
          className="rounded-full border border-[var(--app-card-border)] object-cover"
        />
      ))}
    </div>
  );
}

function GoalCard({ goal, mode }: { goal: Goal; mode: CommunityTab }) {
  return (
    <div className="bg-[var(--app-card-bg)] rounded-xl border border-[var(--app-card-border)] shadow-sm overflow-hidden">
      <div className="w-full h-36 relative">
        <Image
          src={goal.image}
          alt={goal.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="text-base font-medium text-[var(--app-foreground)]">{goal.title}</div>
          <div className="text-xs text-[var(--app-foreground-muted)] mt-0.5">{goal.category}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-[var(--app-foreground-muted)]">Progress</div>
          <div className="text-sm font-medium text-[var(--app-foreground)]">{goal.progressPercent}%</div>
        </div>
        <ProgressBar value={goal.progressPercent} />

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-2 text-sm text-[var(--app-foreground)]">
            <Icon name="check" size="sm" className="text-[var(--app-foreground-muted)]" />
            <span>{goal.stakeLabel}</span>
          </div>
          <AvatarStack urls={goal.participants} />
        </div>

        {mode === "all" && (
          <Button variant="outline" size="sm" className="w-full mt-1">
            Share Poll
          </Button>
        )}
        {mode === "mine" && (
          <div className="text-sm text-[var(--app-foreground-muted)]"><span className="text-[var(--app-foreground)] font-medium">Win chance:</span> {goal.contextEmphasis ?? "--"}</div>
        )}
        {mode === "following" && (
          <div className="text-sm text-[var(--app-foreground-muted)]"><span className="text-[var(--app-foreground)] font-medium">Status:</span> {goal.contextLabel}</div>
        )}
      </div>
    </div>
  );
}

export function Community({ initialTab = "all" as CommunityTab, title = "Community" }: { initialTab?: CommunityTab; title?: string }) {
  const [tab, setTab] = useState<CommunityTab>(initialTab);

  const allGoals = useMemo<Goal[]>(
    () => [
      {
        id: "1",
        title: "Lose 5kg",
        category: "By 30th June",
        image: "/screenshot.png",
        progressPercent: 90,
        stakeLabel: "20 ERC-20",
        participants: avatarUrls,
        contextLabel: "Share poll to earn if failed",
        contextEmphasis: "",
      },
      {
        id: "2",
        title: "Creating Mobile App Design",
        category: "UI UX Design",
        image: "/hero.png",
        progressPercent: 75,
        stakeLabel: "3 days left",
        participants: avatarUrls.slice().reverse(),
        contextLabel: "Share poll to earn if failed",
      },
    ],
    [],
  );

  const myGoals = useMemo<Goal[]>(
    () => [
      {
        id: "m1",
        title: "Run 100km this month",
        category: "Fitness",
        image: "/splash.png",
        progressPercent: 62,
        stakeLabel: "50 A3R staked",
        participants: avatarUrls,
        contextLabel: "My goal",
        contextEmphasis: "68%",
      },
    ],
    [],
  );

  const following = useMemo<Goal[]>(
    () => [
      {
        id: "f1",
        title: "Read 2 books",
        category: "Personal Growth",
        image: "/hero.png",
        progressPercent: 20,
        stakeLabel: "10 A3R at stake",
        participants: avatarUrls,
        contextLabel: "In progress",
      },
      {
        id: "f2",
        title: "Ship MVP by Friday",
        category: "Build",
        image: "/screenshot.png",
        progressPercent: 100,
        stakeLabel: "Completed",
        participants: avatarUrls,
        contextLabel: "Completed – distributing rewards",
      },
    ],
    [],
  );

  const tabs: { key: CommunityTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "mine", label: "My Goals" },
    { key: "following", label: "Following" },
  ];

  const data = tab === "all" ? allGoals : tab === "mine" ? myGoals : following;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              tab === t.key
                ? "bg-[var(--app-accent)] text-white border-transparent"
                : "bg-[var(--app-gray)] text-[var(--app-foreground)] border-[var(--app-card-border)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {data.map((g) => (
          <GoalCard key={g.id} goal={g} mode={tab} />
        ))}
      </div>
    </div>
  );
} 