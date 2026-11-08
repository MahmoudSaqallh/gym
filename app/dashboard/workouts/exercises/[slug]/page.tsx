import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExerciseDetailView } from "@/components/dashboard/workouts/exercise-detail";
import { ALL_EXERCISES, findExercise } from "@/components/dashboard/workouts/exercises-data";

type Props = PageProps<"/dashboard/workouts/exercises/[slug]">;

export function generateStaticParams() {
  return ALL_EXERCISES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = findExercise(slug);
  return { title: e ? `${e.name} – Kinora` : "Exercise – Kinora" };
}

async function ExerciseDetail({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  if (!findExercise(slug)) notFound();
  return <ExerciseDetailView slug={slug} />;
}

function ExerciseDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-[14px]" role="status" aria-label="Loading exercise">
      <div className="h-[300px] rounded-[20px] bg-track" />
      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <div className="h-[320px] rounded-[20px] bg-track" />
        <div className="h-[320px] rounded-[20px] bg-track" />
        <div className="h-[320px] rounded-[20px] bg-track md:col-span-2 wide:col-span-1" />
      </div>
    </div>
  );
}

export default function ExerciseDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<ExerciseDetailSkeleton />}>
      <ExerciseDetail params={params} />
    </Suspense>
  );
}
