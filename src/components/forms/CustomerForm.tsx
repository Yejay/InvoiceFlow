"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customer";
import {
  createCustomer,
  updateCustomer,
  type Customer,
} from "@/app/(protected)/customers/actions";
import { useState } from "react";

type CustomerFormProps = {
  customer?: Customer | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CustomerForm({
  customer,
  onSuccess,
  onCancel,
}: CustomerFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!customer;

  const {
    register,
    handleSubmit,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: customer?.name || "",
      street: customer?.street || "",
      postal_code: customer?.postal_code || "",
      city: customer?.city || "",
      country: customer?.country || "Deutschland",
      email: customer?.email || "",
      phone: customer?.phone || "",
      vat_id: customer?.vat_id || "",
      notes: customer?.notes || "",
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setIsSaving(true);
    setError(null);

    try {
      const result = isEditing
        ? await updateCustomer(customer.id, data)
        : await createCustomer(data);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || "Fehler beim Speichern");
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const errorInputClassName =
    "w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            placeholder="Musterfirma GmbH"
            className={errors.name ? errorInputClassName : inputClassName}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Straße und Hausnummer
          </label>
          <input
            type="text"
            placeholder="Musterstraße 123"
            className={errors.street ? errorInputClassName : inputClassName}
            {...register("street")}
          />
        </div>

        {/* Postal Code and City */}
        <div className="grid grid-cols-2 gap-4">
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
          </div>
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
          </div>
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
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-2 gap-4">
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
          </div>
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
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notizen
          </label>
          <textarea
            rows={3}
            placeholder="Zusätzliche Informationen..."
            className={errors.notes ? errorInputClassName : inputClassName}
            {...register("notes")}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving
              ? "Speichern..."
              : isEditing
              ? "Kunde aktualisieren"
              : "Kunde anlegen"}
          </button>
        </div>
      </div>
    </form>
  );
}
