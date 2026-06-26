"use client";

import { useState } from "react";
import { mockProfile } from "@/lib/mock-data";
import { runScenario } from "@/lib/finance-calc";
import { SLIDER_CONFIGS } from "@/components/scenarios/ScenarioSlider";
import { ScenarioTypePicker } from "@/components/scenarios/ScenarioTypePicker";
import { ScenarioSlider }     from "@/components/scenarios/ScenarioSlider";
import { WhatIfInput }        from "@/components/scenarios/WhatIfInput";
import { CompareCards }       from "@/components/scenarios/CompareCards";
import { ImpactBanner }       from "@/components/scenarios/ImpactBanner";
import type { ScenarioType }  from "@/lib/types";

export default function ScenariosPage() {
  const [type, setType]   = useState<ScenarioType>("income_change");
  const [value, setValue] = useState<number>(SLIDER_CONFIGS["income_change"].default);

  function handleTypeChange(t: ScenarioType) {
    setType(t);
    setValue(SLIDER_CONFIGS[t].default);
  }

  function handleWhatIfParse(t: ScenarioType, v: number) {
    setType(t);
    setValue(v);
  }

  const result = runScenario(mockProfile, type, value);

  return (
    <div className="flex flex-col gap-3 h-full">
      <ScenarioTypePicker selected={type} onChange={handleTypeChange} />
      <div className="grid grid-cols-2 gap-3">
        <ScenarioSlider type={type} value={value} onChange={setValue} />
        <WhatIfInput onParse={handleWhatIfParse} />
      </div>
      <CompareCards result={result} />
      <ImpactBanner result={result} />
    </div>
  );
}
