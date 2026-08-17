"use client";

import type { ShirtFormData } from "@/lib/types";
import { COUNTRIES, LEAGUES, MANUFACTURERS, VERSIONS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SuggestInput } from "@/components/ui/suggest-input";
import { Label } from "@/components/ui/label";

interface ShirtFieldsProps {
  value: ShirtFormData;
  onChange: <K extends keyof ShirtFormData>(
    key: K,
    value: ShirtFormData[K],
  ) => void;
  /**
   * Prefix for input ids. Bulk review swaps between shirts in one dialog, so
   * ids must stay unique and stable per item for the labels to work.
   */
  idPrefix?: string;
  /** Notes are worth the space when adding one shirt, not when reviewing ten. */
  showNotes?: boolean;
}

/**
 * The editable fields of a shirt, shared by the single and bulk add flows.
 * Only `version` is a closed list; the rest are free text with suggestions.
 */
export function ShirtFields({
  value,
  onChange,
  idPrefix = "shirt",
  showNotes = true,
}: ShirtFieldsProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <>
      <div>
        <Label htmlFor={id("team")}>Team name</Label>
        <Input
          id={id("team")}
          value={value.team}
          onChange={(e) => onChange("team", e.target.value)}
          placeholder="e.g. FC Barcelona"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={id("season")}>Season</Label>
          <Input
            id={id("season")}
            value={value.season}
            onChange={(e) => onChange("season", e.target.value)}
            placeholder="e.g. 2019-20"
            required
          />
        </div>
        <div>
          <Label htmlFor={id("version")}>Version</Label>
          <Select
            id={id("version")}
            value={value.version}
            onChange={(e) =>
              onChange("version", e.target.value as ShirtFormData["version"])
            }
          >
            {VERSIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={id("country")}>Country</Label>
          <SuggestInput
            id={id("country")}
            options={COUNTRIES}
            value={value.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="e.g. Spain"
          />
        </div>
        <div>
          <Label htmlFor={id("league")}>League</Label>
          <SuggestInput
            id={id("league")}
            options={LEAGUES}
            value={value.league}
            onChange={(e) => onChange("league", e.target.value)}
            placeholder="e.g. LaLiga (empty if none)"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={id("manufacturer")}>Manufacturer</Label>
        <SuggestInput
          id={id("manufacturer")}
          options={MANUFACTURERS}
          value={value.manufacturer}
          onChange={(e) => onChange("manufacturer", e.target.value)}
          placeholder="e.g. Nike"
        />
      </div>

      {showNotes && (
        <div>
          <Label htmlFor={id("notes")}>Notes (optional)</Label>
          <Textarea
            id={id("notes")}
            value={value.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Anything memorable about this shirt…"
          />
        </div>
      )}
    </>
  );
}
