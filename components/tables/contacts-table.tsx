"use client";

import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export type ContactTableRow = {
  id: string;
  fullName: string;
  primaryEmail: string | null;
  firm: string | null;
  title: string | null;
  group: string | null;
  location: string | null;
  priority: string;
  warmth: string;
  stage: string;
  lastTouchAt: string | null;
  nextTouchAt: string | null;
  activeCampaign: string | null;
  tags: { id: string; name: string }[];
};

const column = createColumnHelper<ContactTableRow>();

const columns = [
  column.accessor("fullName", {
    header: "Name",
    cell: ({ row, getValue }) => (
      <div>
        <Link href={`/contacts/${row.original.id}`} className="font-medium hover:underline">{getValue()}</Link>
        <div className="text-xs text-muted-foreground">{row.original.primaryEmail}</div>
      </div>
    )
  }),
  column.accessor("firm", { header: "Firm", cell: (info) => info.getValue() ?? "—" }),
  column.accessor("title", { header: "Title", cell: (info) => info.getValue() ?? "—" }),
  column.accessor("group", { header: "Group", cell: (info) => info.getValue() ?? "—" }),
  column.accessor("location", { header: "Location", cell: (info) => info.getValue() ?? "—" }),
  column.accessor("priority", { header: "Priority", cell: (info) => <Badge value={info.getValue()} /> }),
  column.accessor("warmth", { header: "Warmth", cell: (info) => <Badge value={info.getValue()} /> }),
  column.accessor("stage", { header: "Stage", cell: (info) => <Badge value={info.getValue()} /> }),
  column.accessor("lastTouchAt", { header: "Last touch", cell: (info) => formatDate(info.getValue()) }),
  column.accessor("nextTouchAt", { header: "Next touch", cell: (info) => formatDate(info.getValue()) }),
  column.accessor("activeCampaign", { header: "Active campaign", cell: (info) => info.getValue() ?? "—" }),
  column.accessor("tags", {
    header: "Tags",
    cell: (info) => <div className="flex flex-wrap gap-1">{info.getValue().map((tag) => <Badge key={tag.id} value={tag.name} />)}</div>
  })
];

export function ContactsTable({ rows }: { rows: ContactTableRow[] }) {
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-muted/60">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b px-3 py-2 align-top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
