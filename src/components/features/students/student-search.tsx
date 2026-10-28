import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudentSearchProps {
  initialValue: string;
  onSearch: (term: string) => void;
}

export function StudentSearch({ initialValue, onSearch }: StudentSearchProps) {
  const [term, setTerm] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(term.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search name, student no., email, or course…"
          className="pl-9"
        />
      </div>
      <Button type="submit">Search</Button>
      {term !== "" ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setTerm("");
            onSearch("");
          }}
        >
          Clear
        </Button>
      ) : null}
    </form>
  );
}