import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "../ui/button";

type Props = {
  caption: string;
  headers: { title: string; className?: string }[];
  rows: any[];
};

export function TableGeneric({ caption, headers, rows }: Props) {
  console.log(headers, " headers");
  console.log(rows, "rows");

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map((h, idx) => (
            <TableHead key={idx} className={h.className}>
              {h.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, idx) => {
          console.log(r, "rows");
          return (
            <TableRow key={idx}>
              {(() => {
                const cells = [];
                for (let [k, v] of Object.entries(r)) {
                  // Only include relevant fields
                  if (k === "createdAt" || k === "updatedAt") continue;

                  // Add "Accepts File" field
                  if (k === "acceptFile") {
                    cells.push(
                      <TableCell key={`acceptFile-${k}`}>
                        {v ? "Yes" : "No"}
                      </TableCell>
                    );
                  }

                  // Add other fields
                  else if (typeof v === "string") {
                    cells.push(<TableCell key={`string-${k}`}>{v}</TableCell>);
                  } else if (typeof v === "function") {
                    cells.push(<TableCell key={`func-${k}`}>{v(r)}</TableCell>);
                  }
                }
                return cells;
              })()}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export const TableActions = ({
  actions,
  data,
}: {
  actions: any[];
  data: any;
}) => {
  return (
    <div className="flex">
      {actions.map((action, idx) => (
        <Button
          key={`action-${idx}`}
          className="mr-4"
          onClick={() => action.onClick(data)}
          disabled={action.disabled ? action.disabled(data) : false}
        >
          {action.title}
        </Button>
      ))}
    </div>
  );
};
