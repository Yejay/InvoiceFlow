"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSettingsSchema, type UserSettingsFormData } from "@/lib/validations/settings";
import { saveUserSettings, type UserSettings } from "@/app/(protected)/settings/actions";
import { useState } from "react";

type SettingsFormProps = {
  initialData: UserSettings | null;
};

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema) as any,
    defaultValues: {
      company_name: initialData?.company_name || "",
      street: initialData?.street || "",
      postal_code: initialData?.postal_code || "",
      city: initialData?.city || "",
      country: initialData?.country || "Deutschland",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      tax_number: initialData?.tax_number || "",
      vat_id: initialData?.vat_id || "",
      iban: initialData?.iban || "",
      bic: initialData?.bic || "",
      bank_name: initialData?.bank_name || "",
      default_vat_rate: initialData?.default_vat_rate ?? 19,
      invoice_prefix: initialData?.invoice_prefix || "INV-",
    },
  });

  const onSubmit = async (data: UserSettingsFormData) => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = await saveUserSettings(data);

      if (result.success) {
        setSaveMessage({ type: "success", text: "Einstellungen wurden gespeichert" });
      } else {
        setSaveMessage({ type: "error", text: result.error || "Fehler beim Speichern" });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Ein unerwarteter Fehler ist aufgetreten" });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const errorInputClassName = "w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Company Information */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Firmendaten</h2>
          <p className="mt-1 text-sm text-gray-500">
            Diese Daten erscheinen auf Ihren Rechnungen als Absender
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firmenname *
              </label>
              <input
                type="text"
                placeholder="Ihre Firma GmbH"
                className={errors.company_name ? errorInputClassName : inputClassName}
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
              )}
            </div>

            {/* Street */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Straße und Hausnummer
              </label>
              <input
                type="text"
                placeholder="Musterstraße 123"
                className={errors.street ? errorInputClassName : inputClassName}
                {...register("street")}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PLZ
              </label>
              <input
                type="text"
                placeholder="12345"
                className={errors.postal_code ? errorInputClassName : inputClassName}
                {...register("postal_code")}
              />
              {errors.postal_code && (
                <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stadt
              </label>
              <input
                type="text"
                placeholder="Berlin"
                className={errors.city ? errorInputClassName : inputClassName}
                {...register("city")}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Land
              </label>
              <input
                type="text"
                placeholder="Deutschland"
                className={errors.country ? errorInputClassName : inputClassName}
                {...register("country")}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                placeholder="kontakt@firma.de"
                className={errors.email ? errorInputClassName : inputClassName}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                placeholder="+49 30 12345678"
                className={errors.phone ? errorInputClassName : inputClassName}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="px-6 py-4 border-t border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Steuerinformationen</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Steuernummer
              </label>
              <input
                type="text"
                placeholder="12/345/67890"
                className={errors.tax_number ? errorInputClassName : inputClassName}
                {...register("tax_number")}
              />
              {errors.tax_number && (
                <p className="mt-1 text-sm text-red-600">{errors.tax_number.message}</p>
              )}
            </div>

            {/* VAT ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                USt-IdNr.
              </label>
              <input
                type="text"
                placeholder="DE123456789"
                className={errors.vat_id ? errorInputClassName : inputClassName}
                {...register("vat_id")}
              />
              {errors.vat_id && (
                <p className="mt-1 text-sm text-red-600">{errors.vat_id.message}</p>
              )}
            </div>

            {/* Default VAT Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard MwSt.-Satz (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                className={errors.default_vat_rate ? errorInputClassName : inputClassName}
                {...register("default_vat_rate")}
              />
              {errors.default_vat_rate && (
                <p className="mt-1 text-sm text-red-600">{errors.default_vat_rate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="px-6 py-4 border-t border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Bankverbindung</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank
              </label>
              <input
                type="text"
                placeholder="Sparkasse Berlin"
                className={errors.bank_name ? errorInputClassName : inputClassName}
                {...register("bank_name")}
              />
              {errors.bank_name && (
                <p className="mt-1 text-sm text-red-600">{errors.bank_name.message}</p>
              )}
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IBAN
              </label>
              <input
                type="text"
                placeholder="DE89370400440532013000"
                className={errors.iban ? errorInputClassName : inputClassName}
                {...register("iban")}
              />
              {errors.iban && (
                <p className="mt-1 text-sm text-red-600">{errors.iban.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Ohne Leerzeichen eingeben
              </p>
            </div>

            {/* BIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BIC
              </label>
              <input
                type="text"
                placeholder="COBADEFFXXX"
                className={errors.bic ? errorInputClassName : inputClassName}
                {...register("bic")}
              />
              {errors.bic && (
                <p className="mt-1 text-sm text-red-600">{errors.bic.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="px-6 py-4 border-t border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Rechnungseinstellungen</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Prefix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rechnungsnummern-Präfix
              </label>
              <input
                type="text"
                className={errors.invoice_prefix ? errorInputClassName : inputClassName}
                {...register("invoice_prefix")}
              />
              {errors.invoice_prefix && (
                <p className="mt-1 text-sm text-red-600">{errors.invoice_prefix.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Beispiel: INV-0001, RE-0001
              </p>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mx-6 mb-4 p-4 rounded-lg ${
            saveMessage.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {saveMessage.text}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Speichern..." : "Einstellungen speichern"}
          </button>
        </div>
      </div>
    </form>
  );
}
