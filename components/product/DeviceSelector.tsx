"use client"
import { deviceModels } from "@/lib/data/variants"

type Props = {
  compatibleModels: string[]
  selectedModelId: string
  onChange: (modelId: string) => void
}

export default function DeviceSelector({ compatibleModels, selectedModelId, onChange }: Props) {
  const available = deviceModels.filter((m) => compatibleModels.includes(m.id))

  const seriesMap = available.reduce<Record<string, typeof available>>((acc, model) => {
    if (!acc[model.series]) acc[model.series] = []
    acc[model.series].push(model)
    return acc
  }, {})

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-3">
        Select Model
      </p>
      <div className="space-y-3">
        {Object.entries(seriesMap).map(([series, models]) => (
          <div key={series}>
            <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#8C8880] mb-2">
              {series}
            </p>
            <div className="flex flex-wrap gap-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => onChange(model.id)}
                  className={`px-3 py-1.5 font-sans text-xs border transition-all ${
                    selectedModelId === model.id
                      ? "bg-[#1A1A18] text-[#FAFAF8] border-[#1A1A18]"
                      : "bg-transparent text-[#8C8880] border-[#E2DDD6] hover:border-[#1A1A18] hover:text-[#1A1A18]"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
