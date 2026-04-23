import React from "react";
import { useSelector } from "react-redux";
import { useGithubProfile } from "../../github/hooks/useGithubProfile";
import { useGithubActivity } from "../../github/hooks/useGithubActivity";
import { useGoals } from "../../goals/hooks/useGoals";

import { ProfileCard } from "../../github/components/ProfileCard";
import { SkillMatrix } from "../../github/components/SkillMatrix";
import { Achievements } from "../../goals/components/Achievements";
import { WeeklyGoals } from "../../goals/components/WeeklyGoals";
import { ActivityFeed } from "../../github/components/ActivityFeed";
import ProfileSkeleton from "../../github/components/ProfileSkeleton";

const OverviewPage = () => {
  const { currentUser } = useSelector((state) => state.auth);
  
  const { profile, loading: profileLoading } = useGithubProfile(currentUser);
  const { activity } = useGithubActivity(profile?.githubUsername);
  
  // Goals feature expects user to have uid field to match firestore structure
  const userWithUid = currentUser ? { uid: currentUser._id, ...currentUser } : null;
  const { goals, toggleGoal, addGoal, removeGoal } = useGoals(userWithUid);

  const skillData = [
    { label: "Frontend", value: 85 },
    { label: "Backend", value: 60 },
    { label: "DevOps", value: 40 },
    { label: "Design", value: 70 },
    { label: "Testing", value: 50 },
  ];

  if (profileLoading && !profile) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8"><ProfileSkeleton /></div>
        <div className="lg:col-span-5 space-y-8"><ProfileSkeleton /></div>
        <div className="lg:col-span-3 space-y-8"><ProfileSkeleton /></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-4 space-y-8">
        <ProfileCard profile={profile} />
        <SkillMatrix data={skillData} skills={profile?.coreSkills} />
      </div>
      <div className="lg:col-span-5 space-y-8">
        <Achievements profile={profile} />
        <WeeklyGoals
          goals={goals}
          toggleGoal={toggleGoal}
          addGoal={addGoal}
          removeGoal={removeGoal}
        />
      </div>
      <div className="lg:col-span-3 space-y-8">
        <ActivityFeed events={activity} username={profile?.githubUsername} />
      </div>
    </div>
  );
};

export default OverviewPage;
