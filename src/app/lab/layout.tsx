import { Sidebar } from "@/components/Sidebar";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex overflow-hidden w-full h-full">
        {children}
      </div>
    </>
  );
}
