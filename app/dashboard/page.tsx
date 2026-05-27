import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { 
  FileText, 
  Presentation, 
  Plus, 
  ArrowRight, 
  Clock, 
  Users, 
  ChevronRight, 
  Layout, 
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });

  // Mock workspaces/recent documents to show visual fidelity
  const recentWorkspaces = [
    {
      id: "doc_1",
      title: "Q3 Product Architecture Requirements",
      type: "Document",
      updatedAt: "2 hours ago",
      collaborators: ["/avatar1.jpg", "/avatar2.jpg"],
      color: "#a855f7",
    },
    {
      id: "board_1",
      title: "User Journey & Experience Canvas",
      type: "Whiteboard",
      updatedAt: "Yesterday",
      collaborators: ["/avatar1.jpg", "/avatar3.jpg", "/avatar4.jpg"],
      color: "#ec4899",
    },
    {
      id: "doc_2",
      title: "Neon DB & Clerk Integration Specs",
      type: "Document",
      updatedAt: "3 days ago",
      collaborators: ["/avatar2.jpg"],
      color: "#38bdf8",
    },
  ];

  return (
    <main className="relative p-6 md:p-10 flex-1 box-border overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/20">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -z-10 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-[250px] h-[250px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header section */}
      <header className="flex justify-between items-center pb-6 border-b border-zinc-200/80 dark:border-zinc-900 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>Workspace Live</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
            Welcome back, {user.firstName || "Creator"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Action shortcuts / Quick Create Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Action 1: Notion style document */}
        <div className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer">
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FileText size={20} />
            </div>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Notion Mode</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100 mt-4 mb-2">New Structured Document</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Write down design requirements, engineering specifications, or workspace guides.
          </p>
          <div className="flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 gap-1.5 group-hover:gap-2.5 transition-all">
            <span>Create new doc</span>
            <Plus size={15} />
          </div>
        </div>

        {/* Action 2: Miro style whiteboard */}
        <div className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer">
          <div className="absolute top-0 left-0 w-2 h-full bg-pink-500" />
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <Presentation size={20} />
            </div>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Miro Mode</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100 mt-4 mb-2">New Infinite Canvas</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Map layouts, build system diagram structures, or conduct design sprints.
          </p>
          <div className="flex items-center text-sm font-semibold text-pink-600 dark:text-pink-400 gap-1.5 group-hover:gap-2.5 transition-all">
            <span>Open Canvas Board</span>
            <ArrowRight size={15} />
          </div>
        </div>

      </section>

      {/* Database/Neon connection validator banner */}
      <section className="mb-10 p-5 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Connected Session (Neon Database)
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
              Synced ID: {dbUser?.id || "N/A"}
            </span>
          </div>
        </div>
        <div className="text-xs font-medium text-zinc-400">
          Last sync: Just now
        </div>
      </section>

      {/* Recent workspaces table */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
            <Clock size={16} className="text-zinc-400" />
            <span>Recent Workspaces</span>
          </h2>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs gap-1">
            <span>View All</span>
            <ChevronRight size={14} />
          </Button>
        </div>

        <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
          {recentWorkspaces.map((doc) => (
            <div key={doc.id} className="group py-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 px-2 rounded-xl transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-4 min-w-0">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${doc.color}15`, color: doc.color }}
                >
                  {doc.type === "Document" ? <FileText size={18} /> : <Layout size={18} />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Mock Avatar list */}
                <div className="flex -space-x-1.5 overflow-hidden">
                  {doc.collaborators.map((_, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full border border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-600 dark:text-zinc-400 font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-700 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}



