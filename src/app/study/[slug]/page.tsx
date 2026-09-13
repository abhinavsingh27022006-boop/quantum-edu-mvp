import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { BlockSimulator } from "@/components/BlockSimulator";
import { BlochSphere } from "@/components/BlochSphere";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";

export async function generateStaticParams() {
  const studyDir = path.join(process.cwd(), "content/study");
  if (!fs.existsSync(studyDir)) {
    return [];
  }
  const files = fs.readdirSync(studyDir);
  return files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

export default async function StudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/study", `${slug}.mdx`);
  
  let content = "Lesson not found.";
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  }

  const components = {
    BlockSimulator: (props: any) => <BlockSimulator {...props} />,
    BlochSphere: (props: any) => <BlochSphere {...props} />,
  };

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-3xl mx-auto prose prose-invert prose-purple">
        <MDXRemote source={content} components={components} />
        <MarkCompleteButton slug={slug} type="lesson" />
      </div>
    </div>
  );
}
