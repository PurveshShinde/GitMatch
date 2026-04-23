import React, { useState } from "react";
import { Target, CheckSquare, Trash2, Loader2, Plus } from "lucide-react";

export const WeeklyGoals = React.memo(({ goals, toggleGoal, addGoal, removeGoal }) => {
  const [newGoal, setNewGoal] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newGoal.trim() && !isAdding) {
      setIsAdding(true);
      await addGoal(newGoal);
      setNewGoal("");
      setIsAdding(false);
    }
  };

  const handleToggle = (goal) => {
    toggleGoal(goal.id, goal.completed);
  };

  const incompleteGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const renderGoal = (goal) => (
    <div
      key={goal.id}
      className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none group ${
        goal.completed
          ? "bg-green-900/10 border-green-900/30 opacity-60"
          : "bg-[#0a0a0f] border-slate-800"
      }`}
    >
      <div
        className="flex items-center gap-3 flex-1"
        onClick={() => handleToggle(goal)}
      >
        <div
          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
            goal.completed
              ? "bg-green-500 border-green-500"
              : "border-slate-600 bg-slate-800"
          }`}
        >
          {goal.completed && <CheckSquare className="w-3.5 h-3.5 text-white" />}
        </div>
        <span
          className={`text-xs ${
            goal.completed ? "line-through text-slate-500" : "text-slate-300"
          }`}
        >
          {goal.text}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeGoal(goal.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-red-500" /> Weekly Goals
      </h3>

      <div className="space-y-3 mb-4">
        {incompleteGoals.length === 0 && completedGoals.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-4">
            No goals found. Add one below!
          </div>
        ) : (
          <>
            {incompleteGoals.map(renderGoal)}
            {completedGoals.length > 0 && (
              <div className="pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-600 mb-2">
                  Completed ({completedGoals.length})
                </p>
                {completedGoals.map(renderGoal)}
              </div>
            )}
          </>
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="flex gap-2 pt-2 border-t border-slate-800/50"
      >
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add new goal..."
          disabled={isAdding}
          className="flex-1 bg-[#0a0a0f] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!newGoal.trim() || isAdding}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-blue-900 disabled:text-slate-500 transition-colors"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
});

WeeklyGoals.displayName = "WeeklyGoals";
