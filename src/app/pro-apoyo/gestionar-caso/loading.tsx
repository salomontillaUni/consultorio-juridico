import {Skeleton} from "@/components/ui/skeleton"
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <Skeleton className="h-12 w-full" />;
}