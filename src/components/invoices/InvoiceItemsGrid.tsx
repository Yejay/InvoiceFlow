"use client";

import { useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams, ValueParserParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { formatCurrency, calculateItemAmounts } from "@/lib/utils";
import type { InvoiceItemFormData } from "@/lib/validations/invoice";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export type InvoiceItem = InvoiceItemFormData & {
  id: string;
  net_amount: number;
};

type InvoiceItemsGridProps = {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  defaultVatRate?: number;
};

// Custom delete button renderer
function DeleteButtonRenderer(props: ICellRendererParams<InvoiceItem>) {
  const handleDelete = () => {
    if (props.context?.onDeleteRow) {
      props.context.onDeleteRow(props.data?.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 p-1"
      title="Position entfernen"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </button>
  );
}

export default function InvoiceItemsGrid({
  items,
  onItemsChange,
  defaultVatRate = 19,
}: InvoiceItemsGridProps) {
  const gridRef = useRef<AgGridReact<InvoiceItem>>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const createEmptyItem = useCallback((): InvoiceItem => ({
    id: generateId(),
    description: "",
    quantity: 1,
    unit: "Stk.",
    unit_price: 0,
    vat_rate: defaultVatRate,
    position: items.length,
    net_amount: 0,
  }), [defaultVatRate, items.length]);

  const handleAddRow = useCallback(() => {
    const newItem = createEmptyItem();
    onItemsChange([...items, newItem]);
  }, [items, onItemsChange, createEmptyItem]);

  const handleDeleteRow = useCallback((id: string) => {
    if (items.length <= 1) return; // Keep at least one row
    const newItems = items.filter(item => item.id !== id);
    onItemsChange(newItems);
  }, [items, onItemsChange]);

  const onCellValueChanged = useCallback(() => {
    const rowData: InvoiceItem[] = [];
    gridRef.current?.api.forEachNode(node => {
      if (node.data) {
        const { net_amount } = calculateItemAmounts(
          node.data.quantity,
          node.data.unit_price,
          node.data.vat_rate
        );
        rowData.push({
          ...node.data,
          net_amount,
        });
      }
    });
    onItemsChange(rowData);
  }, [onItemsChange]);

  const numberParser = (params: ValueParserParams): number => {
    const value = params.newValue;
    if (value === null || value === undefined || value === "") return 0;
    const parsed = parseFloat(String(value).replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const columnDefs = useMemo<ColDef<InvoiceItem>[]>(() => [
    {
      field: "description",
      headerName: "Beschreibung",
      editable: true,
      flex: 3,
      minWidth: 200,
      cellClass: "ag-cell-wrap-text",
    },
    {
      field: "quantity",
      headerName: "Menge",
      editable: true,
      width: 100,
      type: "numericColumn",
      valueParser: numberParser,
      valueFormatter: params => params.value?.toLocaleString("de-DE") ?? "0",
    },
    {
      field: "unit",
      headerName: "Einheit",
      editable: true,
      width: 90,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Stk.", "Std.", "Psch.", "m", "m²", "m³", "kg", "l"],
      },
    },
    {
      field: "unit_price",
      headerName: "Einzelpreis",
      editable: true,
      width: 120,
      type: "numericColumn",
      valueParser: numberParser,
      valueFormatter: params => formatCurrency(params.value ?? 0),
    },
    {
      field: "vat_rate",
      headerName: "MwSt. %",
      editable: true,
      width: 100,
      type: "numericColumn",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0, 7, 19],
      },
      valueFormatter: params => `${params.value ?? 19} %`,
    },
    {
      field: "net_amount",
      headerName: "Netto",
      width: 120,
      type: "numericColumn",
      editable: false,
      valueGetter: params => {
        if (!params.data) return 0;
        return calculateItemAmounts(
          params.data.quantity,
          params.data.unit_price,
          params.data.vat_rate
        ).net_amount;
      },
      valueFormatter: params => formatCurrency(params.value ?? 0),
      cellClass: "font-medium",
    },
    {
      headerName: "",
      width: 50,
      cellRenderer: DeleteButtonRenderer,
      editable: false,
      sortable: false,
      filter: false,
      suppressMovable: true,
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: false,
    filter: false,
    resizable: true,
    suppressMovable: true,
  }), []);

  const context = useMemo(() => ({
    onDeleteRow: handleDeleteRow,
  }), [handleDeleteRow]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Positionen</h3>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Position hinzufügen
        </button>
      </div>

      <div className="ag-theme-alpine border border-gray-200 rounded-lg overflow-hidden" style={{ height: Math.max(200, items.length * 48 + 56) }}>
        <AgGridReact<InvoiceItem>
          ref={gridRef}
          rowData={items}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          context={context}
          onCellValueChanged={onCellValueChanged}
          domLayout="normal"
          rowHeight={48}
          headerHeight={48}
          stopEditingWhenCellsLoseFocus={true}
          singleClickEdit={true}
          getRowId={params => params.data.id}
        />
      </div>

      <p className="text-xs text-gray-500">
        Klicken Sie auf eine Zelle zum Bearbeiten. Drücken Sie Tab zum Navigieren.
      </p>
    </div>
  );
}
