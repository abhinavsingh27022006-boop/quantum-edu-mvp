import { StudySidebar } from "@/components/StudySidebar";

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudySidebar />
      <div className="flex-1 flex overflow-hidden w-full h-full bg-black/40">
        {children}
      </div>
    </>
  );
}
