import { CollectionHeader } from "@/components/CollectionHeader";
import { ShirtGrid } from "@/components/ShirtGrid";

export default function CollectionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mock signed-in user — real auth arrives in Phase 2 */}
      <CollectionHeader email="marc@kitvault.app" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <ShirtGrid />
      </main>
    </div>
  );
}
