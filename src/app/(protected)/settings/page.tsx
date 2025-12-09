import { getUserSettings } from "./actions";
import SettingsForm from "@/components/forms/SettingsForm";

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Verwalten Sie Ihre Firmendaten und Rechnungseinstellungen
        </p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}
