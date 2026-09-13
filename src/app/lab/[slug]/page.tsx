import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { SplitPane } from "@/components/SplitPane";
import { VisualBuilder } from "@/components/VisualBuilder";
import { CodeEditor } from "@/components/CodeEditor";
import { Simulator } from "@/components/Simulator";
import { StateResetter } from "@/components/StateResetter";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";

export async function generateStaticParams() {
  const lessonsDir = path.join(process.cwd(), "content/lab");
  if (!fs.existsSync(lessonsDir)) {
    return [];
  }
  const files = fs.readdirSync(lessonsDir);
  return files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

export default async function LessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/lab", `${slug}.mdx`);
  
  let content = "Lesson not found.";
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  }

  return (
    <>
      <StateResetter slug={slug} />
      <SplitPane
        left={
        <div className="prose prose-invert prose-blue max-w-none">
          <MDXRemote source={content} />
          <MarkCompleteButton slug={slug} type="lab" />
        </div>
      }
      right={
        <div className="flex flex-col gap-6 w-full pb-12">
          <div className="min-h-[24rem]">
            <VisualBuilder />
          </div>
          
          <div className="min-h-[24rem]">
            <CodeEditor />
          </div>
          
          <div className="min-h-[24rem]">
            <Simulator />
          </div>
        </div>
      }
    />
    </>
  );
}
